import type { Metadata } from 'next';

export function publicPageMetadata(
  pathname: string,
  { title, description, socialLocales }: {
    title: string;
    description: string;
    socialLocales?: { locale: string; alternateLocale: string[] };
  }
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: pathname },
    openGraph: {
      type: 'website',
      siteName: 'Desofec AI Studio',
      title,
      description,
      url: pathname,
      ...socialLocales,
      images: [{ url: '/opengraph-image', alt: 'Desofec AI Studio: beginner-friendly AI learning' }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/opengraph-image']
    }
  };
}
