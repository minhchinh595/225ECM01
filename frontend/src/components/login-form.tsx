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
import { UserIcon, LockKeyholeIcon, ArrowRightIcon } from "lucide-react"

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
      className={cn("flex flex-col gap-5", className)}
      onSubmit={onSubmit}
      {...props}
    >
      {/* Header */}
      <div className="mb-1 flex flex-col items-center gap-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200 via-rose-100 to-violet-200 shadow-md ring-1 ring-white/80">
          <span className="font-heading text-xl font-bold tracking-tight text-stone-800">T</span>
        </div>
        <h1 className="font-heading mt-1 text-2xl font-semibold tracking-tight text-stone-900">
          Chào mừng trở lại
        </h1>
        <p className="text-sm text-stone-500">Đăng nhập để tiếp tục khám phá</p>
      </div>

      <FieldGroup className="gap-4">
        {/* Username */}
        <Field>
          <FieldLabel htmlFor="username" className="text-sm font-medium text-stone-700">
            Tên đăng nhập
          </FieldLabel>
          <div className="relative mt-1.5">
            <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
            <Input
              id="username"
              type="text"
              placeholder="admin01"
              required
              className="h-11 rounded-xl border-stone-200 bg-stone-50/80 pl-10 text-sm shadow-sm transition focus-visible:border-amber-300/70 focus-visible:bg-white focus-visible:ring-amber-200/40"
              value={tenDangNhap}
              onChange={(event) => setTenDangNhap(event.target.value)}
            />
          </div>
        </Field>

        {/* Password */}
        <Field>
          <FieldLabel htmlFor="password" className="text-sm font-medium text-stone-700">
            Mật khẩu
          </FieldLabel>
          <div className="relative mt-1.5">
            <LockKeyholeIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
            <Input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              className="h-11 rounded-xl border-stone-200 bg-stone-50/80 pl-10 text-sm shadow-sm transition focus-visible:border-amber-300/70 focus-visible:bg-white focus-visible:ring-amber-200/40"
              value={matKhau}
              onChange={(event) => setMatKhau(event.target.value)}
            />
          </div>
          <div className="mt-1.5 flex justify-end">
            <a href="#" className="text-xs font-medium text-amber-700 hover:text-amber-800 hover:underline">
              Quên mật khẩu?
            </a>
          </div>
        </Field>

        {/* Error */}
        {error ? (
          <FieldDescription className="rounded-xl border border-destructive/30 bg-destructive/8 px-3.5 py-2.5 text-sm text-destructive">
            {error}
          </FieldDescription>
        ) : null}

        {/* Submit */}
        <Field>
          <Button
            type="submit"
            disabled={isPending}
            className="h-11 w-full rounded-xl border-0 bg-stone-900 text-[15px] font-semibold text-white shadow-lg shadow-stone-900/20 transition hover:bg-stone-800 hover:shadow-xl disabled:opacity-60"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Đang xử lý...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Đăng nhập
                <ArrowRightIcon className="size-4" />
              </span>
            )}
          </Button>
        </Field>

        {/* Social */}
        <AuthGoogleContinue className="-mt-1" />

        {/* Footer link */}
        <p className="text-center text-sm text-stone-500">
          Chưa có tài khoản?{" "}
          <Link href="/signup" className="font-semibold text-stone-900 underline-offset-4 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </FieldGroup>
    </form>
  )
}
