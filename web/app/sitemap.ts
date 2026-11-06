import type { MetadataRoute } from 'next';
import { getCatalog } from '@/lib/catalog';
import { tutorials } from '@/lib/tutorials';

const siteUrl = 'https://desofec.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { goals, paths, tools, starterPacks } = await getCatalog();
  const publicPages = ['/', '/onboarding', '/tools', '/paths', '/starter-packs', '/tutorials', '/business-launchpad', '/business-launchpad/automation-lab', '/business-launchpad/first-project', '/business-launchpad/proposal-builder', '/business-launchpad/results-tracker', '/plan', '/break-room', '/projects/first-app', '/privacy', '/terms', '/contact'];
  const tutorialPages = tutorials.map((tutorial) => tutorial.href);

  return [
    { url: new URL('/business-launchpad/client-discovery-lab', siteUrl).toString() },
    { url: new URL('/business-launchpad/freelance-portfolio', siteUrl).toString() },
    { url: new URL('/business-launchpad/spreadsheet-lab', siteUrl).toString() },
    ...[...publicPages, ...tutorialPages].map((path) => ({ url: new URL(path, siteUrl).toString() })),
    ...paths.map((path) => ({
      url: new URL(`/paths/${encodeURIComponent(path.id)}`, siteUrl).toString()
    })),
    ...tools.map((tool) => ({
      url: new URL(`/tools/${encodeURIComponent(tool.id)}`, siteUrl).toString()
    })),
    ...starterPacks.map((pack) => ({
      url: new URL(`/starter-packs/${encodeURIComponent(pack.id)}`, siteUrl).toString()
    })),
    ...goals.map((goal) => ({
      url: new URL(`/results/${encodeURIComponent(goal.id)}`, siteUrl).toString()
    }))
  ];
}
