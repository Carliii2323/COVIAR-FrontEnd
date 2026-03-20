"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

const TIMER_SECONDS = 5 * 60
const CODE_LENGTH = 6

export default function VerificarCodigoPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get("email") ?? ""

  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""))
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number>(TIMER_SECONDS)
  const [canResend, setCanResend] = useState<boolean>(false)
  const [resending, setResending] = useState(false)

  // Sincronizar timer con sessionStorage solo en el cliente, tras el montaje
  useEffect(() => {
    const savedStart = sessionStorage.getItem("verif_timer_start")
    if (!savedStart) {
      sessionStorage.setItem("verif_timer_start", Date.now().toString())
      return
    }
    const elapsed = Math.floor((Date.now() - Number(savedStart)) / 1000)
    const remaining = TIMER_SECONDS - elapsed
    if (remaining <= 0) {
      setTimeLeft(0)
      setCanResend(true)
    } else {
      setTimeLeft(remaining)
    }
  }, [])

  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(CODE_LENGTH).fill(null))

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true)
      return
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  const handleChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(-1)
    const newCode = [...code]
    newCode[index] = cleaned
    setCode(newCode)
    setError(null)

    if (cleaned && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    if (cleaned && index === CODE_LENGTH - 1) {
      const fullCode = newCode.join("")
      if (fullCode.length === CODE_LENGTH) {
        handleVerify(fullCode)
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (code[index]) {
        const newCode = [...code]
        newCode[index] = ""
        setCode(newCode)
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH)
    if (!pasted) return

    const newCode = Array(CODE_LENGTH).fill("")
    pasted.split("").forEach((char, i) => { newCode[i] = char })
    setCode(newCode)
    setError(null)

    const focusIndex = Math.min(pasted.length, CODE_LENGTH - 1)
    inputRefs.current[focusIndex]?.focus()

    if (pasted.length === CODE_LENGTH) {
      handleVerify(pasted)
    }
  }

  const handleVerify = useCallback(
    async (codeToVerify?: string) => {
      const finalCode = codeToVerify ?? code.join("")
      if (finalCode.length < CODE_LENGTH) {
        setError("Por favor ingrese el código completo de 6 dígitos.")
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        // TODO: conectar con la función real, ej:
        // await verificarCodigoEmail(email, finalCode)
        sessionStorage.removeItem("verif_timer_start")
        router.push("/dashboard")
      } catch {
        setError("El código ingresado es inválido o ha expirado. Por favor, verifique e intente nuevamente.")
        setCode(Array(CODE_LENGTH).fill(""))
        setTimeout(() => inputRefs.current[0]?.focus(), 50)
      } finally {
        setIsLoading(false)
      }
    },
    [code, email, router]
  )

  const handleResend = async () => {
    setResending(true)
    setError(null)
    try {
      // TODO: await reenviarCodigoEmail(email)
      sessionStorage.setItem("verif_timer_start", Date.now().toString())
      setTimeLeft(TIMER_SECONDS)
      setCanResend(false)
      setCode(Array(CODE_LENGTH).fill(""))
      setTimeout(() => inputRefs.current[0]?.focus(), 50)
    } catch {
      setError("No se pudo reenviar el código. Intente nuevamente.")
    } finally {
      setResending(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleVerify()
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 pb-16 bg-gray-100">

      {/* Volver al inicio */}
      <Link
        href="/"
        className="absolute top-8 left-8 z-50 flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
      >
        <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm group-hover:bg-white/20 transition-all">
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        </div>
        <span className="font-medium text-sm drop-shadow-md">Volver al inicio</span>
      </Link>

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/header-banner.png" alt="Viñedo" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-coviar-borravino/95 to-coviar-borravino/70 mix-blend-multiply" />
      </div>

      <Card className="relative z-10 w-full max-w-md overflow-hidden p-0 shadow-2xl border-0">
        <CardHeader className="bg-white border-b p-4">
          <div className="flex justify-center mb-4">
            <Image
              src="/assets/logos/logocolorhorz.png"
              alt="Coviar"
              width={500}
              height={200}
              className="h-44 w-auto object-contain"
              priority
            />
          </div>
          <CardTitle className="text-2xl text-center font-serif text-coviar-borravino font-bold">
            Verificación de correo
          </CardTitle>
          <CardDescription className="text-gray-500 text-center">
            Ingrese el código de 6 dígitos que enviamos a{" "}
            <span className="font-medium text-gray-700">{email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 space-y-4 bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Inputs del código */}
            <div className="flex justify-center gap-2" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el }}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={isLoading}
                  className={[
                    "w-11 h-13 text-center text-xl font-bold rounded-lg border-2 outline-none",
                    "transition-all duration-200 bg-gray-50",
                    "focus:border-coviar-borravino focus:bg-white focus:shadow-md",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    error
                      ? "border-red-400 bg-red-50 text-red-700 shake"
                      : digit
                        ? "border-coviar-borravino/60 bg-white text-coviar-borravino"
                        : "border-gray-300 text-gray-800",
                  ].join(" ")}
                  aria-label={`Dígito ${index + 1} del código`}
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md text-center">
                {error}
              </div>
            )}

            {/* Botón verificar — solo visible si el código está incompleto */}
            {code.join("").length < CODE_LENGTH && (
              <Button
                type="submit"
                className="w-full bg-coviar-borravino hover:bg-coviar-borravino-dark h-11 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Verificando..." : "Verificar código"}
              </Button>
            )}

            {/* Temporizador / Reenviar */}
            <div className="flex justify-center">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="px-5 py-2 rounded-full text-sm font-medium bg-coviar-borravino text-white hover:bg-coviar-borravino-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {resending ? "Reenviando..." : "Reenviar código"}
                </button>
              ) : (
                <span className="px-5 py-2 rounded-full text-sm font-medium bg-coviar-borravino text-white opacity-70 cursor-default select-none">
                  El código se reenviará en {formatTime(timeLeft)}
                </span>
              )}
            </div>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">O</span>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:text-coviar-borravino transition-colors font-medium"
              >
                Volver a Iniciar Sesión
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="fixed bottom-4 left-0 right-0 text-center text-white/50 text-xs z-10 p-4">
        &copy; {new Date().getFullYear()} Corporación Vitivinícola Argentina. Todos los derechos reservados.
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .shake { animation: shake 0.4s ease; }
      `}</style>
    </div>
  )
}