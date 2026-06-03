"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { API_URL, getProducts } from "@/lib/api"
import type { NguoiDung, SanPham } from "@/lib/types"
import { CATEGORY_SECTIONS, getProductsForSection } from "@/lib/categories"
import { getStoredUser } from "@/lib/auth"
import { UserMenu } from "@/components/user-menu"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/search-bar"
import { CartIcon } from "@/components/cart-icon"
import {
  ShoppingBagIcon,
  ChevronRightIcon,
  XIcon,
  ArrowLeftIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  HeartIcon,
  EyeIcon,
  StarIcon,
} from "lucide-react"

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
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

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
      <div className="flex min-h-svh items-center justify-center bg-[#faf9f7]">
        <p className="text-stone-400">Danh mục không tồn tại.</p>
      </div>
    )
  }

  const sectionProducts = getProductsForSection(products, section) as SanPham[]

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
    <main className="min-h-svh bg-[#faf9f7] text-stone-900 antialiased">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-stone-200/50 bg-white/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-200 via-rose-100 to-violet-200 shadow-sm ring-1 ring-white/80">
              <span className="font-heading text-base font-bold text-stone-800">V</span>
            </div>
            <span className="font-heading hidden text-base font-semibold tracking-[0.12em] text-stone-900 sm:block">VISILK</span>
          </Link>

          <div className="flex items-center gap-2">
            <SearchBar />
            <CartIcon />
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

      {/* Hero banner - full width */}
      <div className="relative w-screen -ml-4 sm:-ml-6 lg:-ml-8" style={{ width: "calc(100vw)" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 via-stone-900/40 to-transparent z-10" />
        <img src={section.image} alt={section.label} className="block w-full object-cover" />
        <div className="absolute inset-0 z-10 flex flex-col justify-center px-6 sm:px-12 lg:px-16">
          <div className="flex items-center gap-2 text-xs text-white/50 mb-2">
            <Link href="/" className="hover:text-white/80 transition">Trang chủ</Link>
            <ChevronRightIcon className="size-3" />
            <span className="text-white/80">{section.label}</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-semibold tracking-tight text-white">
            {section.label}
          </h1>
          <p className="mt-1.5 text-sm text-white/60 max-w-xl">
            Khám phá bộ sưu tập {section.label.toLowerCase()} tinh tế, được chế tác từ những chất liệu cao cấp nhất
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8 lg:gap-12">
          {/* ── Sidebar ── */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontalIcon className="size-4 text-stone-400" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Bộ lọc</span>
                </div>
                {hasActiveFilter && (
                  <button onClick={resetFilters} className="text-[11px] text-stone-400 underline underline-offset-2 hover:text-stone-700 transition">
                    Xóa
                  </button>
                )}
              </div>
              <div className="h-px bg-gradient-to-r from-stone-200/80 via-stone-200 to-transparent" />

              {/* Sort */}
              <div className="space-y-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">Sắp xếp</p>
                <div className="space-y-0.5">
                  {[
                    { value: "default", label: "Mặc định" },
                    { value: "price-asc", label: "Giá: Thấp → Cao" },
                    { value: "price-desc", label: "Giá: Cao → Thấp" },
                  ].map((opt) => (
                    <button key={opt.value} onClick={() => setSortBy(opt.value as typeof sortBy)}
                      className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                        sortBy === opt.value
                          ? "bg-stone-100 text-stone-900 font-medium"
                          : "text-stone-500 hover:bg-stone-50 hover:text-stone-800"
                      }`}>
                      <span className={`size-1.5 rounded-full transition-all ${sortBy === opt.value ? "bg-stone-900" : "bg-transparent group-hover:bg-stone-300"}`} />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-px bg-gradient-to-r from-stone-200/80 via-stone-200 to-transparent" />

              {/* Price range */}
              <div className="space-y-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">Khoảng giá</p>
                <div className="space-y-2.5">
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-400">₫</span>
                    <input type="number" placeholder="Từ" value={priceMin} onChange={(e) => setPriceMin(e.target.value)}
                      className="w-full h-9 rounded-lg border border-stone-200 bg-white/80 px-3 pl-6 text-sm text-stone-700 outline-none transition placeholder:text-stone-300 focus:border-stone-400 focus:bg-white" />
                  </div>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-400">₫</span>
                    <input type="number" placeholder="Đến" value={priceMax} onChange={(e) => setPriceMax(e.target.value)}
                      className="w-full h-9 rounded-lg border border-stone-200 bg-white/80 px-3 pl-6 text-sm text-stone-700 outline-none transition placeholder:text-stone-300 focus:border-stone-400 focus:bg-white" />
                  </div>
                </div>
              </div>
              <div className="h-px bg-gradient-to-r from-stone-200/80 via-stone-200 to-transparent" />

              {/* Colors */}
              {colors.length > 0 && (
                <>
                  <div className="space-y-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">Màu sắc</p>
                    <div className="flex flex-wrap gap-1.5">
                      {colors.map((color) => (
                        <button key={color} onClick={() => toggleColor(color)}
                          className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-all ${
                            selectedColors.includes(color)
                              ? "border-stone-900 bg-stone-900 text-white shadow-sm"
                              : "border-stone-200 bg-white/80 text-stone-600 hover:border-stone-400 hover:bg-white"
                          }`}>
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="h-px bg-gradient-to-r from-stone-200/80 via-stone-200 to-transparent" />
                </>
              )}

              {/* Sizes */}
              {sizes.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">Kích cỡ</p>
                  <div className="flex flex-wrap gap-1.5">
                    {sizes.map((size) => (
                      <button key={size} onClick={() => toggleSize(size)}
                        className={`flex h-8 min-w-[2.25rem] items-center justify-center rounded-lg border px-2 text-[11px] font-medium transition-all ${
                          selectedSizes.includes(size)
                            ? "border-stone-900 bg-stone-900 text-white shadow-sm"
                            : "border-stone-200 bg-white/80 text-stone-600 hover:border-stone-400 hover:bg-white"
                        }`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* ── Product grid ── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/" className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 bg-white/80 text-stone-400 hover:border-stone-400 hover:text-stone-700 transition shadow-sm">
                  <ArrowLeftIcon className="size-3.5" />
                </Link>
                <div>
                  <p className="text-xs text-stone-400">
                    <span className="font-semibold text-stone-700">{filtered.length}</span> sản phẩm
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Mobile filter button */}
                <button onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                  className="lg:hidden flex h-8 items-center gap-1.5 rounded-full border border-stone-200 bg-white/80 px-3 text-xs text-stone-600 hover:border-stone-400 transition shadow-sm">
                  <SlidersHorizontalIcon className="size-3" />
                  Lọc
                </button>
              </div>
            </div>

            {/* Mobile filter panel */}
            {mobileFilterOpen && (
              <div className="lg:hidden mb-6 rounded-2xl border border-stone-200 bg-white/90 p-5 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Bộ lọc</span>
                  {hasActiveFilter && <button onClick={resetFilters} className="text-[11px] text-stone-400 underline hover:text-stone-700">Xóa</button>}
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500 mb-2">Sắp xếp</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "default", label: "Mặc định" },
                      { value: "price-asc", label: "Giá ↑" },
                      { value: "price-desc", label: "Giá ↓" },
                    ].map((opt) => (
                      <button key={opt.value} onClick={() => setSortBy(opt.value as typeof sortBy)}
                        className={`rounded-full border px-3 py-1 text-xs transition ${
                          sortBy === opt.value ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 text-stone-600"
                        }`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500 mb-2">Giá từ</p>
                    <input type="number" placeholder="₫ Từ" value={priceMin} onChange={(e) => setPriceMin(e.target.value)}
                      className="w-full h-9 rounded-lg border border-stone-200 bg-white/80 px-3 text-sm outline-none focus:border-stone-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500 mb-2">Giá đến</p>
                    <input type="number" placeholder="₫ Đến" value={priceMax} onChange={(e) => setPriceMax(e.target.value)}
                      className="w-full h-9 rounded-lg border border-stone-200 bg-white/80 px-3 text-sm outline-none focus:border-stone-400" />
                  </div>
                </div>

                {colors.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500 mb-2">Màu sắc</p>
                    <div className="flex flex-wrap gap-1.5">
                      {colors.map((color) => (
                        <button key={color} onClick={() => toggleColor(color)}
                          className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition ${
                            selectedColors.includes(color) ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 text-stone-600"
                          }`}>
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {sizes.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500 mb-2">Kích cỡ</p>
                    <div className="flex flex-wrap gap-1.5">
                      {sizes.map((size) => (
                        <button key={size} onClick={() => toggleSize(size)}
                          className={`flex h-8 min-w-[2.25rem] items-center justify-center rounded-lg border px-2 text-[11px] font-medium transition ${
                            selectedSizes.includes(size) ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 text-stone-600"
                          }`}>
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <Button onClick={() => setMobileFilterOpen(false)} className="w-full rounded-xl bg-stone-900 text-white text-sm hover:bg-stone-800">
                  Áp dụng
                </Button>
              </div>
            )}

            {/* Loading / Empty / Grid */}
            {loading ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 gap-y-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}>
                    <div className="aspect-[3/4] animate-pulse rounded-2xl bg-stone-100" />
                    <div className="mt-3 space-y-2">
                      <div className="h-3 w-16 animate-pulse rounded-full bg-stone-100" />
                      <div className="h-4 w-3/4 animate-pulse rounded-full bg-stone-100" />
                      <div className="h-4 w-1/3 animate-pulse rounded-full bg-stone-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-stone-100">
                  <ShoppingBagIcon className="size-8 text-stone-300" strokeWidth={1} />
                </div>
                <h3 className="text-lg font-semibold text-stone-700">Không có sản phẩm</h3>
                <p className="mt-1 max-w-xs text-sm text-stone-400">Không tìm thấy sản phẩm phù hợp với bộ lọc của bạn.</p>
                {hasActiveFilter && (
                  <button onClick={resetFilters} className="mt-4 rounded-full bg-stone-900 px-6 py-2 text-xs font-medium text-white hover:bg-stone-800 transition">
                    Xóa bộ lọc
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 gap-y-7">
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
  const hoverSrc = productImageSrc(product.hinhAnh2)
  const hasHoverImage = Boolean(src && hoverSrc && hoverSrc !== src)
  const grad = FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length]
  const [isWishlisted, setIsWishlisted] = useState(false)

  return (
    <div className="group relative">
      <Link href={`/san-pham/${product.maSanPham}`} className="block">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-stone-50 shadow-[0_4px_16px_-6px_rgba(0,0,0,0.04)] transition-all duration-500 group-hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.10)]">
          {src ? (
            <>
              <img src={src} alt={product.tenSanPham}
                className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.06]" />
              {hasHoverImage && (
                <img src={hoverSrc!} alt="" aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-[1.06] group-hover:opacity-100" />
              )}
            </>
          ) : (
            <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${grad}`}>
              <ShoppingBagIcon className="size-12 text-stone-300" strokeWidth={1} />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Quick actions on hover */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            <button onClick={(e) => { e.preventDefault(); setIsWishlisted(!isWishlisted) }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm hover:bg-white transition">
              <HeartIcon className={`size-4 transition ${isWishlisted ? "fill-red-400 text-red-400" : "text-stone-500"}`} />
            </button>
          </div>

          {/* Rating badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-white/85 backdrop-blur-sm px-2 py-0.5 shadow-sm">
            <StarIcon className="size-3 fill-amber-400 text-amber-400" />
            <span className="text-[10px] font-semibold text-stone-700">4.5</span>
          </div>
        </div>

        {/* Info */}
        <div className="mt-3.5 px-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-stone-400">
              {product.tenThuongHieu ?? "VISILK"}
            </span>
            <span className="size-1 rounded-full bg-stone-200" />
            <span className="text-[10px] text-stone-400">{product.tenDanhMuc}</span>
          </div>
          <h3 className="mt-1 line-clamp-2 text-sm font-medium leading-snug text-stone-900 transition-colors duration-300 group-hover:text-stone-600">
            {product.tenSanPham}
          </h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-base font-semibold text-stone-950">
              {formatCurrency(product.gia)}
            </span>
            {(product.soLuongTon ?? 0) <= 5 && (
              <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[9px] font-medium text-rose-600 border border-rose-200">
                Sắp hết
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}