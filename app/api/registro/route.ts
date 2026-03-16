import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/utils/logger'
import { getClientIp } from '@/lib/utils/client-ip'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        logger.log('Proxy: Enviando registro a', `${API_BASE_URL}/api/registro`)
        logger.log('Proxy: Body:', JSON.stringify(body, null, 2))

        const response = await fetch(`${API_BASE_URL}/api/registro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Forwarded-For': getClientIp(request),
            },
            body: JSON.stringify(body),
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
            logger.error('Proxy: Error del backend:', response.status, data)
            return NextResponse.json(
                { message: data.message || data.error || `Error ${response.status}: ${response.statusText}` },
                { status: response.status }
            )
        }

        logger.log('Proxy: Registro exitoso:', data)
        return NextResponse.json(data)
    } catch (error) {
        logger.error('Proxy: Error de conexión:', error)
        return NextResponse.json(
            { message: 'No se pudo conectar con el servidor backend' },
            { status: 503 }
        )
    }
}
