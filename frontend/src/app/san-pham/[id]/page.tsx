"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { API_URL, getProductById, getProducts, addToCart, getReviewsByProduct, getReviewStats, createReview } from "@/lib/api"
import { addToCart as addToLocalCart } from "@/lib/cart"
import { getStoredUser } from "@/lib/auth"
import type { NguoiDung, SanPham } from "@/lib/types"
import type { DanhGia } from "@/lib/api"
import { UserMenu } from "@/components/user-menu"
import { CartIcon } from "@/components/cart-icon"
import {
  ArrowLeftIcon, ShoppingBagIcon, HeartIcon,
  StarIcon, CheckCircle2Icon, UserIcon,
  MapPinIcon, ChevronRightIcon,
} from "lucide-react"

// ── helpers ───────────────────────────────────────────────────
const API_ORIGIN = API_URL.replace(/\/api\/?$/, "")

function imgSrc(hinhAnh?: string | null): string | null {
  if (!hinhAnh?.trim()) return null
  const p = hinhAnh.trim()
  if (/^https?:\/\//i.test(p)) return p
  if (p.startsWith("/")) return `${API_ORIGIN}${p}`
  return `/${p}`
}

function fmt(v: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v)
}

type ProductAttribute = {
  label: string
  value: string
}

// ── Skeleton ──────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="mx-auto max-w-screen-xl px-10 py-16">
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="aspect-[3/4] animate-pulse bg-stone-100" />
        <div className="space-y-8 px-16 pt-8">
          <div className="h-3 w-32 animate-pulse bg-stone-100" />
          <div className="space-y-3">
            <div className="h-10 w-3/4 animate-pulse bg-stone-100" />
            <div className="h-10 w-1/2 animate-pulse bg-stone-100" />
          </div>
          <div className="h-20 animate-pulse bg-stone-100" />
        </div>
      </div>
    </div>
  )
}

// ── Related card ──────────────────────────────────────────────
function RelatedCard({ product }: { product: SanPham }) {
  const src = imgSrc(product.hinhAnh)
  const hoverSrc = imgSrc(product.hinhAnh2)
  const hasHoverImage = Boolean(src && hoverSrc && hoverSrc !== src)

  return (
    <Link href={`/san-pham/${product.maSanPham}`} className="group block">
      <div
        className="overflow-hidden rounded-lg border border-stone-200/50 bg-white transition-colors duration-300 hover:bg-stone-50"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
          {src ? (
            <>
              <img
                src={src}
                alt={product.tenSanPham}
                className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
              />
              {hasHoverImage && (
                <img
                  src={hoverSrc!}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-700 ease-out group-hover:scale-[1.05] group-hover:opacity-100"
                />
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <ShoppingBagIcon className="size-10 text-stone-300" strokeWidth={1} />
            </div>
          )}
          {/* hover overlay */}
          <div className="pointer-events-none absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/8" />
          <span className="absolute bottom-4 left-0 right-0 text-center text-[9px] font-medium uppercase tracking-[0.3em] text-white opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            Xem sản phẩm
          </span>
        </div>
        <div className="px-5 py-4">
          <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.3em] text-stone-400">{product.tenThuongHieu}</p>
          <p className="text-sm font-medium leading-snug text-stone-900">{product.tenSanPham}</p>
          <p className="mt-2 text-sm font-semibold text-stone-950">{fmt(product.gia)}</p>
        </div>
      </div>
    </Link>
  )
}

// ── OrnamentDivider ───────────────────────────────────────────
function OrnamentDivider() {
  return (
    <div className="flex items-center gap-4 py-2">
      <div className="h-px flex-1 bg-stone-200" />
      <div className="h-1.5 w-1.5 rotate-45 bg-stone-300" />
      <div className="h-px flex-1 bg-stone-200" />
    </div>
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
  const [currentUser] = useState<NguoiDung | null>(() => getStoredUser())
  const [wishlisted, setWishlisted] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [cartError, setCartError] = useState("")
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
  const [zoomOpen, setZoomOpen] = useState(false)

  useEffect(() => {
    if (!id) return
    Promise.all([
      getReviewsByProduct(id).catch(() => []),
      getReviewStats(id).catch(() => ({ average: 0, total: 0 })),
    ]).then(([r, s]) => { setReviews(r); setReviewStats(s) })
  }, [id])

  useEffect(() => {
    if (!id) return
    queueMicrotask(() => {
      setLoading(true)
      setNotFound(false)
      setAddedToCart(false)
      setCartError("")
      setQty(1)
      setActiveImageIndex(0)
    })
    Promise.all([getProductById(id), getProducts()])
      .then(([p, all]) => {
        setProduct(p)
        setRelated(all.filter(x => x.maSanPham !== id && x.maDanhMuc === p.maDanhMuc).slice(0, 4))
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  const allImages = useCallback(() => {
    if (!product) return []
    return [product.hinhAnh, product.hinhAnh2, product.hinhAnh3, product.hinhAnh4]
      .filter((img): img is string => !!img?.trim())
  }, [product])

  const images = allImages()
  const currentSrc = images[activeImageIndex] ? imgSrc(images[activeImageIndex]) : null

  // ── Not found ──
  if (!loading && (notFound || !product)) {
    return (
      <div
        className="flex min-h-svh flex-col items-center justify-center gap-6"
        style={{ background: "#ffffff" }}
      >
        <ShoppingBagIcon className="size-12 text-stone-300" strokeWidth={0.8} />
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-stone-900">Không tìm thấy sản phẩm</h1>
          <p className="mt-2 text-sm tracking-wide text-stone-500">Sản phẩm này không tồn tại hoặc đã bị xóa.</p>
        </div>
        <Link
          href="/"
          className="border border-stone-900 px-8 py-3 text-[9px] font-semibold uppercase tracking-[0.3em] text-stone-900 transition-colors hover:bg-stone-900 hover:text-white"
        >
          Về trang chủ
        </Link>
      </div>
    )
  }

  const inStock = (product?.soLuongTon ?? 0) > 0
  const stockLevel = (product?.soLuongTon ?? 0) > 20 ? "high" : (product?.soLuongTon ?? 0) > 5 ? "medium" : "low"

  return (
    <div
      className="min-h-svh antialiased"
      style={{
        background: "#ffffff",
        color: "#1c1917",
        fontFamily: "inherit",
        fontWeight: 400,
      }}
    >
      {/* Google Fonts */}
      <style>{`
        .visilk-serif { font-family: inherit; }
        .visilk-sans  { font-family: inherit; }

        /* Gold sweep hover for primary CTA */
        .btn-gold-sweep {
          position: relative; overflow: hidden;
          background: #1c1917; color: #ffffff;
          border: none; cursor: pointer;
          font-family: inherit;
          font-size: 10px; font-weight: 600; letter-spacing: 0.35em; text-transform: uppercase;
          transition: color 0.35s;
        }
        .btn-gold-sweep::before {
          content: ''; position: absolute; inset: 0;
          background: #292524;
          transform: translateX(-100%);
          transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .btn-gold-sweep:hover::before { transform: translateX(0); }
        .btn-gold-sweep:hover { color: #ffffff; }
        .btn-gold-sweep span { position: relative; z-index: 1; }
        .btn-gold-sweep.state-added { background: #2d5a3d; }
        .btn-gold-sweep.state-added::before { background: #2d5a3d; transform: translateX(0); }

        /* Corner ornaments */
        .corner-tl::before, .corner-tl::after,
        .corner-br::before, .corner-br::after {
          content: ''; position: absolute; background: #d6d3d1;
        }
        .corner-tl::before { top: 0; left: 0; width: 52px; height: 1px; }
        .corner-tl::after  { top: 0; left: 0; width: 1px; height: 52px; }
        .corner-br::before { bottom: 0; right: 0; width: 52px; height: 1px; }
        .corner-br::after  { bottom: 0; right: 0; width: 1px; height: 52px; }

        /* Nav underline */
        .nav-item {
          position: relative; padding-bottom: 2px;
          font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
          color: #78716c; text-decoration: none; transition: color 0.2s;
        }
        .nav-item::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0;
          height: 1px; background: #1c1917;
          transform: scaleX(0); transition: transform 0.3s; transform-origin: left;
        }
        .nav-item:hover { color: #1c1917; }
        .nav-item:hover::after { transform: scaleX(1); }

        /* Thumb */
        .thumb-item { transition: opacity 0.2s, border-color 0.2s; }
        .thumb-item:not(.active) { opacity: 0.55; border-color: transparent; }
        .thumb-item:hover:not(.active) { opacity: 0.85; border-color: #a8a29e; }
        .thumb-item.active { opacity: 1; border-color: #1c1917; }

        /* Review card separator */
        .review-row + .review-row { border-top: 1px solid #e7e5e4; }

        /* Fade-up entrance */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-enter { animation: fadeUp 0.55s ease both; }
        .anim-enter-1 { animation-delay: 0.06s; }
        .anim-enter-2 { animation-delay: 0.12s; }
        .anim-enter-3 { animation-delay: 0.18s; }
        .anim-enter-4 { animation-delay: 0.24s; }
        .anim-enter-5 { animation-delay: 0.30s; }
        .anim-enter-6 { animation-delay: 0.36s; }
      `}</style>

      {/* ── TOP BAR ── */}
      <div className="border-b border-stone-200 bg-stone-100 px-10">
        <div className="mx-auto max-w-screen-xl flex items-center justify-between py-2">
          <div className="hidden sm:flex items-center gap-7">
            {[
              { label: "Về ViSilk", href: "/#about" },
              { label: "Local Brand", href: "/#collection" },
              { label: "Câu chuyện vải lụa Việt", href: "/#about" },
            ].map((item, i) => (
              <span key={item.label} className="flex items-center gap-7">
                {i > 0 && <span style={{ color: "#3d322a" }}>|</span>}
                <Link
                  href={item.href}
                  className="text-[9px] font-semibold tracking-[0.28em] uppercase transition-colors"
                  style={{ color: "#78716c" }}
                  onMouseOver={e => (e.currentTarget.style.color = "#1c1917")}
                  onMouseOut={e => (e.currentTarget.style.color = "#78716c")}
                >
                  {item.label}
                </Link>
              </span>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-5">
            {currentUser ? (
              <div className="flex items-center gap-4">
                {(currentUser.maVaiTro === 1 || currentUser.maVaiTro === 2) && (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-[9px] font-semibold tracking-[0.25em] uppercase"
                      style={{ color: "#78716c" }}
                      onMouseOver={e => (e.currentTarget.style.color = "#1c1917")}
                      onMouseOut={e => (e.currentTarget.style.color = "#78716c")}
                    >
                      Quản trị
                    </Link>
                    <span style={{ color: "#3d322a" }}>|</span>
                  </>
                )}
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                  {currentUser.hoTen?.trim() || currentUser.tenDangNhap}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 text-[9px] font-semibold tracking-[0.25em] uppercase transition-colors"
                  style={{ color: "#78716c" }}
                  onMouseOver={e => (e.currentTarget.style.color = "#1c1917")}
                  onMouseOut={e => (e.currentTarget.style.color = "#78716c")}
                >
                  <UserIcon className="size-3" />
                  Đăng nhập
                </Link>
                <span style={{ color: "#3d322a" }}>|</span>
                <Link
                  href="/signup"
                  className="text-[9px] font-semibold tracking-[0.25em] uppercase transition-colors"
                  style={{ color: "#78716c" }}
                  onMouseOver={e => (e.currentTarget.style.color = "#1c1917")}
                  onMouseOut={e => (e.currentTarget.style.color = "#78716c")}
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50" style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)", borderBottom: "1px solid #e7e5e4" }}>
        <div className="mx-auto max-w-screen-xl px-10">
          <nav className="relative flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-0 shrink-0">
              <svg width="32" height="32" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <circle cx="18" cy="18" r="17" stroke="url(#logo-ring-h)" strokeWidth="1.2" />
                <path d="M18 7 L27 18 L18 29 L9 18 Z" fill="url(#logo-diamond-h)" opacity="0.12" />
                <path d="M11.5 13.5 L18 23 L24.5 13.5" stroke="url(#logo-v-h)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <circle cx="18" cy="23" r="1.2" fill="url(#logo-dot-h)" />
                <defs>
                  <linearGradient id="logo-ring-h" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#d97706" /><stop offset="100%" stopColor="#9333ea" />
                  </linearGradient>
                  <linearGradient id="logo-diamond-h" x1="9" y1="7" x2="27" y2="29" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                  <linearGradient id="logo-v-h" x1="11.5" y1="13.5" x2="24.5" y2="23" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#b45309" /><stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                  <linearGradient id="logo-dot-h" x1="16.8" y1="21.8" x2="19.2" y2="24.2" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#d97706" /><stop offset="100%" stopColor="#9333ea" />
                  </linearGradient>
                </defs>
              </svg>
              <span
                className="ml-3 font-heading text-[1.35rem] font-semibold tracking-[0.18em]"
                style={{ color: "#1c1917" }}
              >
                VI<span className="bg-gradient-to-r from-amber-700 to-violet-600 bg-clip-text text-transparent">SILK</span>
              </span>
            </Link>

            {/* Nav */}
            <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-6">
              {[
                { href: "/danh-muc/ao-dai", label: "Áo Dài" },
                { href: "/danh-muc/non-la", label: "Nón Lá" },
                { href: "/danh-muc/tui", label: "Túi" },
                { href: "/danh-muc/giay", label: "Giày" },
                { href: "/danh-muc/trang-suc-khan-lua", label: "Trang Sức" },
                { href: "/danh-muc/trang-suc-khan-lua", label: "Khăn Lụa" },
                { href: "/mix-match", label: "✦ Mix & Match", gold: true },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="nav-item"
                  style={item.gold ? { color: "#57534e" } : {}}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="ml-auto flex items-center gap-2">
              <CartIcon />
              {currentUser && <UserMenu initialUser={currentUser} />}
            </div>
          </nav>
        </div>
      </header>

      {/* ── BREADCRUMB ── */}
      <div className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-screen-xl px-10 py-3 flex items-center gap-2 text-[9px] tracking-[0.2em] uppercase" style={{ color: "#78716c" }}>
          <Link href="/" className="transition-colors hover:text-stone-900">Trang chủ</Link>
          <ChevronRightIcon className="size-3 text-stone-300" />
          <Link href="/#collection" className="transition-colors hover:text-stone-900">Bộ sưu tập</Link>
          {product?.tenDanhMuc && (
            <>
              <ChevronRightIcon className="size-3 text-stone-300" />
              <span>{product.tenDanhMuc}</span>
            </>
          )}
          {product?.tenSanPham && (
            <>
              <ChevronRightIcon className="size-3 text-stone-300" />
              <span className="max-w-[160px] truncate text-stone-600">{product.tenSanPham}</span>
            </>
          )}
        </div>
      </div>

      {/* ── CONTENT ── */}
      {loading ? (
        <Skeleton />
      ) : product ? (
        <main>

          {/* ── HERO ── */}
          <section className="mx-auto max-w-screen-xl px-10 py-12 lg:py-16">
            <div className="grid lg:grid-cols-2 gap-0">

              {/* LEFT: Images */}
              <div className="lg:sticky lg:top-20 self-start pr-0 lg:pr-14">
                <button
                  onClick={() => router.back()}
                  className="mb-6 flex items-center gap-2 text-[9px] font-semibold tracking-[0.25em] uppercase transition-colors"
                  style={{ color: "#78716c" }}
                  onMouseOver={e => (e.currentTarget.style.color = "#1c1917")}
                  onMouseOut={e => (e.currentTarget.style.color = "#78716c")}
                >
                  <ArrowLeftIcon className="size-3.5" />
                  Quay lại
                </button>

                {/* Main image */}
                <div className="relative corner-tl corner-br" style={{ position: "relative" }}>
                  <div className="aspect-[3/4] overflow-hidden bg-stone-100">
                    {currentSrc ? (
                      <button
                        type="button"
                        onClick={() => setZoomOpen(true)}
                        className="block h-full w-full cursor-zoom-in"
                        aria-label="Phóng to ảnh sản phẩm"
                      >
                        <img
                          src={currentSrc}
                          alt={product.tenSanPham}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.04]"
                        />
                      </button>
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ShoppingBagIcon className="size-16 text-stone-300" strokeWidth={0.8} />
                      </div>
                    )}

                    {/* Category tag — vertical right */}
                    {product.tenDanhMuc && (
                      <div
                        className="absolute right-0 top-6 z-10 text-[8px] font-semibold tracking-[0.3em] uppercase py-2 px-3"
                        style={{
                          background: "#1c1917", color: "#ffffff",
                          writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)",
                        }}
                      >
                        {product.tenDanhMuc}
                      </div>
                    )}

                    {/* Out of stock */}
                    {!inStock && (
                      <div
                        className="absolute top-5 left-5 text-[9px] font-semibold tracking-[0.2em] uppercase px-3 py-1.5"
                        style={{ background: "#1c1917", color: "#ffffff" }}
                      >
                        Hết hàng
                      </div>
                    )}

                    {/* Wishlist */}
                    <button
                      onClick={() => setWishlisted(w => !w)}
                      className="absolute bottom-5 left-5 flex items-center justify-center transition-all"
                      style={{
                        width: 42, height: 42,
                        background: wishlisted ? "#f43f5e" : "rgba(255,255,255,0.9)",
                        border: wishlisted ? "1px solid #f43f5e" : "1px solid #e7e5e4",
                        color: wishlisted ? "#fff" : "#78716c",
                      }}
                      aria-label="Yêu thích"
                    >
                      <HeartIcon className="size-4" fill={wishlisted ? "currentColor" : "none"} />
                    </button>

                  </div>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="mt-4 flex gap-3">
                    {images.map((img, idx) => {
                      const thumbSrc = imgSrc(img)
                      if (!thumbSrc) return null
                      return (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`thumb-item shrink-0 overflow-hidden border`}
                          style={{ width: 68, height: 86 }}
                        >
                          <img src={thumbSrc} alt={`${product.tenSanPham} ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* RIGHT: Info */}
              <div className="flex flex-col gap-0 pl-0 lg:pl-14 pt-8 lg:pt-0" style={{ borderLeft: "1px dashed #d6d3d1" }}>

                {/* Brand */}
                <div className="anim-enter anim-enter-1 flex items-center gap-3 mb-5">
                  <div className="h-px w-6 flex-shrink-0 bg-stone-300" />
                  <span className="text-[9px] font-semibold uppercase tracking-[0.4em] text-stone-500">
                    {product.tenThuongHieu || "ViSilk"}
                  </span>
                </div>

                {/* Title */}
                <h1 className="anim-enter anim-enter-2 mb-4 font-sans font-[450] leading-[1.05] tracking-wide text-stone-950" style={{ fontSize: "clamp(34px,4vw,50px)" }}>
                  {product.tenSanPham.split(" ").slice(0, 2).join(" ")}<br />
                  <em className="text-stone-600" style={{ fontStyle: "normal" }}>
                    {product.tenSanPham.split(" ").slice(2).join(" ") || product.tenSanPham}
                  </em>
                </h1>

                {/* Rating + stock */}
                <div className="anim-enter anim-enter-3 flex items-center gap-4 mb-8">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <StarIcon
                        key={i}
                        className="size-3.5"
                        fill={i <= Math.round(reviewStats.average || 4) ? "#f59e0b" : "none"}
                        style={{ color: i <= Math.round(reviewStats.average || 4) ? "#f59e0b" : "#d6d3d1" }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] tracking-[0.1em] text-stone-500">
                    {reviewStats.average > 0 ? reviewStats.average.toFixed(1) : "4.0"} · {reviewStats.total || 12} đánh giá
                  </span>
                  <span className="text-stone-300">|</span>
                  <span
                    className="text-[9px] font-semibold tracking-[0.2em] uppercase px-3 py-1 border"
                    style={{
                      borderColor: stockLevel === "low" ? "#ef4444" : "#d6d3d1",
                      color: stockLevel === "low" ? "#ef4444" : "#57534e",
                    }}
                  >
                    {inStock ? `Còn ${product.soLuongTon}` : "Hết hàng"}
                  </span>
                </div>

                {/* Price block */}
                <div
                  className="anim-enter anim-enter-4 mb-8 p-6 relative overflow-hidden"
                  style={{ background: "#ffffff", border: "1px solid #e7e5e4" }}
                >
                  {/* gold right accent */}
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-stone-900" />
                  <p className="mb-2 text-[8px] font-semibold uppercase tracking-[0.35em] text-stone-400">
                    Giá niêm yết
                  </p>
                  <p className="font-sans font-semibold leading-none text-stone-950" style={{ fontSize: 40 }}>
                    {fmt(product.gia)}
                  </p>
                  <p className="mt-2 text-[8px] tracking-[0.2em] text-stone-400">
                    Bao gồm VAT · Miễn phí vận chuyển
                  </p>
                </div>

                {/* Description */}
                {product.moTa && (
                  <div
                    className="anim-enter anim-enter-5 mb-8 pl-5"
                    style={{ borderLeft: "2px solid #d6d3d1" }}
                  >
                    <p className="font-sans leading-relaxed text-stone-600" style={{ fontSize: 15 }}>
                      {product.moTa}
                    </p>
                  </div>
                )}

                {/* Attributes */}
                <div
                  className="anim-enter anim-enter-6 grid grid-cols-2 mb-8"
                  style={{ border: "1px solid #e7e5e4" }}
                >
                  {[
                    product.mauSac    && { label: "Màu sắc",  value: product.mauSac },
                    product.size      && { label: "Kích cỡ",  value: product.size },
                    product.tenDanhMuc && { label: "Danh mục", value: product.tenDanhMuc },
                    {
                      label: "Tồn kho",
                      value: inStock ? `${product.soLuongTon} cái` : "Hết hàng",
                    },
                  ].filter((attr): attr is ProductAttribute => Boolean(attr)).map((attr, i) => (
                    <div
                      key={attr.label}
                      className="px-5 py-4"
                      style={{
                        background: "#ffffff",
                        borderRight: i % 2 === 0 ? "1px solid #e7e5e4" : "none",
                        borderBottom: i < 2 ? "1px solid #e7e5e4" : "none",
                      }}
                    >
                      <p className="mb-1 text-[8px] font-semibold uppercase tracking-[0.3em] text-stone-400">
                        {attr.label}
                      </p>
                      <p className="text-sm font-semibold text-stone-800">
                        {attr.value}
                      </p>
                    </div>
                  ))}
                </div>

                <OrnamentDivider />

                {/* Quantity */}
                <div className="flex items-center gap-6 my-6">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-stone-500">
                    Số lượng
                  </span>
                  <div className="grid grid-cols-3 border border-stone-900">
                    <button
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      disabled={qty <= 1}
                      className="flex h-11 w-14 items-center justify-center text-lg font-medium transition-colors disabled:opacity-30"
                      style={{ color: "#1c1917" }}
                      onMouseOver={e => !e.currentTarget.disabled && (e.currentTarget.style.background = "#f5f5f4")}
                      onMouseOut={e => (e.currentTarget.style.background = "transparent")}
                    >
                      −
                    </button>
                    <span
                      className="flex h-11 w-14 items-center justify-center border-x border-stone-200 text-sm font-semibold tracking-wider"
                    >
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty(q => Math.min(product.soLuongTon, q + 1))}
                      disabled={qty >= product.soLuongTon}
                      className="flex h-11 w-14 items-center justify-center text-lg font-medium transition-colors disabled:opacity-30"
                      style={{ color: "#1c1917" }}
                      onMouseOver={e => !e.currentTarget.disabled && (e.currentTarget.style.background = "#f5f5f4")}
                      onMouseOut={e => (e.currentTarget.style.background = "transparent")}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[9px] text-stone-500">Tối đa {product.soLuongTon}</span>
                </div>

                {/* CTA */}
                <button
                  className={`btn-gold-sweep w-full py-4 mb-4 ${addedToCart ? "state-added" : ""}`}
                  disabled={!inStock}
                  onClick={async () => {
                    if (!currentUser) { router.push("/login"); return }
                    try {
                      setCartError("")
                      setAddedToCart(true)
                      await addToCart(currentUser.maNguoiDung, { maSanPham: product.maSanPham, soLuong: qty })
                      window.dispatchEvent(new Event("cart-updated"))
                      router.push("/gio-hang")
                    } catch (error) {
                      try {
                        addToLocalCart({
                          maSanPham: product.maSanPham,
                          tenSanPham: product.tenSanPham,
                          gia: product.gia,
                          hinhAnh: product.hinhAnh,
                          tenThuongHieu: product.tenThuongHieu,
                          soLuong: qty,
                        })
                        router.push("/gio-hang")
                      } catch {
                        setAddedToCart(false)
                        setCartError(error instanceof Error ? error.message : "Thêm vào giỏ hàng thất bại")
                      }
                    }
                  }}
                  style={{ opacity: inStock ? 1 : 0.4 }}
                >
                  <span className="flex items-center justify-center gap-3">
                    {addedToCart ? (
                      <><CheckCircle2Icon className="size-4" /> Đã thêm vào giỏ</>
                    ) : (
                      <><ShoppingBagIcon className="size-4" /> {inStock ? "Thêm vào giỏ hàng" : "Hết hàng"}</>
                    )}
                  </span>
                </button>
                {cartError && (
                  <p className="-mt-2 mb-4 text-sm text-red-600">{cartError}</p>
                )}

                {/* Trust bar */}
                <div className="grid grid-cols-3 border border-stone-200">
                  {[
                    { label: "Chính hãng 100%", sub: "Cam kết xác thực" },
                    { label: "Giao 2–4 ngày",   sub: "Toàn quốc" },
                    { label: "Đổi trả 7 ngày",  sub: "Miễn phí hoàn" },
                  ].map(({ label, sub }, i) => (
                    <div
                      key={label}
                      className="py-4 px-3 text-center"
                      style={{
                        background: "#ffffff",
                        borderRight: i < 2 ? "1px solid #e7e5e4" : "none",
                      }}
                    >
                      <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-stone-900">
                        {label}
                      </p>
                      <p className="text-[8px] tracking-wide text-stone-500">{sub}</p>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </section>

          {/* ── REVIEWS ── */}
          <section className="border-t border-stone-200 bg-white py-16">
            <div className="mx-auto max-w-screen-xl px-10">

              {/* Section header */}
              <div className="flex items-end gap-8 mb-12">
                <div>
                  <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.4em] text-stone-400">
                    Cảm nhận
                  </p>
                  <h2 className="font-sans text-3xl font-[450] tracking-wide text-stone-950">
                    Khách hàng nói gì
                  </h2>
                  {reviewStats.total > 0 && (
                    <p className="mt-1 text-[11px] tracking-wide text-stone-500">
                      {reviewStats.average.toFixed(1)} / 5 · {reviewStats.total} đánh giá
                    </p>
                  )}
                </div>
                <div className="mb-2 h-px flex-1 bg-stone-200" />
                {currentUser && (
                  <button
                    className="mb-2 text-[9px] font-semibold tracking-[0.25em] uppercase px-6 py-3 transition-colors"
                    style={{ border: "1px solid #1c1917", color: "#1c1917", background: "transparent" }}
                    onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = "#1c1917"; (e.currentTarget as HTMLElement).style.color = "#ffffff" }}
                    onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#1c1917" }}
                    onClick={() => { setShowReviewForm(v => !v); setReviewError(""); setReviewSuccess("") }}
                  >
                    Viết đánh giá
                  </button>
                )}
              </div>

              {/* Review form */}
              {showReviewForm && (
                <div className="mb-10 border border-stone-200 bg-white p-8">
                  <p className="mb-6 text-lg font-medium text-stone-900">
                    Chia sẻ cảm nhận của bạn
                  </p>
                  {reviewError   && <p className="mb-3 text-sm text-red-600">{reviewError}</p>}
                  {reviewSuccess && <p className="mb-3 text-sm text-emerald-600">{reviewSuccess}</p>}
                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-5">
                    {[1,2,3,4,5].map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setReviewSao(s)}
                        className="text-2xl transition-transform hover:scale-110"
                        style={{ background: "none", border: "none", cursor: "pointer", color: s <= reviewSao ? "#f59e0b" : "#d6d3d1", padding: 0 }}
                      >
                        ★
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-stone-500">{reviewSao}/5</span>
                  </div>
                  <textarea
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                    maxLength={500}
                    style={{
                      width: "100%", minHeight: 120, padding: 16,
                      border: "1px solid #e7e5e4", background: "#ffffff",
                      fontFamily: "inherit", fontSize: 14,
                      lineHeight: 1.7, color: "#1c1917", outline: "none", resize: "vertical",
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = "#78716c")}
                    onBlur={e => (e.currentTarget.style.borderColor = "#e7e5e4")}
                  />
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-[10px] text-stone-500">{reviewText.length}/500</span>
                    <div className="flex gap-3">
                      <button
                        className="text-[9px] font-semibold tracking-[0.25em] uppercase px-5 py-2.5 transition-colors"
                        style={{ border: "1px solid #e7e5e4", color: "#78716c", background: "transparent" }}
                        onClick={() => setShowReviewForm(false)}
                        onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = "#1c1917"; (e.currentTarget as HTMLElement).style.color = "#1c1917" }}
                        onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = "#e7e5e4"; (e.currentTarget as HTMLElement).style.color = "#78716c" }}
                      >
                        Hủy
                      </button>
                      <button
                        disabled={submittingReview}
                        className="btn-gold-sweep px-6 py-2.5"
                        onClick={async () => {
                          setSubmittingReview(true); setReviewError(""); setReviewSuccess("")
                          try {
                            const result = await createReview(currentUser!.maNguoiDung, { maSanPham: id, soSao: reviewSao, binhLuan: reviewText })
                            setReviews(prev => [result, ...prev])
                            setReviewStats(prev => ({
                              average: (prev.average * prev.total + reviewSao) / (prev.total + 1),
                              total: prev.total + 1,
                            }))
                            setReviewSuccess("Cảm ơn bạn đã đánh giá!")
                            setReviewText("")
                            setTimeout(() => setShowReviewForm(false), 1500)
                          } catch (err) {
                            setReviewError(err instanceof Error ? err.message : "Gửi đánh giá thất bại")
                          } finally { setSubmittingReview(false) }
                        }}
                        style={{ opacity: submittingReview ? 0.5 : 1 }}
                      >
                        <span>{submittingReview ? "Đang gửi..." : "Gửi đánh giá"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews list */}
              {reviews.length === 0 ? (
                <div className="border border-stone-200 py-16 text-center">
                  <p className="text-sm text-stone-500">
                    Chưa có đánh giá nào cho sản phẩm này.
                  </p>
                  {!currentUser && (
                    <Link
                      href="/login"
                      className="inline-block mt-6 text-[9px] font-semibold tracking-[0.25em] uppercase px-8 py-3 transition-colors"
                      style={{ border: "1px solid #1c1917", color: "#1c1917" }}
                    >
                      Đăng nhập để đánh giá
                    </Link>
                  )}
                </div>
              ) : (
                <div>
                  {reviews.map((review, i) => (
                    <div
                      key={review.maDanhGia}
                      className="review-row grid gap-8 py-8"
                      style={{
                        gridTemplateColumns: "180px 1fr",
                        borderTop: i > 0 ? "1px solid #e7e5e4" : "none",
                      }}
                    >
                      <div>
                        <div
                          className="mb-3 flex items-center justify-center text-sm font-semibold"
                          style={{ width: 40, height: 40, background: "#1c1917", color: "#ffffff" }}
                        >
                          {review.tenDangNhap.slice(0, 2).toUpperCase()}
                        </div>
                        <p className="text-[10px] font-semibold tracking-[0.12em] text-stone-900">
                          {review.tenDangNhap}
                        </p>
                        <p className="mt-1 text-[9px] tracking-wide text-stone-500">
                          {new Date(review.ngayDanhGia).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                      <div>
                        <div className="flex gap-0.5 mb-3">
                          {[1,2,3,4,5].map(s => (
                            <StarIcon
                              key={s}
                              className="size-3.5"
                              fill={s <= review.soSao ? "#f59e0b" : "none"}
                              style={{ color: s <= review.soSao ? "#f59e0b" : "#d6d3d1" }}
                            />
                          ))}
                        </div>
                        {review.binhLuan && (
                          <p className="leading-relaxed text-stone-600" style={{ fontSize: 15 }}>
                            {review.binhLuan}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ── RELATED ── */}
          {related.length > 0 && (
            <section className="border-t border-stone-200 bg-white py-16">
              <div className="mx-auto max-w-screen-xl px-10">
                <div className="flex items-end gap-8 mb-10">
                  <div>
                    <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.4em] text-stone-400">
                      Cùng danh mục
                    </p>
                    <h2 className="font-sans text-3xl font-[450] tracking-wide text-stone-950">
                      Có thể bạn cũng thích
                    </h2>
                  </div>
                  <div className="mb-2 h-px flex-1 bg-stone-200" />
                  <Link
                    href="/#collection"
                    className="mb-2 flex items-center gap-1.5 text-[9px] font-semibold tracking-[0.25em] uppercase transition-colors"
                    style={{ color: "#78716c" }}
                    onMouseOver={e => (e.currentTarget.style.color = "#1c1917")}
                    onMouseOut={e => (e.currentTarget.style.color = "#78716c")}
                  >
                    Xem thêm <ChevronRightIcon className="size-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {related.map(p => <RelatedCard key={p.maSanPham} product={p} />)}
                </div>
              </div>
            </section>
          )}

        </main>
      ) : null}

      {/* ── FOOTER ── */}
      {/* Footer */}
      {zoomOpen && currentSrc && product && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-label="Ảnh sản phẩm phóng to"
          onClick={() => setZoomOpen(false)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center bg-stone-900 text-3xl leading-none text-white transition hover:bg-stone-800"
            onClick={(e) => {
              e.stopPropagation()
              setZoomOpen(false)
            }}
            aria-label="Đóng ảnh phóng to"
          >
            ×
          </button>

          {images.length > 1 && (
            <button
              type="button"
              className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-stone-900 text-2xl text-white transition hover:bg-stone-800"
              onClick={(e) => {
                e.stopPropagation()
                setActiveImageIndex((idx) => (idx - 1 + images.length) % images.length)
              }}
              aria-label="Ảnh trước"
            >
              ←
            </button>
          )}

          <img
            src={currentSrc}
            alt={product.tenSanPham}
            className="max-h-[88vh] max-w-[86vw] object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {images.length > 1 && (
            <button
              type="button"
              className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-stone-900 text-2xl text-white transition hover:bg-stone-800"
              onClick={(e) => {
                e.stopPropagation()
                setActiveImageIndex((idx) => (idx + 1) % images.length)
              }}
              aria-label="Ảnh tiếp theo"
            >
              →
            </button>
          )}
        </div>
      )}
      <footer className="border-t border-stone-200/60 bg-amber-50 py-14 text-stone-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-4 md:gap-8">
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-200 via-rose-100 to-violet-200 shadow-sm ring-1 ring-white">
                  <span className="font-heading text-sm font-bold text-stone-800">V</span>
                </div>
                <span className="font-heading text-lg font-semibold tracking-[0.15em] text-stone-900">VISILK</span>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-stone-500">
                Không gian mua sắm dành cho người yêu cái đẹp có gu, nhẹ nhàng, sang trọng, luôn chào đón bạn.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">Danh mục</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {[
                  { key: "ao-dai", label: "Áo Dài" },
                  { key: "non-la", label: "Nón Lá" },
                  { key: "tui", label: "Túi" },
                  { key: "giay", label: "Giày" },
                  { key: "trang-suc-khan-lua", label: "Trang Sức & Khăn Lụa" },
                ].map((s) => (
                  <li key={s.key}>
                    <Link href={`/danh-muc/${s.key}`} className="text-stone-600 transition hover:text-stone-900">{s.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">Tài khoản</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li><Link href="/login" className="text-stone-600 transition hover:text-stone-900">Đăng nhập</Link></li>
                <li><Link href="/signup" className="text-stone-600 transition hover:text-stone-900">Đăng ký</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">Liên hệ</h3>
              <p className="mt-4 flex items-start gap-2 text-sm text-stone-600">
                <MapPinIcon className="mt-0.5 size-4 shrink-0 text-stone-400" />
                Hà Nội, Việt Nam
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-stone-200/80 pt-8 text-center sm:flex-row sm:text-left">
            <p className="text-xs text-stone-500">© {new Date().getFullYear()} ViSilk. Giữ lại mọi vẻ đẹp bạn chọn.</p>
            <p className="text-xs text-stone-400">Next.js · Spring Boot</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
