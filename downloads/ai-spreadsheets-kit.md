# Excel Data Cleaning & PDF-to-Excel Kit

By Desofec AI Studio. Use Excel or Google Sheets; paid AI features are optional.

The six original lesson IDs and five-order exercise below are unchanged.
After the fundamentals, complete the three service exercises in order. Use fictional data only.
The lab is /business-launchpad/spreadsheet-lab; choose ai-spreadsheets in the private workspace.
No uploads, automatic OCR, AI model, live financial advice or automatic account saving.
CSV downloads are Excel-compatible data, not XLSX files with sheets or formulas.

## Import at A1
Import as comma-separated data into four columns. Preserve Raw and work on a duplicate.

```csv
Order,Item,Quantity,UnitPrice
A1,Notebook,2,5
A2,Pen,3,2
A3,Notebook,1,5
A4,Pen,0,2
A5,Folder,,4
```

## Calculate
Put Total in E1. In E2, fill this down to E6:

```text
=IF(AND(ISNUMBER(C2),ISNUMBER(D2)),C2*D2,"REVIEW")
```

Expected: 10, 6, 5, 0, REVIEW.
English function names and commas are shown; translate function names/separators for your locale without changing the results.

## Reconcile
- `=SUM(E2:E6)` must be 21: a known subtotal, not a complete total.
- `=COUNTIF(E2:E6,"REVIEW")` must be 1.
- Notebook known value: 15. Pen: 6. Folder: unresolved, not zero.
- Chart known values with a zero baseline, practice currency units and the note "A5 Folder unresolved".

## Handoff
Save Raw, Working, Summary and Notes. Record source, formula locale, checks and the unresolved row. Reopen and verify results.
Use only fictional or appropriately permissioned data. Check AI suggestions yourself.

## Service project 1: Excel data cleaning

Preserve this seven-row Raw table; duplicate it as Working before any edits.

```csv
Order,Item,DateUTC,Quantity,UnitPriceEUR
 A1 , Notebook ,2030/01/07,2,5
A2,Pen,2030-01-08,3,2
A3,Notebook,2030-01-09,1,5
A4,Pen,2030-01-13,0,2
A5,Folder,2030-01-13,,4
A1,Notebook,2030-01-07,2,5
A6,Folder,01/02/2030,1,4
```

Trim spaces and convert the unambiguous YYYY/MM/DD date to YYYY-MM-DD. Compare all
fields before removing an identical repeated ID. Expected: seven raw rows, six unique
working rows, one duplicate removed. A conflicting duplicate must block cleaning until
the source is clarified, not be silently dropped.

Keep two exceptions: A5 missing quantity and A6 ambiguous date. Do not infer day/month
order from your computer locale, fill a missing value, or treat unknown as zero.
A4 zero is valid. Record old value, new value, reason and remaining exception for every change.
Reopen the exported CSV in Excel/Sheets and verify six rows, numeric types and blanks.
CSV contains no formulas or multiple sheets; save your actual workbook separately.

## Service project 2: PDF-to-Excel conversion checks

Download `/business-launchpad/spreadsheet-lab/source.pdf`. It is a real, one-page,
text-based PDF of the original five orders, with dates and EUR amounts.
The lab supplies a flawed transcription: A2 quantity is 8 instead of 3 and A5's blank
is wrongly filled with zero. Compare all rows and cells, not only the subtotal.
Correct A2 to 3 and clear A5; source-row count remains five and A4 zero is retained.

Keep the source PDF, page references, unverified extraction, corrected transcription and
correction ledger. Record the extraction method honestly: supplied demo, manual entry or
a permissioned external tool. This app does not upload PDFs, run OCR or claim flawless conversion.
Scanned pages, merged cells, split rows and ambiguous characters require separate human checking.
Real unknown cells stay unresolved until a source owner supplies evidence.

## Service project 3: Excel business reports

Use the original five source rows, not all six cleaned rows. The UTC reporting period is
2030-01-07 through 2030-01-13 inclusive. Date filters are applied before summing.
Reconcile 10 + 6 + 5 + 0 = EUR 21; one unresolved quantity means the total is incomplete.
Notebook known subtotal is EUR 15, Pen EUR 6 and Folder unknown. Do not chart Folder as zero.

Create Raw, Working, Summary and Notes sheets. Record source revision, period, currency,
formula language/separator, changes and one unresolved row. Use a zero-baseline chart of
known values with an accessible text table and a visible missing-value note.
If you report the six cleaning rows instead, A6's ambiguous date is a second unresolved row:
do not silently exclude it or imply the report is complete. Reopen the workbook and recheck formulas.
This sample establishes no business trend, real revenue, tax correctness or verified savings.

## Private proposal, review and handover

Create a spreadsheet project in `/business-launchpad/projects?path=ai-spreadsheets`.
Keep all three exercises in its brief and workbook. Scope one bounded data-cleaning and
source-checking package, a report and one correction round. List input formats, row/page
limits, exclusions, deadlines, source permissions, retention/deletion, human reviewer,
vendor costs and unknowns. No promises of perfect OCR, earnings or financial certification.

Reload project results and explicitly load SHEET-1 through SHEET-7. They start pending;
write your own actual observations. Record corrections and retests, with unavailable
real owner approval **blocked**, not passed. The Review Centre self-reviews copied text,
not external files. A matched fictional source is not client approval.

Private handover: Raw and Working, original PDF, corrected CSV, actual workbook, Summary,
Notes, exception/correction ledger, source revision, actual reopen checks and next review.
Use fictional/anonymised material. Account snapshots contain typed project evidence only
after consent; PDF, CSV and XLSX files are not uploaded automatically. Delete downloads separately.

## Official tool references
- https://support.microsoft.com/en-gb/excel/copilot/get-started-with-copilot-in-excel
- https://workspace.google.com/products/sheets/
- https://workspace.google.com/resources/spreadsheet-ai/

Core capabilities checked against official indexed documentation on 2026-11-05. AI availability depends on subscription and settings. No paid AI feature is needed to complete the exercise.
