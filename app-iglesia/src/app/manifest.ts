import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'IASD Central de Hualqui',
    short_name: 'IASD Hualqui',
    description: 'Aplicación oficial de la Iglesia Adventista del Séptimo Día Central de Hualqui',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#486379',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}