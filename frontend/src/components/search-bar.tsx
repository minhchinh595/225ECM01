"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { SearchIcon } from "lucide-react"
import { getProducts } from "@/lib/api"
import { API_URL } from "@/lib/api"
import type { SanPham } from "@/lib/types"

const API_ORIGIN = API_URL.replace(/\/api\/?$/, "")

function productImageSrc(hinhAnh?: string | null): string | null {
  if (!hinhAnh?.trim()) return null
  const path = hinhAnh.trim()
  if (/^https?:\/\//i.test(path)) return path
  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
}

export function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [products, setProducts] = useState<SanPham[]>([])
  const [results, setResults] = useState<SanPham[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Load products once
  useEffect(() => {
    getProducts().then(setProducts).catch(() => {})
  }, [])

  // Filter on query change
  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const q = query.toLowerCase()
    setResults(
      products
        .filter((p) =>
          p.tenSanPham.toLowerCase().includes(q) ||
          (p.tenDanhMuc ?? "").toLowerCase().includes(q) ||
          (p.tenThuongHieu ?? "").toLowerCase().includes(q)
        )
        .slice(0, 6)
    )
  }, [query, products])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setQuery("")
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setQuery("") }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm sản phẩm..."
            className="h-9 w-44 rounded-full border border-stone-200 bg-stone-50 pl-9 pr-4 text-sm outline-none transition focus:border-stone-400 focus:bg-white sm:w-56"
          />
        </div>
      </div>

      {/* Dropdown kết quả */}
      {query.trim() && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_16px_48px_-12px_rgba(28,25,23,0.18)]">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-stone-400">
              Không tìm thấy sản phẩm nào
            </div>
          ) : (
            <div>
              <p className="border-b border-stone-100 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-stone-400">
                Kết quả tìm kiếm
              </p>
              {results.map((product) => {
                const src = productImageSrc(product.hinhAnh)
                return (
                  <button
                    key={product.maSanPham}
                    onClick={() => {
                      router.push(`/san-pham/${product.maSanPham}`)
                      setOpen(false)
                      setQuery("")
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-stone-50"
                  >
                    <div className="h-12 w-10 shrink-0 overflow-hidden rounded-md bg-stone-100">
                      {src ? (
                        <img src={src} alt={product.tenSanPham} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-stone-100" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-stone-900">{product.tenSanPham}</p>
                      <p className="text-xs text-stone-400">{product.tenDanhMuc}</p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-stone-700">
                      {formatCurrency(product.gia)}
                    </p>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
