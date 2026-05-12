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
  HeartIcon,
  ShoppingBagIcon,
  TrendingUpIcon,
  CheckCircle2Icon,
  MapPinIcon,
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

  const featuredProducts = filteredProducts.slice(0, 3)
  const trendingProducts = filteredProducts.slice(0, 6)

  return (
    <main className="bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-stone-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-linear-to-br from-amber-500 via-rose-500 to-orange-500" />
              <span className="font-heading text-2xl font-semibold text-stone-950">
                THƯƠNG MẠI
              </span>
            </div>
            <div className="hidden md:flex gap-8">
              <a href="#collection" className="text-sm font-medium text-stone-600 hover:text-stone-950 transition">
                Bộ sưu tập
              </a>
              <a href="#trending" className="text-sm font-medium text-stone-600 hover:text-stone-950 transition">
                Xu hướng
              </a>
              <a href="#about" className="text-sm font-medium text-stone-600 hover:text-stone-950 transition">
                Về chúng tôi
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild size="sm" variant="outline" className="rounded-full">
                <Link href="/login">Đăng nhập</Link>
              </Button>
              <Button asChild size="sm" className="rounded-full bg-stone-950 hover:bg-stone-800">
                <Link href="/signup">Tham gia</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-stone-50 via-amber-50 to-orange-50 py-20 sm:py-32 lg:py-40">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-gradient-to-br from-amber-200 to-orange-200 opacity-20 blur-3xl" />
          <div className="absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-gradient-to-tr from-rose-200 to-amber-200 opacity-20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <Badge className="w-fit rounded-full bg-amber-100 text-amber-900 hover:bg-amber-100 border-amber-200 border">
                ✨ Thương hiệu thời trang cao cấp
              </Badge>

              <div className="space-y-4">
                <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-stone-950">
                  Thể hiện cá nhân,
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-rose-500 to-orange-500">
                    tôn vinh phong cách
                  </span>
                </h1>
                <p className="text-lg text-stone-600 leading-relaxed max-w-lg">
                  Khám phá bộ sưu tập áo dài, thời trang hiện đại và phụ kiện cao cấp từ các thương hiệu địa phương yêu thích. Mỗi sản phẩm được lựa chọn với tâm huyết để mang đến sự tuyệt vời.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full bg-stone-950 hover:bg-stone-800 px-8 h-12">
                  <Link href="/login">Khám phá ngay</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-stone-300 px-8 h-12">
                  <Link href="#collection">Xem bộ sưu tập</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div>
                  <p className="text-3xl font-bold text-stone-950">{products.length}+</p>
                  <p className="text-sm text-stone-600">Sản phẩm</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-stone-950">{brands.length}</p>
                  <p className="text-sm text-stone-600">Thương hiệu</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-stone-950">{categories.length}</p>
                  <p className="text-sm text-stone-600">Danh mục</p>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative h-96 sm:h-[500px] lg:h-[600px]">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-200/40 via-rose-200/30 to-orange-200/40 blur-2xl" />
              <div className="absolute inset-0 rounded-3xl border border-white/60 bg-white/20 backdrop-blur-xl overflow-hidden">
                <div className="h-full w-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">👗</div>
                    <p className="text-stone-600 font-medium">Thời trang sang trọng</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section id="collection" className="py-16 sm:py-20 lg:py-24 bg-stone-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="inline-block rounded-full bg-amber-100 text-amber-900 hover:bg-amber-100 border-amber-200 border">
              Bộ sưu tập nổi bật
            </Badge>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-stone-950">
              Những thiết kế tinh tế, được chọn lọc
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Mỗi bộ sưu tập là câu chuyện về văn hóa, cảm xúc và sự khéo léo trong từng chi tiết
            </p>
          </div>

          {/* Featured Products Grid */}
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 mb-8">
              {error}
            </div>
          ) : null}

          <div className="grid gap-6 md:grid-cols-3 mb-12">
            {loading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-96 rounded-2xl bg-gradient-to-br from-stone-200 to-stone-300 animate-pulse"
                  />
                ))
              : featuredProducts.map((product) => (
                  <FeaturedProductCard key={product.maSanPham} product={product} />
                ))}
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="rounded-full bg-stone-950 hover:bg-stone-800">
              <Link href="#trending">Xem thêm sản phẩm</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-stone-950">
                Tìm kiếm sản phẩm yêu thích
              </h2>
              <p className="text-lg text-stone-600">
                Lọc theo danh mục hoặc tìm kiếm từ khóa để khám phá sản phẩm phù hợp với phong cách của bạn
              </p>
            </div>

            {/* Search Input */}
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm theo tên sản phẩm, thương hiệu hoặc danh mục..."
                className="h-14 rounded-full border-stone-200 bg-stone-50 pl-12 text-base"
              />
            </div>

            {/* Category Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant={selectedCategory === null ? "default" : "outline"}
                className="rounded-full px-6"
                onClick={() => startTransition(() => setSelectedCategory(null))}
              >
                Tất cả danh mục
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
                  className="rounded-full px-6"
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

      {/* Trending Products */}
      <section id="trending" className="py-16 sm:py-20 lg:py-24 bg-stone-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUpIcon className="h-5 w-5 text-amber-600" />
                <span className="text-sm font-semibold text-amber-600 uppercase tracking-wide">Đang bán chạy</span>
              </div>
              <h2 className="font-heading text-4xl sm:text-5xl font-bold text-stone-950">
                Những sản phẩm được yêu thích
              </h2>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-80 rounded-2xl bg-gradient-to-br from-stone-200 to-stone-300 animate-pulse"
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

      {/* About Brand Section */}
      <section id="about" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-stone-950 via-stone-900 to-amber-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            {/* Left */}
            <div className="space-y-6">
              <Badge className="w-fit rounded-full bg-white/10 text-white border-white/20 border hover:bg-white/20">
                Về chúng tôi
              </Badge>

              <h2 className="font-heading text-4xl sm:text-5xl font-bold leading-tight">
                Thương hiệu thời trang của người Việt, cho người Việt
              </h2>

              <p className="text-lg text-white/80 leading-relaxed">
                Chúng tôi tin rằng thời trang là một cách để thể hiện cá nhân và tôn vinh văn hóa truyền thống. Mỗi sản phẩm được tạo ra với tâm huyết, chất lượng cao và thiết kế tinh tế.
              </p>

              <div className="space-y-4 pt-4">
                {[
                  "Sản phẩm chất lượng cao từ các thương hiệu địa phương",
                  "Thiết kế hiện đại kết hợp yếu tố truyền thống",
                  "Dịch vụ chăm sóc khách hàng tuyệt vời",
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2Icon className="h-5 w-5 mt-0.5 text-amber-300 flex-shrink-0" />
                    <span className="text-white/90">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Stats */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { number: "5K+", label: "Khách hàng hài lòng" },
                { number: "150+", label: "Sản phẩm được yêu thích" },
                { number: "50+", label: "Thương hiệu đối tác" },
                { number: "24/7", label: "Hỗ trợ khách hàng" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-white/10 border border-white/20 p-6 text-center backdrop-blur-sm"
                >
                  <p className="text-3xl sm:text-4xl font-bold text-amber-200">
                    {stat.number}
                  </p>
                  <p className="text-sm text-white/70 mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-stone-950">
              Bạn đã sẵn sàng khám phá?
            </h2>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto">
              Tham gia cộng đồng những người yêu thích thời trang cao cấp và nhận những đặc quyền độc quyền
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="rounded-full bg-stone-950 hover:bg-stone-800 px-8 h-12">
              <Link href="/signup">Đăng ký miễn phí</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-stone-300 px-8 h-12">
              <Link href="#trending">Xem sản phẩm</Link>
            </Button>
          </div>

          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-stone-200">
            {[
              { icon: ShoppingBagIcon, label: "Giao hàng nhanh" },
              { icon: StarIcon, label: "Chất lượng đảm bảo" },
              { icon: HeartIcon, label: "100% hài lòng" },
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <item.icon className="h-6 w-6 mx-auto text-amber-600" />
                <p className="font-medium text-stone-900">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 via-rose-500 to-orange-500" />
                <span className="font-heading text-xl font-semibold">THƯƠNG MẠI</span>
              </div>
              <p className="text-sm text-white/60">
                Thương hiệu thời trang cao cấp của người Việt
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-white">Điều hướng</h3>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#collection" className="hover:text-white transition">Bộ sưu tập</a></li>
                <li><a href="#trending" className="hover:text-white transition">Xu hướng</a></li>
                <li><a href="#about" className="hover:text-white transition">Về chúng tôi</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-white">Hỗ trợ</h3>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="/login" className="hover:text-white transition">Đăng nhập</a></li>
                <li><a href="/signup" className="hover:text-white transition">Đăng ký</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-white">Liên hệ</h3>
              <div className="space-y-2 text-sm text-white/60">
                <p className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" />
                  Hà Nội, Việt Nam
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/60">
              © 2024 Thương Mại. Tất cả quyền được bảo lưu.
            </p>
            <p className="text-xs text-white/50">
              Được xây dựng với ❤️ bằng Next.js + Spring Boot
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}

// Featured Product Card Component
function FeaturedProductCard({ product }: { product: SanPham }) {
  return (
    <Card className="group overflow-hidden rounded-2xl border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
      <div className="relative h-48 bg-gradient-to-br from-amber-200/40 to-rose-200/40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
          <Badge className="rounded-full bg-amber-100 text-amber-900 border-amber-200 border">
            {product.tenDanhMuc ?? "Danh mục"}
          </Badge>
        </div>
        <h3 className="font-heading text-2xl font-semibold text-stone-950 mb-2 line-clamp-2">
          {product.tenSanPham}
        </h3>
        <p className="text-sm text-stone-600 mb-4 flex-1">
          {product.tenThuongHieu ?? "Thương hiệu cao cấp"}
        </p>
        <div className="flex items-end justify-between gap-2 pt-4 border-t border-stone-200">
          <div>
            <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Giá</p>
            <p className="font-heading text-2xl font-bold text-amber-600">
              {formatCurrency(product.gia)}
            </p>
          </div>
          <Button asChild size="sm" className="rounded-full bg-stone-950 hover:bg-stone-800">
            <Link href="/login">Xem</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Product Card Component
function ProductCard({
  product,
  index,
}: {
  product: SanPham
  index: number
}) {
  return (
    <Card className="group overflow-hidden rounded-2xl border-stone-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div
        className="relative h-52 overflow-hidden bg-gradient-to-br"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(${217 - index * 10}, ${180 - index * 8}, ${140 - index * 6}, 0.8) 0%, rgba(${245 - index * 12}, ${200 - index * 10}, ${150 - index * 8}, 0.6) 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl opacity-30 group-hover:opacity-40 transition-opacity">
            👔
          </div>
        </div>
      </div>

      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="mb-3">
          <Badge variant="outline" className="rounded-full text-xs">
            {product.tenDanhMuc ?? "Danh mục"}
          </Badge>
        </div>

        <h3 className="font-heading text-xl font-semibold text-stone-950 mb-1 line-clamp-2">
          {product.tenSanPham}
        </h3>

        <p className="text-xs text-stone-500 mb-3">
          {product.tenThuongHieu ?? "Thương hiệu"}
        </p>

        <p className="text-sm text-stone-600 mb-4 line-clamp-2 flex-1">
          {product.moTa || "Sản phẩm chất lượng cao"}
        </p>

        <div className="space-y-3 pt-3 border-t border-stone-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-stone-500 mb-1">Giá</p>
              <p className="font-heading text-2xl font-bold text-amber-600">
                {formatCurrency(product.gia)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-stone-500 mb-1">Kho</p>
              <p className="font-semibold text-stone-900">{product.soLuongTon}</p>
            </div>
          </div>

          <Button
            asChild
            className="w-full rounded-full bg-stone-950 hover:bg-stone-800 text-white"
          >
            <Link href="/login" className="flex items-center justify-center gap-2">
              <ShoppingBagIcon className="h-4 w-4" />
              Xem chi tiết
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
