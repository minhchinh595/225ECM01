"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeftIcon,
  LockKeyholeIcon,
  EyeIcon,
  EyeOffIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  ShieldCheckIcon,
} from "lucide-react"
import { getStoredUser } from "@/lib/auth"
import { changePassword } from "@/lib/api"
import type { NguoiDung } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function StrengthBar({ password }: { password: string }) {
  const len = password.length
  const score = len === 0 ? 0 : len < 4 ? 1 : len < 7 ? 2 : len < 10 ? 3 : 4
  const labels = ["", "Yếu", "Trung bình", "Mạnh", "Rất mạnh"]
  const colors = ["", "bg-red-400", "bg-amber-400", "bg-yellow-400", "bg-emerald-400"]
  const textColors = ["", "text-red-500", "text-amber-500", "text-yellow-600", "text-emerald-600"]

  if (len === 0) return null

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i <= score ? colors[score] : "bg-stone-200"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${textColors[score]}`}>{labels[score]}</p>
    </div>
  )
}

export default function ChangePasswordPage() {
  const router = useRouter()
  const [user, setUser] = useState<NguoiDung | null>(null)
  const [form, setForm] = useState({ matKhauCu: "", matKhauMoi: "", confirm: "" })
  const [show, setShow] = useState({ old: false, new: false, confirm: false })
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
  }, [router])

  const patch = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))

  const toggleShow = (key: keyof typeof show) =>
    setShow((s) => ({ ...s, [key]: !s[key] }))

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    if (form.matKhauMoi !== form.confirm) {
      setError("Mật khẩu xác nhận không khớp")
      return
    }
    if (form.matKhauMoi.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự")
      return
    }
    startTransition(async () => {
      try {
        await changePassword(user!.maNguoiDung, {
          matKhauCu: form.matKhauCu,
          matKhauMoi: form.matKhauMoi,
        })
        setSuccess(true)
        setForm({ matKhauCu: "", matKhauMoi: "", confirm: "" })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đổi mật khẩu thất bại")
      }
    })
  }

  if (!user) return null

  const pwFields = [
    {
      key: "matKhauCu" as const,
      showKey: "old" as const,
      label: "Mật khẩu hiện tại",
      placeholder: "Nhập mật khẩu hiện tại",
      hint: null,
    },
    {
      key: "matKhauMoi" as const,
      showKey: "new" as const,
      label: "Mật khẩu mới",
      placeholder: "Tối thiểu 6 ký tự",
      hint: "strength",
    },
    {
      key: "confirm" as const,
      showKey: "confirm" as const,
      label: "Xác nhận mật khẩu mới",
      placeholder: "Nhập lại mật khẩu mới",
      hint: null,
    },
  ]

  return (
    <div className="min-h-svh bg-[linear-gradient(150deg,#fdf8f2_0%,#f0e8f5_55%,#ddd0ec_100%)]">
      {/* Decorative blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-200/30 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-amber-200/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-rose-100/25 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-lg px-4 py-10 sm:px-6 sm:py-14">
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
          <div className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-rose-50/60 to-amber-50/40 px-8 pb-7 pt-8 sm:px-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(167,139,250,0.15),transparent)]" aria-hidden />

            <div className="relative flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-200 via-rose-100 to-amber-200 shadow-md ring-2 ring-white/80">
                <LockKeyholeIcon className="size-7 text-stone-700" />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                  Đổi mật khẩu
                </h1>
                <p className="mt-0.5 text-sm text-stone-500">@{user.tenDangNhap}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="px-8 py-8 sm:px-10">
            <div className="mb-6">
              <h2 className="font-heading text-lg font-semibold text-stone-900">Bảo mật tài khoản</h2>
              <p className="mt-1 text-sm text-stone-500">
                Chọn mật khẩu mạnh, không dùng lại mật khẩu từ các trang khác.
              </p>
            </div>

            <div className="space-y-5">
              {pwFields.map(({ key, showKey, label, placeholder, hint }) => (
                <div key={key}>
                  <label className="mb-2 block text-sm font-medium text-stone-700">{label}</label>
                  <div className="relative">
                    <LockKeyholeIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                    <Input
                      type={show[showKey] ? "text" : "password"}
                      required
                      value={form[key]}
                      onChange={patch(key)}
                      placeholder={placeholder}
                      className="h-12 rounded-2xl border-stone-200 bg-white/80 pl-11 pr-12 text-sm shadow-sm transition focus-visible:border-violet-300/70 focus-visible:bg-white focus-visible:ring-violet-200/40"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShow(showKey)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 transition hover:text-stone-600"
                      aria-label={show[showKey] ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {show[showKey] ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                    </button>
                  </div>
                  {hint === "strength" && <StrengthBar password={form.matKhauMoi} />}
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className="mt-6 rounded-2xl border border-violet-100 bg-violet-50/60 px-4 py-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-violet-700">
                Gợi ý mật khẩu mạnh
              </p>
              <ul className="space-y-1.5">
                {[
                  "Ít nhất 8 ký tự",
                  "Kết hợp chữ hoa, chữ thường và số",
                  "Thêm ký tự đặc biệt (!@#$...)",
                ].map((tip) => (
                  <li key={tip} className="flex items-center gap-2 text-xs text-violet-600">
                    <ShieldCheckIcon className="size-3.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
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
                Đổi mật khẩu thành công! Hãy dùng mật khẩu mới cho lần đăng nhập tiếp theo.
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
                    Xác nhận đổi mật khẩu
                    <ArrowRightIcon className="size-4" />
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
