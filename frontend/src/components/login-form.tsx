 "use client"

import { cn } from "@/lib/utils"
import { login } from "@/lib/api"
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
            : "Khong the dang nhap luc nay",
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
          <h1 className="text-2xl font-bold">Dang nhap quan tri cua hang</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Su dung tai khoan backend de vao khu quan ly san pham va nguoi dung
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="username">Ten dang nhap</FieldLabel>
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
            <FieldLabel htmlFor="password">Mat khau</FieldLabel>
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
            {isPending ? "Dang xu ly..." : "Dang nhap"}
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button variant="outline" type="button" asChild>
            <Link href="/">
              Xem giao dien cua hang
            </Link>
          </Button>
          <FieldDescription className="text-center">
            Chua co tai khoan?{" "}
            <Link href="/signup" className="underline underline-offset-4">
              Dang ky ngay
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
