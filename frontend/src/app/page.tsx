"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { API_URL, getBrands, getCategories, getProducts } from "@/lib/api"
import type { DanhMuc, SanPham, ThuongHieu } from "@/lib/types"
import Link from "next/link"
import {
  ArrowRightIcon,
  SearchIcon,
  SparklesIcon,
  StarIcon,
  StoreIcon,
} from "lucide-react"
import { startTransition, useDeferredValue, useEffect, useState } from "react"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value)
}

export default function Home() {
  const [products, setProducts] = useState<SanPham[]>([])
  const [categories, setCategories] = useState<DanhMuc[]>([])
  const [brands, setBrands] = useState<ThuongHieu[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const deferredSearch = useDeferredValue(search)

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

  const featuredProduct = filteredProducts[0] ?? products[0] ?? null

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fff8ef_0%,#f5ebdf_30%,#efe1d1_62%,#ead8c6_100%)] text-stone-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.9),transparent_22%),radial-gradient(circle_at_80%_10%,rgba(233,180,132,0.25),transparent_24%)]" />

      <section className="relative mx-auto flex max-w-7xl flex-col gap-8 px-5 py-6 lg:px-8 lg:py-8">
        <header className="rounded-[2.25rem] border border-white/70 bg-white/75 p-5 shadow-[0_28px_80px_rgba(115,84,52,0.12)] backdrop-blur">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <Badge
                variant="outline"
                className="rounded-full border-amber-200 bg-amber-50 px-3 py-1 text-[0.7rem] uppercase tracking-[0.35em] text-amber-900"
              >
                Bộ sưu tập áo dài cao cấp
              </Badge>
              <h1 className="mt-5 font-heading text-5xl leading-[0.95] font-semibold text-stone-950 sm:text-6xl xl:text-7xl">
                Tôn vẻ đẹp Việt bằng thiết kế tinh xảo và cảm hứng thời trang
                đương đại.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-stone-600 sm:text-lg">
                Trang chủ này đang lấy dữ liệu thật từ backend Spring Boot để
                giới thiệu những thiết kế áo dài, phụ kiện và thương hiệu mang
                tinh thần thẩm mỹ cao cấp.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:w-[26rem]">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full bg-stone-950 px-6 text-white hover:bg-stone-800"
              >
                <Link href="/login">Đăng nhập quản trị</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-stone-300 bg-white/80 px-6"
              >
                <Link href="/signup">Tạo tài khoản mới</Link>
              </Button>
            </div>
          </div>
        </header>

        <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <Card className="rounded-[2rem] border-none bg-[linear-gradient(135deg,#171311_0%,#2c211c_45%,#8f5f35_100%)] text-stone-50 shadow-[0_28px_80px_rgba(42,29,21,0.32)]">
            <CardHeader className="px-6 pt-6">
              <Badge
                variant="secondary"
                className="w-fit rounded-full border border-white/10 bg-white/10 px-3 text-white"
              >
                Điểm nhấn từ API
              </Badge>
              <CardTitle className="mt-4 max-w-xl font-heading text-3xl leading-tight text-white sm:text-4xl">
                {featuredProduct?.tenSanPham ??
                  "Dữ liệu sản phẩm sẽ xuất hiện ngay khi backend trả về."}
              </CardTitle>
              <CardDescription className="max-w-lg text-stone-200/80">
                {featuredProduct?.moTa ??
                  "Bạn đang xem giao diện storefront ưu tiên cảm xúc thẩm mỹ, kết hợp dữ liệu thật từ cơ sở dữ liệu PostgreSQL."}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 px-6 pb-6 pt-2 sm:grid-cols-[0.7fr_0.3fr]">
              <div className="rounded-[1.6rem] border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-stone-300/80">
                      Giá nổi bật
                    </p>
                    <p className="mt-3 font-heading text-4xl text-amber-200">
                      {featuredProduct
                        ? formatCurrency(featuredProduct.gia)
                        : "—"}
                    </p>
                  </div>
                  <div className="rounded-full border border-white/12 bg-white/10 p-3">
                    <SparklesIcon className="size-5 text-amber-200" />
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Badge className="rounded-full bg-white/12 px-3 text-white">
                    {featuredProduct?.tenDanhMuc ?? "Danh mục"}
                  </Badge>
                  <Badge className="rounded-full bg-white/12 px-3 text-white">
                    {featuredProduct?.tenThuongHieu ?? "Thương hiệu"}
                  </Badge>
                  <Badge className="rounded-full bg-white/12 px-3 text-white">
                    {featuredProduct?.size ?? "Nhiều kích cỡ"}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-3">
                <StatCard
                  label="Sản phẩm"
                  value={products.length}
                  note="Đang đồng bộ từ backend"
                />
                <StatCard
                  label="Thương hiệu"
                  value={brands.length}
                  note="Tạo điểm nhấn bộ sưu tập"
                />
                <StatCard
                  label="Danh mục"
                  value={categories.length}
                  note="Giúp khách lọc nhanh hơn"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-5">
            <Card className="rounded-[2rem] border-none bg-white/82 shadow-[0_22px_60px_rgba(95,73,44,0.12)]">
              <CardHeader className="px-6 pt-6">
                <CardTitle className="font-heading text-3xl text-stone-950">
                  Thẩm mỹ và dữ liệu gặp nhau ở cùng một trải nghiệm.
                </CardTitle>
                <CardDescription className="text-stone-600">
                  Frontend đang dùng shadcn/ui để tạo cấu trúc hiện đại, nhưng
                  hình khối và màu sắc được đẩy theo hướng sang trọng, mềm và
                  tinh tế hơn.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <FeaturePill title="API đang dùng" value={API_URL} />
                  <FeaturePill
                    title="Sản phẩm hiển thị"
                    value={`${filteredProducts.length} mục`}
                  />
                  <FeaturePill
                    title="Tông giao diện"
                    value="Kem, hổ phách, nâu đá"
                  />
                  <FeaturePill title="Trải nghiệm" value="Biên tập như lookbook" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-none bg-white/82 shadow-[0_22px_60px_rgba(95,73,44,0.12)]">
              <CardHeader className="px-6 pt-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <CardDescription className="uppercase tracking-[0.28em] text-stone-500">
                      Tìm kiếm sản phẩm
                    </CardDescription>
                    <CardTitle className="mt-2 font-heading text-3xl">
                      Chọn đúng chất liệu, đúng phong cách
                    </CardTitle>
                  </div>
                  <div className="relative w-full lg:max-w-sm">
                    <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                    <Input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Tìm theo tên sản phẩm hoặc thương hiệu"
                      className="h-12 rounded-full border-stone-200 bg-stone-50 pl-11"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3 px-6 pb-6">
                <Button
                  type="button"
                  variant={selectedCategory === null ? "default" : "outline"}
                  className="rounded-full px-4"
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
                    className="rounded-full px-4"
                    onClick={() =>
                      startTransition(() =>
                        setSelectedCategory(category.maDanhMuc),
                      )
                    }
                  >
                    {category.tenDanhMuc}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        {error ? (
          <div className="rounded-[1.5rem] border border-destructive/20 bg-destructive/10 px-5 py-4 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <section className="rounded-[2.25rem] border border-white/65 bg-white/78 p-6 shadow-[0_28px_80px_rgba(115,84,52,0.1)] backdrop-blur">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Badge
                variant="outline"
                className="rounded-full border-stone-200 bg-stone-50 px-3 py-1 text-[0.7rem] uppercase tracking-[0.32em] text-stone-700"
              >
                Bộ sưu tập đang hiển thị
              </Badge>
              <h2 className="mt-4 font-heading text-4xl leading-tight text-stone-950 sm:text-5xl">
                Những thiết kế được chọn để kể một câu chuyện dịu dàng và sang
                trọng.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-stone-600">
              Giao diện được ưu tiên theo phong cách lookbook: nhiều khoảng
              thở, typography sang trọng và thẻ sản phẩm nổi khối để tôn cảm
              giác thẩm mỹ của thương hiệu.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="min-h-72 rounded-[1.9rem] bg-[linear-gradient(135deg,#f5ece2,#eee2d4)]"
                  />
                ))
              : filteredProducts.map((product, index) => (
                  <article
                    key={product.maSanPham}
                    className="group overflow-hidden rounded-[1.9rem] border border-stone-900/8 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(110,82,49,0.14)]"
                  >
                    <div
                      className="relative flex h-56 items-end overflow-hidden p-5 text-white"
                      style={{
                        backgroundImage: `linear-gradient(145deg, rgba(33,28,25,0.96) 0%, rgba(${98 + index * 4}, ${72 + index * 3}, ${49 + index * 2}, 0.94) 48%, rgba(184, 123, 67, 0.92) 100%)`,
                      }}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_28%),linear-gradient(180deg,transparent_20%,rgba(0,0,0,0.28)_100%)]" />
                      <div className="relative">
                        <Badge className="rounded-full bg-white/12 px-3 text-white">
                          {product.tenDanhMuc ?? "Danh mục"}
                        </Badge>
                        <h3 className="mt-4 font-heading text-3xl leading-tight">
                          {product.tenSanPham}
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-5 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm text-stone-500">Thương hiệu</p>
                          <p className="mt-1 font-medium text-stone-900">
                            {product.tenThuongHieu ?? "Chưa gắn"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-stone-500">Tồn kho</p>
                          <p className="mt-1 font-medium text-stone-900">
                            {product.soLuongTon}
                          </p>
                        </div>
                      </div>

                      <p className="line-clamp-3 min-h-[4.5rem] text-sm leading-7 text-stone-600">
                        {product.moTa ||
                          "Thiết kế đang được đồng bộ từ hệ thống dữ liệu thật và sẵn sàng hiển thị cho khách hàng."}
                      </p>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-stone-500">Giá bán</p>
                          <p className="mt-1 font-heading text-3xl text-rose-700">
                            {formatCurrency(product.gia)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] text-amber-900">
                          <StarIcon className="size-3.5 fill-current" />
                          {product.size || "Nhiều size"}
                        </div>
                      </div>

                      <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-sm font-medium text-stone-900 transition-colors hover:text-amber-800"
                      >
                        Xem chi tiết và quản trị
                        <ArrowRightIcon className="size-4" />
                      </Link>
                    </div>
                  </article>
                ))}
          </div>
        </section>

        <footer className="pb-8 text-center text-sm text-stone-500">
          <span className="font-medium text-stone-700">Web Thời Trang</span> ·
          Giao diện storefront đang đọc dữ liệu thật từ backend Spring Boot và
          PostgreSQL.
        </footer>
      </section>
    </main>
  )
}

function StatCard({
  label,
  value,
  note,
}: {
  label: string
  value: number
  note: string
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/12 bg-white/7 p-4 backdrop-blur-sm">
      <p className="text-[0.7rem] uppercase tracking-[0.28em] text-stone-300/80">
        {label}
      </p>
      <p className="mt-2 font-heading text-4xl text-white">{value}</p>
      <p className="mt-2 text-xs leading-6 text-stone-300/75">{note}</p>
    </div>
  )
}

function FeaturePill({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-stone-200 bg-stone-50 px-4 py-3">
      <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-500">
        {title}
      </p>
      <p className="mt-2 text-sm font-medium leading-6 text-stone-900">
        {value}
      </p>
    </div>
  )
}
