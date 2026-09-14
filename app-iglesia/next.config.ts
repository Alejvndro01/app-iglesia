import type { NextConfig } from "next";

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' https: data: blob:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://*.cloudflarestorage.com https://bolls.life https://bible-api.deno.dev https://himnario-api.qhar.in https://sabbath-school.adventech.io",
      "media-src 'self' https://*.google.com https://drive.google.com blob:",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  /* Standalone solo fuera de Vercel: en Vercel el adaptador de despliegue
     choca con output:"standalone" en Next 16.3 (ENOENT next-server.js.nft.json).
     Vercel ignora .next/standalone de todos modos; el Dockerfile lo sigue usando. */
  output: process.env.VERCEL ? undefined : "standalone",

  /* No exponer la versión de Next.js en los headers de respuesta. */
  poweredByHeader: false,

  /* Quitar console.* del bundle de producción (se conservan error y warn). */
  compiler: {
    removeConsole: {
      exclude: ["error", "warn"],
    },
  },

  /* Permite next/image con la URL remota de respaldo del login. */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
