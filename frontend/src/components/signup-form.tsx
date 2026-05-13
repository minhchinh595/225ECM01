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
        router.push("/dashboard")
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Không thể đăng ký lúc này",
        )
      }
    })
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={onSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Tạo tài khoản</h1>
        </div>
        <Field>
          <FieldLabel htmlFor="username">Tên đăng nhập</FieldLabel>
          <Input
            id="username"
            type="text"
            placeholder="thuongmai_admin"
            required
            className="bg-background"
            value={form.tenDangNhap}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                tenDangNhap: event.target.value,
              }))
            }
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            className="bg-background"
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                email: event.target.value,
              }))
            }
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="phone">Số điện thoại</FieldLabel>
          <Input
            id="phone"
            type="text"
            placeholder="0901234567"
            required
            className="bg-background"
            value={form.soDienThoai}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                soDienThoai: event.target.value,
              }))
            }
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="address">Địa chỉ</FieldLabel>
          <Input
            id="address"
            type="text"
            placeholder="123 Nguyen Trai, Ha Noi"
            className="bg-background"
            value={form.diaChi}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                diaChi: event.target.value,
              }))
            }
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
          <Input
            id="password"
            type="password"
            required
            className="bg-background"
            value={form.matKhau}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                matKhau: event.target.value,
              }))
            }
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Xác nhận mật khẩu</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            required
            className="bg-background"
            value={form.confirmPassword}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                confirmPassword: event.target.value,
              }))
            }
          />
          <FieldDescription>Nhập lại mật khẩu để xác nhận.</FieldDescription>
        </Field>
        {error ? (
          <FieldDescription className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </FieldDescription>
        ) : null}
        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
          </Button>
        </Field>
        <AuthGoogleContinue className="-mt-1" />
        <Field>
          <FieldDescription className="px-6 text-center">
            Đã có tài khoản?{" "}
            <Link href="/login" className="underline underline-offset-4">
              Đăng nhập
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
