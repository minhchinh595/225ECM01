"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { API_URL, getProducts } from "@/lib/api"
import type { NguoiDung, SanPham } from "@/lib/types"
import { CATEGORY_SECTIONS, getProductsForSection } from "@/lib/categories"
import { getStoredUser } from "@/lib/auth"
import { UserMenu } from "@/components/user-menu"
import { Button } from "@/components/ui/button"
import { ShoppingBagIcon, ChevronRightIcon, XIcon, ArrowLeftIcon } from "lucide-react"

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

export default function DanhMucPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = use(params)
  const section = CATEGORY_SECTIONS.find((s) => s.key === key)

  const [products, setProducts] = useState<SanPham[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<NguoiDung | null>(null)

  // Filter states
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default")
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [priceMin, setPriceMin] = useState("")
  const [priceMax, setPriceMax] = useState("")

  useEffect(() => { setCurrentUser(getStoredUser()) }, [])

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

  function toggleColor(c: string) {
    setSelectedColors((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c])
  }
  function toggleSize(s: string) {
    setSelectedSizes((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])
  }
  function resetFilters() {
    setSortBy("default")
    setSelectedColors([])
    setSelectedSizes([])
    setPriceMin("")
    setPriceMax("")
  }

  const hasActiveFilter = sortBy !== "default" || selectedColors.length > 0 || selectedSizes.length > 0 || priceMin || priceMax

  return (
    <main className="min-h-svh bg-white text-stone-900 antialiased">

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-stone-200/50 bg-white/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="group flex items-center gap-2.5">            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <circle cx="18" cy="18" r="17" stroke="url(#lr2)" strokeWidth="1.2" />
              <path d="M18 7 L27 18 L18 29 L9 18 Z" fill="url(#ld2)" opacity="0.15" />
              <path d="M11.5 13.5 L18 23 L24.5 13.5" stroke="url(#lv2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <circle cx="18" cy="23" r="1.2" fill="url(#ldot2)" />
              <defs>
                <linearGradient id="lr2" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#d97706" /><stop offset="100%" stopColor="#9333ea" />
                </linearGradient>
                <linearGradient id="ld2" x1="9" y1="7" x2="27" y2="29" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
                <linearGradient id="lv2" x1="11.5" y1="13.5" x2="24.5" y2="23" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#b45309" /><stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
                <linearGradient id="ldot2" x1="16.8" y1="21.8" x2="19.2" y2="24.2" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#d97706" /><stop offset="100%" stopColor="#9333ea" />
                </linearGradient>
              </defs>
            </svg>
            <span className="select-none font-heading text-[1.35rem] font-semibold tracking-[0.18em] text-stone-900 transition-colors group-hover:text-stone-700">
              VI<span className="bg-gradient-to-r from-amber-700 to-violet-600 bg-clip-text text-transparent">SILK</span>
            </span>
          </Link>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3 -mr-2 sm:-mr-4">
            {currentUser ? (
              <>
                {(currentUser.maVaiTro === 1 || currentUser.maVaiTro === 2) && (
                  <Button asChild size="sm" className="h-9 rounded-full border border-amber-200/80 bg-amber-50 px-4 text-amber-800 shadow-sm hover:bg-amber-100" variant="outline">
                    <Link href="/dashboard">Quản trị</Link>
                  </Button>
                )}
                <UserMenu initialUser={currentUser} />
              </>
            ) : (
              <>
                <Button asChild size="sm" variant="ghost" className="rounded-full px-4 text-stone-600 hover:bg-stone-100">
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

      {/* Hero banner ảnh danh mục */}
      <div className="relative w-full overflow-hidden">
        <img src={section.image} alt={section.label} className="block w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        {/* Breadcrumb */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 sm:px-10">
          <div className="mb-1.5 flex items-center gap-1.5 text-xs text-white/60">
            <Link href="/" className="transition hover:text-white">Trang chủ</Link>
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
        <div className="flex gap-10">

          {/* Nút back */}
          <Link
            href="/"
            className="hidden lg:flex mt-1 h-7 w-7 shrink-0 items-center justify-center rounded-full border border-stone-200 text-stone-400 transition hover:border-stone-400 hover:text-stone-800"
            aria-label="Quay lại trang chủ"
          >
            <ArrowLeftIcon className="size-3.5" />
          </Link>

          {/* ── Sidebar bộ lọc ── */}
          <aside className="hidden w-60 shrink-0 lg:block">
            <div className="sticky top-24 space-y-8">

              {/* Header sidebar */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400">Bộ lọc</span>
                {hasActiveFilter && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 text-[11px] font-medium text-stone-400 transition hover:text-stone-700"
                  >
                    <XIcon className="size-3" />
                    Xóa tất cả
                  </button>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-stone-100" />

              {/* Sắp xếp */}
              <div>
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400">Sắp xếp theo</p>
                <div className="space-y-1">
                  {[
                    { value: "default", label: "Mặc định" },
                    { value: "price-asc", label: "Giá: Thấp → Cao" },
                    { value: "price-desc", label: "Giá: Cao → Thấp" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value as typeof sortBy)}
                      className={`group flex w-full items-center justify-between rounded-none border-l-2 px-3 py-2 text-sm transition ${
                        sortBy === opt.value
                          ? "border-stone-900 bg-stone-50 font-medium text-stone-900"
                          : "border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-800"
                      }`}
                    >
                      {opt.label}
                      {sortBy === opt.value && (
                        <span className="size-1.5 rounded-full bg-stone-900" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-stone-100" />

              {/* Khoảng giá */}
              <div>
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400">Khoảng giá</p>
                <div className="space-y-2.5">
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-400">₫</span>
                    <input
                      type="number"
                      placeholder="Từ"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      className="w-full rounded-none border-0 border-b border-stone-200 bg-transparent py-2 pl-6 pr-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-300 focus:border-stone-600"
                    />
                  </div>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-400">₫</span>
                    <input
                      type="number"
                      placeholder="Đến"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      className="w-full rounded-none border-0 border-b border-stone-200 bg-transparent py-2 pl-6 pr-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-300 focus:border-stone-600"
                    />
                  </div>
                </div>
              </div>

              {/* Màu sắc */}
              {colors.length > 0 && (
                <>
                  <div className="h-px bg-stone-100" />
                  <div>
                    <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400">Màu sắc</p>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => toggleColor(color)}
                          className={`rounded-full border px-3 py-1 text-xs transition ${
                            selectedColors.includes(color)
                              ? "border-stone-900 bg-stone-900 text-white"
                              : "border-stone-200 text-stone-600 hover:border-stone-400"
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Kích cỡ */}
              {sizes.length > 0 && (
                <>
                  <div className="h-px bg-stone-100" />
                  <div>
                    <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400">Kích cỡ</p>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => toggleSize(size)}
                          className={`flex h-9 min-w-[2.25rem] items-center justify-center border px-2 text-xs font-medium transition ${
                            selectedSizes.includes(size)
                              ? "border-stone-900 bg-stone-900 text-white"
                              : "border-stone-200 text-stone-600 hover:border-stone-400"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

            </div>
          </aside>

          {/* ── Product grid ── */}
          <div className="flex-1">
            {/* Kết quả */}
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
                  <button onClick={resetFilters} className="text-xs text-stone-500 underline underline-offset-2 hover:text-stone-800">
                    Xóa bộ lọc
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

        </div>
      </div>
    </main>
  )
}

function ProductCard({ product, index }: { product: SanPham; index: number }) {
  const src = productImageSrc(product.hinhAnh)
  const grad = FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length]

  return (
    <Link href={`/san-pham/${product.maSanPham}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-stone-100">
        {src ? (
          <img
            src={src}
            alt={product.tenSanPham}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
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
