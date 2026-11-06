import type { TutorialStep } from '@/lib/task-tracker-tutorial';

export const spreadsheetSteps: TutorialStep[] = [
  {
    id: 'import-sample',
    title: 'Import a safe practice table',
    explanation: [
      'This original five-order lesson keeps its progress IDs and expected results. After it, follow the service kit and spreadsheet lab for three projects in order: Excel data cleaning, PDF-to-Excel transcription checks and Excel business reports. Create one private spreadsheet project to record all three.',
      'Use Excel or Google Sheets; paid AI features are optional. Copy this invented order table into a new sheet starting at A1. If it stays in one column, import it as CSV or use the split-to-columns feature with a comma separator.',
      'Keep the original sheet unchanged as Raw and duplicate it as Working. Never upload real customer, financial or identifying information to an AI tool without appropriate permission.'
    ],
    file: 'orders.csv',
    code: 'Order,Item,Quantity,UnitPrice\nA1,Notebook,2,5\nA2,Pen,3,2\nA3,Notebook,1,5\nA4,Pen,0,2\nA5,Folder,,4',
    check: 'Raw and Working each have four columns and five data rows; A5 has a missing quantity, not zero.',
    aiPrompt: 'Explain how to import comma-separated text into [Excel or Google Sheets] without changing the source. Use only this fictional table: [table].'
  },
  {
    id: 'check-cells',
    title: 'Check types, missing values and zero',
    explanation: [
      'For the cleaning exercise, preserve seven raw rows before trimming spaces and converting only year/month/day dates to ISO. Remove one identical duplicate, leaving six unique rows. Keep A5 missing quantity and A6 ambiguous date as separate exceptions; never guess a locale.',
      'Check that Quantity and UnitPrice are numeric and Order IDs are unique. A zero quantity is a known value; an empty quantity is unknown. Do not silently replace unknown values with zero or delete their rows.',
      'The practice table has no repeated IDs, one missing quantity and one zero quantity. Flag A5 for review and leave it blank because this exercise has no evidence to fill it in.'
    ],
    file: 'Data checks',
    code: 'Rows: 5\nUnique order IDs: 5\nMissing quantity: A5\nKnown zero quantity: A4\nAction: keep A5 blank and label it for review.',
    check: 'You can explain why A4 and A5 mean different things and have preserved both rows.',
    aiPrompt: 'Review this fictional table for missing values, numeric types and repeated IDs. Distinguish zero from unknown; do not invent replacement values: [table].'
  },
  {
    id: 'verified-formula',
    title: 'Calculate totals without hiding missing data',
    explanation: [
      'For PDF-to-Excel practice, download the fictional one-page source PDF. The lab supplies an extraction with A2 quantity wrongly read as 8 and A5 blank wrongly replaced by 0. Compare every cell with the source: change A2 to 3 and leave A5 empty. This is an extraction-checking exercise, not an automatic OCR engine.',
      'In Working, type Total in E1. Enter the formula below in E2 and fill down to E6. It returns REVIEW when either required cell is not numeric; otherwise it multiplies quantity by price.',
      'These formulas use English function names and comma separators. Localised spreadsheets may use translated function names or semicolons. Ask your app for its equivalent and verify the same results. AI can suggest a formula but you must test it.'
    ],
    file: 'Cell E2',
    code: '=IF(AND(ISNUMBER(C2),ISNUMBER(D2)),C2*D2,"REVIEW")',
    check: 'E2:E6 reads 10, 6, 5, 0, REVIEW. A4 is zero and A5 remains flagged.',
    aiPrompt: 'Explain this formula and give the equivalent for my spreadsheet language: [formula]. Test it against numeric, zero and blank quantity examples. Do not turn blanks into zero.'
  },
  {
    id: 'reconcile-summary',
    title: 'Summarise and reconcile by hand',
    explanation: [
      'Use the original five source orders for the service report, not the unresolved sixth cleaning row. Record the inclusive UTC week, source revision, five unique IDs and one unresolved quantity. Keep totals and exceptions together. If you use the six cleaned rows instead, A6 is a second unresolved row and the report remains incomplete.',
      'Below the table, total only the four known order values with SUM(E2:E6). The result is 21. Label this a known subtotal, not a complete revenue total, because A5 is unresolved.',
      'Use COUNTIF(E2:E6,"REVIEW") to count flagged rows: it must be 1. Filter by Item or create a summary: Notebook has known value 15, Pen 6 and Folder is unresolved. Retain the review flag beside the summary.'
    ],
    file: 'Summary checks',
    code: '=SUM(E2:E6)\n=COUNTIF(E2:E6,"REVIEW")\n\nExpected known subtotal: 21\nExpected rows requiring review: 1\nNotebook: 15; Pen: 6; Folder: unresolved.',
    check: 'Your formulas match the hand calculation 10 + 6 + 5 + 0 = 21 and show one unresolved row.',
    aiPrompt: 'Check this summary against the source. Explain why 21 is a known subtotal, not a complete total, and identify the unresolved row: [table and summary].'
  },
  {
    id: 'chart-honestly',
    title: 'Make a chart that explains its limits',
    explanation: [
      'A client-facing report also needs an accessible source table, reporting period, currency and exception notes. Use a zero baseline and no Folder bar: unknown is not zero. Reconcile values before charting; the lab provides the checked source summary but your actual external chart must be inspected separately.',
      'Create a two-column summary for Notebook and Pen with known subtotals 15 and 6. Insert a simple bar chart with a zero baseline and label the axis as practice currency units.',
      'Use the title Known order values; A5 Folder unresolved. Do not chart Folder as zero or claim that this five-row fictional table shows real business trends.'
    ],
    file: 'Chart source',
    code: 'Item,KnownSubtotal\nNotebook,15\nPen,6\n\nNote: A5 Folder has unknown quantity and is not included.',
    check: 'Your chart has a zero baseline, labelled values and a visible note about the unresolved Folder order.',
    aiPrompt: 'Review this chart title and source table for misleading omissions. Suggest a concise note explaining the unknown quantity: [title and table].'
  },
  {
    id: 'spreadsheet-handoff',
    title: 'Save a reproducible workbook and review AI output',
    explanation: [
      'In the private workspace, reload results and explicitly load SHEET-1 through SHEET-7. Record actual checks, corrections and blocked owner approval; plans never fill results. Keep raw and cleaned CSV, source PDF, corrected transcription, workbook, exceptions and handover notes. CSV contains data only, not XLSX sheets or formulas; reopen both formats honestly.',
      'Save Raw, Working, Summary and a short Notes sheet with the formulas, locale, checks and unresolved issue. Reopen the workbook and confirm that the formulas still calculate correctly.',
      'Copilot in Excel and Gemini in Sheets can help with formulas and analysis, depending on your plan and settings. They are optional: do not activate paid features for this exercise. Verify AI changes against the known results and never use this practice sheet as financial advice.'
    ],
    file: 'Notes sheet',
    code: 'Source: fictional five-order practice data\nKnown subtotal: 21\nUnresolved rows: 1 (A5)\nZero retained: A4\nFormula language/separator:\nChecks performed:\nChanges suggested by AI and independently verified:',
    check: 'Your saved workbook reopens with a subtotal of 21, one review flag and the untouched Raw sheet.',
    aiPrompt: 'Create a handoff checklist for this practice workbook. Include source preservation, formulas, missing values and independent checks of AI suggestions: [notes].'
  }
];
