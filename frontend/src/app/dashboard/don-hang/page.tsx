"use client"

import { useEffect, useMemo, useState } from "react"
import { getOrders, updateOrderStatus } from "@/lib/api"
import type { DonHang } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  CheckCircle2Icon,
  Clock3Icon,
  EyeIcon,
  PackageCheckIcon,
  RefreshCcwIcon,
  SearchIcon,
  ShoppingCartIcon,
  TruckIcon,
  XCircleIcon,
} from "lucide-react"

const STATUS_FLOW = ["Cho xac nhan", "Dang xu ly", "Dang giao", "Da giao", "Da thanh toan", "Da huy"] as const

const statusConfig: Record<string, { label: string; className: string; icon: typeof Clock3Icon }> = {
  "Cho xac nhan": {
    label: "Chờ xác nhận",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
    icon: Clock3Icon,
  },
  "Dang xu ly": {
    label: "Đang xử lý",
    className: "bg-sky-50 text-sky-700 ring-sky-200",
    icon: PackageCheckIcon,
  },
  "Dang giao": {
    label: "Đang giao",
    className: "bg-violet-50 text-violet-700 ring-violet-200",
    icon: TruckIcon,
  },
  "Da giao": {
    label: "Đã giao",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    icon: CheckCircle2Icon,
  },
  "Da thanh toan": {
    label: "Đã thanh toán",
    className: "bg-teal-50 text-teal-700 ring-teal-200",
    icon: CheckCircle2Icon,
  },
  "Da huy": {
    label: "Đã hủy",
    className: "bg-red-50 text-red-700 ring-red-200",
    icon: XCircleIcon,
  },
}

function formatCurrency(value?: number | null) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value ?? 0)
}

function formatDate(value?: string | null) {
  if (!value) return "Chưa có"
  return new Date(value).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getStatusInfo(status?: string | null) {
  return statusConfig[status ?? ""] ?? {
    label: status || "Chưa cập nhật",
    className: "bg-stone-100 text-stone-600 ring-stone-200",
    icon: Clock3Icon,
  }
}

function StatusBadge({ status }: { status?: string | null }) {
  const info = getStatusInfo(status)
  const Icon = info.icon
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${info.className}`}>
      <Icon className="size-3.5" />
      {info.label}
    </span>
  )
}

function canApprove(order: DonHang) {
  return (order.trangThai ?? "") === "Cho xac nhan"
}

function canCancel(order: DonHang) {
  return !["Dang giao", "Da giao", "Da thanh toan", "Da huy"].includes(order.trangThai ?? "")
}

function getCustomer(order: DonHang) {
  return {
    name: order.tenDangNhap ?? order.nguoiDung?.tenDangNhap ?? "Khách hàng",
    email: order.email ?? order.nguoiDung?.email ?? null,
    phone: order.soDienThoai ?? order.nguoiDung?.soDienThoai ?? null,
    address: order.diaChi ?? order.nguoiDung?.diaChi ?? null,
  }
}

export default function DonHangPage() {
  const [orders, setOrders] = useState<DonHang[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const loadOrders = async () => {
    setError("")
    try {
      const data = await getOrders()
      setOrders(data)
      setSelectedId((current) => current ?? data[0]?.maDonHang ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tải được danh sách đơn hàng")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      void loadOrders()
    })
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return orders.filter((order) => {
      const matchStatus = statusFilter === "all" || order.trangThai === statusFilter
      const matchSearch =
        !q ||
        String(order.maDonHang).includes(q) ||
        (order.tenDangNhap ?? "").toLowerCase().includes(q) ||
        (order.email ?? "").toLowerCase().includes(q) ||
        (order.soDienThoai ?? "").toLowerCase().includes(q)
      return matchStatus && matchSearch
    })
  }, [orders, search, statusFilter])

  const selected = orders.find((order) => order.maDonHang === selectedId) ?? filtered[0] ?? null
  const selectedItems = selected?.chiTiet ?? []

  const changeStatus = async (order: DonHang, status: string) => {
    setUpdatingId(order.maDonHang)
    setError("")
    try {
      const updated = await updateOrderStatus(order.maDonHang, status)
      setOrders((items) => items.map((item) => (
        item.maDonHang === order.maDonHang ? { ...item, ...updated, trangThai: updated.trangThai ?? status } : item
      )))
      setSelectedId(order.maDonHang)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cập nhật trạng thái thất bại")
    } finally {
      setUpdatingId(null)
    }
  }

  const stats = [
    { label: "Tổng đơn", value: orders.length, className: "text-stone-900" },
    { label: "Chờ duyệt", value: orders.filter((o) => o.trangThai === "Cho xac nhan").length, className: "text-amber-700" },
    { label: "Đang xử lý", value: orders.filter((o) => ["Dang xu ly", "Dang giao"].includes(o.trangThai ?? "")).length, className: "text-sky-700" },
    { label: "Hoàn tất", value: orders.filter((o) => ["Da giao", "Da thanh toan"].includes(o.trangThai ?? "")).length, className: "text-emerald-700" },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-stone-900">Quản lý đơn hàng</h1>
          <p className="mt-1 text-sm text-stone-500">Theo dõi, duyệt và cập nhật trạng thái đơn hàng của khách.</p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={loadOrders}
          className="h-10 rounded-full border-stone-200 bg-white px-4 text-stone-700 hover:bg-stone-50"
        >
          <RefreshCcwIcon className="mr-2 size-4" />
          Làm mới
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="rounded-[1.5rem] border-none bg-white/85 shadow-[0_8px_24px_rgba(96,74,44,0.07)]">
            <CardContent className="p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-stone-400">{stat.label}</p>
              <p className={`font-heading mt-2 text-3xl font-semibold ${stat.className}`}>{loading ? "..." : stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm mã đơn, tài khoản, email hoặc số điện thoại..."
            className="h-11 rounded-2xl border-stone-200 bg-white/80 pl-11 text-sm shadow-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["all", ...STATUS_FLOW].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                statusFilter === status
                  ? "bg-stone-900 text-white shadow-md"
                  : "border border-stone-200 bg-white/80 text-stone-600 hover:bg-white"
              }`}
            >
              {status === "all" ? "Tất cả" : getStatusInfo(status).label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.8fr)]">
        <Card className="rounded-[1.75rem] border-none bg-white/85 shadow-[0_12px_32px_rgba(96,74,44,0.08)]">
          <CardContent className="p-4 sm:p-5">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-20 animate-pulse rounded-2xl bg-stone-100" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center text-stone-400">
                <ShoppingCartIcon className="size-10 opacity-50" strokeWidth={1.5} />
                <p className="text-sm">Không tìm thấy đơn hàng phù hợp.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((order) => (
                  <OrderRow
                    key={order.maDonHang}
                    order={order}
                    selected={selected?.maDonHang === order.maDonHang}
                    updating={updatingId === order.maDonHang}
                    onSelect={() => setSelectedId(order.maDonHang)}
                    onApprove={() => changeStatus(order, "Dang xu ly")}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[1.75rem] border-none bg-white/85 shadow-[0_12px_32px_rgba(96,74,44,0.08)]">
          <CardContent className="p-5">
            {!selected ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center text-stone-400">
                <EyeIcon className="size-10 opacity-50" strokeWidth={1.5} />
                <p className="text-sm">Chọn một đơn hàng để xem chi tiết.</p>
              </div>
            ) : (
              <OrderDetail
                order={selected}
                items={selectedItems}
                updating={updatingId === selected.maDonHang}
                onStatusChange={(status) => changeStatus(selected, status)}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function OrderRow({
  order,
  selected,
  updating,
  onSelect,
  onApprove,
}: {
  order: DonHang
  selected: boolean
  updating: boolean
  onSelect: () => void
  onApprove: () => void
}) {
  const customer = getCustomer(order)

  return (
                  <div
                    className={`rounded-2xl border px-4 py-4 transition ${
                      selected
                        ? "border-stone-900 bg-white shadow-sm"
                        : "border-stone-100 bg-stone-50/60 hover:border-stone-200 hover:bg-white"
                    }`}
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-heading text-base font-semibold text-stone-900">Đơn #{order.maDonHang}</p>
                          <StatusBadge status={order.trangThai} />
                        </div>
                        <p className="mt-1 truncate text-sm text-stone-500">
                          {customer.name} · {customer.phone ?? customer.email ?? "Chưa có liên hệ"}
                        </p>
                        <p className="mt-1 text-xs text-stone-400">{formatDate(order.ngayDat)}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                        <div className="mr-2 text-left lg:text-right">
                          <p className="text-sm font-semibold text-rose-700">{formatCurrency(order.tongTien)}</p>
                          <p className="text-xs text-stone-400">{order.phuongThucThanhToan ?? "Chưa rõ"}</p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={onSelect}
                          className="rounded-xl border-stone-200"
                        >
                          <EyeIcon className="mr-1.5 size-3.5" />
                          Chi tiết
                        </Button>
                        {canApprove(order) && (
                          <Button
                            type="button"
                            size="sm"
                            disabled={updating}
                            onClick={onApprove}
                            className="rounded-xl bg-stone-900 text-white hover:bg-stone-800"
                          >
                            <CheckCircle2Icon className="mr-1.5 size-3.5" />
                            Duyệt
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
  )
}

function OrderDetail({
  order,
  items,
  updating,
  onStatusChange,
}: {
  order: DonHang
  items: DonHang["chiTiet"]
  updating: boolean
  onStatusChange: (status: string) => void
}) {
  const customer = getCustomer(order)

  return (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Chi tiết đơn hàng</p>
                    <h2 className="font-heading mt-1 text-xl font-semibold text-stone-900">#{order.maDonHang}</h2>
                  </div>
                  <StatusBadge status={order.trangThai} />
                </div>

                <div className="grid gap-3 text-sm">
                  <div className="rounded-2xl bg-stone-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Khách hàng</p>
                    <p className="mt-1 font-medium text-stone-900">{customer.name}</p>
                    <p className="text-stone-500">{customer.email ?? "Chưa có email"}</p>
                    <p className="text-stone-500">{customer.phone ?? "Chưa có số điện thoại"}</p>
                    <p className="text-stone-500">{customer.address ?? "Chưa có địa chỉ"}</p>
                  </div>
                  <div className="rounded-2xl bg-stone-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Thanh toán</p>
                    <div className="mt-2 space-y-1 text-stone-600">
                      <div className="flex justify-between gap-4"><span>Phương thức</span><span>{order.phuongThucThanhToan ?? "Chưa rõ"}</span></div>
                      <div className="flex justify-between gap-4"><span>Phí vận chuyển</span><span>{formatCurrency(order.phiVanChuyen)}</span></div>
                      <div className="flex justify-between gap-4"><span>Giảm giá</span><span>{formatCurrency(order.tienGiam)}</span></div>
                      {order.maCode && <div className="flex justify-between gap-4"><span>Mã giảm</span><span>{order.maCode}</span></div>}
                      <div className="flex justify-between gap-4 border-t border-stone-200 pt-2 font-semibold text-stone-900">
                        <span>Tổng tiền</span><span>{formatCurrency(order.tongTien)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-400">Sản phẩm</p>
                  <div className="space-y-2">
                    {items.length === 0 ? (
                      <p className="rounded-2xl bg-stone-50 px-4 py-4 text-sm text-stone-400">Đơn hàng chưa có chi tiết sản phẩm.</p>
                    ) : items.map((item) => (
                      <div key={item.maChiTietDonHang} className="flex items-center justify-between gap-3 rounded-2xl border border-stone-100 px-3 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-stone-900">{item.tenSanPham ?? `Sản phẩm #${item.maSanPham}`}</p>
                          <p className="text-xs text-stone-400">SL {item.soLuong} · {formatCurrency(item.gia)}</p>
                        </div>
                        <p className="shrink-0 text-sm font-semibold text-stone-900">{formatCurrency(item.thanhTien)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 border-t border-stone-100 pt-5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400">Cập nhật trạng thái</label>
                  <select
                    value={order.trangThai ?? ""}
                    onChange={(event) => onStatusChange(event.target.value)}
                    disabled={updating}
                    className="h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm text-stone-700 shadow-sm outline-none transition focus:border-stone-400"
                  >
                    {STATUS_FLOW.map((status) => (
                      <option key={status} value={status}>{getStatusInfo(status).label}</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    {canApprove(order) && (
                      <Button
                        type="button"
                        disabled={updating}
                        onClick={() => onStatusChange("Dang xu ly")}
                        className="h-10 flex-1 rounded-xl bg-stone-900 text-white hover:bg-stone-800"
                      >
                        <CheckCircle2Icon className="mr-2 size-4" />
                        Duyệt đơn
                      </Button>
                    )}
                    {canCancel(order) && (
                      <Button
                        type="button"
                        variant="outline"
                        disabled={updating}
                        onClick={() => confirm("Hủy đơn hàng này?") && onStatusChange("Da huy")}
                        className="h-10 flex-1 rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <XCircleIcon className="mr-2 size-4" />
                        Hủy đơn
                      </Button>
                    )}
                  </div>
                </div>
              </div>
  )
}
