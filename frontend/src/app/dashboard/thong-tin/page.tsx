"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  UserIcon, MailIcon, PhoneIcon, MapPinIcon,
  ArrowRightIcon, CheckCircle2Icon, SparklesIcon,
} from "lucide-react"
import { getStoredUser, saveUser } from "@/lib/auth"
import { updateProfile } from "@/lib/api"
import type { NguoiDung } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function ThongTinPage() {
  const router = useRouter()
  const [user, setUser] = useState<NguoiDung | null>(null)
  const [form, setForm] = useState({ hoTen: "", email: "", soDienThoai: "", diaChi: "" })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const stored = getStoredUser()
    if (!stored) { router.replace("/login"); return }
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
    setError(""); setSuccess(false)
    startTransition(async () => {
      try {
        const updated = await updateProfile(user!.maNguoiDung, {
          email: form.email,
          soDienThoai: form.soDienThoai,
          diaChi: form.diaChi,
        })
        const merged: NguoiDung = { ...user!, ...updated, hoTen: form.hoTen || null }
        saveUser(merged); setUser(merged); setSuccess(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Cập nhật thất bại")
      }
    })
  }

  if (!user) return null

  const inputClass = "h-11 rounded-xl border-stone-200 bg-stone-50/80 pl-10 text-sm shadow-sm transition focus-visible:border-amber-300/70 focus-visible:bg-white focus-visible:ring-amber-200/40"

  const fields = [
    { key: "hoTen" as const, label: "Họ và tên", type: "text", placeholder: "Nguyễn Văn A", icon: UserIcon, required: false },
    { key: "email" as const, label: "Email", type: "email", placeholder: "ban@example.com", icon: MailIcon, required: true },
    { key: "soDienThoai" as const, label: "Số điện thoại", type: "text", placeholder: "0901 234 567", icon: PhoneIcon, required: true },
    { key: "diaChi" as const, label: "Địa chỉ", type: "text", placeholder: "123 Nguyễn Trãi, Hà Nội", icon: MapPinIcon, required: false },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-stone-900">Cập nhật thông tin</h1>
        <p className="mt-1 text-sm text-stone-500">Chỉnh sửa thông tin cá nhân của tài khoản.</p>
      </div>

      <div className="mx-auto w-full max-w-2xl">
        <Card className="overflow-hidden rounded-[1.75rem] border-none bg-white/85 shadow-[0_12px_32px_rgba(96,74,44,0.08)]">
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-rose-50/60 to-violet-50/40 px-7 pb-6 pt-7">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(251,191,36,0.12),transparent)]" aria-hidden />
            <div className="relative flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200 via-rose-100 to-violet-200 shadow-md ring-2 ring-white/80">
                <span className="font-heading text-xl font-bold text-stone-800">
                  {user.tenDangNhap.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-200/70 bg-white/80 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-800">
                    <SparklesIcon className="size-3" />
                    {user.tenVaiTro ?? "Quản trị viên"}
                  </span>
                </div>
                <h2 className="font-heading text-xl font-semibold text-stone-900">{user.tenDangNhap}</h2>
                <p className="text-sm text-stone-500">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="px-7 py-6">
            {/* Read-only username */}
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-stone-700">Tên đăng nhập</label>
              <div className="relative">
                <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-300" />
                <div className="flex h-11 items-center rounded-xl border border-stone-100 bg-stone-50 pl-10 pr-4 text-sm text-stone-400 select-none">
                  {user.tenDangNhap}
                </div>
              </div>
              <p className="mt-1 text-xs text-stone-400">Tên đăng nhập không thể thay đổi.</p>
            </div>

            <div className="space-y-4">
              {fields.map(({ key, label, type, placeholder, icon: Icon, required }) => (
                <div key={key}>
                  <label className="mb-1.5 block text-sm font-medium text-stone-700">{label}</label>
                  <div className="relative">
                    <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                    <Input type={type} required={required} value={form[key]} onChange={patch(key)} placeholder={placeholder} className={inputClass} />
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}
            {success && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <CheckCircle2Icon className="size-4 shrink-0" /> Cập nhật thành công!
              </div>
            )}

            <div className="mt-6 flex gap-3 border-t border-stone-100 pt-5">
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}
                className="h-11 flex-1 rounded-xl border-stone-200 text-sm font-medium text-stone-700 hover:bg-stone-50">
                Huỷ bỏ
              </Button>
              <Button type="submit" disabled={isPending}
                className="h-11 flex-1 rounded-xl border-0 bg-stone-900 text-sm font-semibold text-white shadow-md hover:bg-stone-800 disabled:opacity-60">
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Đang lưu...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">Lưu thay đổi <ArrowRightIcon className="size-4" /></span>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
