/**
 * Basic, honest photo checks. These look at size and how much visual detail a
 * tiny thumbnail keeps (a covered lens or a blank wall compresses to almost
 * nothing). They do not detect hands or lines.
 */

export interface PhotoMetrics {
  width: number;
  height: number;
  /** Length of a base64 JPEG thumbnail (64px wide, quality 0.7), if measured. */
  thumbnailBase64Length?: number;
}

export type PhotoIssue = 'too-small' | 'landscape' | 'low-detail';

export interface PhotoAssessment {
  ok: boolean;
  issues: PhotoIssue[];
  messages: string[];
}

export const MIN_SHORT_SIDE = 480;
export const MIN_THUMBNAIL_DETAIL = 1100;

const MESSAGES: Record<PhotoIssue, string> = {
  'too-small': 'The photo is low resolution. Move a little closer or use the back camera.',
  landscape: 'The photo is sideways. Hold the phone upright so your fingers point to the top.',
  'low-detail': 'The photo looks very dark or blurry. Try brighter, even light and hold steady.',
};

export function assessPhoto(m: PhotoMetrics): PhotoAssessment {
  const issues: PhotoIssue[] = [];
  if (!(m.width > 0 && m.height > 0) || Math.min(m.width, m.height) < MIN_SHORT_SIDE) issues.push('too-small');
  if (m.width > m.height * 1.15) issues.push('landscape');
  if (m.thumbnailBase64Length !== undefined && m.thumbnailBase64Length < MIN_THUMBNAIL_DETAIL) issues.push('low-detail');
  return { ok: issues.length === 0, issues, messages: issues.map((i) => MESSAGES[i]) };
}
