"use client"

import { useEffect, useState, useTransition } from "react"
import { register } from "@/lib/api"
import type { NguoiDung } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  XIcon, UserIcon, MailIcon, PhoneIcon, MapPinIcon,
  LockKeyholeIcon, ShieldIcon, EyeIcon, EyeOffIcon,
  UserPlusIcon, CheckCircle2Icon, SparklesIcon,
} from "lucide-react"

// ── Types ─────────────────────────────────────────────────────
type FormState = {
  tenDangNhap: string; matKhau: string; email: string
  soDienThoai: string; diaChi: string; maVaiTro: string
}
type FieldErrors = Partial<Record<keyof FormState, string>>

const EMPTY: FormState = {
  tenDangNhap: "", matKhau: "", email: "",
  soDienThoai: "", diaChi: "", maVaiTro: "",
}

// ── Validation ────────────────────────────────────────────────
function validate(f: FormState): FieldErrors {
  const e: FieldErrors = {}
  if (!f.tenDangNhap.trim())       e.tenDangNhap = "Không được để trống"
  else if (f.tenDangNhap.length < 3) e.tenDangNhap = "Tối thiểu 3 ký tự"
  if (!f.email.trim())             e.email = "Không được để trống"
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Email không hợp lệ"
  if (!f.soDienThoai.trim())       e.soDienThoai = "Không được để trống"
  if (!f.matKhau)                  e.matKhau = "Không được để trống"
  else if (f.matKhau.length < 6)   e.matKhau = "Tối thiểu 6 ký tự"
  if (!f.maVaiTro)                 e.maVaiTro = "Vui lòng chọn vai trò"
  return e
}

function pwStrength(pw: string) {
  if (!pw) return 0
  if (pw.length < 4) return 1
  if (pw.length < 7) return 2
  if (pw.length < 10) return 3
  return 4
}

const STRENGTH_META = [
  { label: "", bar: "" },
  { label: "Yếu",       bar: "bg-red-400" },
  { label: "Trung bình", bar: "bg-amber-400" },
  { label: "Mạnh",      bar: "bg-yellow-400" },
  { label: "Rất mạnh",  bar: "bg-emerald-400" },
]

// ── Sub-components ────────────────────────────────────────────
function FieldWrap({
  label, required, error, children,
}: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1 text-xs font-semibold text-stone-600">
        {label}
        {required && <span className="text-violet-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-[11px] font-medium text-red-500">
          <span className="size-1.5 shrink-0 rounded-full bg-red-400" />
          {error}
        </p>
      )}
    </div>
  )
}

function StyledInput({
  icon: Icon, error, className = "", ...props
}: React.ComponentProps<typeof Input> & {
  icon: React.ElementType; error?: string
}) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
      <Input
        className={`h-11 rounded-xl border pl-10 text-sm shadow-sm transition-all duration-200
          ${error
            ? "border-red-300 bg-red-50/40 focus-visible:border-red-400 focus-visible:ring-red-200/50"
            : "border-stone-200 bg-stone-50/70 focus-visible:border-violet-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-violet-200/50 focus-visible:ring-offset-0"
          } ${className}`}
        {...props}
      />
    </div>
  )
}

// ── Main Modal ────────────────────────────────────────────────
export function AddUserModal({
  open, onClose, onCreated,
}: {
  open: boolean
  onClose: () => void
  onCreated: (user: NguoiDung) => void
}) {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({})
  const [showPw, setShowPw] = useState(false)
  const [serverError, setServerError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Reset on open
  useEffect(() => {
    if (open) {
      setForm(EMPTY); setErrors({}); setTouched({})
      setServerError(""); setSuccess(false); setShowPw(false)
    }
  }, [open])

  // Escape
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", h)
    return () => window.removeEventListener("keydown", h)
  }, [open, onClose])

  const patch = (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const val = e.target.value
      setForm(f => ({ ...f, [key]: val }))
      if (touched[key]) {
        const errs = validate({ ...form, [key]: val })
        setErrors(prev => ({ ...prev, [key]: errs[key] }))
      }
    }

  const touch = (key: keyof FormState) => () => {
    setTouched(t => ({ ...t, [key]: true }))
    setErrors(prev => ({ ...prev, [key]: validate(form)[key] }))
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const allTouched = Object.keys(EMPTY).reduce((a, k) => ({ ...a, [k]: true }), {}) as Record<keyof FormState, boolean>
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
        setTimeout(onClose, 1500)
      } catch (err) {
        setServerError(err instanceof Error ? err.message : "Tạo tài khoản thất bại")
      }
    })
  }

  const strength = pwStrength(form.matKhau)
  const strengthMeta = STRENGTH_META[strength]

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-950/50 backdrop-blur-[6px] animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden
      />

      {/* Sheet on mobile, centered modal on desktop */}
      <div className="relative z-10 w-full sm:max-w-xl animate-in fade-in slide-in-from-bottom-6 duration-300 sm:slide-in-from-bottom-4">
        <div className="overflow-hidden rounded-t-[2rem] border border-white/20 bg-white shadow-[0_-8px_60px_rgba(28,25,23,0.18)] sm:rounded-[2rem] sm:shadow-[0_32px_80px_-16px_rgba(28,25,23,0.28)]">

          {/* ── Header ── */}
          <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 px-6 pb-6 pt-6 sm:px-7 sm:pt-7">
            {/* Decorative */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-10%,rgba(255,255,255,0.15),transparent)]" aria-hidden />
            <div className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-white/5" aria-hidden />
            <div className="pointer-events-none absolute -bottom-16 -left-8 size-40 rounded-full bg-white/5" aria-hidden />

            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/30 backdrop-blur-sm">
                  <UserPlusIcon className="size-6 text-white" />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-semibold text-white">Thêm tài khoản</h2>
                  <p className="mt-0.5 text-sm text-white/60">Tạo tài khoản mới cho hệ thống</p>
                </div>
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
          <form onSubmit={onSubmit} noValidate className="px-6 py-6 sm:px-7">
            <div className="grid gap-4 sm:grid-cols-2">

              {/* Tên đăng nhập */}
              <FieldWrap label="Tên đăng nhập" required error={errors.tenDangNhap}>
                <StyledInput
                  icon={UserIcon}
                  value={form.tenDangNhap}
                  onChange={patch("tenDangNhap")}
                  onBlur={touch("tenDangNhap")}
                  placeholder="nhanvien01"
                  error={errors.tenDangNhap}
                />
              </FieldWrap>

              {/* Vai trò */}
              <FieldWrap label="Vai trò" required error={errors.maVaiTro}>
                <div className="relative">
                  <ShieldIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                  <select
                    value={form.maVaiTro}
                    onChange={patch("maVaiTro")}
                    onBlur={touch("maVaiTro")}
                    className={`h-11 w-full appearance-none rounded-xl border pl-10 pr-4 text-sm shadow-sm transition-all duration-200
                      ${errors.maVaiTro
                        ? "border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-red-200/50"
                        : "border-stone-200 bg-stone-50/70 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-200/50"
                      } focus:outline-none`}
                  >
                    <option value="">-- Chọn vai trò --</option>
                    <option value="2">👔 Nhân viên</option>
                    <option value="3">🛍️ Khách hàng</option>
                  </select>
                </div>
              </FieldWrap>

              {/* Email */}
              <FieldWrap label="Email" required error={errors.email}>
                <StyledInput
                  icon={MailIcon}
                  type="email"
                  value={form.email}
                  onChange={patch("email")}
                  onBlur={touch("email")}
                  placeholder="nhanvien@example.com"
                  error={errors.email}
                />
              </FieldWrap>

              {/* Số điện thoại */}
              <FieldWrap label="Số điện thoại" required error={errors.soDienThoai}>
                <StyledInput
                  icon={PhoneIcon}
                  value={form.soDienThoai}
                  onChange={patch("soDienThoai")}
                  onBlur={touch("soDienThoai")}
                  placeholder="0901 234 567"
                  error={errors.soDienThoai}
                />
              </FieldWrap>

              {/* Mật khẩu */}
              <FieldWrap label="Mật khẩu" required error={errors.matKhau}>
                <div className="relative">
                  <LockKeyholeIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                  <Input
                    type={showPw ? "text" : "password"}
                    value={form.matKhau}
                    onChange={patch("matKhau")}
                    onBlur={touch("matKhau")}
                    placeholder="Tối thiểu 6 ký tự"
                    className={`h-11 rounded-xl border pl-10 pr-11 text-sm shadow-sm transition-all duration-200
                      ${errors.matKhau
                        ? "border-red-300 bg-red-50/40 focus-visible:border-red-400 focus-visible:ring-red-200/50"
                        : "border-stone-200 bg-stone-50/70 focus-visible:border-violet-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-violet-200/50 focus-visible:ring-offset-0"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(s => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 transition hover:text-stone-600"
                    aria-label={showPw ? "Ẩn" : "Hiện"}
                  >
                    {showPw ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                  </button>
                </div>
                {/* Strength bar */}
                {form.matKhau.length > 0 && (
                  <div className="mt-2 flex items-center gap-1.5">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthMeta.bar : "bg-stone-200"}`} />
                    ))}
                    <span className="w-16 shrink-0 text-[10px] text-stone-400">{strengthMeta.label}</span>
                  </div>
                )}
              </FieldWrap>

              {/* Địa chỉ — full width */}
              <div className="sm:col-span-2">
                <FieldWrap label="Địa chỉ" error={errors.diaChi}>
                  <StyledInput
                    icon={MapPinIcon}
                    value={form.diaChi}
                    onChange={patch("diaChi")}
                    onBlur={touch("diaChi")}
                    placeholder="123 Nguyễn Trãi, Hà Nội (không bắt buộc)"
                    error={errors.diaChi}
                  />
                </FieldWrap>
              </div>
            </div>

            {/* Server error */}
            {serverError && (
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-200/80 bg-red-50 px-4 py-3.5">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">!</div>
                <p className="text-sm text-red-700">{serverError}</p>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50 px-4 py-3.5">
                <CheckCircle2Icon className="size-5 shrink-0 text-emerald-600" />
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
                className="h-11 flex-1 rounded-xl border-0 bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:from-violet-700 hover:to-indigo-700 hover:shadow-xl active:scale-[0.98] disabled:opacity-60"
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
                    <SparklesIcon className="size-4" /> Tạo tài khoản
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
