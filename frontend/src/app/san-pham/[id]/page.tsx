"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { API_URL, getProductById, getProducts, addToCart, getReviewsByProduct, getReviewStats, createReview } from "@/lib/api"
import { getStoredUser } from "@/lib/auth"
import type { NguoiDung, SanPham } from "@/lib/types"
import type { DanhGia } from "@/lib/api"
import { UserMenu } from "@/components/user-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeftIcon, ShoppingBagIcon, TagIcon,
  PackageIcon, PaletteIcon, RulerIcon, SparklesIcon,
  HeartIcon, ShareIcon, StarIcon, CheckCircle2Icon,
  ChevronRightIcon, TrendingUpIcon, ShieldCheckIcon,
  ZapIcon, MinusIcon, PlusIcon,
} from "lucide-react"

// ── helpers ───────────────────────────────────────────────────
const API_ORIGIN = API_URL.replace(/\/api\/?$/, "")

function imgSrc(hinhAnh?: string | null): string | null {
  if (!hinhAnh?.trim()) return null
  const p = hinhAnh.trim()
  if (/^https?:\/\//i.test(p)) return p
  // Nếu path bắt đầu bằng /, lấy từ backend static files
  if (p.startsWith("/")) return `${API_ORIGIN}${p}`
  // Nếu không, lấy từ frontend public/ (Next.js serve ở root)
  return `/${p}`
}

function fmt(v: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v)
}

// ── Skeleton ──────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 h-4 w-56 animate-pulse rounded-full bg-stone-200" />
      <div className="grid gap-12 lg:grid-cols-[420px_1fr]">
        <div className="aspect-[3/4] animate-pulse rounded-[2rem] bg-stone-200" />
        <div className="space-y-6 pt-2">
          <div className="h-5 w-28 animate-pulse rounded-full bg-stone-200" />
          <div className="space-y-3">
            <div className="h-9 w-3/4 animate-pulse rounded-2xl bg-stone-200" />
            <div className="h-9 w-1/2 animate-pulse rounded-2xl bg-stone-200" />
          </div>
          <div className="h-12 w-40 animate-pulse rounded-2xl bg-stone-200" />
          <div className="space-y-2.5">
            {[1,2,3,4].map(i => <div key={i} className="h-4 animate-pulse rounded-full bg-stone-100" style={{width: `${85 - i*8}%`}} />)}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Related card ──────────────────────────────────────────────
function RelatedCard({ product }: { product: SanPham }) {
  const src = imgSrc(product.hinhAnh)
  return (
    <Link href={`/san-pham/${product.maSanPham}`} className="group block">
      <div className="overflow-hidden rounded-[1.25rem] border border-stone-200/50 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(28,25,23,0.12)]">
        <div className="relative aspect-[3/4] overflow-hidden bg-stone-50">
          {src ? (
            <img src={src} alt={product.tenSanPham} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200/60">
              <ShoppingBagIcon className="size-8 text-stone-300" strokeWidth={1} />
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-900/20 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
        </div>
        <div className="p-3.5">
          <p className="truncate text-sm font-semibold text-stone-900">{product.tenSanPham}</p>
          <p className="mt-0.5 truncate text-xs text-stone-400">{product.tenThuongHieu}</p>
          <p className="mt-2 text-sm font-bold text-amber-700">{fmt(product.gia)}</p>
        </div>
      </div>
    </Link>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function SanPhamDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)

  const [product, setProduct] = useState<SanPham | null>(null)
  const [related, setRelated] = useState<SanPham[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [currentUser, setCurrentUser] = useState<NguoiDung | null>(null)
  const [wishlisted, setWishlisted] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [qty, setQty] = useState(1)
  const [reviews, setReviews] = useState<DanhGia[]>([])
  const [reviewStats, setReviewStats] = useState({ average: 0, total: 0 })
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewSao, setReviewSao] = useState(5)
  const [reviewText, setReviewText] = useState("")
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewError, setReviewError] = useState("")
  const [reviewSuccess, setReviewSuccess] = useState("")
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => { setCurrentUser(getStoredUser()) }, [])

  // Load reviews
  useEffect(() => {
    if (!id) return
    Promise.all([
      getReviewsByProduct(id).catch(() => []),
      getReviewStats(id).catch(() => ({ average: 0, total: 0 })),
    ]).then(([r, s]) => {
      setReviews(r)
      setReviewStats(s)
    })
  }, [id])

  useEffect(() => {
    if (!id) return
    setLoading(true); setNotFound(false); setAddedToCart(false); setQty(1); setActiveImageIndex(0)
    Promise.all([getProductById(id), getProducts()])
      .then(([p, all]) => {
        setProduct(p)
        setRelated(all.filter(x => x.maSanPham !== id && x.maDanhMuc === p.maDanhMuc).slice(0, 4))
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  // ── Lấy danh sách tất cả ảnh có trong database ──
  const allImages = useCallback(() => {
    if (!product) return []
    const imgs = [
      product.hinhAnh,
      product.hinhAnh2,
      product.hinhAnh3,
      product.hinhAnh4,
    ].filter((img): img is string => !!img?.trim())
    return imgs
  }, [product])

  const images = allImages()
  const currentSrc = images[activeImageIndex] ? imgSrc(images[activeImageIndex]) : null

  // ── Not found ──
  if (!loading && (notFound || !product)) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-5 bg-[#faf9f7]">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-stone-100">
          <PackageIcon className="size-10 text-stone-300" strokeWidth={1} />
        </div>
        <div className="text-center">
          <h1 className="font-heading text-2xl font-semibold text-stone-800">Không tìm thấy sản phẩm</h1>
          <p className="mt-1 text-stone-500">Sản phẩm này không tồn tại hoặc đã bị xóa.</p>
        </div>
        <Button asChild className="rounded-full bg-stone-900 px-6 text-white hover:bg-stone-800">
          <Link href="/">Về trang chủ</Link>
        </Button>
      </div>
    )
  }

  const inStock = (product?.soLuongTon ?? 0) > 0
  const stockLevel = (product?.soLuongTon ?? 0) > 20 ? "high" : (product?.soLuongTon ?? 0) > 5 ? "medium" : "low"

  return (
    <div className="min-h-svh bg-[#faf9f7] text-stone-900 antialiased">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 border-b border-stone-200/40 bg-[#faf9f7]/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-200 via-rose-100 to-violet-200 shadow-sm ring-1 ring-white/80">
              <span className="font-heading text-base font-bold text-stone-800">T</span>
            </div>
            <span className="font-heading hidden text-base font-semibold tracking-[0.12em] text-stone-900 sm:block">THƯƠNG MẠI</span>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            {currentUser ? (
              <UserMenu initialUser={currentUser} />
            ) : (
              <>
                <Button asChild size="sm" variant="ghost" className="rounded-full px-4 text-stone-600 hover:bg-white/80">
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button asChild size="sm" className="rounded-full bg-stone-900 px-5 text-white hover:bg-stone-800">
                  <Link href="/signup">Tham gia</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </header>

      {loading ? (
        <Skeleton />
      ) : product ? (
        <main>
          {/* ── Breadcrumb ── */}
          <div className="border-b border-stone-200/30 bg-white/50 backdrop-blur-sm">
            <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-4 py-2.5 text-xs text-stone-400 sm:px-6 lg:px-8">
              <Link href="/" className="transition hover:text-stone-700">Trang chủ</Link>
              <ChevronRightIcon className="size-3 text-stone-300" />
              <Link href="/#collection" className="transition hover:text-stone-700">Bộ sưu tập</Link>
              {product.tenDanhMuc && (
                <>
                  <ChevronRightIcon className="size-3 text-stone-300" />
                  <span>{product.tenDanhMuc}</span>
                </>
              )}
              <ChevronRightIcon className="size-3 text-stone-300" />
              <span className="max-w-[140px] truncate font-medium text-stone-600">{product.tenSanPham}</span>
            </div>
          </div>

          {/* ── Hero section ── */}
          <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <div className="grid items-start gap-10 lg:grid-cols-[400px_1fr] xl:grid-cols-[440px_1fr] xl:gap-16">

              {/* ── Left: Image panel ── */}
              <div className="lg:sticky lg:top-24">
                {/* Back button */}
                <button
                  onClick={() => router.back()}
                  className="mb-5 flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-stone-900"
                >
                  <ArrowLeftIcon className="size-4" />
                  Quay lại
                </button>

                <div className="relative">
                  {/* Ambient glow */}
                  <div className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-amber-200/25 via-rose-100/15 to-violet-200/20 blur-3xl" aria-hidden />

                  {/* Main image card */}
                  <div className="relative overflow-hidden rounded-[1.75rem] bg-white shadow-[0_20px_60px_-12px_rgba(28,25,23,0.15)] ring-1 ring-stone-200/50">
                    {currentSrc ? (
                      <img
                        src={currentSrc}
                        alt={product.tenSanPham}
                        className="aspect-[4/5] w-full object-cover object-center"
                      />
                    ) : (
                      <div className="flex aspect-[4/5] w-full items-center justify-center bg-gradient-to-br from-stone-50 via-amber-50/40 to-rose-50/30">
                        <ShoppingBagIcon className="size-20 text-stone-200" strokeWidth={0.8} />
                      </div>
                    )}

                    {/* Top-left badges */}
                    <div className="absolute left-4 top-4 flex flex-col gap-2">
                      {product.tenDanhMuc && (
                        <span className="rounded-full border border-white/50 bg-white/85 px-3 py-1 text-[11px] font-semibold text-stone-700 shadow-sm backdrop-blur-sm">
                          {product.tenDanhMuc}
                        </span>
                      )}
                      {!inStock && (
                        <span className="rounded-full bg-stone-900/75 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                          Hết hàng
                        </span>
                      )}
                    </div>

                    {/* Wishlist */}
                    <button
                      onClick={() => setWishlisted(w => !w)}
                      className={`absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border shadow-sm backdrop-blur-sm transition-all duration-200 ${
                        wishlisted
                          ? "border-rose-200 bg-rose-50 text-rose-500 scale-110"
                          : "border-white/50 bg-white/80 text-stone-400 hover:scale-105 hover:text-rose-400"
                      }`}
                      aria-label="Yêu thích"
                    >
                      <HeartIcon className={`size-4 transition-all duration-200 ${wishlisted ? "fill-rose-400 text-rose-400" : ""}`} />
                    </button>

                    {/* Bottom gradient overlay */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/30 to-transparent" />
                  </div>

                  {/* ── Thumbnail gallery dưới ảnh chính ── */}
                  {images.length > 1 && (
                    <div className="mt-4 flex gap-3">
                      {images.map((img, idx) => {
                        const thumbSrc = imgSrc(img)
                        if (!thumbSrc) return null
                        return (
                          <button
                            key={idx}
                            onClick={() => setActiveImageIndex(idx)}
                            className={`relative shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                              idx === activeImageIndex
                                ? "border-stone-900 ring-1 ring-stone-900/20 shadow-md"
                                : "border-stone-200 opacity-70 hover:opacity-100 hover:border-stone-400"
                            }`}
                          >
                            <img
                              src={thumbSrc}
                              alt={`${product.tenSanPham} ${idx + 1}`}
                              className="h-20 w-16 object-cover"
                            />
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* Share button below image */}
                  <div className="mt-3 flex justify-end">
                    <button className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-stone-500 shadow-sm transition hover:bg-white hover:text-stone-800">
                      <ShareIcon className="size-3.5" />
                      Chia sẻ
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Right: Product info ── */}
              <div className="flex flex-col gap-7">

                {/* Brand badge + title */}
                <div>
                  {product.tenThuongHieu && (
                    <div className="mb-3">
                      <Badge className="gap-1.5 rounded-full border border-amber-200/60 bg-gradient-to-r from-amber-50 to-orange-50 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-800 shadow-sm hover:from-amber-50 hover:to-orange-50">
                        <SparklesIcon className="size-3" />
                        {product.tenThuongHieu}
                      </Badge>
                    </div>
                  )}
                  <h1 className="font-heading text-3xl font-semibold leading-[1.1] tracking-tight text-stone-950 sm:text-4xl">
                    {product.tenSanPham}
                  </h1>

                  {/* Rating */}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map(i => (
                        <StarIcon key={i} className={`size-3.5 ${i <= 4 ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200"}`} />
                      ))}
                    </div>
                    <span className="text-xs text-stone-400">4.0 · 12 đánh giá</span>
                    <span className="text-stone-200">·</span>
                    <span className={`text-xs font-medium ${
                      stockLevel === "high" ? "text-emerald-600" :
                      stockLevel === "medium" ? "text-amber-600" : "text-red-500"
                    }`}>
                      {inStock ? `Còn ${product.soLuongTon} sản phẩm` : "Hết hàng"}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="font-heading text-4xl font-bold tracking-tight text-stone-950">
                    {fmt(product.gia)}
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    Giá niêm yết
                  </span>
                </div>

                {/* Description */}
                {product.moTa && (
                  <div className="rounded-2xl border border-stone-200/50 bg-white/60 px-5 py-4">
                    <p className="text-sm leading-relaxed text-stone-600">{product.moTa}</p>
                  </div>
                )}

                {/* Attributes grid */}
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2">
                  {[
                    product.mauSac && { icon: PaletteIcon, label: "Màu sắc", value: product.mauSac, accent: "bg-rose-50 text-rose-600" },
                    product.size   && { icon: RulerIcon,   label: "Kích cỡ",  value: product.size,   accent: "bg-violet-50 text-violet-600" },
                    product.tenDanhMuc && { icon: TagIcon, label: "Danh mục", value: product.tenDanhMuc, accent: "bg-sky-50 text-sky-600" },
                    { icon: PackageIcon, label: "Tồn kho", value: inStock ? `${product.soLuongTon} cái` : "Hết hàng",
                      accent: stockLevel === "high" ? "bg-emerald-50 text-emerald-600" : stockLevel === "medium" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-500" },
                  ].filter(Boolean).map((attr: any) => (
                    <div key={attr.label} className="flex items-center gap-3 rounded-xl border border-stone-100 bg-white/70 px-3.5 py-3 shadow-sm">
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${attr.accent}`}>
                        <attr.icon className="size-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">{attr.label}</p>
                        <p className="truncate text-sm font-semibold text-stone-800">{attr.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />

                {/* Quantity + CTA */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-stone-600">Số lượng</span>
                    <div className="flex items-center overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
                      <button
                        onClick={() => setQty(q => Math.max(1, q - 1))}
                        disabled={qty <= 1}
                        className="flex h-9 w-9 items-center justify-center text-stone-400 transition hover:bg-stone-50 hover:text-stone-800 disabled:opacity-30"
                      >
                        <MinusIcon className="size-3.5" />
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-stone-900">{qty}</span>
                      <button
                        onClick={() => setQty(q => Math.min(product.soLuongTon, q + 1))}
                        disabled={qty >= product.soLuongTon}
                        className="flex h-9 w-9 items-center justify-center text-stone-400 transition hover:bg-stone-50 hover:text-stone-800 disabled:opacity-30"
                      >
                        <PlusIcon className="size-3.5" />
                      </button>
                    </div>
                    <span className="text-xs text-stone-400">Tối đa {product.soLuongTon}</span>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={async () => {
                        if (!currentUser) { router.push("/login"); return }
                        try {
                          setAddedToCart(true)
                          await addToCart(currentUser.maNguoiDung, { maSanPham: product.maSanPham, soLuong: qty })
                          window.dispatchEvent(new Event("cart-updated"))
                          router.push("/gio-hang")
                        } catch {
                          setAddedToCart(false)
                        }
                      }}
                      disabled={!inStock}
                      className={`h-12 flex-1 rounded-2xl border-0 text-[15px] font-semibold shadow-lg transition-all duration-300 ${
                        addedToCart
                          ? "bg-emerald-600 shadow-emerald-500/20 hover:bg-emerald-700"
                          : "bg-stone-950 shadow-stone-900/20 hover:bg-stone-800 hover:shadow-xl"
                      } disabled:opacity-40`}
                    >
                      {addedToCart ? (
                        <span className="flex items-center gap-2">
                          <CheckCircle2Icon className="size-5" /> Đã thêm vào giỏ
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <ShoppingBagIcon className="size-5" />
                          {inStock ? "Thêm vào giỏ hàng" : "Hết hàng"}
                        </span>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Trust row */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: ShieldCheckIcon, label: "Chính hãng 100%",  sub: "Cam kết xác thực" },
                    { icon: ZapIcon,         label: "Giao hàng nhanh",  sub: "2–4 ngày làm việc" },
                    { icon: TrendingUpIcon,  label: "Đổi trả 7 ngày",   sub: "Miễn phí đổi trả" },
                  ].map(({ icon: Icon, label, sub }) => (
                    <div key={label} className="flex flex-col items-center gap-1.5 rounded-xl border border-stone-100 bg-white/60 px-2 py-3 text-center shadow-sm">
                      <Icon className="size-4 text-amber-600" strokeWidth={1.5} />
                      <p className="text-[11px] font-semibold text-stone-700">{label}</p>
                      <p className="text-[10px] text-stone-400">{sub}</p>
                    </div>
                  ))}
                </div>
                </div>
              </div>
            </section>

          {/* ── Reviews section ── */}
          <section className="border-t border-stone-200/40 py-14 lg:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-700/80">Đánh giá</p>
                  <h2 className="font-heading text-2xl font-semibold tracking-tight text-stone-950">
                    Khách hàng nói gì
                  </h2>
                  {reviewStats.total > 0 && (
                    <p className="mt-1 text-sm text-stone-500">
                      {reviewStats.average.toFixed(1)} / 5 · {reviewStats.total} đánh giá
                    </p>
                  )}
                </div>
                {currentUser && (
                  <Button
                    onClick={() => { setShowReviewForm(true); setReviewError(""); setReviewSuccess("") }}
                    className="rounded-full bg-stone-900 px-5 text-xs text-white hover:bg-stone-800"
                  >
                    Viết đánh giá
                  </Button>
                )}
              </div>

              {/* Review form */}
              {showReviewForm && (
                <div className="mb-8 rounded-2xl border border-stone-200 bg-stone-50/60 p-6">
                  <h3 className="mb-4 text-sm font-semibold text-stone-900">Đánh giá sản phẩm này</h3>
                  {reviewError && <p className="mb-3 text-sm text-red-600">{reviewError}</p>}
                  {reviewSuccess && <p className="mb-3 text-sm text-emerald-600">{reviewSuccess}</p>}
                  <div className="mb-4 flex items-center gap-1">
                    {[1,2,3,4,5].map((s) => (
                      <button key={s} type="button" onClick={() => setReviewSao(s)} className="transition hover:scale-110">
                        <StarIcon className={`size-6 ${s <= reviewSao ? "fill-amber-400 text-amber-400" : "text-stone-300"}`} />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-stone-500">{reviewSao}/5</span>
                  </div>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                    className="min-h-24 w-full rounded-xl border border-stone-200 bg-white p-4 text-sm outline-none focus:border-stone-400"
                    maxLength={500}
                  />
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-stone-400">{reviewText.length}/500</span>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setShowReviewForm(false)} className="rounded-full border-stone-200 text-sm text-stone-600">
                        Hủy
                      </Button>
                      <Button
                        disabled={submittingReview}
                        onClick={async () => {
                          setSubmittingReview(true); setReviewError(""); setReviewSuccess("")
                          try {
                            const result = await createReview(currentUser!.maNguoiDung, { maSanPham: id, soSao: reviewSao, binhLuan: reviewText })
                            setReviews((prev) => [result, ...prev])
                            setReviewStats((prev) => ({
                              average: (prev.average * prev.total + reviewSao) / (prev.total + 1),
                              total: prev.total + 1,
                            }))
                            setReviewSuccess("Cảm ơn bạn đã đánh giá sản phẩm!")
                            setReviewText("")
                            setTimeout(() => setShowReviewForm(false), 1500)
                          } catch (err) {
                            setReviewError(err instanceof Error ? err.message : "Gửi đánh giá thất bại")
                          } finally { setSubmittingReview(false) }
                        }}
                        className="rounded-full bg-stone-900 px-5 text-sm text-white hover:bg-stone-800 disabled:opacity-50"
                      >
                        {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews list */}
              {reviews.length === 0 ? (
                <div className="rounded-2xl border border-stone-100 bg-white/50 px-6 py-12 text-center">
                  <p className="text-sm text-stone-400">Chưa có đánh giá nào cho sản phẩm này.</p>
                  {!currentUser && (
                    <Button asChild className="mt-4 rounded-full bg-stone-900 px-5 text-xs text-white">
                      <Link href="/login">Đăng nhập để đánh giá</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid gap-4">
                  {reviews.map((review) => (
                    <div key={review.maDanhGia} className="rounded-2xl border border-stone-100 bg-white/70 p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 via-rose-100 to-violet-200 text-xs font-bold text-stone-700">
                            {review.tenDangNhap.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-stone-900">{review.tenDangNhap}</p>
                            <div className="flex items-center gap-1">
                              {[1,2,3,4,5].map((s) => (
                                <StarIcon key={s} className={`size-3.5 ${s <= review.soSao ? "fill-amber-400 text-amber-400" : "text-stone-200"}`} />
                              ))}
                              <span className="ml-1 text-xs text-stone-400">{new Date(review.ngayDanhGia).toLocaleDateString("vi-VN")}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {review.binhLuan && (
                        <p className="mt-3 text-sm leading-relaxed text-stone-600">{review.binhLuan}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ── Related products ── */}
          {related.length > 0 && (
            <section className="border-t border-stone-200/40 bg-white/50 py-14 lg:py-16">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-end justify-between">
                  <div>
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-700/80">Cùng danh mục</p>
                    <h2 className="font-heading text-2xl font-semibold tracking-tight text-stone-950">
                      Có thể bạn cũng thích
                    </h2>
                  </div>
                  <Button asChild variant="ghost" size="sm" className="rounded-full text-stone-500 hover:text-stone-900">
                    <Link href="/#collection" className="flex items-center gap-1.5 text-sm">
                      Xem thêm <ChevronRightIcon className="size-4" />
                    </Link>
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {related.map(p => <RelatedCard key={p.maSanPham} product={p} />)}
                </div>
              </div>
            </section>
          )}
        </main>
      ) : null}

      {/* ── Footer ── */}
      <footer className="border-t border-stone-200/40 bg-white py-8 text-center text-xs text-stone-400">
        © {new Date().getFullYear()} Thương Mại · Maison locale
      </footer>
    </div>
  )
}