 "use client"

import { cn } from "@/lib/utils"
import { register } from "@/lib/api"
import { saveUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
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
      setError("Mat khau xac nhan khong khop")
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
            : "Khong the dang ky luc nay",
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
          <h1 className="text-2xl font-bold">Tao tai khoan quan tri</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Dien thong tin co ban de tao tai khoan va thu nghiem API backend
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="username">Ten dang nhap</FieldLabel>
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
          <FieldDescription>
            Email nay se duoc gui len API `register` cua backend.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="phone">So dien thoai</FieldLabel>
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
          <FieldLabel htmlFor="address">Dia chi</FieldLabel>
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
          <FieldLabel htmlFor="password">Password</FieldLabel>
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
          <FieldDescription>
            Backend dang validate toi thieu 6 ky tu.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
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
          <FieldDescription>Nhap lai mat khau de xac nhan.</FieldDescription>
        </Field>
        {error ? (
          <FieldDescription className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </FieldDescription>
        ) : null}
        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Dang tao tai khoan..." : "Tao tai khoan"}
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button variant="outline" type="button" asChild>
            <Link href="/">
              Quay ve trang san pham
            </Link>
          </Button>
          <FieldDescription className="px-6 text-center">
            Da co tai khoan?{" "}
            <Link href="/login" className="underline underline-offset-4">
              Dang nhap
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
