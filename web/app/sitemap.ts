import type { MetadataRoute } from 'next';
import { getCatalog } from '@/lib/catalog';

const siteUrl = 'https://desofec.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { goals, paths } = await getCatalog();
  const publicPages = ['/', '/onboarding', '/tools', '/paths', '/starter-packs'];

  return [
    ...publicPages.map((path) => ({ url: new URL(path, siteUrl).toString() })),
    ...paths.map((path) => ({
      url: new URL(`/paths/${encodeURIComponent(path.id)}`, siteUrl).toString()
    })),
    ...goals.map((goal) => ({
      url: new URL(`/results/${encodeURIComponent(goal.id)}`, siteUrl).toString()
    }))
  ];
}
