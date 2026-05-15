"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { API_URL, getBrands, getCategories, getProducts } from "@/lib/api"
import type { DanhMuc, NguoiDung, SanPham, ThuongHieu } from "@/lib/types"
import Link from "next/link"
import {
  ArrowRightIcon,
  SearchIcon,
  SparklesIcon,
  StarIcon,
  HeartIcon,
  ShoppingBagIcon,
  TrendingUpIcon,
  CheckCircle2Icon,
  MapPinIcon,
} from "lucide-react"
import { startTransition, useDeferredValue, useEffect, useState } from "react"
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
  if (!hinhAnh?.trim()) {
    return null
  }
  const path = hinhAnh.trim()
  if (/^https?:\/\//i.test(path)) {
    return path
  }
  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`
}

/** Hero lookbook — ảnh banner local brand */
const HERO_IMAGE = "/localbrand.png"

const FALLBACK_GRADIENTS = [
  "from-rose-50 via-orange-50/90 to-amber-100/80",
  "from-violet-50 via-fuchsia-50/70 to-rose-50/80",
  "from-sky-50 via-indigo-50/80 to-violet-100/70",
  "from-emerald-50 via-teal-50/80 to-cyan-50/70",
  "from-amber-50 via-orange-50/70 to-rose-50/80",
  "from-stone-100 via-neutral-50 to-zinc-100",
]

export default function Home() {
  const [products, setProducts] = useState<SanPham[]>([])
  const [categories, setCategories] = useState<DanhMuc[]>([])
  const [brands, setBrands] = useState<ThuongHieu[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentUser, setCurrentUser] = useState<NguoiDung | null>(null)
  const deferredSearch = useDeferredValue(search)

  useEffect(() => {
    setCurrentUser(getStoredUser())
  }, [])

  useEffect(() => {
    let active = true

    async function loadData() {
      try {
        setLoading(true)
        const [productsData, categoriesData, brandsData] = await Promise.all([
          getProducts(),
          getCategories(),
          getBrands(),
        ])

        if (!active) {
          return
        }

        setProducts(productsData)
        setCategories(categoriesData)
        setBrands(brandsData)
        setError("")
      } catch (loadError) {
        if (!active) {
          return
        }
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Không thể tải dữ liệu từ backend.",
        )
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      active = false
    }
  }, [])

  const normalizedSearch = deferredSearch.trim().toLowerCase()
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === null || product.maDanhMuc === selectedCategory
    const matchesSearch =
      normalizedSearch.length === 0 ||
      product.tenSanPham.toLowerCase().includes(normalizedSearch) ||
      (product.tenThuongHieu ?? "").toLowerCase().includes(normalizedSearch)

    return matchesCategory && matchesSearch
  })

  const featuredProducts = filteredProducts.slice(0, 3)
  const trendingProducts = filteredProducts.slice(0, 6)

  return (
    <main className="min-h-svh scroll-smooth bg-[#faf9f7] text-stone-900 antialiased selection:bg-amber-200/40 selection:text-stone-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-stone-200/50 bg-[#faf9f7]/80 backdrop-blur-xl backdrop-saturate-150">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-2.5">
            {/* Logo ViSilk — SVG inline */}
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              {/* Outer ring */}
              <circle cx="18" cy="18" r="17" stroke="url(#logo-ring)" strokeWidth="1.2" />
              {/* Inner diamond shape */}
              <path
                d="M18 7 L27 18 L18 29 L9 18 Z"
                fill="url(#logo-diamond)"
                opacity="0.15"
              />
              {/* V mark */}
              <path
                d="M11.5 13.5 L18 23 L24.5 13.5"
                stroke="url(#logo-v)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              {/* Center dot */}
              <circle cx="18" cy="23" r="1.2" fill="url(#logo-dot)" />
              <defs>
                <linearGradient id="logo-ring" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#9333ea" />
                </linearGradient>
                <linearGradient id="logo-diamond" x1="9" y1="7" x2="27" y2="29" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
                <linearGradient id="logo-v" x1="11.5" y1="13.5" x2="24.5" y2="23" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#b45309" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
                <linearGradient id="logo-dot" x1="16.8" y1="21.8" x2="19.2" y2="24.2" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#9333ea" />
                </linearGradient>
              </defs>
            </svg>
            {/* Wordmark */}
            <span className="select-none font-heading text-[1.35rem] font-semibold tracking-[0.18em] text-stone-900 transition-colors group-hover:text-stone-700">
              VI<span className="bg-gradient-to-r from-amber-700 to-violet-600 bg-clip-text text-transparent">SILK</span>
            </span>
          </Link>

          <div className="hidden items-center gap-10 md:flex">
            {[
              { href: "#collection", label: "Bộ sưu tập" },
              { href: "#trending", label: "Xu hướng" },
              { href: "#about", label: "Câu chuyện" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-stone-500 transition-colors hover:text-stone-900"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {currentUser ? (
              <>
                {(currentUser.maVaiTro === 1 || currentUser.maVaiTro === 2) && (
                  <Button
                    asChild
                    size="sm"
                    className="rounded-full border border-amber-200/80 bg-amber-50 px-4 text-amber-800 shadow-sm hover:bg-amber-100 hover:text-amber-900"
                    variant="outline"
                  >
                    <Link href="/dashboard">Quản trị</Link>
                  </Button>
                )}
                <UserMenu initialUser={currentUser} />
              </>
            ) : (
              <>
                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                  className="rounded-full px-4 text-stone-600 hover:bg-white/80 hover:text-stone-900"
                >
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="rounded-full border-0 bg-stone-900 px-5 text-white shadow-lg shadow-stone-900/15 transition hover:bg-stone-800 hover:shadow-xl"
                >
                  <Link href="/signup">Tham gia</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-x-clip pb-10 pt-1 sm:pb-14 sm:pt-2">
        {/* Background blobs */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-amber-100/60 via-rose-100/40 to-transparent blur-3xl" />
          <div className="absolute -right-32 bottom-10 h-[440px] w-[440px] rounded-full bg-gradient-to-tl from-violet-100/50 via-sky-50/30 to-transparent blur-3xl" />
        </div>



        {/* ── Hero slider — gần full màn hình ── */}
        <div className="relative mx-auto w-full max-w-[99vw] px-1 sm:px-1.5">
          {/* Glow halo */}
          <div
            className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-amber-200/40 via-rose-200/20 to-violet-200/30 blur-3xl"
            aria-hidden
          />

          <figure className="relative overflow-hidden rounded-2xl bg-stone-950 shadow-[0_32px_80px_-20px_rgba(28,25,23,0.30)] ring-1 ring-white/10 sm:rounded-3xl">
            <HeroSlider />

            {/* Floating badge — top right */}
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

          {/* Floating badge — bottom left */}
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

      {/* Featured */}
      <section
        id="collection"
        className="relative border-y border-stone-200/40 bg-white py-20 sm:py-24 lg:py-28"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-3xl text-center sm:mb-20">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-800/80">
              Curated edit
            </p>
            <h2 className="font-heading text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
              Những thiết kế khiến ánh nhìn dừng lại
            </h2>
            <p className="mt-4 text-lg text-stone-600">
              Tuyển chọn từ các nhà mốt địa phương — mỗi sản phẩm là một tuyên ngôn nhẹ nhàng về gu thẩm mỹ của bạn.
            </p>
          </div>

          {error ? (
            <div className="mb-10 rounded-2xl border border-red-200/80 bg-red-50/90 px-5 py-4 text-sm text-red-800 backdrop-blur-sm">
              {error}
            </div>
          ) : null}

          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            {loading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-[3/4] animate-pulse rounded-[1.75rem] bg-gradient-to-br from-stone-100 to-stone-200/80"
                  />
                ))
              : featuredProducts.map((product) => (
                  <FeaturedProductCard key={product.maSanPham} product={product} />
                ))}
          </div>

          <div className="mt-14 flex justify-center sm:mt-16">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-stone-200 bg-[#faf9f7] px-8 text-[15px] font-medium text-stone-800 shadow-sm transition hover:border-stone-300 hover:bg-white"
            >
              <Link href="#trending" className="inline-flex items-center gap-2">
                Xem toàn bộ xu hướng
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Search & filter */}
      <section className="relative py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-stone-200/80 bg-gradient-to-br from-white via-[#fdfcfa] to-amber-50/30 p-8 shadow-[0_24px_60px_-28px_rgba(28,25,23,0.12)] sm:p-10 lg:p-12">
            <div className="mb-8 max-w-2xl space-y-3">
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                Tìm kiếm trong kho tàng phong cách
              </h2>
              <p className="text-stone-600">
                Gõ vài từ — chúng tôi lọc theo danh mục và thương hiệu để bạn chạm đúng món đồ trong tâm trí.
              </p>
            </div>

            <div className="relative mb-8">
              <SearchIcon className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-stone-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tên sản phẩm, thương hiệu…"
                className="h-14 rounded-2xl border-stone-200/90 bg-white/90 pl-14 pr-5 text-base shadow-inner shadow-stone-900/[0.03] transition focus-visible:border-amber-300/60 focus-visible:ring-amber-200/40"
              />
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Button
                type="button"
                variant={selectedCategory === null ? "default" : "outline"}
                className={
                  selectedCategory === null
                    ? "rounded-full border-0 bg-stone-900 px-6 text-white shadow-md hover:bg-stone-800"
                    : "rounded-full border-stone-200/90 bg-white/80 px-6 text-stone-700 shadow-sm hover:bg-white"
                }
                onClick={() => startTransition(() => setSelectedCategory(null))}
              >
                Tất cả
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.maDanhMuc}
                  type="button"
                  variant={
                    selectedCategory === category.maDanhMuc
                      ? "default"
                      : "outline"
                  }
                  className={
                    selectedCategory === category.maDanhMuc
                      ? "rounded-full border-0 bg-stone-900 px-6 text-white shadow-md hover:bg-stone-800"
                      : "rounded-full border-stone-200/90 bg-white/80 px-6 text-stone-700 shadow-sm hover:bg-white"
                  }
                  onClick={() =>
                    startTransition(() =>
                      setSelectedCategory(category.maDanhMuc),
                    )
                  }
                >
                  {category.tenDanhMuc}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending */}
      <section
        id="trending"
        className="border-t border-stone-200/40 bg-[#f7f5f2] py-20 sm:py-24 lg:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col gap-4 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-200/60 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-900 shadow-sm">
                <TrendingUpIcon className="size-3.5" aria-hidden />
                Được yêu thích
              </div>
              <h2 className="font-heading text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
                Làn sóng mới nhất
              </h2>
              <p className="mt-3 max-w-lg text-stone-600">
                Những món đang được săn đón — chất liệu mềm, form dễ mặc, đủ sức gánh một buổi tối thảnh thơi.
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-[3/4] animate-pulse rounded-[1.75rem] bg-gradient-to-br from-stone-100 to-stone-200/70"
                  />
                ))
              : trendingProducts.map((product, index) => (
                  <ProductCard
                    key={product.maSanPham}
                    product={product}
                    index={index}
                  />
                ))}
          </div>
        </div>
      </section>

      {/* About — light premium panel */}
      <section
        id="about"
        className="relative overflow-hidden py-20 sm:py-24 lg:py-28"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(251,191,36,0.12),transparent),radial-gradient(ellipse_60%_50%_at_100%_50%,rgba(196,181,253,0.12),transparent)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] border border-stone-200/60 bg-white/90 p-8 shadow-[0_28px_70px_-32px_rgba(28,25,23,0.15)] backdrop-blur-md sm:p-12 lg:grid lg:grid-cols-2 lg:gap-16 lg:p-16">
            <div className="space-y-6 lg:space-y-8">
              <Badge className="w-fit rounded-full border border-violet-200/80 bg-violet-50/80 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-900 hover:bg-violet-50/80">
                Về chúng tôi
              </Badge>
              <h2 className="font-heading text-3xl font-semibold leading-tight tracking-tight text-stone-950 sm:text-4xl lg:text-[2.75rem]">
                Thời trang Việt — tinh tế, hiện đại, chạm vào cảm xúc
              </h2>
              <p className="text-lg leading-relaxed text-stone-600">
                Chúng tôi tin vào sự chậm rãi: chọn ít hơn nhưng đẹp hơn, ưu tiên thợ lành nghề và câu chuyện đằng sau mỗi đường may.
              </p>
              <ul className="space-y-4 pt-2">
                {[
                  "Chất liệu và thương hiệu được kiểm duyệt kỹ lưỡng",
                  "Cân bằng giữa nét truyền thống và nhịp sống đô thị",
                  "Đồng hành cùng bạn trước và sau khi mua",
                ].map((feature) => (
                  <li key={feature} className="flex gap-3 text-stone-700">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                      <CheckCircle2Icon className="size-4" aria-hidden />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:mt-0">
              {[
                { number: "5K+", label: "Khách hàng tin chọn" },
                { number: "150+", label: "Mẫu được yêu thích" },
                { number: "50+", label: "Đối tác thương hiệu" },
                { number: "24/7", label: "Hỗ trợ trực tuyến" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col justify-center rounded-2xl border border-stone-100 bg-gradient-to-br from-[#faf9f7] to-white p-6 text-center shadow-sm"
                >
                  <p className="font-heading text-3xl font-semibold text-transparent sm:text-4xl bg-gradient-to-r from-amber-700 to-rose-600 bg-clip-text">
                    {stat.number}
                  </p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-wider text-stone-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] border border-stone-200/80 bg-gradient-to-b from-white to-amber-50/40 px-6 py-14 shadow-[0_32px_80px_-40px_rgba(28,25,23,0.2)] sm:px-12 sm:py-16">
            <div
              className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-amber-200/25 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-16 -left-16 size-56 rounded-full bg-violet-200/20 blur-3xl"
              aria-hidden
            />
            <h2 className="relative font-heading text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl lg:text-5xl">
              Sẵn sàng để tủ đồ của bạn
              <span className="mt-1 block text-stone-600">kể một câu chuyện mới?</span>
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-lg text-stone-600">
              Tham gia để nhận gợi ý phối đồ, ưu đãi dành riêng và quyền truy cập sớm vào các drop giới hạn.
            </p>
            <div className="relative mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full border-0 bg-stone-900 px-8 text-[15px] font-medium text-white shadow-lg hover:bg-stone-800"
              >
                <Link href="/signup">Đăng ký miễn phí</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-stone-200 bg-white/80 px-8 text-[15px] font-medium text-stone-800 hover:bg-white"
              >
                <Link href="#trending">Xem sản phẩm</Link>
              </Button>
            </div>

            <div className="relative mt-12 grid gap-6 border-t border-stone-200/60 pt-10 sm:grid-cols-3">
              {[
                { icon: ShoppingBagIcon, label: "Giao hàng linh hoạt" },
                { icon: StarIcon, label: "Chất lượng được kiểm chứng" },
                { icon: HeartIcon, label: "Cam kết hài lòng" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-2">
                  <item.icon
                    className="size-6 text-amber-700/90"
                    strokeWidth={1.5}
                  />
                  <p className="text-sm font-medium text-stone-800">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200/60 bg-white py-14 text-stone-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-4 md:gap-8">
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-200 via-rose-100 to-violet-200 ring-1 ring-white shadow-sm">
                  <span className="font-heading text-sm font-bold text-stone-800">
                    T
                  </span>
                </div>
                <span className="font-heading text-lg font-semibold tracking-[0.15em] text-stone-900">
                  THƯƠNG MẠI
                </span>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-stone-500">
                Không gian mua sắm dành cho người yêu cái đẹp có gu — nhẹ nhàng, sang trọng, luôn chào đón bạn.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Điều hướng
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a
                    href="#collection"
                    className="text-stone-600 transition hover:text-stone-900"
                  >
                    Bộ sưu tập
                  </a>
                </li>
                <li>
                  <a
                    href="#trending"
                    className="text-stone-600 transition hover:text-stone-900"
                  >
                    Xu hướng
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="text-stone-600 transition hover:text-stone-900"
                  >
                    Câu chuyện
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Tài khoản
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/login"
                    className="text-stone-600 transition hover:text-stone-900"
                  >
                    Đăng nhập
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    className="text-stone-600 transition hover:text-stone-900"
                  >
                    Đăng ký
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Liên hệ
              </h3>
              <p className="mt-4 flex items-start gap-2 text-sm text-stone-600">
                <MapPinIcon className="mt-0.5 size-4 shrink-0 text-stone-400" />
                Hà Nội, Việt Nam
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-stone-200/80 pt-8 text-center sm:flex-row sm:text-left">
            <p className="text-xs text-stone-500">
              © {new Date().getFullYear()} Thương Mại. Giữ lại mọi vẻ đẹp bạn chọn.
            </p>
            <p className="text-xs text-stone-400">
              Next.js · Spring Boot
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}

function FeaturedProductCard({ product }: { product: SanPham }) {
  const src = productImageSrc(product.hinhAnh)
  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-stone-200/70 bg-white shadow-[0_20px_50px_-28px_rgba(28,25,23,0.12)] transition duration-500 hover:-translate-y-1 hover:border-stone-300/80 hover:shadow-[0_28px_60px_-24px_rgba(28,25,23,0.18)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
        {src ? (
          <img
            src={src}
            alt={product.tenSanPham}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-50 via-rose-50 to-violet-100">
            <ShoppingBagIcon className="size-14 text-stone-300/80" strokeWidth={1} />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-900/25 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
      </div>
      <CardContent className="flex flex-1 flex-col p-6 sm:p-7">
        <Badge className="mb-4 w-fit rounded-full border border-amber-200/70 bg-amber-50/90 px-3 py-0.5 text-[11px] font-medium uppercase tracking-wider text-amber-900">
          {product.tenDanhMuc ?? "Danh mục"}
        </Badge>
        <h3 className="font-heading text-xl font-semibold leading-snug tracking-tight text-stone-950 line-clamp-2 sm:text-2xl">
          {product.tenSanPham}
        </h3>
        <p className="mt-2 text-sm text-stone-500">
          {product.tenThuongHieu ?? "Thương hiệu đồng hành"}
        </p>
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-stone-100 pt-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">
              Giá niêm yết
            </p>
            <p className="font-heading text-xl font-semibold text-amber-800 sm:text-2xl">
              {formatCurrency(product.gia)}
            </p>
          </div>
          <Button
            asChild
            size="sm"
            className="rounded-full bg-stone-900 px-5 text-white hover:bg-stone-800"
          >
            <Link href={`/san-pham/${product.maSanPham}`}>Xem</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function ProductCard({
  product,
  index,
}: {
  product: SanPham
  index: number
}) {
  const src = productImageSrc(product.hinhAnh)
  const grad = FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length]

  return (
    <Card className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-stone-200/60 bg-white shadow-[0_16px_44px_-28px_rgba(28,25,23,0.14)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-22px_rgba(28,25,23,0.18)]">
      <div className="relative aspect-[5/6] overflow-hidden bg-stone-50">
        {src ? (
          <img
            src={src}
            alt={product.tenSanPham}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${grad}`}
          >
            <ShoppingBagIcon className="size-12 text-stone-400/70" strokeWidth={1} />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-900/20 via-transparent to-white/10 opacity-0 transition duration-500 group-hover:opacity-100" />
      </div>

      <CardContent className="flex flex-1 flex-col p-5 sm:p-6">
        <Badge
          variant="outline"
          className="mb-3 w-fit rounded-full border-stone-200/90 bg-stone-50/80 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-stone-600"
        >
          {product.tenDanhMuc ?? "Danh mục"}
        </Badge>

        <h3 className="font-heading text-lg font-semibold leading-snug tracking-tight text-stone-950 line-clamp-2">
          {product.tenSanPham}
        </h3>

        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-stone-400">
          {product.tenThuongHieu ?? "Thương hiệu"}
        </p>

        <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-stone-600">
          {product.moTa || "Thiết kế tinh giản, dễ phối cho nhiều dịp trong ngày."}
        </p>

        <div className="mt-5 space-y-4 border-t border-stone-100 pt-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">
                Giá
              </p>
              <p className="font-heading text-xl font-semibold text-amber-800">
                {formatCurrency(product.gia)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">
                Tồn kho
              </p>
              <p className="text-sm font-semibold tabular-nums text-stone-800">
                {product.soLuongTon}
              </p>
            </div>
          </div>

          <Button
            asChild
            className="h-11 w-full rounded-full border-0 bg-stone-900 text-[14px] font-medium text-white shadow-md transition hover:bg-stone-800"
          >
            <Link href={`/san-pham/${product.maSanPham}`} className="inline-flex items-center justify-center gap-2">
              <ShoppingBagIcon className="size-4" />
              Xem chi tiết
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
