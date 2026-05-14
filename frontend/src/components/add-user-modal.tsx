"use client"

import { useEffect, useState, useTransition } from "react"
import { register } from "@/lib/api"
import type { NguoiDung } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  XIcon, UserIcon, MailIcon, PhoneIcon, MapPinIcon,
  LockKeyholeIcon, ShieldIcon, EyeIcon, EyeOffIcon,
  UserPlusIcon, CheckCircle2Icon,
} from "lucide-react"

// ── Field error type ──────────────────────────────────────────
type FieldErrors = Partial<Record<
  "tenDangNhap" | "matKhau" | "email" | "soDienThoai" | "diaChi" | "maVaiTro",
  string
>>

// ── Validate ──────────────────────────────────────────────────
function validate(form: {
  tenDangNhap: string; matKhau: string; email: string
  soDienThoai: string; diaChi: string; maVaiTro: string
}): FieldErrors {
  const errors: FieldErrors = {}
  if (!form.tenDangNhap.trim()) errors.tenDangNhap = "Tên đăng nhập không được để trống"
  else if (form.tenDangNhap.length < 3) errors.tenDangNhap = "Tối thiểu 3 ký tự"
  if (!form.email.trim()) errors.email = "Email không được để trống"
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Email không hợp lệ"
  if (!form.soDienThoai.trim()) errors.soDienThoai = "Số điện thoại không được để trống"
  if (!form.matKhau) errors.matKhau = "Mật khẩu không được để trống"
  else if (form.matKhau.length < 6) errors.matKhau = "Mật khẩu tối thiểu 6 ký tự"
  if (!form.maVaiTro) errors.maVaiTro = "Vui lòng chọn vai trò"
  return errors
}

// ── Input wrapper ─────────────────────────────────────────────
function FormField({
  label, error, children,
}: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
        {label}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <span className="size-1.5 rounded-full bg-red-400 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

const inputClass = (hasError?: string) =>
  `h-11 rounded-xl border text-sm shadow-sm transition-all duration-200 pl-10
   focus-visible:ring-2 focus-visible:ring-offset-0
   ${hasError
     ? "border-red-300 bg-red-50/50 focus-visible:border-red-400 focus-visible:ring-red-200/50"
     : "border-stone-200 bg-stone-50/80 focus-visible:border-violet-400 focus-visible:bg-white focus-visible:ring-violet-200/40"
   }`

// ── Main Modal ────────────────────────────────────────────────
export function AddUserModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean
  onClose: () => void
  onCreated: (user: NguoiDung) => void
}) {
  const [form, setForm] = useState({
    tenDangNhap: "", matKhau: "", email: "",
    soDienThoai: "", diaChi: "", maVaiTro: "",
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Reset khi mở lại
  useEffect(() => {
    if (open) {
      setForm({ tenDangNhap: "", matKhau: "", email: "", soDienThoai: "", diaChi: "", maVaiTro: "" })
      setErrors({}); setTouched({}); setServerError(""); setSuccess(false)
    }
  }, [open])

  // Escape key
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", h)
    return () => window.removeEventListener("keydown", h)
  }, [open, onClose])

  const patch = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const val = e.target.value
      setForm(f => ({ ...f, [key]: val }))
      // Realtime validate khi đã touch
      if (touched[key]) {
        const errs = validate({ ...form, [key]: val })
        setErrors(prev => ({ ...prev, [key]: errs[key as keyof FieldErrors] }))
      }
    }

  const blur = (key: string) => () => {
    setTouched(t => ({ ...t, [key]: true }))
    const errs = validate(form)
    setErrors(prev => ({ ...prev, [key]: errs[key as keyof FieldErrors] }))
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Touch all fields
    const allTouched = Object.keys(form).reduce((a, k) => ({ ...a, [k]: true }), {})
    setTouched(allTouched)
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setServerError("")
    startTransition(async () => {
      try {
        const created = await register({
          tenDangNhap: form.tenDangNhap.trim(),
          matKhau: form.matKhau,
          email: form.email.trim(),
          soDienThoai: form.soDienThoai.trim(),
          diaChi: form.diaChi.trim() || undefined,
          maVaiTro: Number(form.maVaiTro),
        })
        setSuccess(true)
        onCreated(created as NguoiDung)
        setTimeout(onClose, 1400)
      } catch (err) {
        setServerError(err instanceof Error ? err.message : "Tạo tài khoản thất bại")
      }
    })
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal
      aria-label="Thêm tài khoản"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-950/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Panel — slide-up animation via CSS */}
      <div
        className="relative z-10 w-full max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-300"
      >
        <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_32px_80px_-16px_rgba(28,25,23,0.28)]">

          {/* ── Header ── */}
          <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 px-7 pb-6 pt-7">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,255,255,0.18),transparent)]"
              aria-hidden
            />
            {/* Decorative circles */}
            <div className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-white/5" aria-hidden />
            <div className="pointer-events-none absolute -bottom-12 -left-6 size-32 rounded-full bg-white/5" aria-hidden />

            <div className="relative flex items-start justify-between">
              <div>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/30 backdrop-blur-sm">
                  <UserPlusIcon className="size-6 text-white" />
                </div>
                <h2 className="font-heading text-xl font-semibold text-white">Thêm tài khoản</h2>
                <p className="mt-1 text-sm text-white/65">Tạo tài khoản mới cho nhân viên hoặc khách hàng.</p>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
                aria-label="Đóng"
              >
                <XIcon className="size-4" />
              </button>
            </div>
          </div>

          {/* ── Form ── */}
          <form onSubmit={onSubmit} noValidate className="px-7 py-6">
            {/* 2-col grid on desktop */}
            <div className="grid gap-4 sm:grid-cols-2">

              {/* Tên đăng nhập */}
              <FormField label="Tên đăng nhập *" error={errors.tenDangNhap}>
                <div className="relative">
                  <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                  <Input
                    value={form.tenDangNhap}
                    onChange={patch("tenDangNhap")}
                    onBlur={blur("tenDangNhap")}
                    placeholder="nhanvien01"
                    className={inputClass(errors.tenDangNhap)}
                  />
                </div>
              </FormField>

              {/* Vai trò */}
              <FormField label="Vai trò *" error={errors.maVaiTro}>
                <div className="relative">
                  <ShieldIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                  <select
                    value={form.maVaiTro}
                    onChange={patch("maVaiTro")}
                    onBlur={blur("maVaiTro")}
                    className={`w-full pl-10 pr-4 ${inputClass(errors.maVaiTro)} appearance-none`}
                  >
                    <option value="">-- Chọn vai trò --</option>
                    <option value="2">Nhân viên</option>
                    <option value="3">Khách hàng</option>
                  </select>
                </div>
              </FormField>

              {/* Email */}
              <FormField label="Email *" error={errors.email}>
                <div className="relative">
                  <MailIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                  <Input
                    type="email"
                    value={form.email}
                    onChange={patch("email")}
                    onBlur={blur("email")}
                    placeholder="nhanvien@example.com"
                    className={inputClass(errors.email)}
                  />
                </div>
              </FormField>

              {/* Số điện thoại */}
              <FormField label="Số điện thoại *" error={errors.soDienThoai}>
                <div className="relative">
                  <PhoneIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                  <Input
                    value={form.soDienThoai}
                    onChange={patch("soDienThoai")}
                    onBlur={blur("soDienThoai")}
                    placeholder="0901 234 567"
                    className={inputClass(errors.soDienThoai)}
                  />
                </div>
              </FormField>

              {/* Mật khẩu */}
              <FormField label="Mật khẩu *" error={errors.matKhau}>
                <div className="relative">
                  <LockKeyholeIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={form.matKhau}
                    onChange={patch("matKhau")}
                    onBlur={blur("matKhau")}
                    placeholder="Tối thiểu 6 ký tự"
                    className={`${inputClass(errors.matKhau)} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 transition hover:text-stone-600"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                  </button>
                </div>
                {/* Password strength */}
                {form.matKhau.length > 0 && (
                  <div className="mt-2 flex items-center gap-1.5">
                    {[1, 2, 3, 4].map(i => {
                      const score = form.matKhau.length < 4 ? 1 : form.matKhau.length < 7 ? 2 : form.matKhau.length < 10 ? 3 : 4
                      return (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= score
                            ? score <= 1 ? "bg-red-400" : score <= 2 ? "bg-amber-400" : score <= 3 ? "bg-yellow-400" : "bg-emerald-400"
                            : "bg-stone-200"
                        }`} />
                      )
                    })}
                    <span className="text-[10px] text-stone-400 w-16 shrink-0">
                      {form.matKhau.length < 4 ? "Yếu" : form.matKhau.length < 7 ? "Trung bình" : form.matKhau.length < 10 ? "Mạnh" : "Rất mạnh"}
                    </span>
                  </div>
                )}
              </FormField>

              {/* Địa chỉ — full width */}
              <div className="sm:col-span-2">
                <FormField label="Địa chỉ" error={errors.diaChi}>
                  <div className="relative">
                    <MapPinIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                    <Input
                      value={form.diaChi}
                      onChange={patch("diaChi")}
                      onBlur={blur("diaChi")}
                      placeholder="123 Nguyễn Trãi, Hà Nội (không bắt buộc)"
                      className={inputClass(errors.diaChi)}
                    />
                  </div>
                </FormField>
              </div>
            </div>

            {/* Server error */}
            {serverError && (
              <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                <span className="mt-0.5 size-4 shrink-0 rounded-full bg-red-400 text-white flex items-center justify-center text-[10px] font-bold">!</span>
                <p className="text-sm text-red-700">{serverError}</p>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mt-4 flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <CheckCircle2Icon className="size-4 shrink-0 text-emerald-600" />
                <p className="text-sm font-medium text-emerald-700">Tạo tài khoản thành công!</p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex gap-3 border-t border-stone-100 pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
                className="h-11 flex-1 rounded-xl border-stone-200 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50"
              >
                Huỷ bỏ
              </Button>
              <Button
                type="submit"
                disabled={isPending || success}
                className="h-11 flex-1 rounded-xl border-0 bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:from-violet-700 hover:to-indigo-700 hover:shadow-xl disabled:opacity-60"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Đang tạo...
                  </span>
                ) : success ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2Icon className="size-4" /> Đã tạo!
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UserPlusIcon className="size-4" /> Tạo tài khoản
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
