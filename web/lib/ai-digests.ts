export type DigestItem = {
  title: string;
  announcement: string;
  relevance: string;
  limitations: string;
  practice: string;
  practiceHref: string;
  source: { title: string; publisher: string; url: string; publishedOn: string };
};

export type AiDigest = {
  id: string;
  status: 'draft' | 'published';
  title: string;
  summary: string;
  publishedOn: string | null;
  review: { reviewedOn: string; reviewer: string; sourcesChecked: true } | null;
  items: DigestItem[];
};

const practiceRoutes = new Set([
  '/start-here',
  '/business-launchpad/client-discovery-lab',
  '/business-launchpad/spreadsheet-lab',
  '/business-launchpad/automation-lab',
  '/business-launchpad/freelance-portfolio',
  '/tutorials'
]);

function invalid(path: string): never {
  throw new Error(`Invalid AI digest: ${path}`);
}

function record(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) invalid(path);
  return value as Record<string, unknown>;
}

function text(value: unknown, path: string, limit = 2000): string {
  if (typeof value !== 'string' || !value.trim() || value.length > limit) invalid(path);
  return value.trim();
}

function date(value: unknown, path: string): string {
  const result = text(value, path, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(result)) invalid(path);
  const parsed = new Date(`${result}T00:00:00.000Z`);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== result) invalid(path);
  return result;
}

function sourceUrl(value: unknown, path: string): string {
  const result = text(value, path);
  let url: URL;
  try {
    url = new URL(result);
  } catch {
    invalid(path);
  }
  if (url.protocol !== 'https:' || url.username || url.password || !url.hostname.includes('.') ||
    url.hostname === 'localhost' || url.hostname.endsWith('.localhost') ||
    url.hostname.endsWith('.local') || /^[\d.]+$/.test(url.hostname)) invalid(path);
  return url.href;
}

export function readAiDigests(value: unknown): AiDigest[] {
  if (!Array.isArray(value)) invalid('expected an array');
  const ids = new Set<string>();
  return value.map((entry, index) => {
    const path = `edition ${index + 1}`;
    const raw = record(entry, path);
    const id = text(raw.id, `${path}.id`, 100);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || ids.has(id)) invalid(`${path}.id (unique slug required)`);
    ids.add(id);
    if (raw.status !== 'draft' && raw.status !== 'published') invalid(`${path}.status`);
    const publishedOn = raw.publishedOn === null ? null : date(raw.publishedOn, `${path}.publishedOn`);
    let review: AiDigest['review'] = null;
    if (raw.review !== null) {
      const saved = record(raw.review, `${path}.review`);
      if (saved.sourcesChecked !== true) invalid(`${path}.review.sourcesChecked`);
      review = {
        reviewer: text(saved.reviewer, `${path}.review.reviewer`, 100),
        reviewedOn: date(saved.reviewedOn, `${path}.review.reviewedOn`),
        sourcesChecked: true
      };
    }
    if (!Array.isArray(raw.items) || raw.items.length > 3) invalid(`${path}.items (at most three)`);
    if (raw.status === 'published' && (!publishedOn || !review || raw.items.length === 0)) {
      invalid(`${path} (publication requires items, date and source review)`);
    }
    if (review && publishedOn && review.reviewedOn > publishedOn) invalid(`${path}.review date`);
    const urls = new Set<string>();
    const items = raw.items.map((entry, itemIndex): DigestItem => {
      const itemPath = `${path}.items.${itemIndex + 1}`;
      const item = record(entry, itemPath);
      const source = record(item.source, `${itemPath}.source`);
      const url = sourceUrl(source.url, `${itemPath}.source.url`);
      if (urls.has(url)) invalid(`${itemPath}.source.url (duplicate source)`);
      urls.add(url);
      const published = date(source.publishedOn, `${itemPath}.source.publishedOn`);
      if (review && published > review.reviewedOn) invalid(`${itemPath}.source date`);
      const practiceHref = text(item.practiceHref, `${itemPath}.practiceHref`, 150);
      if (!practiceRoutes.has(practiceHref)) invalid(`${itemPath}.practiceHref`);
      return {
        title: text(item.title, `${itemPath}.title`, 160),
        announcement: text(item.announcement, `${itemPath}.announcement`),
        relevance: text(item.relevance, `${itemPath}.relevance`),
        limitations: text(item.limitations, `${itemPath}.limitations`),
        practice: text(item.practice, `${itemPath}.practice`),
        practiceHref,
        source: {
          title: text(source.title, `${itemPath}.source.title`, 300),
          publisher: text(source.publisher, `${itemPath}.source.publisher`, 100),
          url,
          publishedOn: published
        }
      };
    });
    return {
      id, status: raw.status,
      title: text(raw.title, `${path}.title`, 160),
      summary: text(raw.summary, `${path}.summary`, 600),
      publishedOn, review, items
    };
  });
}

export type PublishedAiDigest = AiDigest & {
  status: 'published';
  publishedOn: string;
  review: NonNullable<AiDigest['review']>;
};

export function publishedAiDigests(digests: AiDigest[]): PublishedAiDigest[] {
  return digests
    .filter((digest): digest is PublishedAiDigest =>
      digest.status === 'published' && digest.publishedOn !== null && digest.review !== null)
    .sort((a, b) => b.publishedOn.localeCompare(a.publishedOn) || a.id.localeCompare(b.id));
}
