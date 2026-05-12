"use client"

import { LoginForm } from "@/components/login-form"
import Link from "next/link"
import { GalleryVerticalEndIcon } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh bg-[linear-gradient(135deg,#f7efe5_0%,#efe4d4_45%,#d8b38c_100%)] lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-stone-900 text-white">
              <GalleryVerticalEndIcon className="size-4" />
            </div>
            Fashion Commerce
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_24px_80px_rgba(88,62,39,0.12)] backdrop-blur">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_30%),linear-gradient(180deg,rgba(28,25,23,0.1),rgba(28,25,23,0.55)),linear-gradient(135deg,#7c2d12,#431407,#1c1917)]" />
        <div className="absolute inset-0 p-12 text-white">
          <div className="flex h-full flex-col justify-between rounded-[2rem] border border-white/15 bg-white/5 p-8 backdrop-blur-sm">
            <p className="max-w-sm text-sm uppercase tracking-[0.35em] text-amber-200">
              Backend-first workflow
            </p>
            <div>
              <h2 className="max-w-lg text-4xl font-semibold leading-tight">
                Dang nhap de kiem tra API, quan ly san pham va tiep tuc xay dung frontend.
              </h2>
              <p className="mt-4 max-w-md text-white/75">
                Form nay goi truc tiep API `POST /api/nguoi-dung/login` cua Spring Boot.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
