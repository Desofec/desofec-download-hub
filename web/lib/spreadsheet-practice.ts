export type PracticeOrder = { id: string; item: string; date: string; quantity: string; price: string };
export const spreadsheetSource: PracticeOrder[] = [
  { id: 'A1', item: 'Notebook', date: '2030-01-07', quantity: '2', price: '5' },
  { id: 'A2', item: 'Pen', date: '2030-01-08', quantity: '3', price: '2' },
  { id: 'A3', item: 'Notebook', date: '2030-01-09', quantity: '1', price: '5' },
  { id: 'A4', item: 'Pen', date: '2030-01-13', quantity: '0', price: '2' },
  { id: 'A5', item: 'Folder', date: '2030-01-13', quantity: '', price: '4' }
];
export const messySpreadsheet: PracticeOrder[] = [
  { ...spreadsheetSource[0], id: ' A1 ', item: ' Notebook ', date: '2030/01/07' },
  ...spreadsheetSource.slice(1).map((row) => ({ ...row })),
  { ...spreadsheetSource[0] },
  { id: 'A6', item: 'Folder', date: '01/02/2030', quantity: '1', price: '4' }
];
export const extractedPdfRows: PracticeOrder[] = spreadsheetSource.map((row) => ({
  ...row, ...(row.id === 'A2' ? { quantity: '8' } : {}),
  ...(row.id === 'A5' ? { quantity: '0' } : {})
}));

function dateValue(value: string) {
  const date = value.trim().replace(/^(\d{4})\/(\d{2})\/(\d{2})$/, '$1-$2-$3');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date))
    || new Date(date).toISOString().slice(0, 10) !== date) return null;
  return date;
}
function amount(value: string, quantity = false) {
  if (!(quantity ? /^\d+$/ : /^\d+(?:\.\d{1,2})?$/).test(value)) return null;
  const [whole, fraction = ''] = value.split('.');
  const number = quantity ? Number(whole) : Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  return Number.isSafeInteger(number) && number >= 0 ? number : null;
}
export function cleanSpreadsheet(rows: readonly PracticeOrder[]) {
  const unique = new Map<string, PracticeOrder>();
  const issues: { id: string; field: string }[] = [];
  let duplicates = 0;
  for (const input of rows) {
    const row: PracticeOrder = {
      id: input.id.trim(), item: input.item.trim(), date: input.date.trim(),
      quantity: input.quantity.trim(), price: input.price.trim()
    };
    if (!/^A\d+$/.test(row.id) || !['Notebook', 'Pen', 'Folder'].includes(row.item)) {
      throw new Error('Invalid practice order ID or item.');
    }
    const date = dateValue(row.date);
    if (date) row.date = date;
    const previous = unique.get(row.id);
    if (previous) {
      if (JSON.stringify(previous) !== JSON.stringify(row)) throw new Error('Conflicting order ID. Resolve the source before cleaning.');
      duplicates++;
      continue;
    }
    unique.set(row.id, row);
    if (!date) issues.push({ id: row.id, field: 'date' });
    if (amount(row.quantity, true) === null) issues.push({ id: row.id, field: 'quantity' });
    if (amount(row.price) === null) issues.push({ id: row.id, field: 'price' });
  }
  return { rows: [...unique.values()], issues, duplicates, rawCount: rows.length };
}
export function comparePdfRows(rows: readonly PracticeOrder[]) {
  if (rows.length !== spreadsheetSource.length) throw new Error('PDF practice requires exactly five source rows.');
  return spreadsheetSource.flatMap((source, index) =>
    (Object.keys(source) as (keyof PracticeOrder)[]).filter((key) => rows[index][key] !== source[key])
      .map((field) => ({ row: index + 1, id: source.id, field }))
  );
}
export function spreadsheetReport(rows: readonly PracticeOrder[]) {
  const cleaned = cleanSpreadsheet(rows);
  const groups: Record<string, { knownCents: number; unresolved: number }> = {};
  let knownCents = 0, unresolved = 0, excluded = 0;
  for (const row of cleaned.rows) {
    const date = dateValue(row.date);
    if (date && (date < '2030-01-07' || date > '2030-01-13')) { excluded++; continue; }
    const group = groups[row.item] ??= { knownCents: 0, unresolved: 0 };
    const quantity = amount(row.quantity, true), price = amount(row.price);
    if (!date || quantity === null || price === null) { unresolved++; group.unresolved++; continue; }
    const cents = quantity * price;
    if (!Number.isSafeInteger(cents) || !Number.isSafeInteger(knownCents + cents)) {
      throw new Error('Practice amount exceeds the safe calculation limit.');
    }
    knownCents += cents;
    group.knownCents += cents;
  }
  return { knownCents, unresolved, excluded, groups };
}

export function spreadsheetCsv(rows: readonly PracticeOrder[]) {
  const cell = (value: string) => {
    // CSV quoting alone does not neutralise spreadsheet formula interpretation.
    const safe = /^[\s]*[=+\-@]/.test(value) || /^[\t\r\n]/.test(value) ? `'${value}` : value;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  return ['Order,Item,DateUTC,Quantity,UnitPriceEUR',
    ...rows.map((row) => [row.id, row.item, row.date, row.quantity, row.price].map(cell).join(','))
  ].join('\r\n') + '\r\n';
}

export function practicePdf(): string {
  const lines = [
    'FICTIONAL ORDERS - PDF-TO-EXCEL PRACTICE',
    'Source date: 2030-01-14. Currency: EUR. Page 1 of 1.',
    'Order  Item       Date UTC     Quantity  Unit price EUR',
    ...spreadsheetSource.map((row) =>
      `${row.id.padEnd(7)}${row.item.padEnd(11)}${row.date}   ${row.quantity.padEnd(10)}${row.price}`),
    'A5 quantity is BLANK, not zero. A4 quantity is zero.',
    'Known subtotal EUR 21. One unresolved quantity.',
    'Fictional data only. Not accounting advice.'
  ];
  const escape = (text: string) => text.replace(/([\\()])/g, '\\$1');
  const stream = `BT /F1 10 Tf 40 790 Td 18 TL\n${lines.map((line, i) => `${i ? 'T* ' : ''}(${escape(line)}) Tj`).join('\n')}\nET`;
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>',
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = objects.map((object, i) => {
    const offset = pdf.length;
    pdf += `${i + 1} 0 obj\n${object}\nendobj\n`;
    return offset;
  });
  const xref = pdf.length;
  pdf += `xref\n0 6\n0000000000 65535 f \n${offsets.map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')}`;
  return pdf + `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
}
