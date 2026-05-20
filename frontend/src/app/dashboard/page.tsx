"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getBrands, getCategories, getOrders, getProducts, getUsers, getMaGiamGia } from "@/lib/api"
import type { DanhMuc, DonHang, NguoiDung, SanPham, ThuongHieu } from "@/lib/types"
import Link from "next/link"
import {
  PackageIcon,
  ShapesIcon,
  TagsIcon,
  UsersIcon,
  ArrowRightIcon,
  TrendingUpIcon,
  DollarSignIcon,
  ShoppingCartIcon,
  Clock3Icon,
  CheckCircle2Icon,
  TruckIcon,
  TicketPercentIcon,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
}

function getStatusInfo(status?: string | null) {
  const key = (status ?? "").trim().toLowerCase()
  if (key.includes("da giao") || key.includes("da thanh toan"))
    return { label: "Hoàn tất", icon: CheckCircle2Icon, color: "text-emerald-600", bg: "bg-emerald-50" }
  if (key.includes("dang giao"))
    return { label: "Đang giao", icon: TruckIcon, color: "text-violet-600", bg: "bg-violet-50" }
  if (key.includes("cho xac nhan"))
    return { label: "Chờ duyệt", icon: Clock3Icon, color: "text-amber-600", bg: "bg-amber-50" }
  if (key.includes("dang xu ly"))
    return { label: "Đang xử lý", icon: TrendingUpIcon, color: "text-blue-600", bg: "bg-blue-50" }
  return { label: status ?? "Chưa rõ", icon: Clock3Icon, color: "text-stone-400", bg: "bg-stone-50" }
}

function StatCard({ icon: Icon, title, value, link, accent, subtitle }: {
  icon: React.ElementType; title: string; value: string | number; link: string; accent: string; subtitle?: string
}) {
  return (
    <Link href={link}>
      <div className="group relative flex h-28 flex-col justify-between overflow-hidden rounded-2xl border border-stone-100 bg-white/80 p-5 shadow-[0_4px_16px_-6px_rgba(0,0,0,0.06)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_-8px_rgba(0,0,0,0.10)]">
        <div className={`absolute inset-y-0 left-0 w-1 rounded-r-full ${accent} transition-all duration-300 group-hover:w-1.5`} />
        <div className="flex items-start justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-400">{title}</p>
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${accent} bg-opacity-10`}>
            <Icon className={`size-4 ${accent.replace("bg-", "text-")}`} strokeWidth={1.8} />
          </div>
        </div>
        <div>
          <p className="font-heading text-3xl font-semibold tracking-tight text-stone-900">{value}</p>
          {subtitle && <p className="mt-0.5 text-xs text-stone-400">{subtitle}</p>}
        </div>
      </div>
    </Link>
  )
}

function MiniProductRow({ product }: { product: SanPham }) {
  const src = product.hinhAnh?.trim()
  const lowStock = product.soLuongTon <= 5
  return (
    <div className="group flex items-center justify-between rounded-xl border border-stone-100 bg-white/60 px-3.5 py-2.5 shadow-sm transition hover:border-stone-200 hover:bg-white hover:shadow-md">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-stone-100">
          {src ? <img src={src} alt={product.tenSanPham} className="h-full w-full object-cover" /> : <PackageIcon className="size-4 text-stone-300" />}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-stone-900">{product.tenSanPham}</p>
          <p className="truncate text-xs text-stone-400">{product.tenDanhMuc}</p>
        </div>
      </div>
      <div className="ml-3 flex items-center gap-3 shrink-0">
        <span className={`text-xs font-semibold ${lowStock ? "text-amber-600" : "text-emerald-600"}`}>{product.soLuongTon} tồn</span>
        <span className="text-sm font-semibold text-rose-700">{formatCurrency(product.gia)}</span>
      </div>
    </div>
  )
}

function OrderRow({ order }: { order: DonHang }) {
  const info = getStatusInfo(order.trangThai)
  const StatusIcon = info.icon
  const count = order.chiTiet?.length ?? 0
  return (
    <div className="flex items-center justify-between rounded-xl border border-stone-100 bg-white/60 px-3.5 py-3 shadow-sm transition hover:border-stone-200 hover:bg-white hover:shadow-md">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${info.bg}`}>
          <StatusIcon className={`size-4.5 ${info.color}`} strokeWidth={1.8} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-stone-900">#{order.maDonHang}</p>
          <p className="truncate text-xs text-stone-400">{count} sản phẩm</p>
        </div>
      </div>
      <div className="ml-3 text-right shrink-0">
        <p className="text-sm font-semibold text-rose-700">{formatCurrency(order.tongTien ?? 0)}</p>
        <p className={`text-xs font-medium ${info.color}`}>{info.label}</p>
      </div>
    </div>
  )
}

function UserRow({ user }: { user: NguoiDung }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-stone-100 bg-white/60 px-3 py-2.5 shadow-sm transition hover:border-stone-200 hover:bg-white hover:shadow-md">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-200 via-rose-100 to-violet-200 text-xs font-bold text-stone-800 shadow-sm ring-1 ring-white">
        {user.tenDangNhap.slice(0, 2).toUpperCase()}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-stone-900">{user.tenDangNhap}</p>
        <p className="truncate text-xs text-stone-400">{user.email}</p>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [products, setProducts] = useState<SanPham[]>([])
  const [categories, setCategories] = useState<DanhMuc[]>([])
  const [brands, setBrands] = useState<ThuongHieu[]>([])
  const [users, setUsers] = useState<NguoiDung[]>([])
  const [orders, setOrders] = useState<DonHang[]>([])
  const [couponCount, setCouponCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const [p, c, b, u, o, coupons] = await Promise.all([
          getProducts(), getCategories(), getBrands(), getUsers(),
          getOrders().catch(() => [] as DonHang[]),
          getMaGiamGia().catch(() => []),
        ])
        if (!active) return
        setProducts(p); setCategories(c); setBrands(b); setUsers(u); setOrders(o)
        setCouponCount(coupons.length)
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

  const { totalRevenue, pendingOrders } = useMemo(() => {
    const completed = orders.filter((o) => {
      const s = (o.trangThai ?? "").trim().toLowerCase()
      return s.includes("da giao") || s.includes("da thanh toan")
    })
    return {
      totalRevenue: completed.reduce((sum, o) => sum + (o.tongTien ?? 0), 0),
      pendingOrders: orders.filter((o) => {
        const s = (o.trangThai ?? "").trim().toLowerCase()
        return s.includes("cho xac nhan")
      }).length,
    }
  }, [orders])

  const stats = [
    { icon: PackageIcon, title: "Sản phẩm", value: products.length, link: "/dashboard/san-pham", accent: "bg-stone-900", subtitle: `${products.filter((p) => p.soLuongTon <= 5).length} sắp hết` },
    { icon: ShoppingCartIcon, title: "Đơn hàng", value: orders.length, link: "/dashboard/don-hang", accent: "bg-violet-600", subtitle: `${pendingOrders} chờ duyệt` },
    { icon: UsersIcon, title: "Người dùng", value: users.length, link: "/dashboard/nguoi-dung", accent: "bg-rose-600" },
    { icon: TicketPercentIcon, title: "Mã giảm giá", value: couponCount, link: "/dashboard/ma-giam-gia", accent: "bg-amber-600" },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200 via-amber-100 to-orange-100 shadow-sm ring-1 ring-white/80">
              <TrendingUpIcon className="size-5 text-amber-700" strokeWidth={1.8} />
            </div>
            <div>
              <h1 className="font-heading text-xl font-semibold tracking-tight text-stone-900">Tổng quan</h1>
              <p className="text-xs text-stone-400">Bảng điều khiển trung tâm</p>
            </div>
          </div>
        </div>
        <Button asChild className="h-10 rounded-xl bg-stone-900 px-5 text-sm font-semibold text-white shadow-lg shadow-stone-900/15 transition-all hover:bg-stone-800 hover:shadow-xl">
          <Link href="/" className="inline-flex items-center gap-2"><ArrowRightIcon className="size-4" />Về trang chủ</Link>
        </Button>
      </div>

      {error && <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-3.5 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (<StatCard key={s.title} {...s} />))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-2xl border border-stone-100 bg-white/80 p-5 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.04)] backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-heading text-base font-semibold text-stone-900"><PackageIcon className="size-4 text-stone-400" strokeWidth={1.8} />Sản phẩm mới nhất</h2>
            <Button asChild variant="ghost" size="sm" className="rounded-full text-stone-400 hover:text-stone-700">
              <Link href="/dashboard/san-pham" className="inline-flex items-center gap-1 text-xs font-medium">Xem tất cả <ArrowRightIcon className="size-3.5" /></Link>
            </Button>
          </div>
          <div className="space-y-2">
            {loading ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-[52px] animate-pulse rounded-xl bg-stone-100" />)
              : products.slice(0, 5).length === 0 ? <p className="py-6 text-center text-sm text-stone-400">Chưa có sản phẩm nào.</p>
              : products.slice(0, 5).map((p) => <MiniProductRow key={p.maSanPham} product={p} />)}
          </div>
        </div>

        <div className="rounded-2xl border border-stone-100 bg-white/80 p-5 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.04)] backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-heading text-base font-semibold text-stone-900"><ShoppingCartIcon className="size-4 text-stone-400" strokeWidth={1.8} />Đơn hàng mới</h2>
            <Button asChild variant="ghost" size="sm" className="rounded-full text-stone-400 hover:text-stone-700">
              <Link href="/dashboard/don-hang" className="inline-flex items-center gap-1 text-xs font-medium">Xem tất cả <ArrowRightIcon className="size-3.5" /></Link>
            </Button>
          </div>
          <div className="space-y-2">
            {loading ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-[56px] animate-pulse rounded-xl bg-stone-100" />)
              : orders.slice(0, 4).length === 0 ? <p className="py-6 text-center text-sm text-stone-400">Chưa có đơn hàng nào.</p>
              : orders.slice(0, 4).map((o) => <OrderRow key={o.maDonHang} order={o} />)}
          </div>
        </div>
      </div>
    </div>
  )
}