export type SubmissionResult = { ok: boolean; message: string }

export async function submitForm(
  type: string,
  data: Record<string, string>,
): Promise<SubmissionResult> {
  await new Promise((r) => setTimeout(r, 600))

  const entry = { type, ...data, timestamp: new Date().toISOString() }

  try {
    const key = 'indesian_form_submissions'
    const existing = JSON.parse(localStorage.getItem(key) || '[]')
    existing.push(entry)
    localStorage.setItem(key, JSON.stringify(existing))
  } catch {
    // localStorage may be unavailable; submission still "succeeds" in demo
  }

  console.log(`[Demo Form] ${type} submission:`, entry)

  return {
    ok: true,
    message: 'Thank you. Your request has been received. Our team will review the information and provide an update through the appropriate channel.',
  }
}
