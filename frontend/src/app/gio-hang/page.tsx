"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getStoredUser } from "@/lib/auth"
import {
  getCart as getLocalCart,
  removeFromCart as removeLocalCart,
  updateCartQty as updateLocalCartQty,
  clearCart as clearLocalCart,
} from "@/lib/cart"
import {
  API_URL,
  getCart as getServerCart,
  updateCartItem as updateServerCartItem,
  removeFromCart as removeFromServerCart,
  clearCart as clearServerCart,
} from "@/lib/api"
import type { NguoiDung, GioHangItem } from "@/lib/types"
import { UserMenu } from "@/components/user-menu"
import { Button } from "@/components/ui/button"
import {
  ShoppingCartIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ArrowLeftIcon,
  ShoppingBagIcon,
  TagIcon,
  Loader2Icon,
  CheckCircle2Icon,
  AlertCircleIcon,
} from "lucide-react"

const API_ORIGIN = API_URL.replace(/\/api\/?$/, "")

function productImageSrc(hinhAnh?: string | null): string | null {
  if (!hinhAnh?.trim()) return null
  const path = hinhAnh.trim()
  if (/^https?:\/\//i.test(path)) return path
  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
}

export default function GioHangPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<NguoiDung | null>(null)
  const [cart, setCart] = useState<GioHangItem[]>([])
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [coupon, setCoupon] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("COD")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const user = getStoredUser()
    if (!user) {
      router.replace("/login")
      return
    }
    queueMicrotask(() => {
      setCurrentUser(user)
      void loadCart(user)
      setMounted(true)
    })
  }, [router])

  async function loadCart(user: NguoiDung) {
    try {
      setLoading(true)
      const serverCart = await getServerCart(user.maNguoiDung)
      setCart(serverCart.chiTiet)
      setSelectedIds(serverCart.chiTiet.map((item) => item.maSanPham))
    } catch {
      // Fallback to local cart
      const localItems = getLocalCart().map(item => ({
        maSanPham: item.maSanPham,
        tenSanPham: item.tenSanPham,
        gia: item.gia,
        hinhAnh: item.hinhAnh,
        tenThuongHieu: item.tenThuongHieu,
        mauSac: null,
        size: null,
        soLuong: item.soLuong,
        thanhTien: item.gia * item.soLuong,
      }))
      setCart(localItems)
      setSelectedIds(localItems.map((item) => item.maSanPham))
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateQty(maSanPham: number, soLuong: number) {
    if (!currentUser) return
    if (soLuong <= 0) {
      await handleRemove(maSanPham)
      return
    }
    try {
      const updated = await updateServerCartItem(currentUser.maNguoiDung, { maSanPham, soLuong })
      const updatedItem = updated.chiTiet.find((item) => item.maSanPham === maSanPham)
      setCart((items) => items.map((item) => (
        item.maSanPham === maSanPham
          ? updatedItem ?? { ...item, soLuong, thanhTien: item.gia * soLuong }
          : item
      )))
      window.dispatchEvent(new Event("cart-updated"))
    } catch {
      updateLocalCartQty(maSanPham, soLuong)
      setCart(getLocalCart().map(item => ({
        maSanPham: item.maSanPham,
        tenSanPham: item.tenSanPham,
        gia: item.gia,
        hinhAnh: item.hinhAnh,
        tenThuongHieu: item.tenThuongHieu,
        mauSac: null, size: null,
        soLuong: item.soLuong,
        thanhTien: item.gia * item.soLuong,
      })))
    }
  }

  async function handleRemove(maSanPham: number) {
    if (!currentUser) return
    try {
      const updated = await removeFromServerCart(currentUser.maNguoiDung, maSanPham)
      setCart(updated.chiTiet)
      setSelectedIds((ids) => ids.filter((id) => id !== maSanPham))
      window.dispatchEvent(new Event("cart-updated"))
    } catch {
      removeLocalCart(maSanPham)
      setCart(prev => prev.filter(c => c.maSanPham !== maSanPham))
      setSelectedIds((ids) => ids.filter((id) => id !== maSanPham))
    }
  }

  async function handleClear() {
    if (!currentUser) return
    try {
      await clearServerCart(currentUser.maNguoiDung)
      setCart([])
      setSelectedIds([])
      window.dispatchEvent(new Event("cart-updated"))
    } catch {
      clearLocalCart()
      setCart([])
      setSelectedIds([])
    }
  }

  function toggleSelected(maSanPham: number) {
    setMessage("")
    setError("")
    setSelectedIds((ids) => (
      ids.includes(maSanPham)
        ? ids.filter((id) => id !== maSanPham)
        : [...ids, maSanPham]
    ))
  }

  function toggleSelectAll() {
    setMessage("")
    setError("")
    setSelectedIds((ids) => ids.length === cart.length ? [] : cart.map((item) => item.maSanPham))
  }

  function handleCheckout() {
    if (!currentUser || checkoutLoading) return
    if (selectedIds.length === 0) {
      setError("Vui lòng chọn ít nhất một sản phẩm để đặt hàng.")
      return
    }
    setCheckoutLoading(true)
    setError("")
    setMessage("")
    sessionStorage.setItem("visilk_checkout_ids", JSON.stringify(selectedIds))
    router.push("/dat-hang")
  }

  if (!mounted) return null

  const selectedItems = cart.filter((item) => selectedIds.includes(item.maSanPham))
  const subtotal = selectedItems.reduce((sum, item) => sum + item.gia * item.soLuong, 0)
  const itemCount = selectedItems.reduce((sum, item) => sum + item.soLuong, 0)
  const cartItemCount = cart.reduce((sum, item) => sum + item.soLuong, 0)
  const discount = couponApplied ? subtotal * 0.1 : 0
  const total = subtotal - discount
  const allSelected = cart.length > 0 && selectedIds.length === cart.length

  return (
    <main className="min-h-svh bg-[#fafaf9] text-stone-900 antialiased">

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-stone-200/50 bg-white/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="group flex items-center gap-2.5">
              <svg width="32" height="32" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <circle cx="18" cy="18" r="17" stroke="url(#gc-ring)" strokeWidth="1.2" />
                <path d="M11.5 13.5 L18 23 L24.5 13.5" stroke="url(#gc-v)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <defs>
                  <linearGradient id="gc-ring" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#d97706" /><stop offset="100%" stopColor="#9333ea" />
                  </linearGradient>
                  <linearGradient id="gc-v" x1="11.5" y1="13.5" x2="24.5" y2="23" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#b45309" /><stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="select-none font-heading text-[1.2rem] font-semibold tracking-[0.18em] text-stone-900">
                VI<span className="bg-gradient-to-r from-amber-700 to-violet-600 bg-clip-text text-transparent">SILK</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <ShoppingCartIcon className="size-5 text-stone-400" />
            <span className="text-sm font-medium text-stone-700">Giỏ hàng</span>
            {cartItemCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-stone-900 px-1.5 text-[10px] font-bold text-white">
                {cartItemCount}
              </span>
            )}
          </div>

          {currentUser && <UserMenu initialUser={currentUser} />}
        </nav>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Tiêu đề */}
        <div className="mb-10 border-b border-stone-200 pb-6">
          <h1 className="font-sans text-3xl font-[300] uppercase tracking-[0.25em] text-stone-950 sm:text-4xl">
            Giỏ hàng của bạn
          </h1>
          {cart.length > 0 && (
            <p className="mt-1.5 text-sm text-stone-400">{itemCount} sản phẩm đang chờ bạn</p>
          )}
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-1.5 text-xs text-stone-400 transition hover:text-stone-700"
          >
            <ArrowLeftIcon className="size-3" />
            Tiếp tục mua sắm
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2Icon className="size-8 animate-spin text-stone-400" />
          </div>
        ) : cart.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-stone-100">
              <ShoppingBagIcon className="size-10 text-stone-300" strokeWidth={1} />
            </div>
            <h2 className="mb-2 font-sans text-xl font-[300] uppercase tracking-widest text-stone-700">
              Giỏ hàng trống
            </h2>
            <p className="mb-8 max-w-xs text-sm text-stone-400">
              Hãy khám phá bộ sưu tập và thêm những món đồ bạn yêu thích vào giỏ.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-stone-700"
            >
              Khám phá ngay
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_380px]">

            {/* Danh sách sản phẩm */}
            <div className="space-y-0">
              {/* Header cột */}
              <div className="mb-4 hidden grid-cols-[36px_1fr_120px_120px_40px] gap-4 border-b border-stone-100 pb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400 sm:grid">
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className={`flex h-5 w-5 items-center justify-center rounded border transition ${
                    allSelected ? "border-stone-900 bg-stone-900 text-white" : "border-stone-300 bg-white text-transparent hover:border-stone-600"
                  }`}
                  aria-label={allSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                >
                  <CheckCircle2Icon className="size-3.5" />
                </button>
                <span>Sản phẩm</span>
                <span className="text-center">Số lượng</span>
                <span className="text-right">Thành tiền</span>
                <span />
              </div>

              {cart.map((item, idx) => {
                const src = productImageSrc(item.hinhAnh)
                const selected = selectedIds.includes(item.maSanPham)
                return (
                  <div
                    key={item.maSanPham}
                    className={`grid grid-cols-[32px_80px_1fr] gap-4 py-6 sm:grid-cols-[36px_100px_1fr_120px_120px_40px] sm:items-center ${
                      idx < cart.length - 1 ? "border-b border-stone-100" : ""
                    }`}
                  >
                    {/* Ảnh */}
                    <button
                      type="button"
                      onClick={() => toggleSelected(item.maSanPham)}
                      className={`mt-8 flex h-6 w-6 items-center justify-center rounded-md border transition sm:mt-0 ${
                        selected ? "border-stone-900 bg-stone-900 text-white" : "border-stone-300 bg-white text-transparent hover:border-stone-600"
                      }`}
                      aria-label={selected ? `Bỏ chọn ${item.tenSanPham}` : `Chọn ${item.tenSanPham}`}
                    >
                      <CheckCircle2Icon className="size-4" />
                    </button>

                    <Link href={`/san-pham/${item.maSanPham}`} className="block shrink-0">
                      <div className="aspect-[4/5] w-full overflow-hidden rounded-lg bg-stone-100">
                        {src ? (
                          <img src={src} alt={item.tenSanPham} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ShoppingBagIcon className="size-8 text-stone-300" strokeWidth={1} />
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Thông tin */}
                    <div className="flex flex-col justify-center gap-1 sm:col-span-1">
                      <p className="text-[10px] font-medium uppercase tracking-widest text-stone-400">
                        {item.tenThuongHieu ?? ""}
                      </p>
                      <Link href={`/san-pham/${item.maSanPham}`} className="text-sm font-medium text-stone-900 hover:text-stone-600 transition-colors line-clamp-2">
                        {item.tenSanPham}
                      </Link>
                      <p className="text-sm font-semibold text-stone-700 sm:hidden">
                        {formatCurrency(item.gia)}
                      </p>
                    </div>

                    {/* Số lượng */}
                    <div className="col-span-3 flex items-center justify-start gap-0 sm:col-span-1 sm:justify-center">
                      <button
                        onClick={() => handleUpdateQty(item.maSanPham, item.soLuong - 1)}
                        className="flex h-8 w-8 items-center justify-center border border-stone-200 text-stone-500 transition hover:border-stone-400 hover:text-stone-900"
                      >
                        <MinusIcon className="size-3" />
                      </button>
                      <span className="flex h-8 w-10 items-center justify-center border-y border-stone-200 text-sm font-medium text-stone-900">
                        {item.soLuong}
                      </span>
                      <button
                        onClick={() => handleUpdateQty(item.maSanPham, item.soLuong + 1)}
                        className="flex h-8 w-8 items-center justify-center border border-stone-200 text-stone-500 transition hover:border-stone-400 hover:text-stone-900"
                      >
                        <PlusIcon className="size-3" />
                      </button>
                    </div>

                    {/* Thành tiền */}
                    <div className="hidden text-right sm:block">
                      <p className="text-sm font-semibold text-stone-900">
                        {formatCurrency(item.gia * item.soLuong)}
                      </p>
                      <p className="text-[11px] text-stone-400">{formatCurrency(item.gia)} / sp</p>
                    </div>

                    {/* Xóa */}
                    <div className="hidden items-center justify-end sm:flex">
                      <button
                        onClick={() => handleRemove(item.maSanPham)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-stone-300 transition hover:bg-red-50 hover:text-red-500"
                      >
                        <TrashIcon className="size-4" />
                      </button>
                    </div>
                  </div>
                )
              })}

              {/* Xóa tất cả */}
              <div className="flex justify-end pt-4">
                  <button
                    onClick={handleClear}
                  className="text-xs text-stone-400 underline underline-offset-2 transition hover:text-red-500"
                >
                  Xóa tất cả
                </button>
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <h2 className="mb-6 font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-400">
                  Tóm tắt đơn hàng
                </h2>

                {/* Coupon */}
                <div className="mb-6">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <TagIcon className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        placeholder="Mã giảm giá"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                        className="w-full rounded-lg border border-stone-200 bg-stone-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-stone-400 focus:bg-white"
                      />
                    </div>
                    <button
                      onClick={() => { if (coupon) setCouponApplied(true) }}
                      className="rounded-lg border border-stone-200 px-4 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                    >
                      Áp dụng
                    </button>
                  </div>
                  {couponApplied && (
                    <p className="mt-2 text-xs text-emerald-600">✓ Đã áp dụng giảm 10%</p>
                  )}
                </div>

                <div className="h-px bg-stone-100" />

                <div className="my-5">
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">
                    Phương thức thanh toán
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-11 w-full rounded-lg border border-stone-200 bg-stone-50 px-3 text-sm text-stone-700 outline-none transition focus:border-stone-400 focus:bg-white"
                  >
                    <option value="COD">Thanh toán khi nhận hàng</option>
                    <option value="Banking">Chuyển khoản</option>
                  </select>
                </div>

                {/* Chi tiết giá */}
                <div className="my-5 space-y-3">
                  <div className="flex justify-between text-sm text-stone-600">
                    <span>Tạm tính ({itemCount} sản phẩm)</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-stone-600">
                    <span>Phí vận chuyển</span>
                    <span className="text-emerald-600">Miễn phí</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-sm text-emerald-600">
                      <span>Giảm giá (10%)</span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}
                </div>

                <div className="h-px bg-stone-100" />

                <div className="my-5 flex items-baseline justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">Tổng cộng</span>
                  <span className="font-heading text-2xl font-semibold text-stone-950">
                    {formatCurrency(total)}
                  </span>
                </div>

                {message && (
                  <div className="mb-3 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs text-emerald-700">
                    <CheckCircle2Icon className="mt-0.5 size-4 shrink-0" />
                    <span>{message}</span>
                  </div>
                )}
                {error && (
                  <div className="mb-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">
                    <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  disabled={selectedIds.length === 0 || checkoutLoading}
                  onClick={handleCheckout}
                  className="h-12 w-full rounded-full bg-stone-900 text-[13px] font-semibold uppercase tracking-widest text-white shadow-md transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {checkoutLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2Icon className="size-4 animate-spin" />
                      Đang đặt hàng
                    </span>
                  ) : (
                    "Đặt hàng"
                  )}
                </Button>
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  )
}
