import type { ServicePathId } from '@/lib/pilot-projects';
import type { PilotTest } from '@/lib/pilot-results';

export const workbookItemLimit = 8;
export const workbookRevisionLimit = 5;
export const workbookTextLimit = 8000;
export type WorkbookRevision = { number: number; title: string; body: string; savedAt: string };
export type WorkbookTestLink = {
  testId: string; revision: number; name: string; input: string; expected: string;
};
export type WorkbookItem = { id: string; revisions: WorkbookRevision[]; links: WorkbookTestLink[] };
export type EvidenceWorkbook = { version: 1; items: WorkbookItem[] };

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid saved evidence workbook.');
  return value as Record<string, unknown>;
}
function text(value: unknown, limit: number, required = false): string {
  if (typeof value !== 'string' || value.length > limit || (required && !value.trim())) throw new Error('Invalid saved evidence workbook.');
  return value;
}

export function readEvidenceWorkbook(value: unknown): EvidenceWorkbook {
  const workbook = object(value);
  if (workbook.version !== 1 || !Array.isArray(workbook.items) || workbook.items.length > workbookItemLimit) throw new Error('Invalid saved evidence workbook.');
  const ids = new Set<string>();
  const items = workbook.items.map((entry): WorkbookItem => {
    const item = object(entry);
    const id = text(item.id, 6);
    if (!/^item-[1-8]$/.test(id) || ids.has(id) || !Array.isArray(item.revisions)
      || item.revisions.length < 1 || item.revisions.length > workbookRevisionLimit
      || !Array.isArray(item.links) || item.links.length > 20) throw new Error('Invalid saved evidence workbook.');
    ids.add(id);
    const revisions = item.revisions.map((entry, index): WorkbookRevision => {
      const revision = object(entry);
      const savedAt = text(revision.savedAt, 24);
      if (revision.number !== index + 1 || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(savedAt)
        || !Number.isFinite(Date.parse(savedAt)) || new Date(savedAt).toISOString() !== savedAt) throw new Error('Invalid saved evidence workbook.');
      return {
        number: index + 1, title: text(revision.title, 120, true), body: text(revision.body, workbookTextLimit, true), savedAt
      };
    });
    const linkedTests = new Set<string>();
    const links = item.links.map((entry): WorkbookTestLink => {
      const link = object(entry);
      const testId = text(link.testId, 7);
      if (!/^test-(?:[1-9]|1\d|20)$/.test(testId) || linkedTests.has(testId)
        || typeof link.revision !== 'number' || !Number.isInteger(link.revision)
        || link.revision < 1 || link.revision > revisions.length) throw new Error('Invalid saved evidence workbook.');
      linkedTests.add(testId);
      return {
        testId, revision: link.revision, name: text(link.name, 2000, true),
        input: text(link.input, 2000, true), expected: text(link.expected, 2000, true)
      };
    });
    return { id, revisions, links };
  });
  return { version: 1, items };
}

export function appendWorkbookRevision(
  workbook: EvidenceWorkbook, itemId: string | null, title: string, body: string, savedAt: string,
  reservedItemIds: readonly string[] = []
): EvidenceWorkbook {
  const valid = readEvidenceWorkbook(workbook);
  if (!title.trim() || !body.trim()) throw new Error('Add a title and practice text before saving a revision.');
  if (title.length > 120 || body.length > workbookTextLimit) throw new Error('Workbook text exceeds its limit.');
  const item = itemId === null ? null : valid.items.find((item) => item.id === itemId);
  if (itemId !== null && !item) throw new Error('Workbook item no longer exists. Reload before saving.');
  if (!item && valid.items.length >= workbookItemLimit) throw new Error('Workbook item limit reached. Export or remove a saved item before adding another.');
  if (item && item.revisions.length >= workbookRevisionLimit) throw new Error('Revision limit reached. Export this item and start a separate item; old revisions are never removed automatically.');
  const latest = item?.revisions.at(-1);
  if (latest?.title === title.trim() && latest.body === body) throw new Error('This revision is unchanged. Edit the title or text before saving another.');
  const reserved = new Set(reservedItemIds);
  const id = item?.id ?? Array.from({ length: workbookItemLimit }, (_, index) => `item-${index + 1}`)
    .find((candidate) => !reserved.has(candidate) && !valid.items.some((item) => item.id === candidate));
  if (!id) throw new Error('All workbook item identifiers are retained by saved reviews. Delete an archived review before adding another item.');
  const revision: WorkbookRevision = { number: (item?.revisions.length ?? 0) + 1, title: title.trim(), body, savedAt };
  return readEvidenceWorkbook({
    version: 1,
    items: item
      ? valid.items.map((entry) => entry.id === id ? { ...entry, revisions: [...entry.revisions, revision] } : entry)
      : [...valid.items, { id, revisions: [revision], links: [] }]
  });
}

export function setWorkbookTestLink(
  workbook: EvidenceWorkbook, itemId: string, revision: number, test: PilotTest
): EvidenceWorkbook {
  const valid = readEvidenceWorkbook(workbook);
  const item = valid.items.find((item) => item.id === itemId);
  if (!item) throw new Error('Workbook item no longer exists. Reload before saving.');
  if (![test.name, test.input, test.expected].every((value) => value.trim())) throw new Error('Save a test name, input and expected result in the results tracker before linking.');
  const link: WorkbookTestLink = { testId: test.id, revision, name: test.name, input: test.input, expected: test.expected };
  return readEvidenceWorkbook({
    ...valid, items: valid.items.map((entry) => entry.id === itemId
      ? { ...entry, links: [...entry.links.filter((existing) => existing.testId !== test.id), link] }
      : entry)
  });
}

export function workbookLinkState(item: WorkbookItem, link: WorkbookTestLink, tests: readonly PilotTest[]) {
  const test = tests.find((test) => test.id === link.testId);
  if (!test) return 'Linked test was removed. Relink or remove this reference.';
  if (test.name !== link.name || test.input !== link.input || test.expected !== link.expected) return 'Test definition changed. Review and explicitly relink this reference.';
  if (item.revisions.at(-1)?.number !== link.revision) return 'Linked to an older saved revision. Review before using it as evidence.';
  return 'Linked to the current saved revision and test definition. This does not verify the result.';
}

export const workbookStarters: Record<ServicePathId, { title: string; text: string }> = {
  'ai-video-business': {
    title: 'Business video scripts, captions and review ledger',
    text: 'FICTIONAL PRACTICE - NOT APPROVED FOR PUBLICATION.\n\nThree topics: visit / products / counter collection.\n\nFor each: script / timed storyboard / caption text / asset permissions.\n\nActual export duration (15-30 seconds) / resolution (1080 x 1920) / phone and sound-off checks:\n\nv1 / v2 changes / reopened exports / unknown price excluded:\n\nTool terms / actual time / vendor costs / unknowns:\n\nOwner approval: BLOCKED without real evidence. Storyboards are not finished videos.'
  },
  'ai-content-services': {
    title: 'Content drafts and claim ledger',
    text: 'Fictional practice only - not approved for publication.\n\nPost 1 (40-60 words):\n\nPost 2 (40-60 words):\n\nPost 3 (40-60 words):\n\nFour FAQ answers (flag unknown allergens/prices):\n\nClaim / source fact / unknown:\n\nAsset permission and text alternative:\n\nRevision request / change / remaining review:'
  },
  'ai-automation-services': {
    title: 'Review queue and manual runbook',
    text: 'Fictional practice only - no live inbox or sending.\n\nEvent / required fields / status / draft / reviewer:\n\nSuccessful IDs (only after queue write succeeds):\n\nFailure / visible alert / safe retry evidence:\n\nOff switch and manual fallback:\n\nAccess revocation / spending cap / retention:\n\nMissing customer review:'
  },
  'ai-cad-services': {
    title: 'Concept measurements and revision log',
    text: 'CONCEPT ONLY - NOT FOR MANUFACTURE.\n\nMethod (CAD or paper-only) / tool version / units:\n\nv1 measured front / top / side:\n\nGeometric check (not strength or safety approval):\n\nv2 width change / measurements / preserved v1:\n\nReopened export and label checks:\n\nLicensing and missing qualified review:'
  },
  'micro-saas-validation': {
    title: 'Local prototype specification and observations',
    text: 'Local practice only - no payments, login, network or storage.\n\nMethod (browser prototype or manual):\n\nExact two-line output specification:\n\nBlank / 40 / forced 41 / markup / invalid status observations:\n\nActual anonymised demand evidence (otherwise UNVALIDATED):\n\nUnknown costs and production gaps:\n\nRevision and next discovery question:'
  },
  'ai-education-services': {
    title: 'Adult workshop handout and answer key',
    text: 'Adult practice only - no learner names, scores, recordings or certification.\n\nOriginal handout and readable text alternative:\n\nFact sheet / supported claim / contradicted claim / unknown:\n\nManual four-point practice rubric:\n\n3+5+4+3-minute plan / actual rehearsal duration:\n\nAccessibility checks and corrections:\n\nOptional trial and independent review (blocked if unavailable):\n\nMaterial revision log:'
  }
};

export function buildWorkbookExport(
  workbook: EvidenceWorkbook, projectTitle: string, tests: readonly PilotTest[], tr: (text: string) => string
) {
  const valid = readEvidenceWorkbook(workbook);
  return [
    tr('PRIVATE EVIDENCE WORKBOOK - SELF-RECORDED PRACTICE, NOT VERIFIED CLIENT WORK'),
    projectTitle,
    tr('This download includes saved draft text and every retained revision, which may contain sensitive information. No automatic publishing or client approval. Delete downloaded files separately.'),
    ...valid.items.flatMap((item) => [
      ...item.revisions.map((revision) => [
        `${tr('Workbook item')}: ${item.id} - ${revision.title}`,
        `${tr('Saved revision')}: ${revision.number} (${revision.savedAt})`,
        revision.body
      ].join('\n\n')),
      ...item.links.map((link) => [
        `${tr('Linked test')}: ${link.testId} - ${link.name}`,
        `${tr('Saved revision')}: ${link.revision}`,
        tr(workbookLinkState(item, link, tests))
      ].join('\n'))
    ])
  ].join('\n\n');
}
