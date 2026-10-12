import { QUESTIONS, UNSURE } from './questions';
import type { PalmAnswers } from './types';

/**
 * Integration boundary for real computer-vision palm analysis.
 *
 * The app ships WITHOUT a vision model. Readings come from the user's answers.
 * If a backend is configured via EXPO_PUBLIC_PALM_ANALYSIS_URL, the app can
 * offer to upload the photo (only after explicit consent) and use the result
 * to PRE-FILL the questionnaire, which the user reviews before the reading is
 * generated. Model API keys belong on that server, never in this app.
 *
 * Expected server contract:
 *   POST <url>  multipart/form-data, field "photo" (image/jpeg), field "hand" ("left" | "right")
 *   200 -> { "answers": { "<questionId>": "<optionId>", ... }, "confidence": 0..1 }
 */

export interface AnalysisResult {
  answers: PalmAnswers;
  confidence: number;
}

export function getAnalysisEndpoint(env: Record<string, string | undefined> = process.env): string | null {
  const url = env.EXPO_PUBLIC_PALM_ANALYSIS_URL?.trim();
  if (!url) return null;
  // Refuse insecure transport for photo uploads.
  return /^https:\/\/[^\s]+$/i.test(url) ? url : null;
}

/** Validates an untrusted server response, keeping only known question/option pairs. */
export function parseAnalysisResponse(body: unknown): AnalysisResult | null {
  if (!body || typeof body !== 'object') return null;
  const raw = (body as { answers?: unknown }).answers;
  const conf = (body as { confidence?: unknown }).confidence;
  if (!raw || typeof raw !== 'object') return null;
  const answers: PalmAnswers = {};
  for (const q of QUESTIONS) {
    const v = (raw as Record<string, unknown>)[q.id];
    if (typeof v === 'string' && v !== UNSURE && q.options.some((o) => o.id === v)) answers[q.id] = v;
  }
  const confidence = typeof conf === 'number' && Number.isFinite(conf) ? Math.max(0, Math.min(1, conf)) : 0;
  return { answers, confidence };
}

export async function analyzePalmPhoto(
  photoUri: string,
  hand: 'left' | 'right',
  opts: { endpoint: string; fetchImpl?: typeof fetch; timeoutMs?: number },
): Promise<AnalysisResult> {
  const form = new FormData();
  // React Native's FormData accepts { uri, name, type } file descriptors.
  form.append('photo', { uri: photoUri, name: 'palm.jpg', type: 'image/jpeg' } as unknown as Blob);
  form.append('hand', hand);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? 30000);
  try {
    const res = await (opts.fetchImpl ?? fetch)(opts.endpoint, { method: 'POST', body: form, signal: controller.signal });
    if (!res.ok) throw new Error(`Analysis service returned ${res.status}`);
    const parsed = parseAnalysisResponse(await res.json());
    if (!parsed) throw new Error('Analysis service returned an unexpected response');
    return parsed;
  } finally {
    clearTimeout(timer);
  }
}
