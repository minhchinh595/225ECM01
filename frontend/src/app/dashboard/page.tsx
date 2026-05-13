"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getBrands, getCategories, getProducts, getUsers } from "@/lib/api"
import { getStoredUser } from "@/lib/auth"
import type { DanhMuc, NguoiDung, SanPham, ThuongHieu } from "@/lib/types"
import Link from "next/link"
import {
  PackageIcon,
  ShapesIcon,
  TagsIcon,
  UsersIcon,
  ArrowRightIcon,
  TrendingUpIcon,
} from "lucide-react"
import { useEffect, useState } from "react"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
}

export default function DashboardPage() {
  const [products, setProducts] = useState<SanPham[]>([])
  const [categories, setCategories] = useState<DanhMuc[]>([])
  const [brands, setBrands] = useState<ThuongHieu[]>([])
  const [users, setUsers] = useState<NguoiDung[]>([])
  const [currentUser, setCurrentUser] = useState<NguoiDung | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    setCurrentUser(getStoredUser())
    let active = true

    async function load() {
      try {
        const [p, c, b, u] = await Promise.all([
          getProducts(), getCategories(), getBrands(), getUsers(),
        ])
        if (!active) return
        setProducts(p); setCategories(c); setBrands(b); setUsers(u)
      } catch (err) {
        if (!active) return
        setError(err instanceof Error ? err.message : "Không thể tải dữ liệu")
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => { active = false }
  }, [])

  const displayName = currentUser?.hoTen?.trim() || currentUser?.tenDangNhap || "Admin"

  const stats = [
    {
      title: "Sản phẩm",
      value: products.length,
      icon: PackageIcon,
      bg: "bg-stone-950",
      text: "text-white",
      iconBg: "bg-white/15",
      link: "/dashboard/san-pham",
    },
    {
      title: "Danh mục",
      value: categories.length,
      icon: ShapesIcon,
      bg: "bg-amber-50",
      text: "text-amber-900",
      iconBg: "bg-amber-200/50",
      link: "/dashboard/san-pham",
    },
    {
      title: "Thương hiệu",
      value: brands.length,
      icon: TagsIcon,
      bg: "bg-emerald-50",
      text: "text-emerald-900",
      iconBg: "bg-emerald-200/50",
      link: "/dashboard/thuong-hieu",
    },
    {
      title: "Người dùng",
      value: users.length,
      icon: UsersIcon,
      bg: "bg-rose-50",
      text: "text-rose-900",
      iconBg: "bg-rose-200/50",
      link: "/dashboard/nguoi-dung",
    },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      {/* Welcome banner */}
      <section className="overflow-hidden rounded-[2rem] border border-stone-200/60 bg-white/85 shadow-[0_20px_60px_rgba(88,62,39,0.08)] backdrop-blur">
        <div className="relative px-7 py-7 sm:px-8 sm:py-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_80%_50%,rgba(251,191,36,0.08),transparent)]" aria-hidden />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">
                Quản lý hệ thống
              </p>
              <h1 className="font-heading mt-2 text-2xl font-semibold text-stone-900 sm:text-3xl">
                Xin chào, {displayName} 👋
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-500">
                Đây là bảng điều khiển trung tâm. Bạn có thể quản lý sản phẩm, đơn hàng, người dùng và theo dõi doanh thu tại đây.
              </p>
            </div>
            <Button asChild className="shrink-0 rounded-full bg-stone-900 px-6 text-white hover:bg-stone-800">
              <Link href="/" className="inline-flex items-center gap-2">
                Xem trang chủ
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.link}>
            <Card className={`group rounded-[1.75rem] border-none shadow-[0_12px_32px_rgba(96,74,44,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(96,74,44,0.12)] ${stat.bg}`}>
              <CardContent className={`flex items-center justify-between p-6 ${stat.text}`}>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] opacity-60">
                    {stat.title}
                  </p>
                  <p className="mt-3 font-heading text-4xl font-semibold">
                    {loading ? "…" : stat.value}
                  </p>
                </div>
                <div className={`rounded-2xl p-3 ${stat.iconBg}`}>
                  <stat.icon className="size-6" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      {/* Main content */}
      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        {/* Products list */}
        <Card className="rounded-[1.75rem] border-none bg-white/85 shadow-[0_12px_32px_rgba(96,74,44,0.08)]">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="font-heading text-lg font-semibold text-stone-900">
              Sản phẩm mới nhất
            </CardTitle>
            <Button asChild variant="ghost" size="sm" className="rounded-full text-stone-500 hover:text-stone-900">
              <Link href="/dashboard/san-pham" className="inline-flex items-center gap-1.5 text-xs">
                Xem tất cả <ArrowRightIcon className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-14 animate-pulse rounded-2xl bg-stone-100" />
                ))
              : products.slice(0, 6).map((product) => (
                  <div
                    key={product.maSanPham}
                    className="flex items-center justify-between rounded-2xl border border-stone-100 bg-stone-50/60 px-4 py-3 transition hover:border-stone-200 hover:bg-white"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-stone-900">{product.tenSanPham}</p>
                      <p className="text-xs text-stone-400">{product.tenDanhMuc} · {product.tenThuongHieu}</p>
                    </div>
                    <div className="ml-4 shrink-0 text-right">
                      <p className="text-sm font-semibold text-rose-700">{formatCurrency(product.gia)}</p>
                      <p className="text-xs text-stone-400">Tồn {product.soLuongTon}</p>
                    </div>
                  </div>
                ))}
            {!loading && products.length === 0 && (
              <p className="py-4 text-center text-sm text-stone-400">Chưa có sản phẩm nào.</p>
            )}
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* Categories */}
          <Card className="rounded-[1.75rem] border-none bg-white/85 shadow-[0_12px_32px_rgba(96,74,44,0.08)]">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-base font-semibold text-stone-900">Danh mục</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-stone-100" />
                  ))
                : categories.map((cat) => (
                    <span
                      key={cat.maDanhMuc}
                      className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-700"
                    >
                      {cat.tenDanhMuc}
                    </span>
                  ))}
            </CardContent>
          </Card>

          {/* Recent users */}
          <Card className="rounded-[1.75rem] border-none bg-white/85 shadow-[0_12px_32px_rgba(96,74,44,0.08)]">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="font-heading text-base font-semibold text-stone-900">Người dùng gần đây</CardTitle>
              <Button asChild variant="ghost" size="sm" className="rounded-full text-stone-500 hover:text-stone-900">
                <Link href="/dashboard/nguoi-dung" className="inline-flex items-center gap-1.5 text-xs">
                  Xem tất cả <ArrowRightIcon className="size-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-12 animate-pulse rounded-2xl bg-stone-100" />
                  ))
                : users.slice(0, 5).map((user) => (
                    <div
                      key={user.maNguoiDung}
                      className="flex items-center gap-3 rounded-2xl border border-stone-100 bg-stone-50/60 px-3 py-2.5"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-200 via-rose-100 to-violet-200 text-xs font-bold text-stone-800">
                        {user.tenDangNhap.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-stone-900">{user.tenDangNhap}</p>
                        <p className="truncate text-xs text-stone-400">{user.email}</p>
                      </div>
                    </div>
                  ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
