"use client"

import { useEffect, useState } from "react"
import { getBrands } from "@/lib/api"
import type { ThuongHieu } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TagsIcon, PlusIcon, SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function ThuongHieuPage() {
  const [brands, setBrands] = useState<ThuongHieu[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBrands().then(setBrands).finally(() => setLoading(false))
  }, [])

  const filtered = brands.filter((b) =>
    b.tenThuongHieu.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-stone-900">Thương hiệu</h1>
          <p className="mt-1 text-sm text-stone-500">Quản lý các thương hiệu trong hệ thống.</p>
        </div>
        <Button className="rounded-full bg-stone-900 px-5 text-white hover:bg-stone-800">
          <PlusIcon className="mr-2 size-4" />
          Thêm thương hiệu
        </Button>
      </div>

      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm thương hiệu..."
          className="h-11 rounded-2xl border-stone-200 bg-white/80 pl-11 text-sm shadow-sm"
        />
      </div>

      <Card className="rounded-[1.75rem] border-none bg-white/85 shadow-[0_12px_32px_rgba(96,74,44,0.08)]">
        <CardHeader className="pb-4">
          <CardTitle className="font-heading text-lg font-semibold text-stone-900">
            Danh sách thương hiệu
            {!loading && <span className="ml-2 text-sm font-normal text-stone-400">({filtered.length})</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-2xl bg-stone-100" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-stone-400">
              <TagsIcon className="size-10 opacity-40" strokeWidth={1} />
              <p className="text-sm">Không tìm thấy thương hiệu nào.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((brand) => (
                <div
                  key={brand.maThuongHieu}
                  className="rounded-2xl border border-stone-100 bg-stone-50/60 p-4 transition hover:border-stone-200 hover:bg-white hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                      <TagsIcon className="size-5 text-emerald-700" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-900">{brand.tenThuongHieu}</p>
                      {brand.moTa && (
                        <p className="mt-0.5 text-xs text-stone-400 line-clamp-1">{brand.moTa}</p>
                      )}
                    </div>
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
