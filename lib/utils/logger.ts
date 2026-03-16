// lib/utils/logger.ts
// Logging condicionado por entorno.
// En producción (NEXT_PUBLIC_APP_ENV=production) todos los logs quedan silenciados.
// En desarrollo (NEXT_PUBLIC_APP_ENV=development) se muestran normalmente.

const isDev =
  process.env.NEXT_PUBLIC_APP_ENV !== 'production' &&
  process.env.NODE_ENV !== 'production'

export const logger = {
  log: (...args: unknown[]): void => {
    if (isDev) console.log(...args)
  },
  warn: (...args: unknown[]): void => {
    if (isDev) console.warn(...args)
  },
  error: (...args: unknown[]): void => {
    if (isDev) console.error(...args)
  },
}
