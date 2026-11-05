# AI Spreadsheets Kit

By Desofec AI Studio. Use Excel or Google Sheets; paid AI features are optional.

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

## Official tool references
- https://support.microsoft.com/en-gb/excel/copilot/get-started-with-copilot-in-excel
- https://workspace.google.com/products/sheets/
- https://workspace.google.com/resources/spreadsheet-ai/

Core capabilities checked against official indexed documentation on 2026-11-05. AI availability depends on subscription and settings. No paid AI feature is needed to complete the exercise.
