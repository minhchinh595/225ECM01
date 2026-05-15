"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { API_URL, getCategories, getProducts } from "@/lib/api"
import type { DanhMuc, NguoiDung, SanPham } from "@/lib/types"
import Link from "next/link"
import {
  SparklesIcon,
  HeartIcon,
  ShoppingBagIcon,
  MapPinIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react"
import { useEffect, useState } from "react"
import { getStoredUser } from "@/lib/auth"
import { UserMenu } from "@/components/user-menu"
import { HeroSlider } from "@/components/hero-slider"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value)
}

const API_ORIGIN = API_URL.replace(/\/api\/?$/, "")

function productImageSrc(hinhAnh?: string | null): string | null {
  if (!hinhAnh?.trim()) return null
  const path = hinhAnh.trim()
  if (/^https?:\/\//i.test(path)) return path
  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`
}

// Cấu hình 6 section danh mục
const CATEGORY_SECTIONS = [
  {
    key: "ao-dai",
    image: "/lcb1.png",
    label: "Áo Dài",
    keywords: ["áo dài", "ao dai"],
    accent: "from-rose-50 to-amber-50",
    badge: "bg-rose-100 text-rose-800 border-rose-200",
  },
  {
    key: "non-la",
    image: "/lcb2.png",
    label: "Nón Lá",
    keywords: ["nón lá", "non la", "nón"],
    accent: "from-amber-50 to-yellow-50",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
  },
  {
    key: "tui",
    image: "/lcb3.png",
    label: "Túi",
    keywords: ["túi", "tui", "bag"],
    accent: "from-violet-50 to-fuchsia-50",
    badge: "bg-violet-100 text-violet-800 border-violet-200",
  },
  {
    key: "giay",
    image: "/lcb4.png",
    label: "Giày",
    keywords: ["giày", "giay", "dép", "dep"],
    accent: "from-sky-50 to-indigo-50",
    badge: "bg-sky-100 text-sky-800 border-sky-200",
  },
  {
    key: "trang-suc-khan-lua",
    image: "/lcb5.png",
    label: "Trang Sức & Khăn Lụa",
    keywords: ["trang sức", "trang suc", "khăn lụa", "khan lua", "khăn", "lụa", "trang", "sức"],
    accent: "from-emerald-50 to-teal-50",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    multi: true,
  },
]

const ITEMS_PER_ROW = 4

export default function Home() {
  const [products, setProducts] = useState<SanPham[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentUser, setCurrentUser] = useState<NguoiDung | null>(null)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setCurrentUser(getStoredUser())
  }, [])

  useEffect(() => {
    let active = true
    async function loadData() {
      try {
        setLoading(true)
        const productsData = await getProducts()
        if (!active) return
        setProducts(productsData)
        setError("")
      } catch (err) {
        if (!active) return
        setError(err instanceof Error ? err.message : "Không thể tải dữ liệu.")
      } finally {
        if (active) setLoading(false)
      }
    }
    loadData()
    return () => { active = false }
  }, [])

  function getProductsForSection(section: typeof CATEGORY_SECTIONS[0]): SanPham[] {
    return products.filter((p) => {
      const name = (p.tenDanhMuc ?? "").toLowerCase()
      return section.keywords.some((kw) => name.includes(kw))
    })
  }

  function toggleSection(key: string) {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <main className="min-h-svh scroll-smooth bg-white text-stone-900 antialiased selection:bg-amber-200/40 selection:text-stone-900">

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-stone-200/50 bg-white/80 backdrop-blur-xl backdrop-saturate-150">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-2.5">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <circle cx="18" cy="18" r="17" stroke="url(#logo-ring)" strokeWidth="1.2" />
              <path d="M18 7 L27 18 L18 29 L9 18 Z" fill="url(#logo-diamond)" opacity="0.15" />
              <path d="M11.5 13.5 L18 23 L24.5 13.5" stroke="url(#logo-v)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <circle cx="18" cy="23" r="1.2" fill="url(#logo-dot)" />
              <defs>
                <linearGradient id="logo-ring" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#d97706" /><stop offset="100%" stopColor="#9333ea" />
                </linearGradient>
                <linearGradient id="logo-diamond" x1="9" y1="7" x2="27" y2="29" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
                <linearGradient id="logo-v" x1="11.5" y1="13.5" x2="24.5" y2="23" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#b45309" /><stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
                <linearGradient id="logo-dot" x1="16.8" y1="21.8" x2="19.2" y2="24.2" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#d97706" /><stop offset="100%" stopColor="#9333ea" />
                </linearGradient>
              </defs>
            </svg>
            <span className="select-none font-heading text-[1.35rem] font-semibold tracking-[0.18em] text-stone-900 transition-colors group-hover:text-stone-700">
              VI<span className="bg-gradient-to-r from-amber-700 to-violet-600 bg-clip-text text-transparent">SILK</span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3 -mr-2 sm:-mr-4">
            {currentUser ? (
              <>
                {(currentUser.maVaiTro === 1 || currentUser.maVaiTro === 2) && (
                  <Button asChild size="sm" className="h-9 rounded-full border border-amber-200/80 bg-amber-50 px-4 text-amber-800 shadow-sm hover:bg-amber-100 hover:text-amber-900" variant="outline">
                    <Link href="/dashboard">Quản trị</Link>
                  </Button>
                )}
                <UserMenu initialUser={currentUser} />
              </>
            ) : (
              <>
                <Button asChild size="sm" variant="ghost" className="rounded-full px-4 text-stone-600 hover:bg-white/80 hover:text-stone-900">
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button asChild size="sm" className="rounded-full border-0 bg-stone-900 px-5 text-white shadow-lg shadow-stone-900/15 transition hover:bg-stone-800 hover:shadow-xl">
                  <Link href="/signup">Tham gia</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Slider */}
      <section className="relative overflow-x-clip pb-10 pt-0">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-amber-100/60 via-rose-100/40 to-transparent blur-3xl" />
          <div className="absolute -right-32 bottom-10 h-[440px] w-[440px] rounded-full bg-gradient-to-tl from-violet-100/50 via-sky-50/30 to-transparent blur-3xl" />
        </div>

        <div className="relative mx-auto w-full px-0">
          <div className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-amber-200/40 via-rose-200/20 to-violet-200/30 blur-3xl" aria-hidden />
          <figure className="relative overflow-hidden bg-stone-950 shadow-[0_32px_80px_-20px_rgba(28,25,23,0.30)] ring-1 ring-white/10">
            <HeroSlider />
            <div className="absolute right-5 top-5 z-10 flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-3.5 py-2 shadow-lg backdrop-blur-md sm:right-6 sm:top-6">
              <span className="flex size-7 items-center justify-center rounded-full bg-amber-400/20">
                <SparklesIcon className="size-3.5 text-amber-300" />
              </span>
              <div className="leading-tight">
                <p className="text-[11px] font-semibold text-white">Local Brand</p>
                <p className="text-[10px] text-white/60">Việt Nam</p>
              </div>
            </div>
          </figure>
          <div className="absolute -bottom-5 left-6 z-10 flex items-center gap-2.5 rounded-2xl border border-white/80 bg-white/95 px-4 py-2.5 shadow-xl shadow-stone-900/10 backdrop-blur-md sm:left-8">
            <span className="flex size-8 items-center justify-center rounded-full bg-rose-100">
              <HeartIcon className="size-4 text-rose-600" />
            </span>
            <div className="leading-tight">
              <p className="text-[11px] font-semibold text-stone-900">5K+ khách hàng</p>
              <p className="text-[10px] text-stone-500">tin chọn mỗi ngày</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Sections */}
      <div className="mt-8 space-y-20 pb-20 sm:mt-12 sm:space-y-24 sm:pb-24">
        {CATEGORY_SECTIONS.map((section) => {
          const sectionProducts = getProductsForSection(section)
          const isExpanded = expandedSections[section.key] ?? false
          const visibleProducts = isExpanded
            ? sectionProducts
            : sectionProducts.slice(0, ITEMS_PER_ROW)
          const hasMore = sectionProducts.length > ITEMS_PER_ROW

          return (
            <section key={section.key} className="w-full">
              {/* Banner image */}
              <div className="overflow-hidden shadow-[0_20px_60px_-20px_rgba(28,25,23,0.20)]">
                <img
                  src={section.image}
                  alt={section.label}
                  className="block w-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Label + products */}
              <div className="mt-8 px-4 sm:px-6 lg:px-8">
                {/* Section heading */}
                <div className="mb-6 flex items-center gap-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-stone-400 to-stone-400" />
                  <h2 className="font-category text-4xl font-semibold italic uppercase tracking-[0.25em] text-stone-950 sm:text-5xl">
                    {section.label}
                  </h2>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent via-stone-400 to-stone-400" />
                </div>

                {/* Product grid */}
                {loading ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-gradient-to-br from-stone-100 to-stone-200/80" />
                    ))}
                  </div>
                ) : sectionProducts.length === 0 ? (
                  <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-stone-50 text-sm text-stone-400">
                    Chưa có sản phẩm trong danh mục này
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
                      {visibleProducts.map((product, idx) => (
                        <ProductCard key={product.maSanPham} product={product} index={idx} />
                      ))}
                    </div>

                    {hasMore && (
                      <div className="mt-6 flex justify-center">
                        <button
                          onClick={() => toggleSection(section.key)}
                          className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-6 py-2.5 text-sm font-medium text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUpIcon className="size-4" />
                              Thu gọn
                            </>
                          ) : (
                            <>
                              <ChevronDownIcon className="size-4" />
                              Xem thêm
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </section>
          )
        })}
      </div>

      {/* Footer */}
      <footer className="border-t border-stone-200/60 bg-white py-14 text-stone-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-4 md:gap-8">
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-200 via-rose-100 to-violet-200 ring-1 ring-white shadow-sm">
                  <span className="font-heading text-sm font-bold text-stone-800">V</span>
                </div>
                <span className="font-heading text-lg font-semibold tracking-[0.15em] text-stone-900">VISILK</span>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-stone-500">
                Không gian mua sắm dành cho người yêu cái đẹp có gu — nhẹ nhàng, sang trọng, luôn chào đón bạn.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">Danh mục</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {CATEGORY_SECTIONS.map((s) => (
                  <li key={s.key}>
                    <a href={`#${s.key}`} className="text-stone-600 transition hover:text-stone-900">{s.label}</a>
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

const FALLBACK_GRADIENTS = [
  "from-rose-50 via-orange-50/90 to-amber-100/80",
  "from-violet-50 via-fuchsia-50/70 to-rose-50/80",
  "from-sky-50 via-indigo-50/80 to-violet-100/70",
  "from-emerald-50 via-teal-50/80 to-cyan-50/70",
  "from-amber-50 via-orange-50/70 to-rose-50/80",
  "from-stone-100 via-neutral-50 to-zinc-100",
]

function ProductCard({ product, index }: { product: SanPham; index: number }) {
  const src = productImageSrc(product.hinhAnh)
  const grad = FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length]

  return (
    <Link href={`/san-pham/${product.maSanPham}`} className="group block">
      {/* Ảnh */}
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
        {/* Overlay mờ khi hover */}
        <div className="pointer-events-none absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/8" />
      </div>

      {/* Thông tin bên dưới ảnh */}
      <div className="mt-3 px-0.5">
        <p className="text-[11px] font-medium uppercase tracking-widest text-stone-400">
          {product.tenThuongHieu ?? ""}
        </p>
        <h3 className="mt-0.5 line-clamp-2 text-sm font-medium leading-snug text-stone-900 group-hover:text-stone-600 transition-colors">
          {product.tenSanPham}
        </h3>
        <p className="mt-1.5 font-semibold text-stone-950">
          {formatCurrency(product.gia)}
        </p>
      </div>
    </Link>
  )
}
