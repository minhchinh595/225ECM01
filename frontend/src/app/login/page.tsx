"use client"

import { LoginForm } from "@/components/login-form"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh bg-[linear-gradient(135deg,#f7efe5_0%,#efe4d4_45%,#d8b38c_100%)] lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-stone-900 text-white">
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_24px_80px_rgba(88,62,39,0.12)] backdrop-blur">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden overflow-hidden lg:block bg-gradient-to-b from-[#261d16] via-[#3c2f24] to-[#5b4735]">
        <img
          src="https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2024/01/local-brand-la-gi-thumb.jpg"
          alt="Local fashion brand styled photo"
          className="absolute inset-0 m-auto h-full w-full max-h-full max-w-full object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1f170f]/60 via-transparent to-[#473a2f]/70" />
        <div className="absolute inset-0 flex items-end p-10">
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/30 p-6 text-white backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.35em] text-white/70">
              Thương hiệu thời trang local
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              Đẳng cấp &amp; tinh tế theo phong cách Việt
            </h2>
          </div>
        </div>
      </div>
    </div>
  )
}
