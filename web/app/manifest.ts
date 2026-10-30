import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Desofec AI Studio',
    short_name: 'Desofec Studio',
    description: 'Learn the right tools. Build with confidence. Launch with clarity.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#07111d',
    theme_color: '#07111d',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ]
  };
}
