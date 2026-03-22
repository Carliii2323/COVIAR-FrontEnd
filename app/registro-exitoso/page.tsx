"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function RegistroExitosoPage() {
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
            ¡Registro exitoso!
          </CardTitle>
          <CardDescription className="text-gray-500 text-center">
            Tu cuenta fue creada y tu correo fue verificado correctamente.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 bg-white space-y-6">

          {/* Ícono de éxito */}
          <div className="flex justify-center">
            <div className="rounded-full bg-green-50 p-4">
              <CheckCircle2 className="h-14 w-14 text-green-500" strokeWidth={1.5} />
            </div>
          </div>

          {/* Mensaje */}
          <div className="text-center space-y-2">
            <p className="text-gray-700 font-medium">
              Ya podés ingresar al sistema con tus credenciales.
            </p>
            <p className="text-sm text-gray-500">
              Utilizá el email y la contraseña que registraste para iniciar sesión.
            </p>
          </div>

          {/* Botón al login */}
          <Button
            asChild
            className="w-full bg-coviar-borravino hover:bg-coviar-borravino-dark h-11 text-base font-medium"
          >
            <Link href="/login">
              Iniciar sesión
            </Link>
          </Button>

        </CardContent>
      </Card>

      <div className="fixed bottom-4 left-0 right-0 text-center text-white/50 text-xs z-10 p-4">
        &copy; {new Date().getFullYear()} Corporación Vitivinícola Argentina. Todos los derechos reservados.
      </div>

    </div>
  )
}
