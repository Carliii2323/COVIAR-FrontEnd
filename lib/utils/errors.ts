// lib/utils/errors.ts
// Convierte errores técnicos en mensajes amigables en español.

export function getErrorMessage(error: unknown): string {
  const msg = error instanceof Error ? error.message : String(error)

  if (msg.includes('401') || msg.includes('Unauthorized') || msg.includes('credenciales')) {
    return 'Email o contraseña incorrectos'
  }
  if (msg.includes('403') || msg.includes('Forbidden')) {
    return 'No tenés permisos para realizar esta acción'
  }
  if (msg.includes('404') || msg.includes('Not Found')) {
    return 'El recurso solicitado no existe'
  }
  if (msg.includes('409') || msg.includes('ya existe') || msg.includes('duplicate')) {
    return 'Ya existe un registro con esos datos'
  }
  if (msg.includes('422') || msg.includes('Unprocessable')) {
    return 'Los datos enviados no son válidos'
  }
  if (msg.includes('429') || msg.includes('Too Many')) {
    return 'Demasiados intentos. Por favor esperá unos minutos'
  }
  if (msg.includes('503') || msg.includes('500') || msg.includes('Internal')) {
    return 'Error interno del servidor. Intentá más tarde'
  }
  if (msg.includes('Failed to fetch') || msg.includes('conectar') || msg.includes('NetworkError')) {
    return 'No se pudo conectar con el servidor'
  }

  // Si el mensaje ya es legible (no contiene códigos HTTP), devolverlo directo
  if (!/^\d{3}/.test(msg) && msg.length < 200) {
    return msg
  }

  return 'Ocurrió un error inesperado. Intentá de nuevo'
}
