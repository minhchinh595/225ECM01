"use client"

import { LoginForm } from "@/components/login-form"
import Link from "next/link"
import { ArrowLeftIcon, SparklesIcon, StarIcon, ShieldCheckIcon } from "lucide-react"

const PANEL_IMAGE = "/c7b0fa19-b169-461b-9246-78ce5bbc3794.jpg"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1fr_calc(100svh*9/16)]">
      {/* ── Left: form panel ── */}
      <div className="relative flex flex-col bg-[linear-gradient(150deg,#fdf8f2_0%,#f5ece0_55%,#ecdcc8_100%)]">
        {/* Back button */}
        <div className="p-6 md:p-8">
          <Link
            href="/"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-stone-700 shadow-sm ring-1 ring-stone-200/80 backdrop-blur-sm transition hover:bg-white hover:shadow-md"
            aria-label="Về trang chủ"
          >
            <ArrowLeftIcon className="h-4.5 w-4.5" />
          </Link>
        </div>

        {/* Form — scrollable on small screens */}
        <div className="flex flex-1 items-start justify-center px-6 pb-12 md:items-center md:px-10">
          <div className="w-full max-w-[28rem]">
            <div className="rounded-[1.75rem] border border-white/80 bg-white/85 px-8 py-6 shadow-[0_20px_70px_rgba(88,62,39,0.13)] backdrop-blur-md sm:px-10 sm:py-7">
              <LoginForm />
            </div>
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />
          <div className="absolute -bottom-16 right-0 h-64 w-64 rounded-full bg-rose-200/25 blur-3xl" />
        </div>
      </div>

      {/* ── Right: image panel ── */}
      <div className="relative hidden overflow-hidden bg-stone-950 lg:block">
        {/* Full image */}
        <img
          src={PANEL_IMAGE}
          alt="Local brand Việt Nam — lookbook streetwear"
          className="absolute inset-0 h-full w-full object-contain object-center"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-stone-950/40" />

        {/* Top badge */}
        <div className="absolute left-8 top-8 flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-md">
          <span className="flex size-7 items-center justify-center rounded-full bg-amber-400/20">
            <SparklesIcon className="size-3.5 text-amber-300" />
          </span>
          <div className="leading-tight">
            <p className="text-[11px] font-semibold text-white">Local Brand</p>
            <p className="text-[10px] text-white/60">Việt Nam</p>
          </div>
        </div>

        {/* Bottom content */}
        <div className="absolute inset-x-0 bottom-0 p-8 lg:p-10">
          {/* Trust badges */}
          <div className="mb-5 flex flex-wrap gap-2">
            {[
              { icon: StarIcon, label: "Chất lượng kiểm chứng" },
              { icon: ShieldCheckIcon, label: "Bảo mật tuyệt đối" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-sm"
              >
                <Icon className="size-3.5 text-amber-300" strokeWidth={2} />
                <span className="text-[11px] font-medium text-white/80">{label}</span>
              </div>
            ))}
          </div>

          {/* Caption card */}
          <div className="rounded-[1.5rem] border border-white/10 bg-stone-950/40 p-6 backdrop-blur-md">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/55">
              Thương hiệu thời trang local
            </p>
            <h2 className="font-heading mt-2.5 text-2xl font-semibold leading-snug text-white lg:text-3xl">
              Đẳng cấp &amp; tinh tế theo phong cách Việt
            </h2>
          </div>
        </div>
      </div>
    </div>
  )
}
