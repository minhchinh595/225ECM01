"use client"

import { AuthGoogleContinue } from "@/components/auth-google-continue"
import { cn } from "@/lib/utils"
import { register } from "@/lib/api"
import { saveUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  LockKeyholeIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from "lucide-react"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const [form, setForm] = useState({
    tenDangNhap: "",
    email: "",
    soDienThoai: "",
    diaChi: "",
    matKhau: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  const patch = (key: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setForm((current) => ({ ...current, [key]: event.target.value }))

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    if (form.matKhau !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
      return
    }

    startTransition(async () => {
      try {
        const user = await register({
          tenDangNhap: form.tenDangNhap,
          matKhau: form.matKhau,
          email: form.email,
          soDienThoai: form.soDienThoai,
          diaChi: form.diaChi,
        })
        saveUser(user)
        // Đăng ký tự động là khách hàng (maVaiTro = 3) → về trang chủ
        router.push("/")
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Không thể đăng ký lúc này",
        )
      }
    })
  }

  const inputClass =
    "h-9 rounded-xl border-stone-200 bg-stone-50/80 pl-10 text-sm shadow-sm transition focus-visible:border-amber-300/70 focus-visible:bg-white focus-visible:ring-amber-200/40"

  const fields = [
    {
      id: "username",
      label: "Tên đăng nhập",
      type: "text",
      placeholder: "thuongmai_user",
      icon: UserIcon,
      key: "tenDangNhap" as const,
      required: true,
    },
    {
      id: "email",
      label: "Email",
      type: "email",
      placeholder: "ban@example.com",
      icon: MailIcon,
      key: "email" as const,
      required: true,
    },
    {
      id: "phone",
      label: "Số điện thoại",
      type: "text",
      placeholder: "0901 234 567",
      icon: PhoneIcon,
      key: "soDienThoai" as const,
      required: true,
    },
    {
      id: "address",
      label: "Địa chỉ",
      type: "text",
      placeholder: "123 Nguyễn Trãi, Hà Nội",
      icon: MapPinIcon,
      key: "diaChi" as const,
      required: false,
    },
    {
      id: "password",
      label: "Mật khẩu",
      type: "password",
      placeholder: "••••••••",
      icon: LockKeyholeIcon,
      key: "matKhau" as const,
      required: true,
    },
    {
      id: "confirm-password",
      label: "Xác nhận mật khẩu",
      type: "password",
      placeholder: "••••••••",
      icon: ShieldCheckIcon,
      key: "confirmPassword" as const,
      required: true,
    },
  ]

  return (
    <form
      className={cn("flex flex-col gap-3", className)}
      onSubmit={onSubmit}
      {...props}
    >
      {/* Header */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200 via-rose-100 to-violet-200 shadow-md ring-1 ring-white/80">
          <span className="font-heading text-lg font-bold tracking-tight text-stone-800">T</span>
        </div>
        <h1 className="font-heading text-xl font-semibold tracking-tight text-stone-900">
          Tạo tài khoản
        </h1>
        <p className="text-xs text-stone-500">Tham gia cộng đồng thời trang Việt</p>
      </div>

      <FieldGroup className="gap-2.5">
        {fields.map(({ id, label, type, placeholder, icon: Icon, key, required }) => (
          <Field key={id}>
            <FieldLabel htmlFor={id} className="text-xs font-medium text-stone-700">
              {label}
            </FieldLabel>
            <div className="relative mt-0.5">
              <Icon className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-stone-400" />
              <Input
                id={id}
                type={type}
                placeholder={placeholder}
                required={required}
                className={inputClass}
                value={form[key]}
                onChange={patch(key)}
              />
            </div>
          </Field>
        ))}

        {/* Error */}
        {error ? (
          <FieldDescription className="rounded-xl border border-destructive/30 bg-destructive/8 px-3 py-2 text-xs text-destructive">
            {error}
          </FieldDescription>
        ) : null}

        {/* Submit */}
        <Field>
          <Button
            type="submit"
            disabled={isPending}
            className="h-10 w-full rounded-xl border-0 bg-stone-900 text-sm font-semibold text-white shadow-lg shadow-stone-900/20 transition hover:bg-stone-800 hover:shadow-xl disabled:opacity-60"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Đang tạo tài khoản...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Tạo tài khoản
                <ArrowRightIcon className="size-3.5" />
              </span>
            )}
          </Button>
        </Field>

        {/* Social */}
        <AuthGoogleContinue className="-mt-0.5" />

        {/* Footer link */}
        <p className="text-center text-xs text-stone-500">
          Đã có tài khoản?{" "}
          <Link href="/login" className="font-semibold text-stone-900 underline-offset-4 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </FieldGroup>
    </form>
  )
}
