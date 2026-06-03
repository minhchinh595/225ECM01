"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { API_URL, getProducts } from "@/lib/api"
import type { NguoiDung, SanPham } from "@/lib/types"
import { CATEGORY_SECTIONS, getProductsForSection } from "@/lib/categories"
import { getStoredUser } from "@/lib/auth"
import { UserMenu } from "@/components/user-menu"
import { SearchBar } from "@/components/search-bar"
import { CartIcon } from "@/components/cart-icon"
import { ShoppingBagIcon, ChevronRightIcon, XIcon, UserIcon, MapPinIcon, FilterIcon, ChevronDownIcon, StarIcon } from "lucide-react"
import { getProductRating } from "@/lib/product-rating"

const API_ORIGIN = API_URL.replace(/\/api\/?$/, "")

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

const FALLBACK_GRADIENTS = [
  "from-rose-50 via-orange-50/90 to-amber-100/80",
  "from-violet-50 via-fuchsia-50/70 to-rose-50/80",
  "from-sky-50 via-indigo-50/80 to-violet-100/70",
  "from-emerald-50 via-teal-50/80 to-cyan-50/70",
  "from-amber-50 via-orange-50/70 to-rose-50/80",
  "from-stone-100 via-neutral-50 to-zinc-100",
]

type SortOption = "default" | "price-asc" | "price-desc" | "name-asc" | "name-desc" | "oldest" | "newest" | "best-selling" | "stock-desc"
type ProductSalesFields = SanPham & {
  soLuongDaBan?: number | null
  daBan?: number | null
  sold?: number | null
  totalSold?: number | null
}

function getSoldCount(product: SanPham) {
  const p = product as ProductSalesFields
  return p.soLuongDaBan ?? p.daBan ?? p.sold ?? p.totalSold ?? 0
}

function HoverDropdown({
  label,
  value,
  options,
  width = "w-48",
  onChange,
}: {
  label: string
  value: string
  options: Array<{ value: string; label: string }>
  width?: string
  onChange: (value: string) => void
}) {
  const selected = options.find((option) => option.value === value)

  return (
    <div className={`group relative ${width}`}>
      <button
        type="button"
        className="flex h-12 w-full items-center justify-between rounded-full border border-stone-200 bg-white px-5 text-left text-sm text-stone-700 outline-none transition group-hover:border-stone-400"
        aria-haspopup="listbox"
      >
        <span className="truncate">{selected?.label ?? label}</span>
        <ChevronDownIcon className="size-4 text-stone-400 transition-transform duration-200 group-hover:rotate-180 group-hover:text-stone-700" />
      </button>

      <div className="invisible absolute left-0 top-full z-30 mt-2 w-full translate-y-1 rounded-2xl border border-stone-200 bg-white py-2 opacity-0 shadow-[0_18px_50px_-20px_rgba(28,25,23,0.35)] transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`block w-full px-4 py-2.5 text-left text-sm transition ${
              value === option.value
                ? "bg-stone-100 font-medium text-stone-950"
                : "text-stone-700 hover:bg-stone-50 hover:text-stone-950"
            }`}
            role="option"
            aria-selected={value === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function DanhMucPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = use(params)
  const section = CATEGORY_SECTIONS.find((s) => s.key === key)

  const [products, setProducts] = useState<SanPham[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser] = useState<NguoiDung | null>(() => getStoredUser())

  // Filter states
  const [sortBy, setSortBy] = useState<SortOption>("default")
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [priceMin, setPriceMin] = useState("")
  const [priceMax, setPriceMax] = useState("")

  useEffect(() => {
    let active = true
    async function load() {
      try {
        setLoading(true)
        const data = await getProducts()
        if (!active) return
        setProducts(data)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  if (!section) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-white">
        <p className="text-stone-400">Danh mục không tồn tại.</p>
      </div>
    )
  }

  const sectionProducts = getProductsForSection(products, section) as SanPham[]

  // Lấy màu sắc & kích cỡ unique
  const colors = Array.from(new Set(
    sectionProducts.flatMap((p) =>
      (p.mauSac ?? "").split(",").map((c) => c.trim()).filter(Boolean)
    )
  ))
  const sizes = Array.from(new Set(
    sectionProducts.flatMap((p) =>
      (p.size ?? "").split(",").map((s) => s.trim()).filter(Boolean)
    )
  ))

  // Áp dụng filter
  let filtered = [...sectionProducts]
  if (selectedColors.length > 0) {
    filtered = filtered.filter((p) =>
      selectedColors.some((c) => (p.mauSac ?? "").toLowerCase().includes(c.toLowerCase()))
    )
  }
  if (selectedSizes.length > 0) {
    filtered = filtered.filter((p) =>
      selectedSizes.some((s) => (p.size ?? "").toLowerCase().includes(s.toLowerCase()))
    )
  }
  if (priceMin) filtered = filtered.filter((p) => p.gia >= Number(priceMin))
  if (priceMax) filtered = filtered.filter((p) => p.gia <= Number(priceMax))
  if (sortBy === "price-asc") filtered.sort((a, b) => a.gia - b.gia)
  if (sortBy === "price-desc") filtered.sort((a, b) => b.gia - a.gia)
  if (sortBy === "name-asc") filtered.sort((a, b) => a.tenSanPham.localeCompare(b.tenSanPham, "vi"))
  if (sortBy === "name-desc") filtered.sort((a, b) => b.tenSanPham.localeCompare(a.tenSanPham, "vi"))
  if (sortBy === "oldest") filtered.sort((a, b) => a.maSanPham - b.maSanPham)
  if (sortBy === "newest") filtered.sort((a, b) => b.maSanPham - a.maSanPham)
  if (sortBy === "best-selling") filtered.sort((a, b) => getSoldCount(b) - getSoldCount(a) || b.maSanPham - a.maSanPham)
  if (sortBy === "stock-desc") filtered.sort((a, b) => b.soLuongTon - a.soLuongTon)

  function resetFilters() {
    setSortBy("default")
    setSelectedColors([])
    setSelectedSizes([])
    setPriceMin("")
    setPriceMax("")
  }

  const hasActiveFilter = sortBy !== "default" || selectedColors.length > 0 || selectedSizes.length > 0 || priceMin || priceMax
  const priceRangeValue =
    priceMin === "" && priceMax === "" ? "all" :
    priceMin === "" && priceMax === "500000" ? "under-500" :
    priceMin === "500000" && priceMax === "1000000" ? "500-1000" :
    priceMin === "1000000" && priceMax === "2000000" ? "1000-2000" :
    priceMin === "2000000" && priceMax === "" ? "over-2000" :
    "custom"

  function setPriceRange(value: string) {
    if (value === "under-500") { setPriceMin(""); setPriceMax("500000"); return }
    if (value === "500-1000") { setPriceMin("500000"); setPriceMax("1000000"); return }
    if (value === "1000-2000") { setPriceMin("1000000"); setPriceMax("2000000"); return }
    if (value === "over-2000") { setPriceMin("2000000"); setPriceMax(""); return }
    setPriceMin("")
    setPriceMax("")
  }
  const priceOptions = [
    { value: "all", label: "Mức giá" },
    { value: "under-500", label: "Dưới 500.000đ" },
    { value: "500-1000", label: "500.000đ - 1.000.000đ" },
    { value: "1000-2000", label: "1.000.000đ - 2.000.000đ" },
    { value: "over-2000", label: "Trên 2.000.000đ" },
  ]
  const colorOptions = [
    { value: "all", label: "Màu sắc" },
    ...colors.map((color) => ({ value: color, label: color })),
  ]
  const sizeOptions = [
    { value: "all", label: "Kích thước" },
    ...sizes.map((size) => ({ value: size, label: size })),
  ]
  const sortOptions: Array<{ value: SortOption; label: string }> = [
    { value: "default", label: "Sắp xếp" },
    { value: "price-asc", label: "Giá: Tăng dần" },
    { value: "price-desc", label: "Giá: Giảm dần" },
    { value: "name-asc", label: "Tên: A-Z" },
    { value: "name-desc", label: "Tên: Z-A" },
    { value: "oldest", label: "Cũ nhất" },
    { value: "newest", label: "Mới nhất" },
    { value: "best-selling", label: "Bán chạy nhất" },
    { value: "stock-desc", label: "Tồn kho giảm dần" },
  ]

  return (
    <main className="min-h-svh bg-white text-stone-900 antialiased">

      {/* Top bar */}
      <div className="border-b border-stone-200 bg-stone-100">
        <div className="flex w-full items-center justify-between px-20 py-[2px]">
          <div className="hidden items-center gap-0 sm:flex">
            {[
              { label: "VỀ VISILK", href: "/#about" },
              { label: "LOCAL BRAND", href: "/#collection" },
              { label: "CÂU CHUYỆN VẢI LỤA VIỆT", href: "/#about" },
            ].map((item, i) => (
              <span key={item.label} className="flex items-center">
                {i > 0 && <span className="mx-3 text-stone-300">|</span>}
                <Link
                  href={item.href}
                  className="text-[11px] font-semibold tracking-[0.18em] text-stone-500 transition hover:text-stone-800"
                >
                  {item.label}
                </Link>
              </span>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-3">
                {(currentUser.maVaiTro === 1 || currentUser.maVaiTro === 2) && (
                  <>
                    <Link href="/dashboard" className="text-[11px] font-semibold tracking-[0.18em] text-stone-500 transition hover:text-stone-800">
                      QUẢN TRỊ
                    </Link>
                    <span className="text-stone-300">|</span>
                  </>
                )}
                <span className="text-[11px] font-semibold tracking-[0.18em] text-stone-500">
                  {currentUser.hoTen?.trim() || currentUser.tenDangNhap}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.18em] text-stone-500 transition hover:text-stone-800">
                  <UserIcon className="size-3" />
                  ĐĂNG NHẬP
                </Link>
                <span className="text-stone-300">|</span>
                <Link href="/signup" className="text-[11px] font-semibold tracking-[0.18em] text-stone-500 transition hover:text-stone-800">
                  ĐĂNG KÝ
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl backdrop-saturate-150">
        <div className="border-b border-stone-200/50">
          <nav className="relative flex w-full items-center px-20 py-3.5">
            <Link href="/" className="group flex shrink-0 items-center gap-2.5">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <circle cx="18" cy="18" r="17" stroke="url(#logo-ring-list)" strokeWidth="1.2" />
                <path d="M18 7 L27 18 L18 29 L9 18 Z" fill="url(#logo-diamond-list)" opacity="0.15" />
                <path d="M11.5 13.5 L18 23 L24.5 13.5" stroke="url(#logo-v-list)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <circle cx="18" cy="23" r="1.2" fill="url(#logo-dot-list)" />
                <defs>
                  <linearGradient id="logo-ring-list" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#d97706" /><stop offset="100%" stopColor="#9333ea" />
                  </linearGradient>
                  <linearGradient id="logo-diamond-list" x1="9" y1="7" x2="27" y2="29" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                  <linearGradient id="logo-v-list" x1="11.5" y1="13.5" x2="24.5" y2="23" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#b45309" /><stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                  <linearGradient id="logo-dot-list" x1="16.8" y1="21.8" x2="19.2" y2="24.2" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#d97706" /><stop offset="100%" stopColor="#9333ea" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="select-none font-heading text-[1.35rem] font-semibold tracking-[0.18em] text-stone-900 transition-colors group-hover:text-stone-700">
                VI<span className="bg-gradient-to-r from-amber-700 to-violet-600 bg-clip-text text-transparent">SILK</span>
              </span>
            </Link>

            <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
              {[
                { href: "/danh-muc/ao-dai", label: "Áo Dài" },
                { href: "/danh-muc/non-la", label: "Nón Lá" },
                { href: "/danh-muc/tui", label: "Túi" },
                { href: "/danh-muc/giay", label: "Giày" },
                { href: "/danh-muc/trang-suc-khan-lua", label: "Trang Sức" },
                { href: "/danh-muc/trang-suc-khan-lua", label: "Khăn Lụa" },
                { href: "/mix-match", label: "✨ Mix & Match" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="relative px-3 py-1.5 text-sm font-medium text-stone-500 transition-colors hover:text-stone-900 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[1.5px] after:origin-left after:scale-x-0 after:bg-stone-900 after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-1">
              <SearchBar />
              <CartIcon />
              {currentUser && <UserMenu initialUser={currentUser} />}
            </div>
          </nav>
        </div>
      </header>
      {/* Hero banner ảnh danh mục */}
      <div className="relative w-full overflow-hidden">
        <img src={section.image} alt={section.label} className="block w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 sm:px-10">
          <div className="mb-1.5 flex items-center gap-1.5 text-xs text-white/60">
            <ChevronRightIcon className="size-3" />
            <span className="text-white/90">{section.label}</span>
          </div>
          <h1 className="font-sans text-3xl font-[450] uppercase tracking-widest text-white drop-shadow sm:text-4xl">
            {section.label}
          </h1>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-7xl px-2 py-10 sm:px-4 lg:px-6">
        <div className="mb-6 flex justify-center">
          <div className="flex w-full max-w-6xl flex-wrap items-center justify-center gap-4 border-b border-stone-100 pb-6">
            <div className="flex items-center gap-2 pr-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
              <FilterIcon className="size-4 text-stone-400" />
              Bộ lọc
            </div>

            <HoverDropdown
              label="Mức giá"
              value={priceRangeValue}
              options={priceOptions}
              width="w-56"
              onChange={setPriceRange}
            />

            <HoverDropdown
              label="Màu sắc"
              value={selectedColors[0] ?? "all"}
              options={colorOptions}
              width="w-48"
              onChange={(value) => setSelectedColors(value === "all" ? [] : [value])}
            />

            <HoverDropdown
              label="Kích thước"
              value={selectedSizes[0] ?? "all"}
              options={sizeOptions}
              width="w-48"
              onChange={(value) => setSelectedSizes(value === "all" ? [] : [value])}
            />

            <HoverDropdown
              label="Sắp xếp"
              value={sortBy}
              options={sortOptions}
              width="w-56"
              onChange={(value) => setSortBy(value as SortOption)}
            />

            {hasActiveFilter && (
              <button
                onClick={resetFilters}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-stone-200 text-stone-400 transition hover:border-stone-400 hover:bg-stone-50 hover:text-stone-900"
                aria-label="Xóa bộ lọc"
                title="Xóa bộ lọc"
              >
                <XIcon className="size-4" />
              </button>
            )}
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between border-b border-stone-100 pb-4">
          <p className="text-sm text-stone-400">
            <span className="font-medium text-stone-800">{filtered.length}</span> sản phẩm
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse rounded-lg bg-stone-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex h-60 flex-col items-center justify-center gap-3 text-stone-400">
            <ShoppingBagIcon className="size-10" strokeWidth={1} />
            <p className="text-sm">Không có sản phẩm phù hợp</p>
            {hasActiveFilter && (
              <button
                onClick={resetFilters}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 text-stone-400 transition hover:border-stone-400 hover:text-stone-800"
                aria-label="Xóa bộ lọc"
                title="Xóa bộ lọc"
              >
                <XIcon className="size-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-5">
            {filtered.map((product, idx) => (
              <ProductCard key={product.maSanPham} product={product} index={idx} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
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
    </main>
  )
}

function ProductCard({ product, index }: { product: SanPham; index: number }) {
  const src = productImageSrc(product.hinhAnh)
  const hoverSrc = productImageSrc(product.hinhAnh2)
  const hasHoverImage = Boolean(src && hoverSrc && hoverSrc !== src)
  const grad = FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length]
  const rating = getProductRating(product)

  return (
    <Link href={`/san-pham/${product.maSanPham}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-stone-100">
        <div className="absolute left-2 top-2 z-10 inline-flex w-fit items-center gap-0.5 rounded-full bg-white px-1.5 py-0.5 text-[11px] font-semibold leading-none text-stone-900 shadow-sm ring-1 ring-stone-900/5">
          <StarIcon className="size-3 shrink-0 fill-amber-400 text-amber-400" />
          <span>{rating}</span>
        </div>
        {src ? (
          <>
            <img
              src={src}
              alt={product.tenSanPham}
              className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
            />
            {hasHoverImage && (
              <img
                src={hoverSrc!}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${grad}`}>
            <ShoppingBagIcon className="size-10 text-stone-300" strokeWidth={1} />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/8" />
      </div>
      <div className="mt-3 px-0.5">
        <p className="text-[11px] font-medium uppercase tracking-widest text-stone-400">
          {product.tenThuongHieu ?? ""}
        </p>
        <h3 className="mt-0.5 line-clamp-2 text-sm font-medium leading-snug text-stone-900 transition-colors group-hover:text-stone-500">
          {product.tenSanPham}
        </h3>
        <p className="mt-1.5 font-semibold text-stone-950">
          {formatCurrency(product.gia)}
        </p>
      </div>
    </Link>
  )
}
