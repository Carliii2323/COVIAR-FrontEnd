/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Permite acceso desde otros dispositivos en la red local durante desarrollo.
  // Agregá la IP de tu celular/dispositivo si cambia.
  // Solo tiene efecto con: npm run dev -- --hostname 0.0.0.0
  allowedDevOrigins: [
    '192.168.1.*',   // red local típica de router hogareño
    '192.168.0.*',   // variante alternativa de red local
    '10.0.0.*',      // red local corporativa / VPN
  ],
}

export default nextConfig