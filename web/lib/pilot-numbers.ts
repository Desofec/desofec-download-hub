// Keep two decimal places as integers; accept a decimal comma but no thousands separators.
export function pilotHundredths(value: string, max: number): number | null {
  const text = value.trim();
  if (!text) return null;
  if (!/^\d+(?:[.,]\d{1,2})?$/.test(text)) throw new Error('Invalid pilot number');
  const [whole, fraction = ''] = text.replace(',', '.').split('.');
  const result = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  if (!Number.isSafeInteger(result) || result > max * 100) throw new Error('Invalid pilot number');
  return result;
}

export function formatPilotMoney(cents: number, language: string) {
  return new Intl.NumberFormat(language, { style: 'currency', currency: 'EUR' }).format(cents / 100);
}
