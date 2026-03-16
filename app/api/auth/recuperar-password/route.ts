import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/utils/logger'
import { getClientIp } from '@/lib/utils/client-ip'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        logger.log('Proxy Recuperar Password: Enviando solicitud a', `${API_BASE_URL}/api/recuperar-password`)

        const response = await fetch(`${API_BASE_URL}/api/recuperar-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Forwarded-For': getClientIp(request),
            },
            body: JSON.stringify(body),
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
            logger.error('Proxy Recuperar Password: Error del backend:', response.status, data)
            return NextResponse.json(
                { message: data.message || `Error ${response.status}: ${response.statusText}` },
                { status: response.status }
            )
        }

        logger.log('Proxy Recuperar Password: Solicitud exitosa')
        return NextResponse.json(data)
    } catch (error) {
        logger.error('Proxy Recuperar Password: Error de conexión:', error)
        return NextResponse.json(
            { message: 'No se pudo conectar con el servidor backend' },
            { status: 503 }
        )
    }
}
