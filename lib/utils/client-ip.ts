// lib/utils/client-ip.ts
// Extrae la IP real del cliente desde una NextRequest.
// Sirve para reenviarla al backend Go vía X-Forwarded-For,
// ya que las rutas API de Next.js actúan como proxy y ocultan la IP original.

import type { NextRequest } from 'next/server'

export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    request.headers.get('cf-connecting-ip') ?? // Cloudflare
    'unknown'
  )
}
