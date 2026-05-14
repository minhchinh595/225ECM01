"use client"

import { SignupForm } from "@/components/signup-form"
import Link from "next/link"
import { ArrowLeftIcon, SparklesIcon, StarIcon, ShieldCheckIcon } from "lucide-react"

const PANEL_IMAGE = "/Login.png"
const BG_IMAGE = "/anhnenlogin.png"

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1fr_calc(100svh*9/16)]">

      {/* ── Left: background ảnh + form đè lên ── */}
      <div className="relative flex flex-col overflow-hidden">
        {/* Ảnh nền cột trái */}
        <img
          src={BG_IMAGE}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        {/* Overlay nhẹ */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]" aria-hidden />

        {/* Back button */}
        <div className="relative z-10 p-6 md:p-8">
          <Link
            href="/"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-stone-700 shadow-md ring-1 ring-stone-200/60 backdrop-blur-sm transition hover:bg-white hover:shadow-lg"
            aria-label="Về trang chủ"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
        </div>

        {/* Form card — đè lên ảnh nền, scrollable */}
        <div className="relative z-10 flex flex-1 items-start justify-center px-6 pb-12 md:items-center md:px-10">
          <div className="w-full max-w-[28rem]">
            <div className="rounded-[1.75rem] border border-white/70 bg-white/85 px-7 py-5 shadow-[0_24px_80px_rgba(88,62,39,0.16)] backdrop-blur-xl sm:px-8 sm:py-6">
              <SignupForm />
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: image panel (giữ nguyên) ── */}
      <div className="relative hidden overflow-hidden bg-stone-950 lg:block">
        <img
          src={PANEL_IMAGE}
          alt="Local brand Việt Nam — lookbook streetwear"
          className="absolute inset-0 h-full w-full object-contain object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-stone-950/40" />

        {/* Top badge — centered */}
        <div className="absolute left-1/2 top-8 z-10 flex -translate-x-1/2 items-center gap-2.5 rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-md">
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
          <div className="mb-5 flex flex-wrap gap-2">
            {[
              { icon: StarIcon, label: "Chất lượng kiểm chứng" },
              { icon: ShieldCheckIcon, label: "Bảo mật tuyệt đối" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                <Icon className="size-3.5 text-amber-300" strokeWidth={2} />
                <span className="text-[11px] font-medium text-white/80">{label}</span>
              </div>
            ))}
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-stone-950/40 p-6 backdrop-blur-md">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/55">
              Chào mừng đến với phong cách riêng
            </p>
            <h2 className="font-heading mt-2.5 text-2xl font-semibold leading-snug text-white lg:text-3xl">
              Kết nối với thương hiệu thời trang Việt Nam
            </h2>
          </div>
        </div>
      </div>

    </div>
  )
}
