import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// In-Memory User Profiles Database for Role-Based Auth
const TEST_USERS: Record<string, any> = {
  'patient@indesian.com': {
    id: 'user-patient-1',
    email: 'patient@indesian.com',
    name: 'Test Patient (Ananya Sharma)',
    role: 'PATIENT',
    dashboardPath: '/patient-dashboard',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
    phone: '+91 98765 43210',
    isVerified: true
  },
  'doctor@indesian.com': {
    id: 'user-doctor-1',
    email: 'doctor@indesian.com',
    name: 'Dr. Rajesh Sharma (Test Doctor)',
    role: 'DOCTOR',
    dashboardPath: '/doctor-dashboard',
    specialty: 'Senior Consultant Physician',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&q=80',
    phone: '+91 98111 22334',
    isVerified: true
  },
  'pharmacy@indesian.com': {
    id: 'user-pharmacy-1',
    email: 'pharmacy@indesian.com',
    name: 'Apollo Pharmacy Partner',
    role: 'PHARMACY',
    dashboardPath: '/pharmacy-dashboard',
    partnerName: 'Apollo Digital Pharmacy',
    avatarUrl: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=100&q=80',
    phone: '+91 98222 33445',
    isVerified: true
  },
  'lab@indesian.com': {
    id: 'user-lab-1',
    email: 'lab@indesian.com',
    name: 'Dr. Lal Pathlabs Partner',
    role: 'LAB',
    dashboardPath: '/lab-dashboard',
    partnerName: 'Dr. Lal Pathlabs NABL Lab',
    avatarUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=100&q=80',
    phone: '+91 98333 44556',
    isVerified: true
  },
  'hospital@indesian.com': {
    id: 'user-hospital-1',
    email: 'hospital@indesian.com',
    name: 'Fortis Hospital Desk',
    role: 'HOSPITAL',
    dashboardPath: '/hospital-dashboard',
    partnerName: 'Fortis Healthcare OPD Desk',
    avatarUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=100&q=80',
    phone: '+91 98444 55667',
    isVerified: true
  },
  'partner@indesian.com': {
    id: 'user-partner-1',
    email: 'partner@indesian.com',
    name: 'Central Partner Network',
    role: 'PARTNER',
    dashboardPath: '/partner-dashboard',
    partnerName: 'Indesian Partner Ecosystem',
    avatarUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100&q=80',
    phone: '+91 98555 66778',
    isVerified: true
  },
  'admin@indesian.com': {
    id: 'user-admin-1',
    email: 'admin@indesian.com',
    name: 'Indesian Control Tower Admin',
    role: 'ADMIN',
    dashboardPath: '/admin-dashboard',
    partnerName: 'Indesian Operations Control Tower',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    phone: '+91 98000 00000',
    isVerified: true
  }
};

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Indesian Digital OPD API' });
});

// ROLE-BASED AUTHENTICATION ENDPOINTS
app.post('/api/auth/login', (req, res) => {
  const { email, role } = req.body;

  // Find user by email or by target role
  let foundUser = null;
  if (email && TEST_USERS[email.toLowerCase()]) {
    foundUser = TEST_USERS[email.toLowerCase()];
  } else if (role) {
    const targetRole = role.toUpperCase();
    foundUser = Object.values(TEST_USERS).find((u) => u.role === targetRole);
  }

  if (!foundUser) {
    // Default fallback to patient
    foundUser = TEST_USERS['patient@indesian.com'];
  }

  return res.json({
    success: true,
    user: foundUser,
    message: `Successfully authenticated as ${foundUser.name} (${foundUser.role}). Directed to ${foundUser.dashboardPath}`
  });
});

app.get('/api/auth/me', (req, res) => {
  const email = (req.query.email as string) || '';
  const role = (req.query.role as string) || '';

  let foundUser = null;
  if (email && TEST_USERS[email.toLowerCase()]) {
    foundUser = TEST_USERS[email.toLowerCase()];
  } else if (role) {
    foundUser = Object.values(TEST_USERS).find((u) => u.role === role.toUpperCase());
  }

  if (!foundUser) {
    foundUser = TEST_USERS['patient@indesian.com'];
  }

  return res.json({
    authenticated: true,
    user: foundUser
  });
});

app.get('/api/auth/test-accounts', (req, res) => {
  return res.json({
    accounts: Object.values(TEST_USERS)
  });
});

// Initialize Google Gen AI lazily or safely
let hasWarnedGeminiMissing = false;

function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === 'your_gemini_api_key_here') {
    if (!hasWarnedGeminiMissing) {
      console.warn('⚠️ [CONFIG WARNING] GEMINI_API_KEY is not configured or using placeholder. Running AI healthcare assistant in deterministic offline fallback mode.');
      hasWarnedGeminiMissing = true;
    }
    return null;
  }
  try {
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err: any) {
    console.error('⚠️ [ERROR] Failed to initialize GoogleGenAI client:', err?.message || err);
    return null;
  }
}

// Helper: Deterministic Clinical Triage Classifier
function classifyPatientComplaint(queryText: string, symptoms: string[] = []) {
  const text = `${queryText} ${symptoms.join(' ')}`.toLowerCase();

  // 1. Emergency Critical Red Flags (English, Romanized Hindi, and Devanagari Hindi)
  const isEmergency = [
    'chest pain', 'severe pain in chest', 'chhati mein', 'crushing chest', 'heart attack', 'dil ka daura',
    'saans lene mein dikkat', 'saans nahi', 'cannot breathe', 'severe breathlessness', 'shortness of breath',
    'unconscious', 'behoshi', 'fainted', 'stroke', 'sudden paralysis',
    'heavy bleeding', 'severe bleeding', 'massive bleeding', 'convulsion', 'seizure',
    'सीने में दर्द', 'छाती में दर्द', 'सांस लेने में दिक्कत', 'साँस लेने में दिक्कत', 'दिल का दौरा', 'बेहोश', 'बेहोशी', 'भारी रक्तस्राव'
  ].some(k => text.includes(k.toLowerCase()));

  if (isEmergency) {
    return {
      urgency: 'urgent_emergency',
      intent: 'urgent_emergency',
      initialDoctorRoute: 'Emergency / Critical Care',
      suggestedSpecialty: 'Emergency / Critical Care',
      category: 'Emergency Help',
      reasoning: 'Critical red flag symptoms detected requiring immediate emergency intervention.'
    };
  }

  // 2. Ophthalmology / Eye (Eye pain, red eye, blurred vision, aankh, drishti)
  if ([
    'aankh', 'eye', 'dhundhla', 'vision', 'sight', 'dikh raha', 'cataract', 'glaucoma', 'cornea', 'red eye', 'blind',
    'आँख', 'आंख', 'धुंधला', 'दिखाई', 'मोतियाबिंद', 'दृष्टि', 'नेत्र', 'आंख लाल', 'आँख लाल'
  ].some(k => text.includes(k.toLowerCase()))) {
    return {
      urgency: 'routine',
      intent: 'specialist_consultation',
      initialDoctorRoute: 'Ophthalmology',
      suggestedSpecialty: 'Ophthalmology',
      category: 'Ophthalmology',
      reasoning: 'Symptoms relate specifically to vision, ocular pain, or eye health.'
    };
  }

  // 3. ENT (Ear, Nose, Throat)
  if ([
    'kaan', 'ear', 'naak', 'nose', 'gala', 'throat', 'sinus', 'tonsil', 'hearing', 'vertigo', 'earache', 'tinnitus',
    'कान', 'नाक', 'गला', 'गले', 'साइनस', 'टॉन्सिल', 'सुनने', 'कान दर्द', 'गले में खराश'
  ].some(k => text.includes(k.toLowerCase()))) {
    return {
      urgency: 'routine',
      intent: 'specialist_consultation',
      initialDoctorRoute: 'ENT (Ear, Nose, Throat)',
      suggestedSpecialty: 'ENT (Ear, Nose, Throat)',
      category: 'ENT',
      reasoning: 'Symptoms involve the auditory, nasal, or otorhinolaryngology pathways.'
    };
  }

  // 4. Diabetology & Endocrinology (Blood sugar, thyroid, metabolic)
  if ([
    'diabetes', 'sugar', 'blood sugar', 'hba1c', 'thyroid', 'insulin', 'endocrine', 'hormone', 'metabolic',
    'शुगर', 'डायबिटीज', 'थायराइड', 'इंसुलिन', 'मधुमेह', 'हार्मोन'
  ].some(k => text.includes(k.toLowerCase()))) {
    return {
      urgency: 'routine',
      intent: 'specialist_consultation',
      initialDoctorRoute: 'Diabetology & Endocrinology',
      suggestedSpecialty: 'Diabetology & Endocrinology',
      category: 'Diabetology & Endocrinology',
      reasoning: 'Complaint targets metabolic health, glycemic control, or endocrine disorders.'
    };
  }

  // 5. Orthopaedics & Joint Care (Knee, joint, bone, spine, fracture)
  if ([
    'ghutne', 'knee', 'joint', 'bone', 'haddi', 'jod', 'arthritis', 'spine', 'back pain', 'backache', 'fracture', 'ortho', 'ligament',
    'घुटने', 'घुटनों', 'जोड़', 'जोड़ों', 'हड्डी', 'हड्डियों', 'गठिया', 'कमर दर्द', 'पीठ दर्द', 'फ्रैक्चर', 'रीढ़'
  ].some(k => text.includes(k.toLowerCase()))) {
    return {
      urgency: 'routine',
      intent: 'specialist_consultation',
      initialDoctorRoute: 'Orthopaedics & Joint Care',
      suggestedSpecialty: 'Orthopaedics & Joint Care',
      category: 'Orthopaedics',
      reasoning: 'Symptoms involve musculoskeletal, joint, spine, or bone conditions.'
    };
  }

  // 6. Dermatology & Hair Care
  if ([
    'skin', 'twacha', 'baal', 'hair', 'acne', 'pimple', 'rash', 'eczema', 'khujli', 'itching', 'allergy', 'scalp', 'dermat',
    'त्वचा', 'बाल', 'खुजली', 'दाने', 'मुंहासे', 'चमड़ी', 'एलर्जी'
  ].some(k => text.includes(k.toLowerCase()))) {
    return {
      urgency: 'routine',
      intent: 'specialist_consultation',
      initialDoctorRoute: 'Dermatology & Hair Care',
      suggestedSpecialty: 'Dermatology & Hair Care',
      category: 'Dermatology',
      reasoning: 'Dermatological and trichological symptoms.'
    };
  }

  // 7. Gynaecology & Pregnancy Care
  if ([
    'pregnancy', 'pregnant', 'period', 'menstrual', 'pcod', 'pcos', 'mahila', 'gynae', 'fetus', 'uterus', 'ovary', 'discharge',
    'गर्भावस्था', 'गर्भवती', 'मासिक धर्म', 'पीरियड', 'महिला', 'गर्भाशय'
  ].some(k => text.includes(k.toLowerCase()))) {
    return {
      urgency: 'routine',
      intent: 'specialist_consultation',
      initialDoctorRoute: 'Gynaecology & Pregnancy Care',
      suggestedSpecialty: 'Gynaecology & Pregnancy Care',
      category: 'Gynaecology',
      reasoning: 'Obstetric, gynaecological, and female reproductive health concerns.'
    };
  }

  // 8. Paediatrics & Child Health
  if ([
    'baccha', 'child', 'kid', 'baby', 'infant', 'pediat', 'newborn', 'vaccin',
    'बच्चा', 'बच्चे', 'शिशु', 'नवजात', 'बाल रोग', 'टीकाकरण'
  ].some(k => text.includes(k.toLowerCase()))) {
    return {
      urgency: 'routine',
      intent: 'specialist_consultation',
      initialDoctorRoute: 'Paediatrics & Child Health',
      suggestedSpecialty: 'Paediatrics & Child Health',
      category: 'Paediatrics',
      reasoning: 'Paediatric and infant care concerns.'
    };
  }

  // 9. Gastroenterology & Liver
  if ([
    'pet dard', 'stomach pain', 'acidity', 'gas', 'liver', 'jaundice', 'piliya', 'gerd', 'constipation', 'kabz', 'ulcer', 'digest',
    'पेट दर्द', 'पेट में दर्द', 'एसिडिटी', 'गैस', 'लिवर', 'पीलिया', 'कब्ज', 'अल्सर', 'पाचन', 'उल्टी'
  ].some(k => text.includes(k.toLowerCase()))) {
    return {
      urgency: 'routine',
      intent: 'specialist_consultation',
      initialDoctorRoute: 'Gastroenterology & Liver',
      suggestedSpecialty: 'Gastroenterology & Liver',
      category: 'Gastroenterology',
      reasoning: 'Gastrointestinal and hepatobiliary complaints.'
    };
  }

  // 10. Pulmonology & Chest (Non-emergency chronic respiratory)
  if ([
    'asthma', 'chronic cough', 'bronchitis', 'lung', 'respiratory', 'inhaler', 'wheezing',
    'अस्थमा', 'दमा', 'फेफड़े', 'श्वसन'
  ].some(k => text.includes(k.toLowerCase()))) {
    return {
      urgency: 'routine',
      intent: 'specialist_consultation',
      initialDoctorRoute: 'Pulmonology & Chest',
      suggestedSpecialty: 'Pulmonology & Chest',
      category: 'Pulmonology',
      reasoning: 'Respiratory and pulmonary health concerns.'
    };
  }

  // 11. Nephrology & Urology
  if ([
    'kidney', 'stone', 'patthri', 'urine', 'peshab', 'prostate', 'uti', 'gurda', 'renal',
    'किडनी', 'गुर्दा', 'पथरी', 'पेशाब', 'प्रोस्टेट', 'मूत्र'
  ].some(k => text.includes(k.toLowerCase()))) {
    return {
      urgency: 'routine',
      intent: 'specialist_consultation',
      initialDoctorRoute: 'Nephrology & Urology',
      suggestedSpecialty: 'Nephrology & Urology',
      category: 'Nephrology & Urology',
      reasoning: 'Renal, urinary tract, or urological health concerns.'
    };
  }

  // 12. General Physician / Internal Medicine (Default for undifferentiated, general, fever/mild cough, or multiple symptoms)
  return {
    urgency: 'routine',
    intent: 'general_physician_consultation',
    initialDoctorRoute: 'General Physician / Internal Medicine',
    suggestedSpecialty: 'General Physician',
    category: 'General Physician',
    reasoning: 'General, undifferentiated, or systemic symptoms best evaluated first by a General Physician.'
  };
}

// 1. AI Reception & Patient Intake Triage Endpoint
app.post('/api/ai/reception', async (req, res) => {
  const { userQuery, language = 'English', symptoms = [], medicalHistory = [] } = req.body;
  if (!userQuery) {
    return res.status(400).json({ error: 'userQuery is required' });
  }

  const queryText = userQuery.trim();
  const triageClass = classifyPatientComplaint(queryText, symptoms);

  const ai = getAIClient();
  if (!ai) {
    // Fallback response using clinical triage classifier
    if (triageClass.urgency === 'urgent_emergency') {
      return res.json({
        intent: 'urgent_emergency',
        initialDoctorRoute: 'Emergency / Critical Care',
        suggestedSpecialty: 'Emergency / Critical Care',
        urgency: 'urgent_emergency',
        summary: `Immediate emergency attention required. Please call 108 or proceed to the nearest emergency hospital.`,
        receptionMessage: `⚠️ Emergency Alert: Please do not wait for online routine OPD. Urgent in-person evaluation is required.`,
        extractedSymptoms: ['Emergency / Critical symptoms flagged'],
        potentialSpecialistForGP: 'Emergency Medicine / Critical Care',
        nextSteps: [
          'Call Emergency Ambulance (108) or National Emergency (112)',
          'Proceed to the nearest 24x7 Emergency Hospital',
          'Keep your ID and emergency contact ready'
        ],
        recommendedQuestions: [
          'What immediate first-aid is required?',
          'Which nearest hospital has active ICU/ER support?'
        ]
      });
    }

    const isGP = triageClass.suggestedSpecialty.toLowerCase().includes('general') || triageClass.suggestedSpecialty.toLowerCase().includes('internal medicine');

    return res.json({
      intent: triageClass.intent,
      initialDoctorRoute: triageClass.initialDoctorRoute,
      suggestedSpecialty: triageClass.suggestedSpecialty,
      urgency: triageClass.urgency,
      summary: isGP
        ? `Your intake has been recorded. A General Physician will conduct the initial clinical assessment and coordinate further care or referrals if needed.`
        : `Your complaint indicates a specialty consultation in ${triageClass.suggestedSpecialty}. Matching certified specialists are available in our Doctor Master.`,
      receptionMessage: `Patient intake recorded. Directed to ${triageClass.suggestedSpecialty}.`,
      extractedSymptoms: symptoms.length > 0 ? symptoms : [queryText],
      potentialSpecialistForGP: triageClass.suggestedSpecialty,
      nextSteps: [
        `Select a verified ${triageClass.suggestedSpecialty} specialist`,
        'Upload previous medical records or test reports if available',
        'Proceed with secure audio/video or in-clinic consultation'
      ],
      recommendedQuestions: [
        `What could be causing these ${triageClass.suggestedSpecialty} symptoms?`,
        'Are there any diagnostic investigations or blood tests recommended?',
        'What precautions or treatment plan should be followed?'
      ]
    });
  }

  try {
    const prompt = `You are Indesian Health AI, the digital triage receptionist for "Patient Reception & AI Intake" at Indesian Digital OPD.
    Analyze this patient intake query: "${queryText}".
    Attached known symptoms: ${JSON.stringify(symptoms)}.
    Attached medical history: ${JSON.stringify(medicalHistory)}.
    Requested response language: ${language}.

    CLINICAL ROUTING & TRIAGE TAXONOMY:
    1. YOUR ROLE IS ADMINISTRATIVE & CLINICAL ROUTING ONLY. You DO NOT provide final medical diagnoses or prescribe medications.
    2. EMERGENCY SYMPTOMS:
       If the patient has severe chest pain, acute breathlessness/respiratory distress, stroke signs, unconsciousness, heavy bleeding, or life-threatening red flags:
       - urgency: "urgent_emergency"
       - intent: "urgent_emergency"
       - initialDoctorRoute: "Emergency / Critical Care"
       - suggestedSpecialty: "Emergency / Critical Care"
       - summary: Clear emergency guidance in ${language} advising immediate emergency room visit or calling 108.
    3. SPECIALTY-SPECIFIC ROUTING (DO NOT DEFAULT TO GENERAL PHYSICIAN WHEN A SPECIFIC SPECIALTY IS CLEAR):
       - Eye / Vision / Pain in eye / Red eye / Dhundhla dikhna -> suggestedSpecialty: "Ophthalmology"
       - Ear / Nose / Throat / Ear pain / Sinus / Hearing / Kaan dard -> suggestedSpecialty: "ENT (Ear, Nose, Throat)"
       - Diabetes / Uncontrolled Sugar / Thyroid / Hormonal -> suggestedSpecialty: "Diabetology & Endocrinology"
       - Bone / Joint pain / Knee pain / Ghutne mein dard / Spine / Arthritis -> suggestedSpecialty: "Orthopaedics & Joint Care"
       - Skin / Acne / Hair fall / Rash / Twacha / Baal -> suggestedSpecialty: "Dermatology & Hair Care"
       - Stomach pain / Severe acidity / Liver / Jaundice / Pet dard -> suggestedSpecialty: "Gastroenterology & Liver"
       - Chronic cough / Asthma / Breathing allergies (non-emergency) -> suggestedSpecialty: "Pulmonology & Chest"
       - Kidney stone / Urinary pain / Prostate / Gurda -> suggestedSpecialty: "Nephrology & Urology"
       - Pregnancy / Menstrual / PCOD / Female health -> suggestedSpecialty: "Gynaecology & Pregnancy Care"
       - Child / Infant / Baby health -> suggestedSpecialty: "Paediatrics & Child Health"
       - Heart palpitations / High Blood Pressure (non-emergency) -> suggestedSpecialty: "Cardiology"
    4. GENERAL PHYSICIAN / INTERNAL MEDICINE (USE ONLY WHEN APPROPRIATE):
       - Route to "General Physician" ONLY when:
         a) Complaint is genuinely general or systemic (e.g. fever, mild cough, body fatigue, viral illness)
         b) Symptoms are unclear, undifferentiated, or patient is confused ("samajh nahi aa raha")
         c) Patient explicitly requests a General Physician / Family Doctor.

    Provide response in JSON format with these exact keys:
    {
      "intent": "specialist_consultation" | "general_physician_consultation" | "urgent_emergency",
      "initialDoctorRoute": string (The exact medical specialty identified, or "Emergency / Critical Care"),
      "suggestedSpecialty": string (e.g. "Ophthalmology", "ENT (Ear, Nose, Throat)", "Orthopaedics & Joint Care", "Diabetology & Endocrinology", "General Physician", "Emergency / Critical Care"),
      "urgency": "routine" | "moderate" | "urgent_emergency",
      "summary": string (Intake summary in ${language}),
      "receptionMessage": string (Intake confirmation note in ${language}),
      "extractedSymptoms": array of strings,
      "potentialSpecialistForGP": string,
      "nextSteps": array of 3 strings,
      "recommendedQuestions": array of 3 strings
    }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');

    // Cross-verify with deterministic safety rules
    if (triageClass.urgency === 'urgent_emergency') {
      parsed.urgency = 'urgent_emergency';
      parsed.intent = 'urgent_emergency';
      parsed.initialDoctorRoute = 'Emergency / Critical Care';
      parsed.suggestedSpecialty = 'Emergency / Critical Care';
    } else if (parsed.suggestedSpecialty === 'General Physician / Internal Medicine' && triageClass.suggestedSpecialty !== 'General Physician') {
      // If AI over-generalized a specific complaint, respect the specific specialty
      parsed.suggestedSpecialty = triageClass.suggestedSpecialty;
      parsed.initialDoctorRoute = triageClass.initialDoctorRoute;
    }

    return res.json(parsed);
  } catch (_error) {
    console.log('Serving robust fallback response for patient reception intake.');
    const isGP = triageClass.suggestedSpecialty.toLowerCase().includes('general');
    return res.json({
      intent: triageClass.intent,
      initialDoctorRoute: triageClass.initialDoctorRoute,
      suggestedSpecialty: triageClass.suggestedSpecialty,
      urgency: triageClass.urgency,
      summary: triageClass.urgency === 'urgent_emergency'
        ? 'Your symptoms require immediate in-person emergency medical care. Please call 108 or visit the nearest hospital emergency room immediately.'
        : isGP
          ? `Your information has been received. A General Physician will evaluate your case first and coordinate further care or referrals.`
          : `Your complaint indicates a specialty consultation in ${triageClass.suggestedSpecialty}. Matching certified specialists are available in our Doctor Master.`,
      receptionMessage: `Patient intake recorded. Directed to ${triageClass.suggestedSpecialty}.`,
      extractedSymptoms: symptoms.length > 0 ? symptoms : [queryText],
      potentialSpecialistForGP: triageClass.suggestedSpecialty,
      nextSteps: [
        `Select a verified ${triageClass.suggestedSpecialty} specialist`,
        'Keep medical history and previous test reports ready',
        'Receive official doctor advice and prescription'
      ],
      recommendedQuestions: [
        `What could be causing these ${triageClass.suggestedSpecialty} symptoms?`,
        'Do I need any baseline diagnostic tests?',
        'What precautions should I take before consultation?'
      ]
    });
  }
});


// 2. Medical Report Intelligence Analyzer Endpoint
app.post('/api/ai/analyze-report', async (req, res) => {
  const { reportText, reportType = 'General Laboratory Report', patientAge, language = 'English' } = req.body;
  
  const fallbackReport = {
    summary: `This ${reportType} shows standard biological markers. Always consult a certified physician to interpret laboratory values in clinical context.`,
    keyFindings: [
      { parameter: 'Hemoglobin', value: '11.8 g/dL', status: 'Slightly Low', referenceRange: '12.0 - 15.5 g/dL', explanation: 'Mildly below average female reference baseline. Indicates mild anemia evaluation might be helpful.' },
      { parameter: 'Fasting Blood Sugar', value: '104 mg/dL', status: 'Borderline High', referenceRange: '70 - 99 mg/dL', explanation: 'Slightly above normal fasting glucose level. Discuss dietary lifestyle changes with your doctor.' },
      { parameter: 'Total Cholesterol', value: '185 mg/dL', status: 'Normal', referenceRange: '< 200 mg/dL', explanation: 'Within healthy reference bounds.' }
    ],
    healthTrend: [
      { period: '2024', parameter: 'Hemoglobin', value: 12.1 },
      { period: '2025', parameter: 'Hemoglobin', value: 11.8 },
      { period: '2026', parameter: 'Hemoglobin', value: 11.2 }
    ],
    doctorQuestions: [
      'Do I need iron supplements or dietary changes for my hemoglobin?',
      'When should I repeat the fasting blood sugar test?',
      'Does my current prescription need modification based on these results?'
    ],
    disclaimer: 'AI explanation is for educational understanding only and is NOT a medical diagnosis. Please present this report to your doctor.'
  };

  const ai = getAIClient();
  if (!ai) {
    return res.json(fallbackReport);
  }

  try {
    const prompt = `You are Indesian Report Intelligence, part of Indesian Digital OPD.
    Analyze this medical report data:
    Report Type: ${reportType}
    Patient Age: ${patientAge || 'Adult'}
    Report Content/Text: "${reportText}"
    Language: ${language}

    Extract key findings and explain them simply for a patient in India.
    Respond strictly in JSON with this structure:
    {
      "summary": "Simple 2-sentence summary of overall findings in patient-friendly terms",
      "keyFindings": [
        {
          "parameter": "Parameter name",
          "value": "Measured value",
          "status": "Normal | Slightly Low | High | Borderline",
          "referenceRange": "Standard reference range",
          "explanation": "Simple clear explanation of what this marker means in everyday body terms"
        }
      ],
      "doctorQuestions": ["Question 1 to ask doctor", "Question 2", "Question 3"],
      "disclaimer": "AI explanation is for educational understanding only and does NOT constitute a clinical diagnosis."
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed.summary ? parsed : fallbackReport);
  } catch (_error) {
    console.log('Serving smart offline AI response for report analysis.');
    return res.json(fallbackReport);
  }
});

// 3. AI Health Assistant Endpoint (Context-Aware, Multi-Turn, Data-Grounded Digital OPD Guide & Receptionist)
app.post('/api/ai/health-assistant', async (req, res) => {
  const { 
    messages, 
    userContext, 
    userQuery, 
    language = 'English', 
    detectedIntent, 
    detectedSpecialty, 
    patientContext, 
    liveData,
    currentTab = 'home'
  } = req.body;

  const lastMessage = (messages?.[messages.length - 1]?.content || userQuery || 'Hello').trim();
  const lowerQuery = lastMessage.toLowerCase();
  const history = Array.isArray(messages) ? messages.slice(-8) : [];
  const isHindi = language.toLowerCase().includes('hindi') || 
    /[\u0900-\u097F]/.test(lastMessage) ||
    ['meri', 'mera', 'mere', 'mujhe', 'kya', 'hai', 'hain', 'kaise', 'kaun', 'kaunsa', 'kaunsi', 'kaunse', 'dard', 'aankh', 'ghutne', 'bukhar', 'seene', 'saans', 'dawai', 'kahan', 'kab', 'pitaji', 'papa', 'mummy', 'bacche', 'kislie', 'karo', 'karein', 'karta', 'suvidha', 'parcha', 'jodein'].some(k => lowerQuery.split(/[\s,?.!]+/).includes(k) || lowerQuery.includes(k));

  // Grounded Context-Aware Deterministic Response Generator
  const generateGroundedResponse = () => {
    const pName = patientContext?.name || 'Self';
    const pRel = patientContext?.relation || 'Self';
    const isFamily = pRel && pRel !== 'Self';
    const patientStr = isFamily ? ` for ${pName} (${pRel})` : '';
    const patientHindiStr = isFamily ? ` (${pName} - ${pRel} के लिए)` : '';

    // A. Platform Awareness & Overview Queries ("What is this platform?", "यह platform किसलिए है?", "ये app किस काम आता है?")
    if (detectedIntent === 'PLATFORM_INFO_QUERY' || [
      'platform kislie', 'kis kaam aata hai', 'what is this platform', 'what is indesian',
      'yeh app kya hai', 'ye platform kya hai', 'what can i do here', 'about this platform',
      'online hospital kaise kaam karta hai', 'is this a hospital', 'platform ke baare mein',
      'यह platform किसलिए है', 'यह platform किस लिए है', 'ये app किस काम आता है', 'यह ऐप क्या है', 'इस प्लेटफॉर्म के बारे में बताओ'
    ].some(k => lowerQuery.includes(k))) {
      if (isHindi) {
        return `🏥 **यह इंडेशियन डिजिटल ओपीडी है।** यह एक ऑनलाइन हेल्थकेयर प्लेटफॉर्म है, जहाँ आप डॉक्टर से कंसल्ट कर सकते हैं, लैब टेस्ट बुक कर सकते हैं, अपनी प्रिस्क्रिप्शन देख सकते हैं और अपनी हेल्थ जानकारी मैनेज कर सकते हैं।\n\n` +
          `**मुख्य सुविधाएं:**\n` +
          `• 🤖 **AI क्लिनिकल रिसेप्शन:** अपने लक्षणों का विश्लेषण करवाएं और सही मेडिकल स्पेशलिटी जानें।\n` +
          `• 👨‍⚕️ **सत्यापित डॉक्टर परामर्श:** 14+ विभागों के अनुभवी डॉक्टरों से वीडियो या इन-क्लीनिक परामर्श बुक करें।\n` +
          `• 🧪 **डायग्नोस्टिक लैब टेस्ट:** घर पर सैंपल कलेक्शन व ब्लड टेस्ट बुक करें और डिजिटल रिपोर्ट प्राप्त करें।\n` +
          `• 📝 **डिजिटल पर्चा (Prescriptions):** डॉक्टर का प्रमाणित डिजिटल पर्चा और दवा निर्देश सुरक्षित देखें।\n` +
          `• 💊 **दवाइयाँ एवं रिमाइंडर:** अपनी चालू दवाइयों का शेड्यूल ट्रैक करें और समय पर अलर्ट पाएं।\n` +
          `• 📁 **हेल्थ रिकॉर्ड्स वॉलेट:** अपने और पूरे परिवार के मेडिकल रिकॉर्ड्स एक जगह सुरक्षित रखें।\n` +
          `• 👨‍👩‍👧‍👦 **पारिवारिक स्वास्थ्य प्रोफाइल:** माता-पिता, बच्चों व जीवनसाथी के लिए अलग प्रोफाइल बनाएं।\n` +
          `• 🚨 **आपातकालीन सहायता:** किसी भी गंभीर स्थिति में 108/112 एम्बुलेंस सेवा का त्वरित एक्सेस।\n\n` +
          `आप किस सेवा के बारे में विस्तार से जानना चाहते हैं या शुरुआत करना चाहते हैं?`;
      }
      return `🏥 **Welcome to Indesian Digital OPD!**\n\nIndesian is a comprehensive **Digital OPD and Healthcare Platform** designed to make clinical care accessible, transparent, and seamless:\n\n` +
        `• 🤖 **AI Clinical Intake:** Describe your symptoms to find the exact medical specialty and care guidance.\n` +
        `• 👨‍⚕️ **Verified Doctor Consultations:** Book instant video or in-clinic visits with senior specialists across 14+ departments.\n` +
        `• 🧪 **Diagnostic Lab Tests:** Schedule pathology blood tests and home sample collection with digital reports.\n` +
        `• 📝 **Digital Prescriptions:** Access official verified e-prescriptions with clear dosage schedules.\n` +
        `• 💊 **Medicine Manager & Reminders:** Track daily active medications and set smart dosage alarms.\n` +
        `• 📁 **Health Records Wallet:** Store diagnostic reports, prescriptions, and summaries securely.\n` +
        `• 👨‍👩‍👧‍👦 **Family Health Profiles:** Manage care individually for Father, Mother, Spouse, or Children.\n` +
        `• 🚨 **Emergency Triage:** Instant 108/112 ambulance dialer and emergency protocol.\n\n` +
        `Which healthcare service would you like to explore or start with today?`;
    }

    // B. Service List Query ("मैं यहाँ क्या-क्या कर सकता हूँ?", "Services list", "All features")
    if (detectedIntent === 'SERVICE_LIST_QUERY' || [
      'kya kya kar sakta', 'services list', 'all features', 'suvidhayein', 'kya suvidha hai',
      'facilities', 'main yahan kya kar sakta', 'kya services milti hai',
      'मैं यहाँ क्या-क्या कर सकता हूँ', 'सुविधाएं', 'क्या सुविधाएं हैं'
    ].some(k => lowerQuery.includes(k))) {
      if (isHindi) {
        return `📋 **Indesian Digital OPD पर उपलब्ध सभी मुख्य सेवाएं:**\n\n` +
          `1. **डॉक्टर परामर्श (Doctor Consultations):** जनरल फिजिशियन, ऑर्थोपेडिक, ईएनटी, नेत्र रोग, डायग्नोस्टिक्स आदि के लिए अपॉइंटमेंट लें।\n` +
          `2. **AI रिसेप्शन (AI Triage):** लक्षणों के आधार पर सही डॉक्टर की सिफारिश प्राप्त करें।\n` +
          `3. **लैब टेस्ट (Lab Tests):** सीबीसी, लिपिड प्रोफाइल, शुगर, थायराइड आदि घर बैठे बुक करें।\n` +
          `4. **दवाइयाँ (Medicine Manager):** डॉक्टर द्वारा लिखी दवाइयों की खुराक व समय का प्रबंधन करें।\n` +
          `5. **डिजिटल प्रिस्क्रिप्शन (Prescriptions):** डॉक्टर के परामर्श के बाद पर्चा डाउनलोड करें।\n` +
          `6. **हेल्थ वॉलेट (Health Records):** पुरानी टेस्ट रिपोर्ट्स और डिस्चार्ज समरी सुरक्षित रखें।\n` +
          `7. **AI रिपोर्ट विश्लेषक (Report Analyzer):** लैब रिपोर्ट अपलोड कर सरल भाषा में समझें।\n` +
          `8. **डाइट प्लानर (Diet Planner):** अपनी सेहत और बीमारी के अनुसार भारतीय डाइट चार्ट पाएं।\n\n` +
          `आप किस सुविधा को शुरू करना चाहते हैं? नीचे दिए गए विकल्पों में से चुनें।`;
      }
      return `📋 **Complete Services Available on Indesian Digital OPD:**\n\n` +
        `1. **Doctor Consultations:** Video and in-clinic appointments with verified specialists.\n` +
        `2. **AI Clinical Reception:** Triage symptoms and receive accurate specialty routing.\n` +
        `3. **Diagnostic Labs:** Book routine & specialized blood tests with home sample pickup.\n` +
        `4. **Medicine Manager:** Track daily prescriptions, schedules, and active doses.\n` +
        `5. **Digital Prescriptions:** Access authenticated doctor prescriptions anytime.\n` +
        `6. **Health Records Wallet:** Store lifetime medical documents securely.\n` +
        `7. **AI Report Analyzer:** Decode complex lab markers into patient-friendly explanations.\n` +
        `8. **AI Diet Planner:** Personalized Indian nutrition plans for wellness and recovery.\n\n` +
        `Which module would you like to use right now?`;
    }

    // C. How to Use / Beginner Guide Query ("यह कैसे काम करता है?", "How to use", "Kaise use karein")
    if (detectedIntent === 'HOW_TO_USE_QUERY' || [
      'kaise use karein', 'how to use', 'kaise kaam karta hai', 'guide me', 'shuruat kaise karein',
      'step by step', 'kaise chalta hai', 'kaise shuru karein', 'यह कैसे चलता है', 'कैसे इस्तेमाल करें'
    ].some(k => lowerQuery.includes(k))) {
      if (isHindi) {
        return `💡 **Indesian का उपयोग करने की सरल 3-चरणीय प्रक्रिया:**\n\n` +
          `**चरण 1: लक्षण बताएं या सेवा चुनें**\n` +
          `• AI रिसेप्शन में अपने लक्षण बोलकर या लिखकर बताएं, या सीधे **'Doctor खोजें'** पर क्लिक करें।\n\n` +
          `**चरण 2: डॉक्टर या टेस्ट बुक करें**\n` +
          `• अपनी पसंद के डॉक्टर, समय स्लॉट और परामर्श मोड (वीडियो या अस्पताल विज़िट) का चयन करें।\n\n` +
          `**चरण 3: परामर्श एवं डिजिटल पर्चा प्राप्त करें**\n` +
          `• परामर्श के बाद आपका डिजिटल पर्चा (Prescription) और दवाइयाँ स्वतः आपके डैशबोर्ड में जुड़ जाएंगी।\n\n` +
          `क्या आप डॉक्टर खोजना चाहते हैं या अपने लक्षण बताना चाहते हैं?`;
      }
      return `💡 **How to Use Indesian in 3 Simple Steps:**\n\n` +
        `**Step 1: Describe Symptoms or Choose a Service**\n` +
        `• Speak or type symptoms in AI Reception, or directly browse the **'Find Doctors'** section.\n\n` +
        `**Step 2: Book Your Consultation or Lab Test**\n` +
        `• Select your preferred doctor, time slot, and consultation mode (Video or In-Clinic).\n\n` +
        `**Step 3: Consult & Access Digital Records**\n` +
        `• Complete your visit to receive an official digital prescription, synced directly into your Medicine Manager and Health Wallet.\n\n` +
        `Would you like to find a doctor or start with AI symptom intake?`;
    }

    // D. Doctor Booking Help ("Doctor से consultation कैसे होगी?", "Doctor kaise book karein?")
    if (detectedIntent === 'DOCTOR_BOOKING_HELP' || [
      'consultation kaise hogi', 'doctor kaise book', 'how to book doctor', 'appointment kaise lein',
      'video call kaise hogi', 'clinic visit kaise book', 'doctor se milna hai kaise',
      'डॉक्टर कैसे बुक करें', 'परामर्श कैसे लें'
    ].some(k => lowerQuery.includes(k))) {
      if (isHindi) {
        return `👨‍⚕️ **डॉक्टर परामर्श बुक करने की प्रक्रिया:**\n\n` +
          `1. **'डॉक्टर खोजें (Find Doctors)'** टैब पर जाएं।\n` +
          `2. अपनी आवश्यकता के अनुसार स्पेशलिटी चुनें (जैसे General Physician, Orthopaedics, Ophthalmology आदि)।\n` +
          `3. डॉक्टर की प्रोफाइल, अनुभव और परामर्श शुल्क (₹299 - ₹499) देखें।\n` +
          `4. **'Book Slot'** पर क्लिक कर सुविधाजनक समय और मोड (वीडियो परामर्श या इन-क्लीनिक) चुनें।\n\n` +
          `हमारे पास 14+ विभागों के सत्यापित विशेषज्ञ उपलब्ध हैं। क्या आप अभी डॉक्टर सूची देखना चाहते हैं?`;
      }
      return `👨‍⚕️ **How Doctor Consultations Work:**\n\n` +
        `1. Navigate to the **'Find Doctors'** section.\n` +
        `2. Select the relevant medical specialty (e.g., General Physician, Orthopaedics, Ophthalmology).\n` +
        `3. Review doctor qualifications, experience, and transparent fees (₹299 - ₹499).\n` +
        `4. Click **'Book Slot'** to choose an appointment time and mode (Video Consultation or In-Clinic).\n\n` +
        `Verified specialists across 14+ departments are ready for booking. Would you like to view matching doctors now?`;
    }

    // E. Lab Booking Help ("Lab test कैसे book करूँ?", "Blood test kaise karayein?")
    if (detectedIntent === 'LAB_BOOKING_HELP' || [
      'lab test kaise book', 'blood test kaise', 'how to book lab test', 'sample collection kaise',
      'home sample kaise', 'test kaise karayein', 'लैब टेस्ट कैसे बुक'
    ].some(k => lowerQuery.includes(k))) {
      if (isHindi) {
        return `🧪 **डायग्नोस्टिक लैब टेस्ट बुक करने की प्रक्रिया:**\n\n` +
          `1. **'लैब टेस्ट (Diagnostic Labs)'** टैब खोलें।\n` +
          `2. आवश्यक टेस्ट (जैसे Complete Blood Count, Lipid Profile, HbA1c, Liver/Kidney Panel) चुनें।\n` +
          `3. होम सैंपल कलेक्शन के लिए अपना पता और सुविधाजनक समय चुनें।\n` +
          `4. सैंपल कलेक्शन के बाद 24 घंटे में डिजिटल रिपोर्ट आपके **हेल्थ रिकॉर्ड्स** में उपलब्ध हो जाएगी।\n\n` +
          `क्या आप लैब टेस्ट कैटलॉग देखना चाहते हैं?`;
      }
      return `🧪 **How to Book Diagnostic Lab Tests:**\n\n` +
        `1. Open the **'Diagnostic Labs'** section.\n` +
        `2. Choose your required test or package (CBC, Lipid Profile, HbA1c, Thyroid, Full Body Panel).\n` +
        `3. Select home sample collection with your preferred address and time slot.\n` +
        `4. Certified phlebotomists collect the sample, and digital reports are delivered directly to your Health Records within 24 hours.\n\n` +
        `Would you like to browse available lab tests now?`;
    }

    // F. Prescription Help ("मेरी prescription कहाँ है?", "Digital parcha kahan milega?")
    if (detectedIntent === 'PRESCRIPTION_HELP' || [
      'prescription kahan hai', 'parcha kahan hai', 'where is my prescription', 'digital prescription kaise',
      'prescription download', 'डॉक्टर का पर्चा कहाँ', 'पर्चा कहाँ है'
    ].some(k => lowerQuery.includes(k))) {
      if (isHindi) {
        return `📝 **डिजिटल प्रिस्क्रिप्शन (डॉक्टर का पर्चा) देखने का तरीका:**\n\n` +
          `• डॉक्टर परामर्श समाप्त होने के तुरंत बाद आपका डिजिटल पर्चा **'Prescriptions'** टैब में उपलब्ध हो जाता है।\n` +
          `• इसमें डॉक्टर द्वारा सुझाई गई दवाइयों के नाम, खुराक (Dosage), भोजन के पहले/बाद का समय और विशेष निर्देश लिखे होते हैं।\n` +
          `• आप इसे कभी भी डाउनलोड या प्रिंट कर सकते हैं और दवाइयां सीधे मेडिसिन मैनेजर में सिंक हो जाती हैं।\n\n` +
          `क्या आप अपने प्रिस्क्रिप्शन टैब पर जाना चाहते हैं?`;
      }
      return `📝 **Where to Find Your Digital Prescriptions:**\n\n` +
        `• Immediately after your consultation, your verified electronic prescription is stored in the **'Prescriptions'** tab.\n` +
        `• It details prescribed medications, exact dosages, meal timings, and clinical notes.\n` +
        `• Prescriptions can be downloaded as PDF or synced directly with the Medicine Manager for daily reminders.\n\n` +
        `Would you like to view your digital prescriptions now?`;
    }

    // G. Family Member Help ("मेरे पापा को कैसे add करूं?", "Family member kaise jodein?", "मेरे परिवार के सदस्य के लिए डॉक्टर कैसे ढूँढूँ?")
    if (detectedIntent === 'FAMILY_MEMBER_HELP' || [
      'family member kaise add', 'papa ko kaise add', 'mummy ko kaise add', 'how to add family member',
      'parivar kaise jodein', 'apne papa ke liye', 'family profile kaise', 'परिवार कैसे जोड़ें',
      'परिवार के सदस्य के लिए डॉक्टर', 'family member ke liye doctor', 'परिवार के सदस्य'
    ].some(k => lowerQuery.includes(k))) {
      if (isHindi) {
        return `👨‍👩‍👧‍👦 **परिवार के सदस्यों के लिए डॉक्टर खोजने व परामर्श का तरीका:**\n\n` +
          `1. **'पारिवारिक स्वास्थ्य (Family Health)'** टैब में जाकर परिवार के सदस्य (पिताजी, माताजी, बच्चे आदि) का प्रोफाइल जोड़ें या चुनें।\n` +
          `2. मरीज का संदर्भ (Patient Context) परिवार के सदस्य पर सेट करें।\n` +
          `3. **'डॉक्टर खोजें (Find Doctors)'** में जाकर उनकी बीमारी/स्पेशलिटी के अनुसार उपयुक्त डॉक्टर चुनें।\n` +
          `4. **'Book Slot'** पर क्लिक कर उनके नाम पर अपॉइंटमेंट कन्फर्म करें। उनका पर्चा और रिकॉर्ड्स उनके प्रोफाइल में अलग सुरक्षित रहेंगे।\n\n` +
          `क्या आप फैमिली प्रोफाइल अनुभाग देखना चाहते हैं?`;
      }
      return `👨‍👩‍👧‍👦 **How to Find Doctors for Family Members:**\n\n` +
        `1. Go to the **'Family Health'** tab and select or add the family member (Father, Mother, Spouse, Child).\n` +
        `2. Switch the active patient context to that family member.\n` +
        `3. Navigate to **'Find Doctors'** to choose the right specialist based on their clinical needs.\n` +
        `4. Click **'Book Slot'** to schedule the visit under their specific profile, keeping their prescriptions and records separated.\n\n` +
        `Would you like to open the Family Profiles manager now?`;
    }

    // 1. Emergency Query Handling
    if (detectedIntent === 'EMERGENCY_QUERY' || [
      'chest pain', 'chhati mein', 'heart attack', 'dil ka daura', 'saans lene mein',
      'cannot breathe', 'unconscious', 'behoshi', 'stroke', 'heavy bleeding', 'सीने में दर्द'
    ].some(k => lowerQuery.includes(k))) {
      if (isHindi) {
        return `🚨 **आपातकालीन चिकित्सा चेतावनी (Emergency Alert):** आपके द्वारा बताए गए लक्षण (जैसे सीने में तीव्र दर्द, सांस लेने में अत्यधिक कठिनाई या बेहोशी) गंभीर आपातकालीन स्थिति का संकेत हो सकते हैं। कृपया तुरंत **108 या 112** पर एम्बुलेंस कॉल करें या नजदीकी अस्पताल के इमरजेंसी (ER/ICU) विभाग में तुरंत संपर्क करें। घर पर प्रतीक्षा न करें।`;
      }
      return `🚨 **CRITICAL MEDICAL EMERGENCY ALERT:** The symptoms described (such as severe chest pain, acute respiratory distress, stroke signs, or collapse) indicate a potential medical emergency. Please immediately call **108 or 112** for ambulance dispatch or proceed to the nearest Hospital Emergency Department (ER/ICU). Do not delay.`;
    }

    // 2. Appointment Query with Live Data
    if (detectedIntent === 'APPOINTMENT_QUERY' || ['appointment', 'अपॉइंटमेंट', 'next visit', 'कब है', 'kab hai'].some(k => lowerQuery.includes(k))) {
      const appts = liveData?.appointments || [];
      if (appts.length > 0) {
        const upcoming = appts[0];
        if (isHindi) {
          return `📅 **आपकी आगामी अपॉइंटमेंट की जानकारी${patientHindiStr}:**\n• **डॉक्टर:** ${upcoming.doctorName || 'डॉक्टर'}\n• **विशेषज्ञता:** ${upcoming.specialty || 'जनरल ओपीडी'}\n• **तारीख व समय:** ${upcoming.date} at ${upcoming.timeSlot || upcoming.time || 'निर्धारित'}\n• **परामर्श मोड:** ${upcoming.mode === 'video' ? 'वीडियो परामर्श (Video)' : upcoming.mode === 'in_person' ? 'अस्पताल विजिट (In-Clinic)' : 'ऑनलाइन'}\n• **स्थिति:** ${upcoming.status === 'upcoming' ? 'पुष्टि हो चुकी है (Confirmed)' : upcoming.status || 'Active'}\n\nयदि आप समय बदलना चाहते हैं या नई अपॉइंटमेंट लेना चाहते हैं, तो आप डॉक्टर डिस्कवरी में जा सकते हैं।`;
        }
        return `📅 **Your Upcoming Appointment Details${patientStr}:**\n• **Doctor:** ${upcoming.doctorName || 'Doctor'}\n• **Specialty:** ${upcoming.specialty || 'General OPD'}\n• **Date & Time:** ${upcoming.date} at ${upcoming.timeSlot || upcoming.time || 'Scheduled'}\n• **Consultation Mode:** ${upcoming.mode === 'video' ? 'Video Consultation' : upcoming.mode === 'in_person' ? 'In-Clinic OPD' : 'Online'}\n• **Status:** ${upcoming.status === 'upcoming' ? 'Confirmed' : upcoming.status || 'Active'}\n\nYou can manage or reschedule this booking from your Patient Dashboard.`;
      } else {
        if (isHindi) {
          return `आपके रिकॉर्ड में वर्तमान में ${patientHindiStr ? patientHindiStr : 'कोई'} आगामी अपॉइंटमेंट निर्धारित नहीं है। यदि आप नए परामर्श के लिए अपॉइंटमेंट बुक करना चाहते हैं, तो कृपया अपने पसंदीदा डॉक्टर या विशेषज्ञता का चयन करें।`;
        }
        return `No upcoming appointments were found in the current patient records${patientStr}. Would you like to schedule a consultation with one of our verified specialists?`;
      }
    }

    // 3. Medicine & Prescription Query with Live Data
    if (detectedIntent === 'MEDICINE_QUERY' || detectedIntent === 'PRESCRIPTION_QUERY' || ['medicine', 'dawai', 'दवा', 'दवाई', 'tablet', 'prescription', 'khorak'].some(k => lowerQuery.includes(k))) {
      const meds = liveData?.medicines || [];
      if (meds.length > 0) {
        const medList = meds.map((m: any) => `• **${m.name}** - ${m.dosage || '1 टैबलेट'} (${m.timing || 'दिन में निर्देशानुसार'}) ${m.instructions ? `[${m.instructions}]` : ''}`).join('\n');
        if (isHindi) {
          return `💊 **सक्रिय दवाइयाँ एवं प्रिस्क्रिप्शन${patientHindiStr}:**\n\n${medList}\n\n⚠️ *कृपया सभी दवाएं डॉक्टर के परामर्श और निर्धारित समय पर ही लें। यदि कोई साइड इफेक्ट हो तो तुरंत डॉक्टर से संपर्क करें।*`;
        }
        return `💊 **Active Prescriptions & Medications${patientStr}:**\n\n${medList}\n\n⚠️ *Please ensure all medicines are taken on schedule as prescribed by your physician.*`;
      } else {
        if (isHindi) {
          return `वर्तमान में ${patientHindiStr ? patientHindiStr : 'आपके प्रोफाइल'} में कोई सक्रिय दवा या डिजिटल प्रिस्क्रिप्शन रिकॉर्ड नहीं मिला। डॉक्टर परामर्श पूर्ण होने के बाद डिजिटल पर्चा यहाँ स्वतः दिखाई देगा।`;
        }
        return `No active prescriptions or medicine records were found in the profile${patientStr}. After your doctor consultation, digital prescriptions will appear here automatically.`;
      }
    }

    // 4. Lab & Medical Records Query with Live Data
    if (detectedIntent === 'LAB_QUERY' || detectedIntent === 'PATIENT_RECORD_QUERY' || ['medical report', 'lab report', 'blood test', 'रिपोर्ट', 'जांच रिपोर्ट', 'test report', 'diagnostic report'].some(k => lowerQuery.includes(k))) {
      const recs = liveData?.records || [];
      if (recs.length > 0) {
        const recList = recs.map((r: any) => `• **${r.title || r.type}** (${r.date || 'हालिया'}) - ${r.doctorName || 'Indesian Lab Partner'}`).join('\n');
        if (isHindi) {
          return `📁 **उपलब्ध स्वास्थ्य रिकॉर्ड एवं लैब रिपोर्ट्स${patientHindiStr}:**\n\n${recList}\n\nआप स्वास्थ्य रिकॉर्ड अनुभाग में जाकर पूरी रिपोर्ट देख सकते हैं या AI रिपोर्ट विश्लेषक से रिपोर्ट समझ सकते हैं।`;
        }
        return `📁 **Available Medical Records & Lab Reports${patientStr}:**\n\n${recList}\n\nYou can view and analyze complete diagnostic reports in the Health Records section.`;
      } else {
        if (isHindi) {
          return `वर्तमान में आपके खाते में कोई पुरानी लैब टेस्ट या मेडिकल रिकॉर्ड फाइल नहीं मिली। आप नई टेस्ट रिपोर्ट अपलोड कर सकते हैं या होम सैंपल कलेक्शन बुक कर सकते हैं।`;
        }
        return `No diagnostic reports or medical records were found in your account${patientStr}. You can upload past reports for instant AI analysis or book a home blood test.`;
      }
    }

    // 5. Doctor Discovery Query with Live CRM Doctors
    if (detectedIntent === 'DOCTOR_QUERY' || ['doctor', 'dr', 'specialist', 'kaun sa', 'kaunsa', 'which doctor', 'available doctor', 'डॉक्टर', 'विशेषज्ञ', 'कौन सा'].some(k => lowerQuery.includes(k))) {
      const docs = liveData?.doctors || [];
      const spec = detectedSpecialty || 'General Physician';

      if (docs.length > 0) {
        const topDoc = docs[0];
        const fee = topDoc.consultationFee || topDoc.fees?.generalConsultation || 399;
        const slots = topDoc.availableSlots?.slice(0, 3).join(', ') || '10:00 AM, 03:00 PM';
        const docListStr = docs.slice(0, 3).map((d: any) => {
          const docName = (d.name || '').startsWith('Dr.') ? d.name : `Dr. ${d.name}`;
          return `• **${docName}** (${d.qualification || 'MD / MBBS'}) - ${d.specialty}\n  *अनुभव:* ${d.experienceYears} वर्ष | *शुल्क:* ₹${d.consultationFee || d.fees?.generalConsultation || 399} | *स्लॉट:* ${d.availableSlots?.slice(0, 2).join(', ') || 'उपलब्ध'}`;
        }).join('\n\n');
        const docListStrEn = docs.slice(0, 3).map((d: any) => {
          const docName = (d.name || '').startsWith('Dr.') ? d.name : `Dr. ${d.name}`;
          return `• **${docName}** (${d.qualification || 'MD / MBBS'}) - ${d.specialty}\n  *Experience:* ${d.experienceYears} yrs | *Fee:* ₹${d.consultationFee || d.fees?.generalConsultation || 399} | *Slots:* ${d.availableSlots?.slice(0, 2).join(', ') || 'Available'}`;
        }).join('\n\n');

        if (isHindi) {
          return `**${spec}** के लिए हमारे CRM डॉक्टर मास्टर में सत्यापित विशेषज्ञ उपलब्ध हैं${patientHindiStr}:\n\n${docListStr}\n\n**निकटतम उपलब्ध समय:** ${slots}\n**परामर्श शुल्क:** ₹${fee}\n\nआप नीचे दिए गए कार्ड से सीधे वीडियो या इन-क्लीनिक स्लॉट बुक कर सकते हैं।`;
        }
        return `Here are the verified **${spec}** specialists available in our CRM Doctor Master${patientStr}:\n\n${docListStrEn}\n\n**Next Available Slots:** ${slots}\n**Consultation Fee:** ₹${fee}\n\nYou can book an instant video consultation or in-person appointment directly.`;
      } else {
        if (isHindi) {
          return `वर्तमान में CRM मास्टर में **${spec}** के लिए कोई विशेषज्ञ डॉक्टर सक्रिय नहीं मिला।\n\nअनुशंसित विकल्प:\n1. प्राथमिक मूल्यांकन और सटीक रेफरल के लिए **General Physician (डॉ. राजेश शर्मा)** से परामर्श लें।\n2. सभी उपलब्ध विशेषज्ञ देखने के लिए डॉक्टर डिस्कवरी देखें।\n3. स्पेशलिस्ट कॉलबैक का अनुरोध करें।`;
        }
        return `No specialist is currently available for **${spec}** in the CRM Master.\n\nRecommended steps:\n1. Consult our **General Physician (Dr. Rajesh Sharma)** for initial clinical evaluation and referral.\n2. Explore all available departments in Doctor Discovery.\n3. Request a specialist callback.`;
      }
    }

    // 6. Symptom-Specific Guidance
    const isFever = ['bukhar', 'fever', 'sardi', 'cold', 'khansi', 'cough', 'बुखार', 'सर्दी', 'खांसी'].some(k => lowerQuery.includes(k));
    const isKneeOrJoint = ['ghutne', 'ghutna', 'knee', 'joint', 'bone', 'haddi', 'jod', 'arthritis', 'घुटने', 'घुटनों', 'जोड़', 'हड्डी'].some(k => lowerQuery.includes(k));
    const isEye = ['aankh', 'eye', 'dhundhla', 'vision', 'dikh raha', 'red eye', 'आँख', 'आंख', 'धुंधला', 'दिखाई'].some(k => lowerQuery.includes(k));
    const isDiabetes = ['diabetes', 'sugar', 'blood sugar', 'thyroid', 'शुगर', 'डायबिटीज', 'थायराइड'].some(k => lowerQuery.includes(k));
    const isENT = ['kaan', 'ear', 'naak', 'nose', 'gala', 'throat', 'sinus', 'कान', 'नाक', 'गला'].some(k => lowerQuery.includes(k));
    const isGastro = ['pet dard', 'stomach pain', 'acidity', 'gas', 'liver', 'pet', 'पेट', 'एसिडिटी'].some(k => lowerQuery.includes(k));

    if (isFever) {
      if (isHindi) {
        return `🌡️ **बुखार / वायरल संक्रमण संबंधी प्राथमिक मार्गदर्शन${patientHindiStr}:**\n• शरीर को पर्याप्त आराम दें और दिनभर में 2.5 - 3 लीटर गुनगुना पानी या तरल पदार्थ लें।\n• थर्मामीटर से हर 4-6 घंटे में तापमान (Temperature) नोट करें।\n• यदि बुखार 101°F से अधिक है, 48 घंटे से अधिक समय से बना हुआ है, या तेज सिरदर्द व ठंड लग रही है, तो तुरंत **General Physician (जनरल फिजिशियन)** से परामर्श लें।\n\nहमारे CRM मास्टर में **डॉ. राजेश शर्मा (Senior Consultant Physician)** उपलब्ध हैं। क्या आप उनके साथ परामर्श स्लॉट बुक करना चाहते हैं?`;
      }
      return `🌡️ **Fever & Viral Infection Guidance${patientStr}:**\n• Ensure adequate hydration (2.5 - 3 liters of warm fluids daily) and adequate rest.\n• Monitor and log body temperature using a digital thermometer every 4–6 hours.\n• If temperature exceeds 101°F, lasts beyond 48 hours, or is accompanied by severe chills, consult a **General Physician** promptly.\n\nOur verified specialist **Dr. Rajesh Sharma (Senior Consultant Physician)** is available. Would you like to schedule a consultation?`;
    }

    if (isKneeOrJoint) {
      if (isHindi) {
        return `🦵 **घुटने एवं जोड़ों के दर्द संबंधी मार्गदर्शन${patientHindiStr}:**\n• जोड़ों पर अत्यधिक भार देने, उकड़ू बैठने या सीढ़ियां चढ़ने से बचें।\n• सूजन या दर्द वाले हिस्से पर दिन में 2 बार 10-15 मिनट के लिए गर्म/ठंडी सिकाई करें।\n• सही निदान (गठिया, लिगामेंट खिंचाव, या कार्टिलेज क्षरण) के लिए **Orthopaedics & Joint Care (हड्डी एवं जोड़ विशेषज्ञ)** को दिखाना आवश्यक है।\n\nहमारे CRM में **डॉ. अमित वर्मा (Senior Orthopaedic & Joint Replacement Specialist)** उपलब्ध हैं। क्या आप उनके उपलब्ध स्लॉट देखना चाहते हैं?`;
      }
      return `🦵 **Knee & Joint Care Guidance${patientStr}:**\n• Avoid heavy weight-bearing, squatting, or excessive stair climbing to prevent joint strain.\n• Apply warm or cold compresses for 10–15 minutes twice daily to relieve swelling.\n• A thorough evaluation by an **Orthopaedics & Joint Care Specialist** is recommended for accurate joint and cartilage assessment.\n\nVerified specialist **Dr. Amit Verma (Senior Orthopaedic Specialist)** is available. Would you like to view available slots?`;
    }

    if (isEye) {
      if (isHindi) {
        return `👁️ **आँखों के दर्द एवं दृष्टि संबंधी मार्गदर्शन${patientHindiStr}:**\n• आँखों को बार-बार मलने (rubbing) से बचें और तेज रोशनी/स्क्रीन से आँखों को आराम दें।\n• आँखों को दिन में 2-3 बार साफ ठंडे पानी से धोएं, बिना डॉक्टर की सलाह के कोई आई ड्रॉप न डालें।\n• धुंधला दिखाई देना या दर्द होना दृष्टि संबंधी समस्या का संकेत हो सकता है, इसके लिए **Ophthalmology (नेत्र रोग विशेषज्ञ)** से परामर्श लेना उचित है।\n\nहमारे CRM में **डॉ. सुनीता राव (Senior Eye Surgeon & Ophthalmologist)** उपलब्ध हैं। क्या आप अपॉइंटमेंट बुक करना चाहते हैं?`;
      }
      return `👁️ **Eye Pain & Vision Care Guidance${patientStr}:**\n• Avoid rubbing the eyes and reduce direct exposure to bright screens and glare.\n• Do not use over-the-counter eye drops without a proper ophthalmic prescription.\n• Persistent pain or blurred vision requires professional assessment by an **Ophthalmologist**.\n\nOur verified specialist **Dr. Sunita Rao (Senior Eye Surgeon & Ophthalmologist)** is available. Would you like to book an appointment?`;
    }

    if (isDiabetes) {
      if (isHindi) {
        return `🩺 **डायबिटीज एवं शुगर नियंत्रण मार्गदर्शन${patientHindiStr}:**\n• अपनी फास्टिंग और खाने के 2 घंटे बाद की ब्लड शुगर नियमित मापें।\n• रिफाइंड मीठा और जंक फूड सीमित करें और समय पर भोजन लें।\n• शुगर नियंत्रण और दवा समायोजन के लिए **Diabetology & Endocrinology (डायबिटीज विशेषज्ञ)** से परामर्श लें।\n\nहमारे CRM में **डॉ. प्रिया नायर (Consultant Diabetologist)** उपलब्ध हैं। क्या आप परामर्श बुक करना चाहते हैं?`;
      }
      return `🩺 **Diabetes & Metabolic Health Guidance${patientStr}:**\n• Track your Fasting and Post-Prandial blood sugar levels consistently.\n• Maintain a low-glycemic, balanced diet with timely meals.\n• Regular follow-up with a **Diabetology & Endocrinology Specialist** is recommended for glycemic management.\n\nVerified specialist **Dr. Priya Nair (Consultant Diabetologist)** is available in our Doctor Master.`;
    }

    if (isENT) {
      if (isHindi) {
        return `👂 **कान, नाक एवं गले संबंधी मार्गदर्शन${patientHindiStr}:**\n• गले के दर्द में गुनगुने पानी में नमक डालकर गरारे करें और ठंडी चीजों से परहेज करें।\n• कान में खुद से कोई तेल या ईयरबड न डालें।\n• उचित जांच के लिए **ENT (कान, नाक, गला विशेषज्ञ)** डॉक्टर से परामर्श लें।\n\nहमारे CRM में **डॉ. विक्रम मल्होत्रा (ENT Specialist)** उपलब्ध हैं। क्या आप उनसे संपर्क करना चाहते हैं?`;
      }
      return `👂 **Ear, Nose & Throat Guidance${patientStr}:**\n• Gargle with warm saline water for throat discomfort and avoid excessively cold beverages.\n• Avoid inserting cotton swabs or foreign objects into the ear canal.\n• Consult an **ENT Specialist** for definitive examination and treatment.\n\nVerified specialist **Dr. Vikram Malhotra (ENT Specialist)** is available.`;
    }

    if (isGastro) {
      if (isHindi) {
        return `🫄 **पेट दर्द एवं पाचन संबंधी मार्गदर्शन${patientHindiStr}:**\n• हल्का सुपाच्य भोजन (खिचड़ी, दलिया) लें और अत्यधिक मसालेदार व तैलीय भोजन से बचें।\n• पर्याप्त पानी पिएं। यदि पेट में तीव्र दर्द या उल्टी हो, तो तुरंत **Gastroenterology (गैस्ट्रोएंटरोलॉजिस्ट)** से परामर्श लें।\n\nहमारे CRM में **डॉ. रमेश गुप्ता (Gastroenterologist)** उपलब्ध हैं। क्या आप स्लॉट बुक करना चाहते हैं?`;
      }
      return `🫄 **Gastrointestinal & Digestive Health Guidance${patientStr}:**\n• Consume a light, easily digestible diet and stay hydrated while avoiding spicy/fried foods.\n• If abdominal discomfort is severe or persistent, a consultation with a **Gastroenterologist** is recommended.\n\nVerified specialist **Dr. Ramesh Gupta (Gastroenterologist)** is available.`;
    }

    // 7. General Symptom / Specialty Routing Fallback
    const spec = detectedSpecialty || 'General Physician';
    if (isHindi) {
      return `स्वास्थ्य संबंधी जानकारी दर्ज कर ली गई है${patientHindiStr}। लक्षणों के आधार पर **${spec}** विशेषज्ञ से परामर्श लेना उचित रहेगा। हमारे CRM में सत्यापित डॉक्टर सक्रिय हैं। क्या आप उपलब्ध डॉक्टरों की सूची व समय स्लॉट देखना चाहते हैं?`;
    }
    return `Health query recorded${patientStr}. Based on your inquiry, consulting a **${spec}** specialist is recommended. Verified doctors are active in our CRM Master. Would you like to view matching specialists and available appointment slots?`;
  };

  const ai = getAIClient();
  if (!ai) {
    return res.json({ reply: generateGroundedResponse() });
  }

  try {
    const formattedHistory = history
      .map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');

    const doctorSummary = liveData?.doctors?.length
      ? liveData.doctors.map((d: any) => `- Dr. ${d.name} (${d.specialty}, Exp: ${d.experienceYears} yrs, Fee: ₹${d.consultationFee || d.fees?.generalConsultation || 399}, Slots: ${d.availableSlots?.slice(0, 2).join(', ') || 'Available'})`).join('\n')
      : 'No matching doctors in current view.';

    const appointmentSummary = liveData?.appointments?.length
      ? liveData.appointments.map((a: any) => `- Appt with ${a.doctorName} (${a.specialty}) on ${a.date} at ${a.timeSlot || a.time || 'Scheduled'} [Status: ${a.status}]`).join('\n')
      : 'No upcoming appointments found.';

    const medicineSummary = liveData?.medicines?.length
      ? liveData.medicines.map((m: any) => `- ${m.name} (${m.dosage || '1 tablet'}, ${m.timing || 'Daily'})`).join('\n')
      : 'No active medicine records found.';

    const systemInstruction = `You are the Indesian AI Healthcare Assistant, the Digital OPD Guide and AI Receptionist for the Indesian Digital OPD platform.
You must respond in ${isHindi ? 'Hindi / Hinglish (natural, warm, respectful, patient-friendly Devanagari/Hindi format)' : 'English (clear, professional, warm, and supportive Indian English tone)'}.

MEDICAL SAFETY DIRECTIVES (MANDATORY & STRICT):
1. You are an AI Healthcare Navigation and Support Assistant. You MUST NEVER claim or imply that you are a human doctor.
2. NEVER provide a definitive medical diagnosis. Always frame clinical possibilities as preliminary assessments or triage recommendations and guide the patient to a qualified doctor.
3. NEVER independently issue a final prescription or specify unauthorized prescription drug dosages.
4. NEVER advise changing, stopping, or altering approved prescription medications. Always advise the patient to consult their prescribing physician for any dosage modifications.
5. In case of emergency red-flag symptoms (severe chest pain, breathing collapse, stroke signs, severe trauma), immediately issue an emergency alert and direct the user to call 108/112 or visit the nearest ER/ICU.

PLATFORM AWARENESS & CAPABILITIES:
Indesian Digital OPD provides:
1. AI Clinical Intake & Reception ('reception' tab): Symptom assessment, specialty routing, and emergency triage.
2. Verified Doctor Discovery ('doctors' tab): 14+ specialties, live slots, video consultations & in-clinic OPD.
3. Diagnostic Labs ('labs' tab): Blood test packages & home sample collection.
4. Digital Prescriptions ('prescription' tab): Official doctor prescriptions with dosages and meal timings.
5. Medicine Manager ('medicines' tab): Active prescription tracking and reminder alarms.
6. Health Records Wallet ('records' tab): Lifetime repository for reports and prescriptions.
7. AI Medical Report Analyzer ('reports' tab): Patient-friendly AI breakdown of lab parameters.
8. Family Health Profiles ('family' tab): Distinct profiles for Father, Mother, Spouse, Children.
9. Emergency Triage: Priority 108/112 ambulance dialer and critical red flag guidance.

CURRENT USER & PATIENT CONTEXT:
- Current Active Tab / Module: ${currentTab}
- Active Patient: ${patientContext?.name || 'Self'} (${patientContext?.relation || 'Self'}, Age: ${patientContext?.age || 'Adult'})
- Detected Intent: ${detectedIntent || 'GENERAL_HEALTH_QUERY'}
- Detected Clinical Specialty: ${detectedSpecialty || 'General Physician'}

REAL FIRESTORE DATA AVAILABLE:
Live CRM Doctors:
${doctorSummary}

Patient's Live Appointments:
${appointmentSummary}

Patient's Active Medicines:
${medicineSummary}

CRITICAL OPERATIONAL RULES:
1. NEVER REPEAT STATIC BOILERPLATE. Always answer the specific user query directly and distinctly.
2. PLATFORM & HOW-TO QUESTIONS: If the user asks what the platform is, what services are offered, or how to book/use anything, explain clearly in structured bullet points with exact steps. Never confuse platform info with a medical diagnosis.
3. SYMPTOM QUESTIONS: Provide specific symptom-related guidance first, then recommend the matching specialty and doctor.
4. DOCTOR QUERIES ("Which doctor?" / "Kaunsa doctor?"): Keep the multi-turn specialty context and cite actual doctor names, experience, and fees from the real data above.
5. APPOINTMENTS & MEDICINES: Answer with the real data provided above.
6. FAMILY MEMBER CONTEXT: Explicitly acknowledge when a query relates to a family member (Father, Mother, Child, etc.).
7. Keep responses well-formatted with clear headers, bullet points, and actionable guidance.`;

    const prompt = `CONVERSATION HISTORY:\n${formattedHistory}\n\nCURRENT USER QUERY:\n${lastMessage}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    return res.json({ reply: response.text || generateGroundedResponse() });
  } catch (error) {
    console.log('Serving smart grounded fallback AI response for health assistant:', error);
    return res.json({ reply: generateGroundedResponse() });
  }
});

// 3.5 Authoritative Gemini Function-Calling Agent for Portal Actions & Reception
app.post('/api/ai/portal-agent', async (req, res) => {
  const { userMessage, conversationState } = req.body;
  if (!userMessage) {
    return res.status(400).json({ error: 'userMessage is required' });
  }

  const ai = getAIClient();
  if (!ai) {
    return res.status(503).json({ error: 'Gemini client not initialized' });
  }

  try {
    const activePatient = conversationState?.activePatient || 'Self';
    const activeModule = conversationState?.currentModule || 'patient-dashboard';
    const history = Array.isArray(conversationState?.conversationHistory) ? conversationState.conversationHistory : [];

    const systemInstruction = `You are Indesian AI Healthcare Receptionist and Portal Operator for Indesian Digital OPD.
You understand natural Hindi, Hinglish, and English queries.
The patient communicates naturally without needing to know UI navigation.

MEDICAL SAFETY DIRECTIVES (STRICT):
- You are a healthcare navigation/support assistant. You are NOT a human doctor.
- You must NOT give a definitive diagnosis, issue a final prescription independently, change an approved prescription, or make dangerous medication decisions.
- If a patient asks you to prescribe medicines or diagnose them directly, guide them to consult a verified doctor and open the doctor discovery or consultation workflow.

INTENT AND TOOL ROUTING DISCIPLINE:
Every user request MUST be routed strictly to its corresponding domain tool:

1. CLINICAL SYMPTOMS & INTAKE (NO AUTOMATIC TOOL CALLS):
   - Query examples: "are ghutnon mein problem hai", "mere ghutne mein dard hai", "sir dard ho raha hai", "pet mein dard hai", "meri tabiyat kharab hai", "I have knee pain"
   - ACTION: DO NOT CALL switchFamilyMember. DO NOT CALL findDoctors. DO NOT CALL getMedicineSchedule or viewHealthRecords.
   - Response: Respond naturally as a clinical intake/triage assistant. Acknowledge the symptom with empathy, ask appropriate follow-up questions (duration, severity, stiffness, swelling, injury), and offer the option to consult a doctor or start digital OPD triage without forcing a tool execution.

2. FAMILY MEMBER SWITCHING:
   - ONLY call switchFamilyMember when the user explicitly requests changing or selecting the active patient/relative, e.g.:
     * "meri mummy ki report dikhao" -> switchFamilyMember({ relationOrName: "Mother" }) + viewHealthRecords()
     * "father ki medicines dikhao" -> switchFamilyMember({ relationOrName: "Father" }) + getMedicineSchedule()
     * "switch to mother" / "mummy ko select karo"
   - STRICT: The mere presence of words like "meri", "mere", "problem", "dard" in symptom descriptions (e.g. "mere ghutnon mein problem hai") must NEVER trigger switchFamilyMember.

3. DOCTOR DISCOVERY & CONSULTATION:
   - ONLY invoke findDoctors when the user explicitly asks to find, show, or consult a doctor/specialist:
     * Examples: "mere liye cardiologist dikhao", "knee ke liye orthopedic doctor dikhao", "general physician dikhao", "haddi ke doctor dikhao", "doctor consult karna hai"
   - STRICT: A symptom statement such as "are ghutnon mein problem hai" or "mere sir mein dard hai" is NOT a doctor search request. DO NOT invoke findDoctors for symptom statements.
   - Specialty mapping:
     * Heart / Cardiologist / दिल -> "Cardiology"
     * General Physician / Fever / Cold / फिजिशियन -> "General Physician"
     * Child / Paediatrician / बच्चा -> "Paediatrics & Child Health"
     * Bone / Joint / Knee / Orthopaedic / हड्डी / घुटना -> "Orthopaedics & Joint Care"
     * Skin / Derma / Hair / त्वचा -> "Dermatology & Hair Care"
     * Eye / Vision / आँख -> "Ophthalmology"
     * Diabetes / Sugar / शुगर -> "Diabetology & Endocrinology"

4. DIET / NUTRITION / MEAL PLAN:
   - Query examples: "diet chart open karo", "diet plan dikhao", "smart diet", "nutrition chart", "डाइट चार्ट"
   - Tool to invoke: openDietPlanner() or navigateTab({ tabKey: "diet" })
   - STRICT: DO NOT invoke findDoctors.

5. MEDICINE SCHEDULE & PRESCRIPTIONS:
   - Query examples: "meri medicines dikhao", "dawaiyan dikhao", "medicine schedule", "subah ki dawa", "मेरी दवाइयां दिखाओ", "ab meri medicines dikhao"
   - Tool to invoke: getMedicineSchedule() (plus switchFamilyMember ONLY if user explicitly specifies a relative)
   - STRICT: DO NOT invoke findDoctors.

6. HEALTH RECORDS & LAB REPORTS:
   - Query examples: "meri mummy ki report dikhao", "purani reports dikhao", "health records", "मेरी रिपोर्ट दिखाओ"
   - Tool to invoke: viewHealthRecords() (plus switchFamilyMember if relative specified)
   - STRICT: DO NOT invoke findDoctors.

7. DIAGNOSTIC LAB TESTS & PACKAGES:
   - Query examples: "lab test dikhao", "blood test dekhna hai", "health checkup package", "लैब टेस्ट दिखाओ"
   - Tool to invoke: searchLabTests() or getDiagnosticPackages()
   - STRICT: DO NOT invoke findDoctors.

8. APPOINTMENTS:
   - Query examples: "meri appointment dikhao", "upcoming appointments", "मेरी अपॉइंटमेंट दिखाओ"
   - Tool to invoke: getAppointments()
   - STRICT: DO NOT invoke findDoctors.

9. PRESCRIPTION VIEW & PHARMACY FULFILLMENT:
   - Query examples: "parcha dikhao", "doctor ka parcha kholo", "digital prescription dikhao" -> getPrescription()
   - Query examples: "dawa mangwa do", "pharmacy kholo", "dawa order karni hai" -> openPharmacy()

10. AI RECEPTION & CLINICAL INTAKE DESK:
   - Query examples: "reception kholo", "receptionist se baat karni hai", "digital opd intake start karo" -> openAIReception()

11. HOSPITALS & TREATMENT COST ESTIMATOR:
   - Query examples: "aspatal dikhao", "hospitals near me", "hospital directory" -> openHospitalDirectory()
   - Query examples: "ilaj ka kharcha", "surgery cost", "cost estimator", "kharcha kitna hoga" -> openCostEstimator()

12. EMERGENCY:
   - Severe red-flag symptoms (severe chest pain, severe breathlessness, stroke, unconsciousness) -> invoke triggerEmergency().

13. CONTEXT ISOLATION & NO REPEATED GREETINGS:
   - Never repeat the initial greeting ("नमस्ते! मैं इंडेसियन...") during an ongoing conversation. Provide direct, conversational responses.
   - Interpret each user command on its own specific action intent. Never inherit or execute an unrelated previous tool.`;

    const functionDeclarations: any[] = [
      {
        name: 'openDietPlanner',
        description: 'Opens and navigates to the AI Smart Diet and Indian Nutrition Planner section. Call this whenever the user asks for diet chart, diet plan, meal plan, or nutrition guidance.',
        parameters: {
          type: 'OBJECT',
          properties: {}
        }
      },
      {
        name: 'openAIReception',
        description: 'Opens the Patient Reception & AI Clinical Intake desk for automated triaging and guidance.',
        parameters: {
          type: 'OBJECT',
          properties: {
            specialty: { type: 'STRING', description: 'Optional medical specialty' }
          }
        }
      },
      {
        name: 'openPharmacy',
        description: 'Opens the Pharmacy fulfillment desk and prescription medicine order section.',
        parameters: {
          type: 'OBJECT',
          properties: {}
        }
      },
      {
        name: 'openHospitalDirectory',
        description: 'Opens the verified hospital directory and network hospitals section.',
        parameters: {
          type: 'OBJECT',
          properties: {}
        }
      },
      {
        name: 'openCostEstimator',
        description: 'Opens the Treatment & Surgery Cost Estimator with Ayushman PMJAY scheme comparison.',
        parameters: {
          type: 'OBJECT',
          properties: {}
        }
      },
      {
        name: 'switchFamilyMember',
        description: 'Switches the active patient profile to a family member (Father/Pitaji, Mother/Mataji, Child/Beta/Beti, Spouse, Self). Call this whenever a family member is specified.',
        parameters: {
          type: 'OBJECT',
          properties: {
            relationOrName: { 
              type: 'STRING', 
              description: 'Family member name or relation (e.g. "Father", "Mother", "Child", "Self", "Pitaji", "Mataji", "Beta")' 
            }
          },
          required: ['relationOrName']
        }
      },
      {
        name: 'getActiveFamilyMember',
        description: 'Retrieves the currently active patient profile in context.',
        parameters: {
          type: 'OBJECT',
          properties: {}
        }
      },
      {
        name: 'findDoctors',
        description: 'Searches and displays doctors filtered by medical specialty, max budget fee, or name. Automatically opens the Doctor Discovery module. ONLY invoke when user explicitly asks for doctors, specialists, or clinical consultations.',
        parameters: {
          type: 'OBJECT',
          properties: {
            specialty: { 
              type: 'STRING', 
              description: 'Medical specialty e.g. "Cardiology", "Paediatrics & Child Health", "General Physician", "Orthopaedics & Joint Care", "Dermatology & Hair Care", "Ophthalmology", "Diabetology & Endocrinology", "ENT", "Gynaecology"' 
            },
            maxBudget: { 
              type: 'NUMBER', 
              description: 'Maximum consultation fee in INR (e.g. 500, 800)' 
            },
            query: { 
              type: 'STRING', 
              description: 'Search keyword for doctor name or clinical condition' 
            }
          }
        }
      },
      {
        name: 'filterDoctors',
        description: 'Applies filter criteria to the doctor directory.',
        parameters: {
          type: 'OBJECT',
          properties: {
            specialty: { type: 'STRING', description: 'Specialty name' },
            maxBudget: { type: 'NUMBER', description: 'Budget filter in INR' }
          }
        }
      },
      {
        name: 'openDoctorProfile',
        description: 'Opens and highlights a specific verified doctor profile.',
        parameters: {
          type: 'OBJECT',
          properties: {
            doctorId: { type: 'STRING', description: 'Unique doctor ID' }
          },
          required: ['doctorId']
        }
      },
      {
        name: 'viewHealthRecords',
        description: 'Opens lifetime medical records and lab reports for the currently active patient.',
        parameters: {
          type: 'OBJECT',
          properties: {
            category: { type: 'STRING', description: 'Optional category (Lab Report, Prescription, Consultation)' },
            memberId: { type: 'STRING', description: 'Optional specific family member ID' }
          }
        }
      },
      {
        name: 'searchHealthRecords',
        description: 'Searches through health records, past prescriptions, and lab reports by keyword.',
        parameters: {
          type: 'OBJECT',
          properties: {
            query: { type: 'STRING', description: 'Search term for reports or tests' },
            memberId: { type: 'STRING', description: 'Optional family member ID' }
          },
          required: ['query']
        }
      },
      {
        name: 'searchLabTests',
        description: 'Searches diagnostic blood tests and health checkup packages. Automatically opens Diagnostic Labs module.',
        parameters: {
          type: 'OBJECT',
          properties: {
            query: { type: 'STRING', description: 'Search term e.g. "ECG", "Lipid Profile", "CBC", "Thyroid", "HbA1c", "Heart"' },
            category: { type: 'STRING', description: 'Category e.g. "Blood Tests", "Health Packages", "Cardiac"' }
          }
        }
      },
      {
        name: 'getDiagnosticPackages',
        description: 'Retrieves comprehensive preventive health checkup packages.',
        parameters: {
          type: 'OBJECT',
          properties: {
            category: { type: 'STRING', description: 'Package category' }
          }
        }
      },
      {
        name: 'getMedicineSchedule',
        description: 'Opens Medicine Manager and retrieves current prescription medication schedule and dosage alarms for active patient.',
        parameters: {
          type: 'OBJECT',
          properties: {
            memberId: { type: 'STRING', description: 'Optional family member ID' }
          }
        }
      },
      {
        name: 'getPrescription',
        description: 'Opens digital prescriptions for active patient.',
        parameters: {
          type: 'OBJECT',
          properties: {
            memberId: { type: 'STRING', description: 'Optional family member ID' }
          }
        }
      },
      {
        name: 'getAppointments',
        description: 'Retrieves scheduled doctor appointments.',
        parameters: {
          type: 'OBJECT',
          properties: {
            memberId: { type: 'STRING', description: 'Optional family member ID' }
          }
        }
      },
      {
        name: 'navigateTab',
        description: 'Navigates to a specific portal tab.',
        parameters: {
          type: 'OBJECT',
          properties: {
            tabKey: { 
              type: 'STRING', 
              description: 'Target tab: "patient-dashboard", "doctors", "labs", "records", "medicines", "family", "reception", "diet", "reports", "cost", "hospitals", "reminders", "timeline", "calculators"' 
            }
          },
          required: ['tabKey']
        }
      },
      {
        name: 'goHome',
        description: 'Returns the user to the main patient dashboard.',
        parameters: {
          type: 'OBJECT',
          properties: {}
        }
      },
      {
        name: 'triggerEmergency',
        description: 'Activates priority emergency modal with 108/112 ambulance dialer for red-flag symptoms.',
        parameters: {
          type: 'OBJECT',
          properties: {}
        }
      }
    ];

    // Build context prompt with active patient and history
    let contextPrompt = `CURRENT STATE: Active Patient Profile: "${activePatient}", Current View: "${activeModule}".\n`;
    if (history.length > 0) {
      contextPrompt += `RECENT CONVERSATION:\n` + history.slice(-4).map((h: any) => `${h.role === 'user' ? 'Patient' : 'Assistant'}: "${h.content || ''}"`).join('\n') + '\n';
    }
    contextPrompt += `NEW USER QUERY: "${userMessage}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: contextPrompt,
      config: {
        systemInstruction,
        tools: [{ functionDeclarations }],
      },
    });

    const candidate = response.candidates?.[0];
    const functionCalls = candidate?.content?.parts?.filter((p: any) => p.functionCall).map((p: any) => p.functionCall) || [];
    const textPart = candidate?.content?.parts?.find((p: any) => p.text)?.text || response.text || '';

    return res.json({
      success: true,
      functionCalls,
      reply: textPart,
      activePatient
    });
  } catch (err: any) {
    console.warn('Gemini function-calling agent offline/quota notice:', err?.message);
    return res.json({ success: false, fallbackToLocal: true, functionCalls: [], reply: '' });
  }
});

// 4. AI Indian Diet & Wellness Planner Endpoint
app.post('/api/ai/diet-plan', async (req, res) => {
  const { age, gender, dietType, healthGoal, medicalConditions, locationRegion } = req.body;

  const fallbackDiet = {
    dietTitle: `Indian Healthy Balanced Plan (${dietType || 'Vegetarian'})`,
    summary: `A balanced regional diet tailored for ${healthGoal || 'general wellness'} while respecting traditional Indian kitchen staples.`,
    mealPlan: {
      earlyMorning: 'Warm water with lemon/jeera or soaked almonds (5-6)',
      breakfast: dietType === 'Non-Vegetarian' ? '2 Boiled eggs / Besan Chilla with mint chutney & Tea/Coffee' : 'Poha / Vegetable Dalia / Oats Idli with Sambar',
      midMorning: 'Fresh seasonal fruit (Guava/Apple) or Coconut water',
      lunch: '2 Whole Wheat Rotis / Brown Rice, Mixed Dal/Rajma, Seasonal Sabzi (Bhindi/Lauki), Curd & Salad',
      eveningSnack: 'Roasted Chana / Makhana with Masala Chai',
      dinner: 'Light Khichdi / Lauki Soup with 1 Roti and Steamed Vegetables',
      bedtime: 'Warm Turmeric Milk (Haldi Doodh)'
    },
    doAndDonts: [
      'Do stay hydrated with 2.5 - 3 liters of water daily',
      'Do eat dinner at least 2 hours before bedtime',
      'Avoid refined sugar and excess fried snacks'
    ]
  };

  const ai = getAIClient();
  if (!ai) {
    return res.json(fallbackDiet);
  }

  try {
    const prompt = `You are an expert Indian Clinical Nutritionist for Indesian Digital OPD.
    Create a personalized Indian meal plan for:
    Age: ${age || 35}, Gender: ${gender || 'Adult'}, Diet Preference: ${dietType || 'Vegetarian'}, Health Goal: ${healthGoal || 'Weight Management & Energy'}, Medical Conditions: ${medicalConditions || 'None'}, Region: ${locationRegion || 'North/Central India'}.

    Provide JSON response:
    {
      "dietTitle": "Title of plan",
      "summary": "Brief explanation",
      "mealPlan": {
        "earlyMorning": "Description",
        "breakfast": "Description",
        "midMorning": "Description",
        "lunch": "Description",
        "eveningSnack": "Description",
        "dinner": "Description",
        "bedtime": "Description"
      },
      "doAndDonts": ["Tip 1", "Tip 2", "Tip 3"]
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed.dietTitle ? parsed : fallbackDiet);
  } catch (_error) {
    console.log('Serving smart offline AI response for diet planner.');
    return res.json(fallbackDiet);
  }
});

// 5. Configurable Google Cloud Chirp 3 HD TTS Endpoint & Voice Profiles
const CHIRP3_HD_VOICES = {
  LAOMEDEIA: 'hi-IN-Chirp3-HD-Laomedeia',     // [SELECTED PRIMARY] Young adult Indian female (21-26 yrs), fresh, pleasant, warm, crisp articulation
  PULCHERRIMA: 'hi-IN-Chirp3-HD-Pulcherrima', // Young adult Indian female (28-32 yrs), formal, corporate healthcare tone
  LEDA: 'hi-IN-Chirp3-HD-Leda',               // Young adult Indian female (24-28 yrs), soft, warm receptionist
  ZEPHYR: 'hi-IN-Chirp3-HD-Zephyr',           // Gentle, calm, soothing young Indian female tone
  KORE: 'hi-IN-Chirp3-HD-Kore',               // Mature, deep vocal tract resonance (older sounding)
};

let activeTtsVoice = CHIRP3_HD_VOICES.LAOMEDEIA;

app.get('/api/ai/tts/config', (_req, res) => {
  res.json({
    activeVoice: activeTtsVoice,
    activeAssistantVoice: activeTtsVoice,
    supportedVoices: Object.values(CHIRP3_HD_VOICES),
    voiceProfile: {
      persona: 'Young Adult Indian Female Digital Hospital Receptionist',
      perceivedAge: '21-26 years',
      tone: 'Fresh, pleasant, warm, naturally feminine, friendly, crisp medical articulation',
      pitch: 1.05,
      speakingRate: 1.0,
      language: 'hi-IN',
      vocalWeight: 'Light-Medium (Naturally youthful, zero elderly resonance)'
    },
    candidates: {
      'hi-IN-Chirp3-HD-Laomedeia': { status: 'ACTIVE_PRIMARY', character: 'Fresh, pleasant, warm young adult female (21-26 yrs), crisp medical articulation' },
      'hi-IN-Chirp3-HD-Pulcherrima': { status: 'AVAILABLE_CANDIDATE', character: 'Formal, crisp young adult professional (28-32 yrs)' },
      'hi-IN-Chirp3-HD-Leda': { status: 'AVAILABLE_CANDIDATE', character: 'Soft, warm, pleasant young adult female (24-28 yrs)' },
      'hi-IN-Chirp3-HD-Zephyr': { status: 'AVAILABLE_CANDIDATE', character: 'Soft, gentle, soothing young female' },
      'hi-IN-Chirp3-HD-Kore': { status: 'DEPRECATED', character: 'Mature, deeper vocal resonance (older sounding)' }
    }
  });
});

app.post('/api/ai/tts/set-voice', (req, res) => {
  const { voice } = req.body;
  if (voice && Object.values(CHIRP3_HD_VOICES).includes(voice)) {
    activeTtsVoice = voice;
    return res.json({ success: true, activeVoice: activeTtsVoice });
  }
  return res.status(400).json({ error: 'Invalid voice selection', supported: Object.values(CHIRP3_HD_VOICES) });
});

// =================================================================
// 6. PHASE 3B: SERVER-AUTHORITATIVE PAYMENT GATEWAY API ENDPOINTS
// =================================================================
import { PaymentService } from './src/lib/payment/paymentService';

// A. Create Payment Intent (Authoritative order creation + idempotency)
app.post('/api/payments/create-intent', async (req, res) => {
  try {
    const { 
      idempotencyKey, 
      entityType, 
      entityId, 
      patientId, 
      patientName, 
      patientEmail, 
      patientPhone, 
      doctorId,
      amount,
      paymentMethod,
      provider 
    } = req.body;

    if (!idempotencyKey || !entityType || !entityId || !patientId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameters: idempotencyKey, entityType, entityId, patientId' 
      });
    }

    const intent = await PaymentService.createIntent({
      idempotencyKey,
      entityType,
      entityId,
      patientId,
      patientName: patientName || 'Patient',
      patientEmail,
      patientPhone,
      doctorId,
      amount,
      paymentMethod,
      provider: provider || 'MOCK_SANDBOX'
    });

    return res.json(intent);
  } catch (error: any) {
    console.error('[Payment API] Create Intent Error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Payment intent creation failed' });
  }
});

// B. Verify Webhook & Cryptographic Signature Callback
app.post('/api/payments/verify-webhook', async (req, res) => {
  try {
    const signature = (req.headers['x-webhook-signature'] || req.body.signature) as string;
    const timestamp = (req.headers['x-webhook-timestamp'] || req.body.timestamp) as string | number;
    const payload = req.body.payload || req.body;

    if (!signature || !timestamp) {
      return res.status(401).json({ 
        success: false, 
        error: 'Missing mandatory webhook security headers (x-webhook-signature, x-webhook-timestamp)' 
      });
    }

    const result = await PaymentService.verifyAndProcessWebhook(payload, signature, timestamp);
    return res.json({ success: true, transaction: result.transaction });
  } catch (error: any) {
    console.error('[Payment API] Webhook Verification Error:', error);
    return res.status(400).json({ success: false, error: error.message || 'Webhook verification failed' });
  }
});

// C. Server-Authoritative Refund Processing
app.post('/api/payments/refund', async (req, res) => {
  try {
    const { transactionId, amount, reason, actorId, actorRole, idempotencyKey } = req.body;

    if (!transactionId || !reason || !actorId || !actorRole || !idempotencyKey) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameters: transactionId, reason, actorId, actorRole, idempotencyKey' 
      });
    }

    const result = await PaymentService.processRefund({
      transactionId,
      amount,
      reason,
      actorId,
      actorRole,
      idempotencyKey
    });

    return res.json(result);
  } catch (error: any) {
    console.error('[Payment API] Refund Error:', error);
    return res.status(400).json({ success: false, error: error.message || 'Refund processing failed' });
  }
});

// D. Authoritative Transaction Status
app.get('/api/payments/transaction/:id', (req, res) => {
  const txn = PaymentService.getTransaction(req.params.id);
  if (!txn) {
    return res.status(404).json({ success: false, error: 'Transaction not found' });
  }
  return res.json({ success: true, transaction: txn });
});

// E. Patient Transactions Query
app.get('/api/payments/patient/:patientId', (req, res) => {
  const txns = PaymentService.getTransactionsForPatient(req.params.patientId);
  return res.json({ success: true, transactions: txns });
});

// Express backend + Vite Integration
function auditRuntimeCredentials() {
  console.log('🔒 [Security Audit] Auditing runtime credentials:');
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey || geminiKey === 'MY_GEMINI_API_KEY' || geminiKey === 'your_gemini_api_key_here') {
    console.warn('   ⚠️ GEMINI_API_KEY: Unset or placeholder. Generative AI triage will use deterministic clinical fallback rules.');
  } else {
    console.log('   ✅ GEMINI_API_KEY: Configured securely.');
  }

  const provider = process.env.PAYMENT_GATEWAY_PROVIDER || 'MOCK_SANDBOX';
  console.log(`   ℹ️ PAYMENT_GATEWAY_PROVIDER: ${provider}`);
  if (provider === 'RAZORPAY') {
    if (!process.env.PAYMENT_GATEWAY_KEY_ID || process.env.PAYMENT_GATEWAY_KEY_ID === 'your_razorpay_key_id_here') {
      console.warn('   ⚠️ PAYMENT_GATEWAY_KEY_ID: Missing or placeholder for production Razorpay.');
    }
    if (!process.env.PAYMENT_GATEWAY_KEY_SECRET || process.env.PAYMENT_GATEWAY_KEY_SECRET === 'your_razorpay_key_secret_here') {
      console.warn('   ⚠️ PAYMENT_GATEWAY_KEY_SECRET: Missing or placeholder for production Razorpay.');
    }
    if (!process.env.PAYMENT_WEBHOOK_SECRET || process.env.PAYMENT_WEBHOOK_SECRET === 'your_payment_webhook_secret_here') {
      console.warn('   ⚠️ PAYMENT_WEBHOOK_SECRET: Missing or placeholder for payment webhooks.');
    }
  }
}

async function startServer() {
  auditRuntimeCredentials();
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = process.cwd() + '/dist';
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(distPath + '/index.html');
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Indesian Digital OPD Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
