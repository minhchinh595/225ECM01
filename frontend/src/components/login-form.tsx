"use client"

import { AuthGoogleContinue } from "@/components/auth-google-continue"
import { cn } from "@/lib/utils"
import { login } from "@/lib/api"
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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const [tenDangNhap, setTenDangNhap] = useState("")
  const [matKhau, setMatKhau] = useState("")
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    startTransition(async () => {
      try {
        const response = await login({ tenDangNhap, matKhau })
        saveUser(response.user)
        router.push("/dashboard")
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Không thể đăng nhập lúc này",
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
          <h1 className="text-2xl font-bold">Đăng nhập</h1>
        </div>
        <Field>
          <FieldLabel htmlFor="username">Tên đăng nhập</FieldLabel>
          <Input
            id="username"
            type="text"
            placeholder="admin01"
            required
            className="bg-background"
            value={tenDangNhap}
            onChange={(event) => setTenDangNhap(event.target.value)}
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
          </div>
          <Input
            id="password"
            type="password"
            required
            className="bg-background"
            value={matKhau}
            onChange={(event) => setMatKhau(event.target.value)}
          />
        </Field>
        {error ? (
          <FieldDescription className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </FieldDescription>
        ) : null}
        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Đang xử lý..." : "Đăng nhập"}
          </Button>
        </Field>
        <AuthGoogleContinue className="-mt-1" />
        <Field>
          <FieldDescription className="text-center">
            Chưa có tài khoản?{" "}
            <Link href="/signup" className="underline underline-offset-4">
              Đăng ký ngay
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
