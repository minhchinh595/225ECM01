"use client"

import { SignupForm } from "@/components/signup-form"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

export default function SignupPage() {
  return (
    <div className="grid min-h-svh bg-[linear-gradient(135deg,#f8f1e7_0%,#efdfcc_50%,#d8c2a8_100%)] lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-stone-900 text-white">
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_24px_80px_rgba(88,62,39,0.12)] backdrop-blur">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80"
          alt="Local fashion brand styled photo"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 flex items-end p-10">
          <div className="rounded-[1.5rem] border border-white/20 bg-white/10 p-6 text-white backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.35em] text-white/70">
              Chào mừng đến với phong cách riêng
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              Kết nối đội ngũ với thương hiệu thời trang Việt Nam
            </h2>
          </div>
        </div>
      </div>
    </div>
  )
}
