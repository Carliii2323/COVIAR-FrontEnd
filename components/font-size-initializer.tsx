"use client"

import { useEffect } from "react"

export const FONT_SIZE_KEY = "coviar_font_size"

/**
 * Se monta una sola vez en el layout.
 * Lee el tamaño guardado en localStorage y lo aplica al elemento <html>
 * para que Tailwind (rem) escale toda la interfaz.
 */
export function FontSizeInitializer() {
  useEffect(() => {
    const saved = localStorage.getItem(FONT_SIZE_KEY)
    if (saved) {
      document.documentElement.style.fontSize = saved
    }
  }, [])

  return null
}
