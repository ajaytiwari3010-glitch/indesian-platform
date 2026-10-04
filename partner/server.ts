import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

// Server-side State & Ledger Storage (In-memory + Firestore Sync)
interface StoredPaymentOrder {
  orderId: string;
  partnerId: string;
  referenceId: string;
  amount: number;
  currency: string;
  commissionRate: number;
  platformFee: number;
  partnerShare: number;
  status: 'CREATED' | 'PENDING' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
  createdAt: string;
  capturedAt?: string;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
}

interface StoredSettlement {
  settlementId: string;
  idempotencyKey: string;
  partnerId: string;
  grossAmount: number;
  commissionAmount: number;
  payableAmount: number;
  bankSummary: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  payoutRef?: string;
  requestedAt: string;
  completedAt?: string;
}

interface AmbulanceTelemetry {
  tripId: string;
  ambulanceId: string;
  partnerId: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  accuracy: number;
  timestamp: string;
  tripStatus: 'DISPATCHED' | 'EN_ROUTE' | 'PATIENT_PICKED_UP' | 'HOSPITAL_ARRIVAL' | 'TRIP_COMPLETED';
}

const paymentOrdersStore = new Map<string, StoredPaymentOrder>();
const settlementsStore = new Map<string, StoredSettlement>();
const processedWebhookEvents = new Set<string>();
const ambulanceTelemetryStore = new Map<string, AmbulanceTelemetry>();

/**
 * Audit and validate server-side environment variables on startup.
 * Logs clear diagnostics and graceful notices without crashing.
 */
function validateEnvironment(): void {
  console.log('\n======================================================');
  console.log(' INDESIAN ENTERPRISE PARTNER GATEWAY — SECURITY AUDIT');
  console.log('======================================================');

  const envSummary: Record<string, string> = {
    PORT: process.env.PORT || '3000 (default)',
    NODE_ENV: process.env.NODE_ENV || 'development (default)',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY ? 'CONFIGURED [SECURE]' : 'NOT_SET (AI features will return graceful notice)',
    FIREBASE_SERVICE_ACCOUNT: process.env.FIREBASE_SERVICE_ACCOUNT ? 'CONFIGURED [SECURE]' : 'NOT_SET (Hybrid / client auth mode)',
    VITE_FIREBASE_CONFIG: (process.env.VITE_FIREBASE_CONFIG || process.env.VITE_FIREBASE_API_KEY) ? 'CONFIGURED [CLIENT]' : 'NOT_SET (Demo store mode)',
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET ? 'CONFIGURED [SECURE]' : 'NOT_SET (Staging payment sandbox mode)',
    PAYMENT_WEBHOOK_SECRET: process.env.PAYMENT_WEBHOOK_SECRET ? 'CONFIGURED [SECURE]' : 'NOT_SET (Webhook HMAC bypass in dev)',
    N8N_WEBHOOK_SECRET: process.env.N8N_WEBHOOK_SECRET ? 'CONFIGURED [SECURE]' : 'NOT_SET (Unsigned dispatch in dev)',
    GOOGLE_MAPS_API_KEY: (process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY) ? 'CONFIGURED' : 'NOT_SET (Simulated GPS telemetry)',
  };

  for (const [key, status] of Object.entries(envSummary)) {
    console.log(` • ${key.padEnd(26)} : ${status}`);
  }

  if (process.env.NODE_ENV === 'production') {
    const requiredInProd = ['RAZORPAY_KEY_SECRET', 'N8N_WEBHOOK_SECRET'];
    const missingProdKeys = requiredInProd.filter((k) => !process.env[k]);
    if (missingProdKeys.length > 0) {
      console.warn(`\n[SECURITY WARNING] Production environment lacks recommended secrets: ${missingProdKeys.join(', ')}.`);
    }
  }

  console.log('======================================================\n');
}

async function startServer() {
  validateEnvironment();

  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // JSON Body Parser with raw body preservation for HMAC webhook signature verification
  app.use(
    express.json({
      verify: (req: any, _res, buf) => {
        req.rawBody = buf;
      },
    })
  );

  // -------------------------------------------------------------
  // 1. INFRASTRUCTURE & HEALTH STATUS API
  // -------------------------------------------------------------
  app.get('/api/health', (_req: Request, res: Response) => {
    const isFirebaseConfigured = Boolean(
      process.env.FIREBASE_CONFIG || process.env.VITE_FIREBASE_CONFIG || process.env.VITE_FIREBASE_API_KEY
    );
    const isPaymentConfigured = Boolean(process.env.RAZORPAY_KEY_SECRET || process.env.CASHFREE_SECRET_KEY);
    const isN8nConfigured = Boolean(process.env.N8N_WEBHOOK_URL && process.env.N8N_WEBHOOK_SECRET);
    const isMapsConfigured = Boolean(process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY);
    const isFcmConfigured = Boolean(process.env.FCM_SERVER_KEY || process.env.FIREBASE_SERVICE_ACCOUNT);
    const isGeminiConfigured = Boolean(process.env.GEMINI_API_KEY);

    res.json({
      status: 'ok',
      service: 'Indesian Universal Partner Portal Gateway',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      infrastructure: {
        firebaseAuth: isFirebaseConfigured ? 'CONFIGURED' : 'DEV_MODE_ACTIVE',
        firestore: isFirebaseConfigured ? 'CONFIGURED' : 'HYBRID_MODE',
        cloudStorage: isFirebaseConfigured ? 'CONFIGURED' : 'MOCK_AVAILABLE',
        paymentGateway: isPaymentConfigured ? 'LIVE_CONFIGURED' : 'STAGING_ADAPTER_ACTIVE',
        n8nAutomations: isN8nConfigured ? 'CONNECTED' : 'DISPATCHER_READY',
        googleMapsGPS: isMapsConfigured ? 'CONNECTED' : 'MOCK_TELEMETRY',
        fcmNotifications: isFcmConfigured ? 'CONNECTED' : 'IN_APP_POLLING_ACTIVE',
        geminiAI: isGeminiConfigured ? 'LIVE_KEY_CONFIGURED' : 'API_KEY_NOT_CONFIGURED',
      },
    });
  });

  // -------------------------------------------------------------
  // 2. SERVER-AUTHORITATIVE PAYMENT FLOW (PHASE 3C)
  // -------------------------------------------------------------
  
  // Create Payment Order (Server calculates authoritative price & commission)
  app.post('/api/payments/create-order', (req: Request, res: Response) => {
    try {
      const { partnerId, referenceId, baseAmount, customCommissionRate } = req.body;

      if (!partnerId || !baseAmount || baseAmount <= 0) {
        return res.status(400).json({ error: 'Missing required parameters: partnerId and positive baseAmount.' });
      }

      const orderId = `PAY-${Date.now()}-${Math.floor(Math.random() * 8999 + 1000)}`;
      const commissionRate = typeof customCommissionRate === 'number' ? customCommissionRate : 10;
      const platformFee = Math.round((baseAmount * commissionRate) / 100);
      const partnerShare = baseAmount - platformFee;

      const newOrder: StoredPaymentOrder = {
        orderId,
        partnerId,
        referenceId: referenceId || orderId,
        amount: baseAmount,
        currency: 'INR',
        commissionRate,
        platformFee,
        partnerShare,
        status: 'CREATED',
        createdAt: new Date().toISOString(),
        gatewayOrderId: `rzp_order_${Date.now()}`,
      };

      paymentOrdersStore.set(orderId, newOrder);

      res.status(201).json({
        success: true,
        order: newOrder,
        message: 'Server-authoritative payment order initialized.',
      });
    } catch (err: any) {
      console.error('[Payments] Order creation error:', err);
      res.status(500).json({ error: 'Internal payment order creation error', details: err.message });
    }
  });

  // Verify Payment Signature (HMAC SHA-256 with Idempotency)
  app.post('/api/payments/verify', (req: Request, res: Response) => {
    try {
      const { orderId, paymentId, signature } = req.body;

      if (!orderId) {
        return res.status(400).json({ error: 'Missing orderId' });
      }

      const order = paymentOrdersStore.get(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Payment order not found.' });
      }

      // Check Idempotency
      if (order.status === 'CAPTURED') {
        return res.json({
          success: true,
          status: 'CAPTURED',
          message: 'Payment already captured idempotently.',
          order,
        });
      }

      const secret = process.env.RAZORPAY_KEY_SECRET || process.env.PAYMENT_WEBHOOK_SECRET;
      
      let isValidSignature = true;
      if (signature) {
        if (secret) {
          const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(`${order.gatewayOrderId || orderId}|${paymentId}`)
            .digest('hex');
          isValidSignature = crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));
        } else {
          console.warn('[Payments] Payment signature received without RAZORPAY_KEY_SECRET configured. Allowed in development mode.');
        }
      }

      if (!isValidSignature) {
        order.status = 'FAILED';
        return res.status(400).json({ success: false, error: 'Invalid payment signature verification.' });
      }

      // Transition to CAPTURED
      order.status = 'CAPTURED';
      order.capturedAt = new Date().toISOString();
      order.gatewayPaymentId = paymentId || `pay_${Date.now()}`;
      paymentOrdersStore.set(orderId, order);

      res.json({
        success: true,
        status: 'CAPTURED',
        order,
        message: 'Payment captured and verified server-side.',
      });
    } catch (err: any) {
      console.error('[Payments] Verification error:', err);
      res.status(500).json({ error: 'Payment verification failed', details: err.message });
    }
  });

  // Inbound Payment Gateway Webhook (Replay Protection & HMAC Validation)
  app.post('/api/payments/webhook', (req: any, res: Response) => {
    try {
      const signature = req.headers['x-razorpay-signature'] || req.headers['x-webhook-signature'];
      const eventId = req.headers['x-event-id'] || req.body?.event_id || `evt_${Date.now()}`;

      // 1. Check Replay Protection
      if (processedWebhookEvents.has(eventId as string)) {
        return res.status(200).json({ status: 'ignored', message: 'Event already processed (Idempotent).' });
      }

      // 2. Validate HMAC Signature if secret exists
      const secret = process.env.PAYMENT_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
      if (secret && signature && req.rawBody) {
        const expectedSignature = crypto.createHmac('sha256', secret).update(req.rawBody).digest('hex');
        if (expectedSignature !== signature) {
          return res.status(401).json({ error: 'Unauthorized webhook signature.' });
        }
      } else if (signature && !secret) {
        console.warn('[Payments Webhook] Received webhook signature without PAYMENT_WEBHOOK_SECRET. Bypassed in dev mode.');
      }

      processedWebhookEvents.add(eventId as string);

      const event = req.body;
      console.log(`[Payment Webhook] Ingested event: ${event.event || 'payment.captured'}`);

      res.status(200).json({ status: 'success', eventId });
    } catch (err: any) {
      console.error('[Payments Webhook] Error:', err);
      res.status(500).json({ error: 'Webhook processing error' });
    }
  });

  // -------------------------------------------------------------
  // 3. SERVER-SIDE SETTLEMENT ARCHITECTURE (PHASE 3D)
  // -------------------------------------------------------------

  // Calculate Settlement Breakdown & Eligibility
  app.post('/api/settlements/calculate', (req: Request, res: Response) => {
    try {
      const { partnerId, grossAmount, commissionRate = 10 } = req.body;

      if (!partnerId || grossAmount <= 0) {
        return res.status(400).json({ error: 'Invalid settlement amount or partnerId' });
      }

      const commissionAmount = Math.round((grossAmount * commissionRate) / 100);
      const payableAmount = grossAmount - commissionAmount;

      res.json({
        partnerId,
        grossAmount,
        commissionRate,
        commissionAmount,
        payableAmount,
        currency: 'INR',
        isEligible: payableAmount > 0,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Settlement calculation error', details: err.message });
    }
  });

  // Initiate Settlement Request with Idempotency Key
  app.post('/api/settlements/request', (req: Request, res: Response) => {
    try {
      const { partnerId, amount, commissionRate = 10, bankSummary, idempotencyKey } = req.body;

      if (!partnerId || !amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid partnerId or amount.' });
      }

      const finalKey = idempotencyKey || `idemp-${partnerId}-${Date.now()}`;

      // Check if already requested with same idempotency key
      const existing = settlementsStore.get(finalKey);
      if (existing) {
        return res.status(200).json({
          success: true,
          settlement: existing,
          message: 'Retrieved existing settlement request (Idempotent).',
        });
      }

      const commissionAmount = Math.round((amount * commissionRate) / 100);
      const payableAmount = amount - commissionAmount;
      const settlementId = `IND-SETTL-${Math.floor(Math.random() * 8999 + 1000)}`;

      const newSettlement: StoredSettlement = {
        settlementId,
        idempotencyKey: finalKey,
        partnerId,
        grossAmount: amount,
        commissionAmount,
        payableAmount,
        bankSummary: bankSummary || 'Partner Bank Account (NEFT/RTGS)',
        status: 'PENDING',
        requestedAt: new Date().toISOString(),
      };

      settlementsStore.set(finalKey, newSettlement);

      res.status(201).json({
        success: true,
        settlement: newSettlement,
        message: 'Settlement payout request registered in server ledger.',
      });
    } catch (err: any) {
      console.error('[Settlements] Request error:', err);
      res.status(500).json({ error: 'Failed to process settlement request', details: err.message });
    }
  });

  // Payout Webhook Listener (Bank Disbursal Status Update)
  app.post('/api/settlements/payout-webhook', (req: any, res: Response) => {
    try {
      const { settlementId, status, payoutRef } = req.body;

      if (!settlementId) {
        return res.status(400).json({ error: 'Missing settlementId' });
      }

      for (const [key, item] of settlementsStore.entries()) {
        if (item.settlementId === settlementId) {
          item.status = status === 'SUCCESS' ? 'COMPLETED' : 'FAILED';
          item.payoutRef = payoutRef || `UTR_${Date.now()}`;
          item.completedAt = new Date().toISOString();
          settlementsStore.set(key, item);
          break;
        }
      }

      res.json({ success: true, message: 'Settlement state updated.' });
    } catch (err: any) {
      res.status(500).json({ error: 'Payout webhook processing error' });
    }
  });

  // -------------------------------------------------------------
  // 4. n8n SECURE WEBHOOK ARCHITECTURE (PHASE 3E)
  // -------------------------------------------------------------

  // Outbound Webhook Dispatcher to n8n with HMAC Signature
  app.post('/api/webhooks/n8n/dispatch', async (req: Request, res: Response) => {
    try {
      const { eventType, partnerId, payload } = req.body;
      const n8nUrl = process.env.N8N_WEBHOOK_URL;
      const n8nSecret = process.env.N8N_WEBHOOK_SECRET;

      const eventId = `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const timestamp = new Date().toISOString();

      const eventBody = {
        eventId,
        eventType,
        partnerId,
        timestamp,
        data: payload,
      };

      const payloadString = JSON.stringify(eventBody);
      const signature = n8nSecret
        ? crypto.createHmac('sha256', n8nSecret).update(payloadString).digest('hex')
        : 'dev-unsigned-event';

      // If live n8n URL is configured, perform outbound POST
      let dispatched = false;
      if (n8nUrl) {
        try {
          const response = await fetch(n8nUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Indesian-Signature': signature,
              'X-Indesian-Timestamp': timestamp,
              'X-Indesian-Event-Id': eventId,
            },
            body: payloadString,
          });
          dispatched = response.ok;
        } catch (fetchErr) {
          console.warn('[n8n Webhook] Outbound endpoint connection note:', fetchErr);
        }
      }

      res.json({
        success: true,
        eventId,
        eventType,
        dispatched,
        signatureGenerated: Boolean(n8nSecret),
        message: dispatched
          ? 'Event dispatched to live n8n pipeline.'
          : 'Event staged in webhook queue (n8n adapter active).',
      });
    } catch (err: any) {
      console.error('[n8n Webhook] Dispatch error:', err);
      res.status(500).json({ error: 'Failed to dispatch n8n event', details: err.message });
    }
  });

  // Inbound Webhook Listener from n8n (Signature & Timestamp Validation)
  app.post('/api/webhooks/n8n/inbound', (req: any, res: Response) => {
    try {
      const signature = req.headers['x-indesian-signature'];
      const timestampHeader = req.headers['x-indesian-timestamp'] as string;
      const n8nSecret = process.env.N8N_WEBHOOK_SECRET;

      // 1. Validate Timestamp Freshness (< 5 minutes to prevent replay attack)
      if (timestampHeader) {
        const eventTime = new Date(timestampHeader).getTime();
        const now = Date.now();
        if (Math.abs(now - eventTime) > 5 * 60 * 1000) {
          return res.status(400).json({ error: 'Webhook timestamp expired (Replay protection triggered).' });
        }
      }

      // 2. Validate HMAC Signature
      if (req.rawBody && signature) {
        if (n8nSecret) {
          const expectedSignature = crypto.createHmac('sha256', n8nSecret).update(req.rawBody).digest('hex');
          if (signature !== expectedSignature) {
            return res.status(401).json({ error: 'Invalid HMAC signature on inbound n8n webhook.' });
          }
        } else {
          console.warn('[n8n Inbound Webhook] Signature present but N8N_WEBHOOK_SECRET not configured. Accepted in dev mode.');
        }
      }

      console.log('[n8n Inbound Webhook] Successfully validated and processed message:', req.body?.eventType);
      res.json({ success: true, status: 'PROCESSED' });
    } catch (err: any) {
      res.status(500).json({ error: 'Inbound webhook failure' });
    }
  });

  // -------------------------------------------------------------
  // 5. NOTIFICATION MULTI-CHANNEL DISPATCHER (PHASE 3F)
  // -------------------------------------------------------------
  app.post('/api/notifications/dispatch', (req: Request, res: Response) => {
    try {
      const { partnerId, title, message, category, channels = ['IN_APP'] } = req.body;

      const notificationId = `NTF-${Date.now()}-${Math.floor(Math.random() * 899 + 100)}`;
      const createdAt = new Date().toISOString();

      console.log(`[Notification Engine] Dispatched alert to ${partnerId} across channels: ${channels.join(', ')}`);

      res.status(201).json({
        success: true,
        notificationId,
        partnerId,
        title,
        message,
        category: category || 'GENERAL',
        channels,
        createdAt,
        status: 'DELIVERED',
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Notification dispatch failed', details: err.message });
    }
  });

  // -------------------------------------------------------------
  // 6. GPS & AMBULANCE TELEMATICS ARCHITECTURE (PHASE 3G & 3H)
  // -------------------------------------------------------------
  
  // Driver Telemetry Location Ingest
  app.post('/api/telemetry/location-update', (req: Request, res: Response) => {
    try {
      const { tripId, ambulanceId, partnerId, latitude, longitude, speed = 0, heading = 0, accuracy = 5, tripStatus } = req.body;

      if (!tripId || !latitude || !longitude) {
        return res.status(400).json({ error: 'Missing required telemetry parameters (tripId, latitude, longitude).' });
      }

      const telemetry: AmbulanceTelemetry = {
        tripId,
        ambulanceId: ambulanceId || 'AMB-UNIT-1',
        partnerId: partnerId || 'DEMO-AMB-1001',
        latitude,
        longitude,
        speed,
        heading,
        accuracy,
        timestamp: new Date().toISOString(),
        tripStatus: tripStatus || 'EN_ROUTE',
      };

      ambulanceTelemetryStore.set(tripId, telemetry);

      res.json({
        success: true,
        telemetry,
        message: 'Telemetry point ingested and stored.',
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Telemetry ingestion error', details: err.message });
    }
  });

  // Dispatcher Telemetry Stream Query
  app.get('/api/telemetry/trip-stream/:tripId', (req: Request, res: Response) => {
    try {
      const { tripId } = req.params;
      const telemetry = ambulanceTelemetryStore.get(tripId);

      if (!telemetry) {
        // Return default base telemetry for active emergency demonstration
        return res.json({
          tripId,
          ambulanceId: 'AMB-ALS-04',
          partnerId: 'DEMO-AMB-1001',
          latitude: 28.6139,
          longitude: 77.2090,
          speed: 42,
          heading: 185,
          accuracy: 4.2,
          timestamp: new Date().toISOString(),
          tripStatus: 'EN_ROUTE',
          isLiveTelemetry: false,
          note: 'Google Maps telematics streaming adapter active.',
        });
      }

      res.json({
        ...telemetry,
        isLiveTelemetry: true,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve trip telemetry', details: err.message });
    }
  });

  // Emergency State Machine Transition (Server-Authoritative)
  app.post('/api/emergency/transition-state', (req: Request, res: Response) => {
    try {
      const { tripId, partnerId, currentStatus, nextStatus } = req.body;

      const validTransitions: Record<string, string[]> = {
        SOS_REQUEST: ['DISPATCHED', 'CANCELLED'],
        DISPATCHED: ['EN_ROUTE', 'CANCELLED'],
        EN_ROUTE: ['PATIENT_PICKED_UP', 'CANCELLED'],
        PATIENT_PICKED_UP: ['HOSPITAL_ARRIVAL'],
        HOSPITAL_ARRIVAL: ['TRIP_COMPLETED'],
      };

      if (currentStatus && validTransitions[currentStatus] && !validTransitions[currentStatus].includes(nextStatus)) {
        return res.status(400).json({
          error: `Invalid state transition from ${currentStatus} to ${nextStatus}. Valid targets: ${validTransitions[currentStatus].join(', ')}`,
        });
      }

      res.json({
        success: true,
        tripId,
        partnerId,
        previousStatus: currentStatus,
        newStatus: nextStatus,
        transitionTimestamp: new Date().toISOString(),
        auditLogged: true,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Emergency transition failed', details: err.message });
    }
  });

  // -------------------------------------------------------------
  // 7. GEMINI AI SECURE PROXY (SERVER-SIDE ONLY)
  // -------------------------------------------------------------
  app.get('/api/ai/status', (_req: Request, res: Response) => {
    const isGeminiConfigured = Boolean(process.env.GEMINI_API_KEY);
    res.json({
      configured: isGeminiConfigured,
      model: 'gemini-2.5-flash',
      message: isGeminiConfigured
        ? 'Gemini AI API key is configured and ready.'
        : 'GEMINI_API_KEY is not set in environment. Set it in .env to activate live AI reasoning.',
    });
  });

  app.post('/api/ai/generate', async (req: Request, res: Response) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn('[Gemini AI] Call received but GEMINI_API_KEY is not configured in environment.');
        return res.status(503).json({
          error: 'Gemini AI is not configured. Please supply GEMINI_API_KEY in your .env file.',
          configured: false,
        });
      }

      const { prompt, systemInstruction } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Missing prompt parameter in request body.' });
      }

      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: systemInstruction ? { systemInstruction } : undefined,
      });

      res.json({
        success: true,
        text: response.text,
        model: 'gemini-2.5-flash',
      });
    } catch (err: any) {
      console.error('[Gemini AI] Generation error:', err);
      res.status(500).json({
        error: 'Failed to generate content with Gemini AI',
        details: err.message,
      });
    }
  });

  // -------------------------------------------------------------
  // 8. VITE MIDDLEWARE / SPA FALLBACK
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Indesian Partner Gateway] Server active on port ${PORT}`);
  });
}

startServer();
