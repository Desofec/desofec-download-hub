import type { MetadataRoute } from 'next';
import { getCatalog } from '@/lib/catalog';
import { tutorials } from '@/lib/tutorials';

const siteUrl = 'https://desofec.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { goals, paths } = await getCatalog();
  const publicPages = ['/', '/onboarding', '/tools', '/paths', '/starter-packs', '/projects/first-app'];
  const tutorialPages = tutorials.map((tutorial) => tutorial.href);

  return [
    ...[...publicPages, ...tutorialPages].map((path) => ({ url: new URL(path, siteUrl).toString() })),
    ...paths.map((path) => ({
      url: new URL(`/paths/${encodeURIComponent(path.id)}`, siteUrl).toString()
    })),
    ...goals.map((goal) => ({
      url: new URL(`/results/${encodeURIComponent(goal.id)}`, siteUrl).toString()
    }))
  ];
}
