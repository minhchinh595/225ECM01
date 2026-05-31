"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getStoredUser } from "@/lib/auth"
import {
  API_URL,
  checkoutCart,
  getCart as getServerCart,
  getMaGiamGia,
  updateCartItem as updateServerCartItem,
  type MaGiamGia,
} from "@/lib/api"
import type { GioHangItem, NguoiDung } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  CheckCircle2Icon,
  Loader2Icon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  TicketPercentIcon,
  TrashIcon,
} from "lucide-react"

const API_ORIGIN = API_URL.replace(/\/api\/?$/, "")
const CHECKOUT_KEY = "visilk_checkout_ids"

function productImageSrc(hinhAnh?: string | null): string | null {
  if (!hinhAnh?.trim()) return null
  const p = hinhAnh.trim()
  if (/^https?:\/\//i.test(p)) return p
  if (p.startsWith("/")) return `${API_ORIGIN}${p}`
  return `/${p}`
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
}

function isPercentCoupon(coupon: MaGiamGia) {
  const value = coupon.loaiGiam.toLowerCase().trim()
  return value === "phantram" || value === "phan_tram" || value === "percent" || value === "%"
}

function isCouponActive(coupon: MaGiamGia) {
  const now = new Date()
  return Boolean(coupon.trangThai) && new Date(coupon.ngayBatDau) <= now && now <= new Date(coupon.ngayKetThuc)
}

function calculateDiscount(coupon: MaGiamGia | null, subtotal: number) {
  if (!coupon) return 0
  const minimum = coupon.giaTriDonHangToiThieu ?? 0
  if (subtotal < minimum) return 0

  if (isPercentCoupon(coupon)) {
    const rawDiscount = subtotal * (coupon.giaTriGiam / 100)
    return Math.min(rawDiscount, coupon.giamToiDa ?? rawDiscount, subtotal)
  }

  return Math.min(coupon.giaTriGiam, subtotal)
}

export default function DatHangPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<NguoiDung | null>(null)
  const [items, setItems] = useState<GioHangItem[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [coupons, setCoupons] = useState<MaGiamGia[]>([])
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<MaGiamGia | null>(null)
  const [couponMessage, setCouponMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("COD")
  const [form, setForm] = useState({ tenNguoiNhan: "", soDienThoai: "", diaChi: "" })
  const [message, setMessage] = useState("")
  const [successOrderId, setSuccessOrderId] = useState<number | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const user = getStoredUser()
    if (!user) {
      router.replace("/login")
      return
    }

    queueMicrotask(async () => {
      setCurrentUser(user)
      setForm({
        tenNguoiNhan: user.hoTen?.trim() || user.tenDangNhap,
        soDienThoai: user.soDienThoai ?? "",
        diaChi: user.diaChi ?? "",
      })

      try {
        const storedIds = JSON.parse(sessionStorage.getItem(CHECKOUT_KEY) ?? "[]") as number[]
        const [cart, couponList] = await Promise.all([
          getServerCart(user.maNguoiDung),
          getMaGiamGia().catch(() => []),
        ])
        const ids = storedIds.length > 0 ? storedIds : cart.chiTiet.map((item) => item.maSanPham)
        setSelectedIds(ids)
        setItems(cart.chiTiet.filter((item) => ids.includes(item.maSanPham)))
        setCoupons(couponList)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không tải được thông tin đặt hàng.")
      } finally {
        setLoading(false)
      }
    })
  }, [router])

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.gia * item.soLuong, 0), [items])
  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.soLuong, 0), [items])
  const discount = useMemo(() => calculateDiscount(appliedCoupon, subtotal), [appliedCoupon, subtotal])
  const total = Math.max(subtotal - discount, 0)

  async function handleUpdateQty(maSanPham: number, soLuong: number) {
    if (!currentUser) return
    if (soLuong <= 0) {
      removeFromCheckout(maSanPham)
      return
    }

    try {
      const updated = await updateServerCartItem(currentUser.maNguoiDung, { maSanPham, soLuong })
      const updatedItem = updated.chiTiet.find((item) => item.maSanPham === maSanPham)
      setItems((current) => current.map((item) => (
        item.maSanPham === maSanPham ? updatedItem ?? { ...item, soLuong, thanhTien: item.gia * soLuong } : item
      )))
      window.dispatchEvent(new Event("cart-updated"))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cập nhật số lượng thất bại.")
    }
  }

  function removeFromCheckout(maSanPham: number) {
    const nextIds = selectedIds.filter((id) => id !== maSanPham)
    setSelectedIds(nextIds)
    setItems((current) => current.filter((item) => item.maSanPham !== maSanPham))
    sessionStorage.setItem(CHECKOUT_KEY, JSON.stringify(nextIds))
  }

  function handleApplyCoupon() {
    const normalized = couponCode.trim().toUpperCase()
    setCouponMessage("")
    setAppliedCoupon(null)

    if (!normalized) {
      setCouponMessage("Vui lòng nhập mã giảm giá.")
      return
    }

    const coupon = coupons.find((item) => item.maCode.toUpperCase() === normalized)
    if (!coupon) {
      setCouponMessage("Không tìm thấy mã giảm giá này.")
      return
    }
    if (!isCouponActive(coupon)) {
      setCouponMessage("Mã giảm giá đã hết hạn hoặc đang tắt.")
      return
    }
    if (subtotal < (coupon.giaTriDonHangToiThieu ?? 0)) {
      setCouponMessage(`Đơn hàng cần tối thiểu ${formatCurrency(coupon.giaTriDonHangToiThieu ?? 0)} để áp mã.`)
      return
    }

    setCouponCode(coupon.maCode)
    setAppliedCoupon(coupon)
    setCouponMessage(`Đã áp dụng ${coupon.maCode}.`)
  }

  async function handlePlaceOrder() {
    if (!currentUser || placing) return
    if (items.length === 0) {
      setError("Vui lòng chọn ít nhất một sản phẩm để đặt hàng.")
      return
    }
    if (!form.tenNguoiNhan.trim() || !form.soDienThoai.trim() || !form.diaChi.trim()) {
      setError("Vui lòng nhập đầy đủ tên người nhận, số điện thoại và địa chỉ.")
      return
    }

    setPlacing(true)
    setError("")
    setMessage("")
    setSuccessOrderId(null)
    try {
      const order = await checkoutCart(currentUser.maNguoiDung, {
        maSanPham: selectedIds,
        phuongThucThanhToan: paymentMethod,
        tenNguoiNhan: form.tenNguoiNhan,
        soDienThoai: form.soDienThoai,
        diaChi: form.diaChi,
        maGiamGia: appliedCoupon?.maGiamGia,
        tienGiam: discount,
      })
      sessionStorage.removeItem(CHECKOUT_KEY)
      setItems([])
      setSelectedIds([])
      setSuccessOrderId(order.maDonHang)
      setMessage(`Đặt hàng thành công. Mã đơn hàng của bạn là #${order.maDonHang}.`)
      window.dispatchEvent(new Event("cart-updated"))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đặt hàng thất bại. Vui lòng thử lại.")
    } finally {
      setPlacing(false)
    }
  }

  return (
    <main className="min-h-svh bg-[#f7f3ec] text-stone-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/gio-hang" className="mb-6 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/80 px-4 py-2 text-sm text-stone-600 shadow-sm hover:text-stone-950">
          <ArrowLeftIcon className="size-4" />
          Quay lại giỏ hàng
        </Link>

        <div className="mb-8 flex flex-col gap-3 border-b border-stone-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">Checkout</p>
            <h1 className="font-heading mt-2 text-4xl font-semibold text-stone-950">Đặt hàng</h1>
          </div>
          <p className="max-w-xl text-sm text-stone-500">
            Kiểm tra sản phẩm, áp mã giảm giá và xác nhận thông tin nhận hàng trước khi tạo đơn.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2Icon className="size-8 animate-spin text-stone-400" />
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
            <section className="space-y-4">
              <div className="rounded-2xl border border-stone-200 bg-white/90 p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Sản phẩm đặt mua</h2>
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">{itemCount} sản phẩm</span>
                </div>

                {items.length === 0 ? (
                  <div className="py-14 text-center">
                    <ShoppingBagIcon className="mx-auto mb-4 size-10 text-stone-300" />
                    <p className="font-medium text-stone-800">Chưa có sản phẩm nào để đặt.</p>
                    <Button asChild className="mt-5 rounded-full bg-stone-900 text-white hover:bg-stone-700">
                      <Link href="/gio-hang">Chọn sản phẩm</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => {
                      const src = productImageSrc(item.hinhAnh)
                      return (
                        <div key={item.maSanPham} className="grid grid-cols-[84px_1fr] gap-4 rounded-2xl border border-stone-100 bg-stone-50/70 p-3 sm:grid-cols-[96px_1fr_128px_40px] sm:items-center">
                          <div className="aspect-[4/5] overflow-hidden rounded-xl bg-stone-100">
                            {src ? (
                              <img src={src} alt={item.tenSanPham} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <ShoppingBagIcon className="size-7 text-stone-300" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs uppercase tracking-widest text-stone-400">{item.tenThuongHieu ?? ""}</p>
                            <p className="mt-1 line-clamp-2 text-sm font-medium text-stone-950">{item.tenSanPham}</p>
                            <p className="mt-1 text-sm font-semibold text-rose-700">{formatCurrency(item.gia)}</p>
                          </div>
                          <div className="col-span-2 flex items-center gap-0 sm:col-span-1 sm:justify-center">
                            <button type="button" onClick={() => handleUpdateQty(item.maSanPham, item.soLuong - 1)} className="flex h-9 w-9 items-center justify-center rounded-l-xl border border-stone-200 bg-white text-stone-500 hover:text-stone-900">
                              <MinusIcon className="size-3" />
                            </button>
                            <span className="flex h-9 w-12 items-center justify-center border-y border-stone-200 bg-white text-sm font-medium">{item.soLuong}</span>
                            <button type="button" onClick={() => handleUpdateQty(item.maSanPham, item.soLuong + 1)} className="flex h-9 w-9 items-center justify-center rounded-r-xl border border-stone-200 bg-white text-stone-500 hover:text-stone-900">
                              <PlusIcon className="size-3" />
                            </button>
                          </div>
                          <button type="button" onClick={() => removeFromCheckout(item.maSanPham)} className="hidden h-9 w-9 items-center justify-center rounded-full text-stone-300 hover:bg-red-50 hover:text-red-500 sm:flex">
                            <TrashIcon className="size-4" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </section>

            <aside className="lg:sticky lg:top-8 lg:self-start">
              <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-[0_18px_50px_rgba(80,60,35,0.10)]">
                <div className="bg-stone-950 px-6 py-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-300">Thông tin đơn hàng</p>
                  <p className="mt-2 font-heading text-2xl font-semibold">{formatCurrency(total)}</p>
                </div>

                <div className="space-y-5 p-6">
                  <div>
                    <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Giao hàng</h2>
                    <div className="space-y-3">
                      <input value={form.tenNguoiNhan} onChange={(e) => setForm((f) => ({ ...f, tenNguoiNhan: e.target.value }))} placeholder="Tên người nhận" className="h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm outline-none focus:border-stone-400 focus:bg-white" />
                      <input value={form.soDienThoai} onChange={(e) => setForm((f) => ({ ...f, soDienThoai: e.target.value }))} placeholder="Số điện thoại" className="h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm outline-none focus:border-stone-400 focus:bg-white" />
                      <textarea value={form.diaChi} onChange={(e) => setForm((f) => ({ ...f, diaChi: e.target.value }))} placeholder="Địa chỉ nhận hàng" className="min-h-24 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-sm outline-none focus:border-stone-400 focus:bg-white" />
                      <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm outline-none focus:border-stone-400 focus:bg-white">
                        <option value="COD">Thanh toán khi nhận hàng</option>
                        <option value="Banking">Chuyển khoản</option>
                      </select>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
                    <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">
                      <TicketPercentIcon className="size-4" />
                      Mã giảm giá
                    </label>
                    <div className="flex gap-2">
                      <input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Nhập mã" className="h-10 flex-1 rounded-xl border border-amber-200 bg-white px-3 text-sm outline-none focus:border-amber-500" />
                      <Button type="button" variant="outline" onClick={handleApplyCoupon} className="h-10 rounded-xl border-amber-200 bg-white px-4 text-amber-800 hover:bg-amber-100">
                        Áp dụng
                      </Button>
                    </div>
                    {couponMessage && (
                      <p className={`mt-2 text-xs ${appliedCoupon ? "text-emerald-700" : "text-amber-800"}`}>{couponMessage}</p>
                    )}
                  </div>

                  <div className="space-y-3 text-sm text-stone-600">
                    <div className="flex justify-between"><span>Tạm tính</span><span>{formatCurrency(subtotal)}</span></div>
                    <div className="flex justify-between"><span>Phí vận chuyển</span><span className="text-emerald-600">Miễn phí</span></div>
                    {discount > 0 && <div className="flex justify-between text-emerald-700"><span>Giảm giá</span><span>-{formatCurrency(discount)}</span></div>}
                    <div className="flex justify-between border-t border-stone-100 pt-3 text-base font-semibold text-stone-950">
                      <span>Tổng thanh toán</span><span>{formatCurrency(total)}</span>
                    </div>
                  </div>

                  {message && (
                    <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs text-emerald-700">
                      <CheckCircle2Icon className="mt-0.5 size-4 shrink-0" />
                      <div className="flex-1">
                        <p>{message}</p>
                        {successOrderId && (
                          <Button asChild className="mt-3 h-9 rounded-xl bg-emerald-700 px-4 text-xs font-semibold text-white hover:bg-emerald-800">
                            <Link href="/lich-su-don-hang">Xem lịch sử đơn hàng</Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                  {error && (
                    <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">
                      <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <Button type="button" disabled={items.length === 0 || placing} onClick={handlePlaceOrder} className="h-12 w-full rounded-full bg-stone-900 text-[13px] font-semibold uppercase tracking-widest text-white hover:bg-stone-700 disabled:opacity-50">
                    {placing ? (
                      <span className="flex items-center gap-2">
                        <Loader2Icon className="size-4 animate-spin" />
                        Đang đặt hàng
                      </span>
                    ) : (
                      "Xác nhận đặt hàng"
                    )}
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}
