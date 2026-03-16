import { NextRequest, NextResponse } from 'next/server'
import { getClientIp } from '@/lib/utils/client-ip'
import { logger } from '@/lib/utils/logger'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

/**
 * POST /api/autoevaluaciones/{id}/completar
 * Validar y finalizar la autoevaluación
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        logger.log('Proxy: Completando autoevaluación', id)

        const cookies = request.headers.get('Cookie')
        const authHeader = request.headers.get('Authorization')

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        }

        if (cookies) {
            headers['Cookie'] = cookies
        }

        if (authHeader) {
            headers['Authorization'] = authHeader
        headers['X-Forwarded-For'] = getClientIp(request)
        }

        const backendUrl = `${API_BASE_URL}/api/autoevaluaciones/${id}/completar`

        const response = await fetch(backendUrl, {
            method: 'POST',
            headers,
            credentials: 'include',
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
            logger.error('Proxy: Error al completar autoevaluación:', response.status, data)
            return NextResponse.json(
                { message: data.message || `Error ${response.status}: ${response.statusText}` },
                { status: response.status }
            )
        }

        logger.log('Proxy: Autoevaluación completada exitosamente')
        return NextResponse.json(data)
    } catch (error) {
        logger.error('Proxy: Error de conexión:', error)
        return NextResponse.json(
            { message: 'No se pudo conectar con el servidor backend' },
            { status: 503 }
        )
    }
}
