import { practicePdf } from '@/lib/spreadsheet-practice';

export function GET() {
  return new Response(practicePdf(), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="fictional-orders.pdf"',
      'Cache-Control': 'public, max-age=86400',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}
