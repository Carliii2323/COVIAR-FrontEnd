"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { restablecerPassword } from "@/lib/api/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff, CheckCircle2 } from "lucide-react"

function ActualizarContrasenaContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (!token) {
      setError("Token de recuperación no válido o faltante")
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setMessage(null)

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    if (!token) {
      setError("Token de recuperación no válido")
      setIsLoading(false)
      return
    }

    try {
      await restablecerPassword(token, password)
      setMessage("¡Contraseña actualizada exitosamente!")
      setIsSuccess(true)
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ocurrió un error al actualizar la contraseña")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="relative z-10 w-full max-w-md overflow-hidden p-0 shadow-2xl border-0">
      <CardHeader className="bg-coviar-borravino px-8 pt-6 pb-5">
        <CardTitle className="text-xl text-center font-serif text-white font-bold">
          Actualizar Contraseña
        </CardTitle>
        <CardDescription className="text-white/80 text-center text-sm">
          Ingresa tu nueva contraseña
        </CardDescription>
      </CardHeader>

      <CardContent className="px-8 pt-5 pb-6 space-y-4">
        {!token ? (
          <div className="space-y-4">
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              El enlace de recuperación no es válido o ha expirado.
            </div>
            <div className="text-center">
              <Link href="/recuperar-contrasena" className="text-sm text-coviar-borravino hover:underline font-medium">
                Solicitar un nuevo enlace
              </Link>
            </div>
          </div>
        ) : isSuccess ? (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="text-sm text-green-700 bg-green-50 p-3 rounded-md border border-green-200">
              {message}
            </div>
            <p className="text-sm text-muted-foreground">
              Serás redirigido al inicio de sesión...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">Nueva Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repite tu contraseña"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-coviar-borravino hover:bg-coviar-borravino-dark h-11 text-base font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Actualizando..." : "Actualizar Contraseña"}
            </Button>

            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">O</span>
              </div>
            </div>

            <div className="text-center">
              <Link href="/login" className="text-sm text-muted-foreground hover:text-coviar-borravino transition-colors font-medium">
                Volver a Iniciar Sesión
              </Link>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

export default function ActualizarContrasenaPage() {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-gray-100">

      {/* Volver al inicio */}
      <Link href="/" className="absolute top-8 left-8 z-50 flex items-center gap-2 text-white/80 hover:text-white transition-colors group">
        <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm group-hover:bg-white/20 transition-all">
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        </div>
        <span className="font-medium text-sm drop-shadow-md">Volver al inicio</span>
      </Link>

      {/* Background igual al login */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/header-banner.png" alt="Viñedo" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-coviar-borravino/95 to-coviar-borravino/70 mix-blend-multiply"></div>
      </div>

      <Suspense fallback={
        <Card className="relative z-10 w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coviar-borravino mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando...</p>
          </CardContent>
        </Card>
      }>
        <ActualizarContrasenaContent />
      </Suspense>

      <div className="absolute bottom-4 left-0 right-0 text-center text-white/50 text-xs z-10 p-4">
        &copy; {new Date().getFullYear()} Corporación Vitivinícola Argentina. Todos los derechos reservados.
      </div>
    </div>
  )
}
