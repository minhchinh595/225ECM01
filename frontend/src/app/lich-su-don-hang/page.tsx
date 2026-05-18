"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  Clock3Icon,
  CreditCardIcon,
  Loader2Icon,
  PackageCheckIcon,
  PackageIcon,
  ReceiptTextIcon,
  RefreshCwIcon,
  SearchIcon,
  TruckIcon,
  XCircleIcon,
} from "lucide-react"
import { getStoredUser } from "@/lib/auth"
import { API_URL, getOrdersByUser } from "@/lib/api"
import type { DonHang, NguoiDung } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/user-menu"
import { CartIcon } from "@/components/cart-icon"

const API_ORIGIN = API_URL.replace(/\/api\/?$/, "")

const STATUS_FILTERS = [
  { value: "all", label: "Tất cả" },
  { value: "cho-xac-nhan", label: "Chờ xác nhận" },
  { value: "dang-xu-ly", label: "Đang xử lý" },
  { value: "dang-giao", label: "Đang giao" },
  { value: "da-giao", label: "Đã giao" },
  { value: "da-thanh-toan", label: "Đã thanh toán" },
  { value: "da-huy", label: "Đã hủy" },
]

function normalizeStatus(status?: string | null) {
  return (status ?? "Cho xac nhan")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ")
}

function getStatusKey(status?: string | null) {
  const normalized = normalizeStatus(status)
  if (normalized === "dang xu ly") return "dang-xu-ly"
  if (normalized === "dang giao") return "dang-giao"
  if (normalized === "da giao") return "da-giao"
  if (normalized === "da thanh toan") return "da-thanh-toan"
  if (normalized === "da huy") return "da-huy"
  return "cho-xac-nhan"
}

function getStatusLabel(status?: string | null) {
  return STATUS_FILTERS.find((item) => item.value === getStatusKey(status))?.label ?? "Chờ xác nhận"
}

function formatCurrency(value?: number | null) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value ?? 0)
}

function formatDate(value?: string | null) {
  if (!value) return "Chưa có thời gian"
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value))
}

function productImageSrc(hinhAnh?: string | null): string | null {
  if (!hinhAnh?.trim()) return null
  const path = hinhAnh.trim()
  if (/^https?:\/\//i.test(path)) return path
  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`
}

function getStatusInfo(status?: string | null) {
  const key = getStatusKey(status)
  const label = getStatusLabel(status)
  if (key === "da-giao" || key === "da-thanh-toan") {
    return {
      label,
      icon: CheckCircle2Icon,
      badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
      rail: "bg-emerald-500",
    }
  }
  if (key === "dang-giao") {
    return {
      label,
      icon: TruckIcon,
      badge: "border-violet-200 bg-violet-50 text-violet-700",
      rail: "bg-violet-500",
    }
  }
  if (key === "dang-xu-ly") {
    return {
      label,
      icon: PackageCheckIcon,
      badge: "border-sky-200 bg-sky-50 text-sky-700",
      rail: "bg-sky-500",
    }
  }
  if (key === "da-huy") {
    return {
      label,
      icon: XCircleIcon,
      badge: "border-red-200 bg-red-50 text-red-700",
      rail: "bg-red-500",
    }
  }
  return {
    label,
    icon: Clock3Icon,
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    rail: "bg-amber-500",
  }
}

function getItemCount(order: DonHang) {
  return (order.chiTiet ?? []).reduce((sum, item) => sum + (item.soLuong ?? 0), 0)
}

export default function LichSuDonHangPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<NguoiDung | null>(null)
  const [orders, setOrders] = useState<DonHang[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")
  const [expandedId, setExpandedId] = useState<number | null>(null)

  useEffect(() => {
    const user = getStoredUser()
    if (!user) {
      router.replace("/login")
      return
    }

    queueMicrotask(() => {
      setCurrentUser(user)
      void loadOrders(user.maNguoiDung)
    })
  }, [router])

  async function loadOrders(maNguoiDung: number) {
    setLoading(true)
    setError("")
    try {
      const data = await getOrdersByUser(maNguoiDung)
      setOrders(data)
      setExpandedId(data[0]?.maDonHang ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tải được lịch sử đơn hàng.")
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return orders.filter((order) => {
      const matchesStatus = status === "all" || getStatusKey(order.trangThai) === status
      const matchesQuery = !keyword
        || String(order.maDonHang).includes(keyword)
        || (order.chiTiet ?? []).some((item) => item.tenSanPham?.toLowerCase().includes(keyword))
      return matchesStatus && matchesQuery
    })
  }, [orders, query, status])

  const stats = useMemo(() => {
    const totalSpent = orders
      .filter((order) => getStatusKey(order.trangThai) !== "da-huy")
      .reduce((sum, order) => sum + (order.tongTien ?? 0), 0)
    const waiting = orders.filter((order) => {
      const key = getStatusKey(order.trangThai)
      return key === "cho-xac-nhan" || key === "dang-xu-ly"
    }).length
    const shipping = orders.filter((order) => getStatusKey(order.trangThai) === "dang-giao").length
    return { totalSpent, waiting, shipping }
  }, [orders])

  return (
    <main className="min-h-svh bg-[#f7f3ec] text-stone-900">
      <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-[#f7f3ec]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="font-heading text-xl font-semibold tracking-wide text-stone-950">
            VISILK
          </Link>
          <div className="flex items-center gap-2">
            <CartIcon />
            {currentUser && <UserMenu initialUser={currentUser} />}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/80 px-4 py-2 text-sm text-stone-600 shadow-sm hover:text-stone-950">
          <ArrowLeftIcon className="size-4" />
          Tiếp tục mua sắm
        </Link>

        <section className="mb-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">Tài khoản của tôi</p>
            <h1 className="font-heading mt-2 text-4xl font-semibold text-stone-950 sm:text-5xl">Lịch sử đơn hàng</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
              Theo dõi trạng thái, kiểm tra sản phẩm đã mua và xem lại thông tin thanh toán của từng đơn hàng.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-3xl border border-stone-200 bg-white/85 p-3 shadow-sm">
            <div className="rounded-2xl bg-stone-50 px-3 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">Đơn</p>
              <p className="mt-1 text-xl font-semibold text-stone-950">{orders.length}</p>
            </div>
            <div className="rounded-2xl bg-amber-50 px-3 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-700">Chờ</p>
              <p className="mt-1 text-xl font-semibold text-stone-950">{stats.waiting}</p>
            </div>
            <div className="rounded-2xl bg-violet-50 px-3 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-700">Giao</p>
              <p className="mt-1 text-xl font-semibold text-stone-950">{stats.shipping}</p>
            </div>
          </div>
        </section>

        <section className="mb-6 rounded-3xl border border-stone-200 bg-white/90 p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm theo mã đơn hoặc tên sản phẩm"
                className="h-11 w-full rounded-2xl border border-stone-200 bg-stone-50 pl-10 pr-3 text-sm outline-none transition focus:border-stone-400 focus:bg-white"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
              {STATUS_FILTERS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setStatus(item.value)}
                  className={`h-10 shrink-0 rounded-full border px-4 text-xs font-semibold transition ${
                    status === item.value
                      ? "border-stone-950 bg-stone-950 text-white"
                      : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-stone-950"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2Icon className="size-8 animate-spin text-stone-400" />
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-8 text-center text-red-700">
            <p className="text-sm font-medium">{error}</p>
            {currentUser && (
              <Button type="button" onClick={() => loadOrders(currentUser.maNguoiDung)} className="mt-4 rounded-full bg-red-700 text-white hover:bg-red-800">
                <RefreshCwIcon className="mr-2 size-4" />
                Tải lại
              </Button>
            )}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-3xl border border-stone-200 bg-white px-6 py-16 text-center shadow-sm">
            <ReceiptTextIcon className="mx-auto mb-4 size-12 text-stone-300" />
            <h2 className="text-lg font-semibold text-stone-950">Chưa có đơn hàng phù hợp</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-stone-500">
              Khi bạn đặt hàng thành công, đơn sẽ xuất hiện tại đây để tiện theo dõi.
            </p>
            <Button asChild className="mt-6 rounded-full bg-stone-950 px-6 text-white hover:bg-stone-700">
              <Link href="/">Mua sắm ngay</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-5">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.trangThai)
              const StatusIcon = statusInfo.icon
              const expanded = expandedId === order.maDonHang
              const subtotal = (order.tongTien ?? 0) + (order.tienGiam ?? 0) - (order.phiVanChuyen ?? 0)

              return (
                <article key={order.maDonHang} className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => setExpandedId(expanded ? null : order.maDonHang)}
                    className="grid w-full gap-4 p-5 text-left transition hover:bg-stone-50/70 lg:grid-cols-[1fr_220px_180px]"
                  >
                    <div className="flex gap-4">
                      <div className={`mt-1 h-14 w-1 rounded-full ${statusInfo.rail}`} />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-heading text-xl font-semibold text-stone-950">Đơn #{order.maDonHang}</h2>
                          <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${statusInfo.badge}`}>
                            <StatusIcon className="size-3.5" />
                            {statusInfo.label}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-stone-500">{formatDate(order.ngayDat)}</p>
                        <p className="mt-2 line-clamp-1 text-sm text-stone-600">
                          {(order.chiTiet ?? []).map((item) => item.tenSanPham).filter(Boolean).join(", ") || "Đơn hàng chưa có chi tiết sản phẩm"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-stone-600 lg:justify-center">
                      <PackageIcon className="size-4 text-stone-400" />
                      <span>{getItemCount(order)} sản phẩm</span>
                    </div>

                    <div className="text-left lg:text-right">
                      <p className="text-xs uppercase tracking-widest text-stone-400">Thanh toán</p>
                      <p className="mt-1 text-lg font-semibold text-rose-700">{formatCurrency(order.tongTien)}</p>
                    </div>
                  </button>

                  {expanded && (
                    <div className="border-t border-stone-100 bg-[#fbfaf7] p-5">
                      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                        <div className="space-y-3">
                          {(order.chiTiet ?? []).length === 0 ? (
                            <div className="rounded-2xl bg-white px-4 py-5 text-sm text-stone-500">
                              Đơn hàng này chưa có chi tiết sản phẩm.
                            </div>
                          ) : (
                            order.chiTiet.map((item) => {
                              const src = productImageSrc(item.hinhAnh)
                              return (
                                <div key={`${order.maDonHang}-${item.maChiTietDonHang}`} className="grid grid-cols-[72px_1fr] gap-4 rounded-2xl bg-white p-3 shadow-sm sm:grid-cols-[80px_1fr_140px] sm:items-center">
                                  <div className="aspect-[4/5] overflow-hidden rounded-xl bg-stone-100">
                                    {src ? (
                                      <img src={src} alt={item.tenSanPham ?? "Sản phẩm"} className="h-full w-full object-cover" />
                                    ) : (
                                      <div className="flex h-full w-full items-center justify-center">
                                        <PackageIcon className="size-6 text-stone-300" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="line-clamp-2 text-sm font-semibold text-stone-950">{item.tenSanPham ?? "Sản phẩm"}</p>
                                    <p className="mt-1 text-xs text-stone-500">Số lượng: {item.soLuong}</p>
                                  </div>
                                  <div className="col-span-2 text-sm font-semibold text-stone-900 sm:col-span-1 sm:text-right">
                                    {formatCurrency(item.thanhTien ?? item.gia * item.soLuong)}
                                  </div>
                                </div>
                              )
                            })
                          )}
                        </div>

                        <aside className="rounded-2xl bg-white p-5 shadow-sm">
                          <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                            <CreditCardIcon className="size-4" />
                            Tóm tắt
                          </h3>
                          <div className="space-y-3 text-sm text-stone-600">
                            <div className="flex justify-between">
                              <span>Phương thức</span>
                              <span className="font-medium text-stone-900">{order.phuongThucThanhToan ?? "COD"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Tạm tính</span>
                              <span>{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Phí vận chuyển</span>
                              <span>{formatCurrency(order.phiVanChuyen)}</span>
                            </div>
                            {(order.tienGiam ?? 0) > 0 && (
                              <div className="flex justify-between text-emerald-700">
                                <span>Giảm giá {order.maCode ? `(${order.maCode})` : ""}</span>
                                <span>-{formatCurrency(order.tienGiam)}</span>
                              </div>
                            )}
                            <div className="flex justify-between border-t border-stone-100 pt-3 text-base font-semibold text-stone-950">
                              <span>Tổng tiền</span>
                              <span>{formatCurrency(order.tongTien)}</span>
                            </div>
                          </div>
                        </aside>
                      </div>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
