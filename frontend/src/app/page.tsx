"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { API_URL, getBrands, getCategories, getProducts } from "@/lib/api"
import type { DanhMuc, SanPham, ThuongHieu } from "@/lib/types"
import Link from "next/link"
import { SearchIcon, ShirtIcon, SparklesIcon, StoreIcon } from "lucide-react"
import { startTransition, useDeferredValue, useEffect, useState } from "react"

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
            : "Khong the tai du lieu tu backend",
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

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f7efe5_0%,#f4ede4_28%,#efe7da_46%,#e8ddcf_100%)] text-stone-900">
      <section className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-8 lg:px-10">
        <header className="rounded-[2rem] border border-stone-900/10 bg-white/70 p-4 shadow-[0_20px_60px_rgba(87,62,40,0.08)] backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-amber-800">
                Web thoi trang
              </p>
              <h1 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
                Frontend da noi truc tiep vao backend Spring Boot cua ban.
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="rounded-full bg-stone-900 px-6 text-white hover:bg-stone-800">
                <Link href="/login">Dang nhap</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-stone-400 bg-white/80 px-6">
                <Link href="/signup">Dang ky</Link>
              </Button>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="rounded-[1.75rem] border-none bg-stone-950 text-stone-50 shadow-[0_20px_50px_rgba(32,24,18,0.22)]">
            <CardContent className="flex items-center gap-4 p-6">
              <StoreIcon className="size-10 text-amber-300" />
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-stone-400">
                  API URL
                </p>
                <p className="mt-1 text-sm text-stone-100">{API_URL}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-[1.75rem] border-none bg-white/85 shadow-[0_20px_50px_rgba(96,74,44,0.1)]">
            <CardContent className="flex items-center gap-4 p-6">
              <ShirtIcon className="size-10 text-amber-700" />
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-stone-500">
                  San pham
                </p>
                <p className="mt-1 text-3xl font-semibold">{products.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-[1.75rem] border-none bg-white/85 shadow-[0_20px_50px_rgba(96,74,44,0.1)]">
            <CardContent className="flex items-center gap-4 p-6">
              <SparklesIcon className="size-10 text-rose-700" />
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-stone-500">
                  Thuong hieu
                </p>
                <p className="mt-1 text-3xl font-semibold">{brands.length}</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-[0_20px_60px_rgba(87,62,40,0.08)] backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-stone-500">
                Danh muc tu backend
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                San pham hien thi dang doc tu API that
              </h2>
            </div>
            <div className="relative w-full lg:max-w-sm">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tim theo ten san pham hoac thuong hieu"
                className="rounded-full border-stone-300 bg-white pl-10"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              type="button"
              variant={selectedCategory === null ? "default" : "outline"}
              className="rounded-full"
              onClick={() => startTransition(() => setSelectedCategory(null))}
            >
              Tat ca
            </Button>
            {categories.map((category) => (
              <Button
                key={category.maDanhMuc}
                type="button"
                variant={
                  selectedCategory === category.maDanhMuc ? "default" : "outline"
                }
                className="rounded-full"
                onClick={() =>
                  startTransition(() => setSelectedCategory(category.maDanhMuc))
                }
              >
                {category.tenDanhMuc}
              </Button>
            ))}
          </div>

          {error ? (
            <div className="mt-6 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="min-h-64 rounded-[1.75rem] border border-stone-200 bg-stone-100/80"
                  />
                ))
              : filteredProducts.map((product, index) => (
                  <article
                    key={product.maSanPham}
                    className="group overflow-hidden rounded-[1.75rem] border border-stone-900/10 bg-white shadow-[0_18px_40px_rgba(96,74,44,0.08)] transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div
                      className="flex h-44 items-end bg-gradient-to-br from-stone-900 via-stone-700 to-amber-700 p-5 text-white"
                      style={{
                        backgroundImage: `linear-gradient(135deg, rgba(41,37,36,1) 0%, rgba(${70 + index * 7}, ${54 + index * 4}, ${40 + index * 3}, 0.95) 42%, rgba(180, 83, 9, 0.9) 100%)`,
                      }}
                    >
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-white/70">
                          {product.tenDanhMuc ?? "Danh muc"}
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold">
                          {product.tenSanPham}
                        </h3>
                      </div>
                    </div>
                    <div className="space-y-4 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm text-stone-500">Thuong hieu</p>
                          <p className="font-medium text-stone-800">
                            {product.tenThuongHieu ?? "Chua gan"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-stone-500">Ton kho</p>
                          <p className="font-medium">{product.soLuongTon}</p>
                        </div>
                      </div>
                      <p className="line-clamp-2 min-h-10 text-sm text-stone-600">
                        {product.moTa || "San pham hien dang duoc tra ve tu backend va san sang cho frontend su dung."}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-stone-500">Gia ban</p>
                          <p className="text-2xl font-semibold text-rose-700">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(product.gia)}
                          </p>
                        </div>
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-amber-900">
                          {product.size || "Free size"}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
          </div>
        </section>
      </section>
    </main>
  )
}
