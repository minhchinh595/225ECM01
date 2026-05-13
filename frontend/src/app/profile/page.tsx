"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeftIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  SparklesIcon,
} from "lucide-react"
import { getStoredUser, saveUser } from "@/lib/auth"
import { updateProfile } from "@/lib/api"
import type { NguoiDung } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<NguoiDung | null>(null)
  const [form, setForm] = useState({ hoTen: "", email: "", soDienThoai: "", diaChi: "" })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const stored = getStoredUser()
    if (!stored) {
      router.replace("/login")
      return
    }
    setUser(stored)
    setForm({
      hoTen: stored.hoTen ?? "",
      email: stored.email ?? "",
      soDienThoai: stored.soDienThoai ?? "",
      diaChi: stored.diaChi ?? "",
    })
  }, [router])

  const patch = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    startTransition(async () => {
      try {
        // Gửi lên backend (không có hoTen)
        const updated = await updateProfile(user!.maNguoiDung, {
          email: form.email,
          soDienThoai: form.soDienThoai,
          diaChi: form.diaChi,
        })
        // Merge hoTen từ form vào local (lưu localStorage)
        const merged: NguoiDung = { ...user!, ...updated, hoTen: form.hoTen || null }
        saveUser(merged)
        setUser(merged)
        setSuccess(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể kết nối đến máy chủ. Vui lòng thử lại.")
      }
    })
  }

  if (!user) return null

  const inputClass =
    "h-12 rounded-2xl border-stone-200 bg-white/80 pl-11 text-sm shadow-sm transition focus-visible:border-amber-300/70 focus-visible:bg-white focus-visible:ring-amber-200/40"

  const fields = [
    {
      key: "hoTen" as const,
      label: "Họ và tên",
      type: "text",
      placeholder: "Nguyễn Văn A",
      icon: UserIcon,
      required: false,
    },
    {
      key: "email" as const,
      label: "Email",
      type: "email",
      placeholder: "ban@example.com",
      icon: MailIcon,
      required: true,
    },
    {
      key: "soDienThoai" as const,
      label: "Số điện thoại",
      type: "text",
      placeholder: "0901 234 567",
      icon: PhoneIcon,
      required: true,
    },
    {
      key: "diaChi" as const,
      label: "Địa chỉ",
      type: "text",
      placeholder: "123 Nguyễn Trãi, Hà Nội",
      icon: MapPinIcon,
      required: false,
    },
  ]

  return (
    <div className="min-h-svh bg-[linear-gradient(150deg,#fdf8f2_0%,#f5ece0_55%,#ecdcc8_100%)]">
      {/* Decorative blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-violet-200/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-rose-100/25 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Back */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-sm font-medium text-stone-700 shadow-sm backdrop-blur-sm transition hover:bg-white hover:shadow-md"
        >
          <ArrowLeftIcon className="size-4" />
          Về trang chủ
        </Link>

        {/* Card */}
        <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/85 shadow-[0_24px_80px_rgba(88,62,39,0.13)] backdrop-blur-md">
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-rose-50/60 to-violet-50/40 px-8 pb-7 pt-8 sm:px-10">
            {/* Subtle pattern */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(251,191,36,0.15),transparent)]" aria-hidden />

            <div className="relative flex items-center gap-4">
              {/* Avatar */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200 via-rose-100 to-violet-200 shadow-md ring-2 ring-white/80">
                <span className="font-heading text-2xl font-bold text-stone-800">
                  {user.tenDangNhap.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-200/70 bg-white/80 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-800">
                    <SparklesIcon className="size-3" />
                    Thành viên
                  </span>
                </div>
                <h1 className="font-heading text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                  {user.tenDangNhap}
                </h1>
                <p className="mt-0.5 text-sm text-stone-500">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="px-8 py-8 sm:px-10">
            <div className="mb-6">
              <h2 className="font-heading text-lg font-semibold text-stone-900">Thông tin cá nhân</h2>
              <p className="mt-1 text-sm text-stone-500">Cập nhật email, số điện thoại và địa chỉ của bạn.</p>
            </div>

            {/* Read-only username */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-stone-700">Tên đăng nhập</label>
              <div className="relative">
                <UserIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-300" />
                <div className="flex h-12 items-center rounded-2xl border border-stone-100 bg-stone-50 pl-11 pr-4 text-sm text-stone-400 select-none">
                  {user.tenDangNhap}
                </div>
              </div>
              <p className="mt-1.5 text-xs text-stone-400">Tên đăng nhập không thể thay đổi.</p>
            </div>

            <div className="space-y-5">
              {fields.map(({ key, label, type, placeholder, icon: Icon, required }) => (
                <div key={key}>
                  <label className="mb-2 block text-sm font-medium text-stone-700">{label}</label>
                  <div className="relative">
                    <Icon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                    <Input
                      type={type}
                      required={required}
                      value={form[key]}
                      onChange={patch(key)}
                      placeholder={placeholder}
                      className={inputClass}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mt-5 flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <CheckCircle2Icon className="size-4 shrink-0" />
                Thông tin đã được cập nhật thành công!
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 border-t border-stone-100 pt-7 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/")}
                className="h-12 flex-1 rounded-2xl border-stone-200 text-sm font-medium text-stone-700 hover:bg-stone-50"
              >
                Huỷ bỏ
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="h-12 flex-1 rounded-2xl border-0 bg-stone-900 text-sm font-semibold text-white shadow-lg shadow-stone-900/20 transition hover:bg-stone-800 hover:shadow-xl disabled:opacity-60"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Đang lưu...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Lưu thay đổi
                    <ArrowRightIcon className="size-4" />
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Quick link to change password */}
        <div className="mt-4 rounded-2xl border border-white/70 bg-white/50 px-6 py-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stone-800">Bảo mật tài khoản</p>
              <p className="text-xs text-stone-500">Cập nhật mật khẩu định kỳ để bảo vệ tài khoản.</p>
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="shrink-0 rounded-xl border-stone-200 text-sm font-medium text-stone-700 hover:bg-white"
            >
              <Link href="/change-password">Đổi mật khẩu</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
