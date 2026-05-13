"use client"

import { useEffect, useState } from "react"
import { getProducts, getCategories, getBrands } from "@/lib/api"
import type { SanPham, DanhMuc, ThuongHieu } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PackageIcon, PlusIcon, SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

function formatCurrency(v: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v)
}

export default function SanPhamPage() {
  const [products, setProducts] = useState<SanPham[]>([])
  const [categories, setCategories] = useState<DanhMuc[]>([])
  const [brands, setBrands] = useState<ThuongHieu[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getProducts(), getCategories(), getBrands()])
      .then(([p, c, b]) => { setProducts(p); setCategories(c); setBrands(b) })
      .finally(() => setLoading(false))
  }, [])

  const filtered = products.filter((p) =>
    p.tenSanPham.toLowerCase().includes(search.toLowerCase()) ||
    (p.tenThuongHieu ?? "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-stone-900">Sản phẩm</h1>
          <p className="mt-1 text-sm text-stone-500">Quản lý toàn bộ sản phẩm trong hệ thống.</p>
        </div>
        <Button className="rounded-full bg-stone-900 px-5 text-white hover:bg-stone-800">
          <PlusIcon className="mr-2 size-4" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên sản phẩm, thương hiệu..."
          className="h-11 rounded-2xl border-stone-200 bg-white/80 pl-11 text-sm shadow-sm"
        />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Tổng sản phẩm", value: products.length, color: "text-stone-900" },
          { label: "Danh mục", value: categories.length, color: "text-amber-700" },
          { label: "Thương hiệu", value: brands.length, color: "text-emerald-700" },
        ].map((s) => (
          <Card key={s.label} className="rounded-[1.5rem] border-none bg-white/85 shadow-[0_8px_24px_rgba(96,74,44,0.07)]">
            <CardContent className="p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-stone-400">{s.label}</p>
              <p className={`font-heading mt-2 text-3xl font-semibold ${s.color}`}>
                {loading ? "…" : s.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="rounded-[1.75rem] border-none bg-white/85 shadow-[0_12px_32px_rgba(96,74,44,0.08)]">
        <CardHeader className="pb-4">
          <CardTitle className="font-heading text-lg font-semibold text-stone-900">
            Danh sách sản phẩm
            {!loading && <span className="ml-2 text-sm font-normal text-stone-400">({filtered.length})</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-14 animate-pulse rounded-2xl bg-stone-100" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-stone-400">
              <PackageIcon className="size-10 opacity-40" strokeWidth={1} />
              <p className="text-sm">Không tìm thấy sản phẩm nào.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((product) => (
                <div
                  key={product.maSanPham}
                  className="flex items-center justify-between rounded-2xl border border-stone-100 bg-stone-50/60 px-4 py-3.5 transition hover:border-stone-200 hover:bg-white"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100">
                      <PackageIcon className="size-5 text-stone-400" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-stone-900">{product.tenSanPham}</p>
                      <p className="text-xs text-stone-400">{product.tenDanhMuc} · {product.tenThuongHieu}</p>
                    </div>
                  </div>
                  <div className="ml-4 shrink-0 text-right">
                    <p className="text-sm font-semibold text-rose-700">{formatCurrency(product.gia)}</p>
                    <p className="text-xs text-stone-400">Tồn {product.soLuongTon}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
