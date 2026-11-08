import type { Metadata } from 'next';

export function publicPageMetadata(
  pathname: string,
  { title, description }: { title: string; description: string }
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
