import type { BeforeSendEvent } from '@vercel/analytics';

const privateRoutes = [
  '/account', '/my-progress', '/newsletter', '/workspaces', '/study-groups',
  '/business-launchpad/projects', '/business-launchpad/proposal-builder',
  '/business-launchpad/results-tracker', '/business-launchpad/client-discovery',
  '/business-launchpad/case-study-builder', '/business-launchpad/evidence-workbook',
  '/business-launchpad/review-centre', '/business-launchpad/commerce-pilot-planner',
  '/business-launchpad/commerce-pilot-review', '/business-launchpad/commerce-readiness'
];

export function redactAnalyticsEvent(event: BeforeSendEvent): BeforeSendEvent | null {
  if (event.type !== 'pageview') return null;
  let url: URL;
  let pathname: string;
  try {
    url = new URL(event.url);
    pathname = decodeURIComponent(url.pathname);
  } catch {
    console.warn('Skipped analytics page view with an invalid URL.');
    return null;
  }
  if (!['http:', 'https:'].includes(url.protocol)
    || privateRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))) return null;

  url.search = '';
  url.hash = '';
  url.username = '';
  url.password = '';
  return { type: 'pageview', url: url.toString() };
}
