import { analyzePalmPhoto, getAnalysisEndpoint, parseAnalysisResponse } from '@/features/palm/analyzer';
import { answeredCount, generatePalmReport, reportShareText } from '@/features/palm/engine';
import { assessPhoto } from '@/features/palm/photoQuality';
import { questionsForStep, sanitizeAnswers, STEPS } from '@/features/palm/questions';
import type { PalmAnswers } from '@/features/palm/types';

const base = { id: 'r1', createdAt: new Date('2026-10-12T10:00:00Z'), hand: 'right' as const, isDominant: true };

const romantic: PalmAnswers = {
  hand_shape: 'water', life_length: 'long', life_depth: 'deep', life_curve: 'wide', life_breaks: 'none',
  heart_end: 'index', heart_shape: 'curved', heart_breaks: 'none', head_length: 'medium', head_shape: 'sloping',
  head_start: 'separate', fate_presence: 'absent', success_presence: 'clear', marriage_count: 'one',
  marriage_shape: 'up', travel_count: 'many',
};
const analytical: PalmAnswers = {
  hand_shape: 'air', life_length: 'short', life_depth: 'faint', life_curve: 'close', life_breaks: 'several',
  heart_end: 'middle', heart_shape: 'straight', heart_breaks: 'many', head_length: 'long', head_shape: 'straight',
  head_start: 'joined', fate_presence: 'clear', fate_start: 'wrist', success_presence: 'absent', marriage_count: 'none',
  travel_count: 'none',
};

describe('palm reading engine', () => {
  it('produces a report covering all seven lines and four themes', () => {
    const r = generatePalmReport({ ...base, answers: romantic });
    expect(r.lines.map((l) => l.id)).toEqual(['life', 'heart', 'head', 'fate', 'success', 'marriage', 'travel']);
    expect(r.themes.map((t) => t.id)).toEqual(['personality', 'relationships', 'career', 'growth']);
    expect(r.lines.every((l) => l.answered > 0)).toBe(true);
    expect(r.method).toBe('questionnaire');
  });

  it('gives meaningfully different readings for different palms', () => {
    const a = generatePalmReport({ ...base, answers: romantic });
    const b = generatePalmReport({ ...base, answers: analytical });
    expect(a.summary).not.toEqual(b.summary);
    expect(a.topTraits).not.toEqual(b.topTraits);
    const differing = a.lines.filter((l, i) => l.paragraphs.join() !== b.lines[i]!.paragraphs.join());
    expect(differing).toHaveLength(7);
    expect(b.topTraits).toContain('analytical');
  });

  it('scores pronounced lines higher than faint ones', () => {
    const a = generatePalmReport({ ...base, answers: romantic });
    const b = generatePalmReport({ ...base, answers: analytical });
    expect(a.lines[0]!.strength).toBeGreaterThan(b.lines[0]!.strength);
  });

  it('personalises with name and sign', () => {
    const r = generatePalmReport({ ...base, answers: romantic, name: '  Sam ', signId: 'leo' });
    expect(r.summary.startsWith('Sam, your right hand')).toBe(true);
    expect(r.summary).toMatch(/Leo/);
    expect(r.themes[0]!.text).toMatch(/Leo/);
    expect(r.name).toBe('Sam');
  });

  it('is honest when everything is skipped', () => {
    const r = generatePalmReport({ ...base, answers: {} });
    expect(r.topTraits).toHaveLength(0);
    expect(r.summary).toMatch(/skipped/);
    expect(r.lines.every((l) => l.answered === 0 && l.headline.startsWith('Not read'))).toBe(true);
    expect(answeredCount({})).toBe(0);
  });

  it('treats "unsure" as unanswered', () => {
    const r = generatePalmReport({ ...base, answers: { hand_shape: 'unsure', life_length: 'unsure' } });
    expect(r.lines[0]!.answered).toBe(0);
  });

  it('includes share text without the photo or birth data', () => {
    const r = generatePalmReport({ ...base, answers: romantic, photoUri: 'file:///x.jpg' });
    const text = reportShareText(r);
    expect(text).toMatch(/entertainment/);
    expect(text).not.toMatch(/file:/);
  });
});

describe('questionnaire rules', () => {
  it('asks follow-up questions only when they apply', () => {
    expect(questionsForStep('fate', { fate_presence: 'absent' }).map((q) => q.id)).toEqual(['fate_presence']);
    expect(questionsForStep('fate', { fate_presence: 'clear' }).map((q) => q.id)).toEqual(['fate_presence', 'fate_start']);
    expect(questionsForStep('marriage', {}).map((q) => q.id)).toEqual(['marriage_count']);
  });
  it('drops stale conditional answers and unknown options', () => {
    const cleaned = sanitizeAnswers({ fate_presence: 'absent', fate_start: 'wrist', hand_shape: 'banana' } as PalmAnswers);
    expect(cleaned).toEqual({ fate_presence: 'absent' });
  });
  it('has eight steps: hand plus seven lines', () => {
    expect(STEPS).toHaveLength(8);
  });
});

describe('photo quality checks', () => {
  it('passes a good portrait photo', () => {
    expect(assessPhoto({ width: 1200, height: 1600, thumbnailBase64Length: 3000 }).ok).toBe(true);
  });
  it('flags small, sideways and blank photos', () => {
    expect(assessPhoto({ width: 300, height: 400 }).issues).toContain('too-small');
    expect(assessPhoto({ width: 1600, height: 1200 }).issues).toContain('landscape');
    expect(assessPhoto({ width: 1200, height: 1600, thumbnailBase64Length: 400 }).issues).toEqual(['low-detail']);
    expect(assessPhoto({ width: 0, height: 0 }).ok).toBe(false);
  });
});

describe('photo analysis boundary', () => {
  it('is disabled unless an https endpoint is configured', () => {
    expect(getAnalysisEndpoint({})).toBeNull();
    expect(getAnalysisEndpoint({ EXPO_PUBLIC_PALM_ANALYSIS_URL: 'http://insecure.example' })).toBeNull();
    expect(getAnalysisEndpoint({ EXPO_PUBLIC_PALM_ANALYSIS_URL: 'https://api.example.com/palm' })).toBe('https://api.example.com/palm');
  });
  it('accepts only known question/option pairs from the server', () => {
    const res = parseAnalysisResponse({ answers: { hand_shape: 'fire', life_length: 'gigantic', hacked: 'x', heart_end: 'unsure' }, confidence: 7 });
    expect(res).toEqual({ answers: { hand_shape: 'fire' }, confidence: 1 });
    expect(parseAnalysisResponse('nope')).toBeNull();
    expect(parseAnalysisResponse({})).toBeNull();
  });
  it('surfaces server errors', async () => {
    const fetchImpl = jest.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) });
    await expect(analyzePalmPhoto('file:///p.jpg', 'left', { endpoint: 'https://x.example', fetchImpl })).rejects.toThrow('500');
  });
});
