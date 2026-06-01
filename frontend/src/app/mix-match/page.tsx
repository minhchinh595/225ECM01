"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getProducts } from "@/lib/api"
import { productImageSrc } from "@/lib/product-image"
import { getStoredUser } from "@/lib/auth"
import type { NguoiDung, SanPham } from "@/lib/types"
import { UserMenu } from "@/components/user-menu"
import { SearchBar } from "@/components/search-bar"
import { CartIcon } from "@/components/cart-icon"
import { Button } from "@/components/ui/button"
import {
  SparklesIcon,
  ShoppingBagIcon,
  Loader2Icon,
  Wand2Icon,
  DownloadIcon,
  XIcon,
  ArrowLeftIcon,
  LayoutGridIcon,
  RefreshCwIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  ImageIcon,
} from "lucide-react"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "Áo Dài": ["áo dài", "ao dai", "cái áo"],
  "Nón Lá": ["nón lá", "non la", "nón"],
  "Túi": ["túi", "tui", "bag"],
  "Giày": ["giày", "giay", "dép", "dep", "guốc", "guoc", "cao gót", "sandal"],
  "Trang Sức & Khăn Lụa": ["trang sức", "trang suc", "khăn lụa", "khan lua", "vòng tay", "vong tay", "khăn", "lụa"],
}

function getCategoryKey(product: SanPham): string {
  const name = (product.tenDanhMuc ?? "").toLowerCase()
  for (const [key, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => name.includes(kw))) return key
  }
  return "Khác"
}

const CATEGORY_ORDER = ["Áo Dài", "Nón Lá", "Túi", "Giày", "Trang Sức & Khăn Lụa"]

// Định nghĩa 2 bộ sản phẩm mix-match
interface MixMatchSet {
  id: number
  name: string
  products: string[]   // danh sách keywords các sản phẩm trong bộ
  modelImage: string
  resultImage: string
}

const MIX_MATCH_SETS: MixMatchSet[] = [
  {
    id: 1,
    name: "Bộ Áo Dài Xanh Ngọc + Nón Lá + Túi Cói",
    products: ["xanh ngọc", "nón lá truyền thống", "túi cói truyền thống"],
    modelImage: "/nguoi_mau_1.png",
    resultImage: "/mixmath1.png",
  },
  {
    id: 2,
    name: "Bộ Áo Dài Trắng Kem + Túi Lụa + Vòng Tay Ngọc Trai",
    products: ["trắng kem", "túi lụa tối giản", "vòng tay ngọc trai"],
    modelImage: "/nguoi_mau_2.png",
    resultImage: "/mixmath2.png",
  },
]

// Ảnh người mẫu có sẵn
const MODEL_IMAGES = [
  { src: "/nguoi_mau_1.png", label: "Người mẫu 1" },
  { src: "/nguoi_mau_2.png", label: "Người mẫu 2" },
]

function checkMatch(
  selectedProducts: SanPham[],
  selectedModelImage: string | null
): { matched: boolean; resultImage: string | null; message: string } {
  if (selectedProducts.length === 0) {
    return { matched: false, resultImage: null, message: "Chưa chọn sản phẩm nào" }
  }

  const productNames = selectedProducts.map((p) => p.tenSanPham.toLowerCase())

  for (const set of MIX_MATCH_SETS) {
    // Kiểm tra tất cả sản phẩm trong bộ có match không
    let setMatchCount = 0
    for (const kw of set.products) {
      if (productNames.some((name) => name.includes(kw.toLowerCase()))) {
        setMatchCount++
      }
    }

    // Cần ít nhất 2/3 sản phẩm trong bộ match và có đúng ảnh người mẫu
    const modelMatch = selectedModelImage?.includes(`nguoi_mau_${set.id}`)

    if (setMatchCount >= 2 && modelMatch) {
      return {
        matched: true,
        resultImage: set.resultImage,
        message: "Đã mix-match xong",
      }
    }
  }

  return {
    matched: false,
    resultImage: null,
    message: "Không tìm thấy ảnh mix-match phù hợp.\nHãy chọn đúng sản phẩm và ảnh người mẫu tương ứng.",
  }
}

export default function MixMatchPage() {
  const [currentUser, setCurrentUser] = useState<NguoiDung | null>(null)
  const [products, setProducts] = useState<SanPham[]>([])
  const [loading, setLoading] = useState(true)

  // Mỗi danh mục chọn tối đa 1 sản phẩm
  const [selectedProducts, setSelectedProducts] = useState<Record<string, SanPham>>({})
  const [selectedModelImage, setSelectedModelImage] = useState<string | null>(null)

  const [isGenerating, setIsGenerating] = useState(false)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    setCurrentUser(getStoredUser())
    getProducts()
      .then((data) => { setProducts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Nhóm sản phẩm theo danh mục
  const groupedProducts: Record<string, SanPham[]> = {}
  for (const cat of CATEGORY_ORDER) groupedProducts[cat] = []
  groupedProducts["Khác"] = []
  for (const p of products) {
    const key = getCategoryKey(p)
    if (!groupedProducts[key]) groupedProducts[key] = []
    groupedProducts[key].push(p)
  }

  function toggleProduct(category: string, product: SanPham) {
    setSelectedProducts((prev) => {
      const next = { ...prev }
      if (next[category]?.maSanPham === product.maSanPham) {
        delete next[category] // bỏ chọn
      } else {
        next[category] = product // chọn sản phẩm mới cho danh mục này
      }
      return next
    })
  }

  function handleGenerate() {
    const selectedList = Object.values(selectedProducts)
    if (selectedList.length === 0) {
      setError("Vui lòng chọn ít nhất một sản phẩm.")
      return
    }

    setIsGenerating(true)
    setError("")
    setSuccess("")
    setResultImage(null)

    setTimeout(() => {
      const result = checkMatch(selectedList, selectedModelImage)
      if (result.matched && result.resultImage) {
        setResultImage(result.resultImage)
        setSuccess(result.message)
      } else {
        setError(result.message)
      }
      setIsGenerating(false)
    }, 1000)
  }

  function handleDownload() {
    if (!resultImage) return
    const link = document.createElement("a")
    link.href = resultImage
    link.download = `mix-match-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  function resetAll() {
    setSelectedProducts({})
    setSelectedModelImage(null)
    setResultImage(null)
    setError("")
    setSuccess("")
  }

  const selectedList = Object.entries(selectedProducts)

  return (
    <main className="min-h-svh bg-gradient-to-br from-stone-50 via-amber-50/30 to-rose-50/20 text-stone-900 antialiased">
      <header className="sticky top-0 z-50 border-b border-stone-200/50 bg-white/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-200 via-rose-100 to-violet-200 shadow-sm ring-1 ring-white/80">
              <Wand2Icon className="size-4 text-stone-800" />
            </div>
            <span className="font-heading hidden text-base font-semibold tracking-[0.12em] text-stone-900 sm:block">MIX & MATCH</span>
          </Link>
          <div className="flex items-center gap-2">
            <SearchBar /><CartIcon />
            {currentUser ? <UserMenu initialUser={currentUser} /> : (
              <Link href="/login" className="text-[11px] font-semibold tracking-[0.18em] text-stone-500 transition hover:text-stone-800">ĐĂNG NHẬP</Link>
            )}
          </div>
        </nav>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-2 text-sm text-stone-400">
          <Link href="/" className="transition hover:text-stone-700">Trang chủ</Link><span>/</span>
          <span className="text-stone-700 font-medium">Mix & Match</span>
        </div>

        <div className="mb-8 border-b border-stone-200/60 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200 via-rose-100 to-violet-200 shadow-sm">
              <SparklesIcon className="size-6 text-stone-800" />
            </div>
            <div>
              <h1 className="font-heading text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                Mix & Match
              </h1>
              <p className="text-sm text-stone-500 mt-1">
                Click chọn 1 sản phẩm mỗi danh mục + ảnh người mẫu → xem ảnh kết hợp
              </p>
            </div>
          </div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-stone-400 transition hover:text-stone-700">
            <ArrowLeftIcon className="size-3" /> Quay lại trang chủ
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            {/* Các sản phẩm đã chọn */}
            {selectedList.length > 0 && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
                <h3 className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-3">Sản phẩm đã chọn:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedList.map(([cat, product]) => (
                    <div key={cat} className="inline-flex items-center gap-1.5 rounded-full bg-white border border-amber-200 px-3 py-1.5 text-xs text-amber-800">
                      <ShoppingBagIcon className="size-3" />
                      <span className="font-medium">{product.tenSanPham}</span>
                      <button onClick={() => toggleProduct(cat, product)} className="text-amber-400 hover:text-red-500 ml-1">
                        <XIcon className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Product grids - mỗi danh mục 1 product */}
            {loading ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] animate-pulse rounded-xl bg-stone-100" />
                ))}
              </div>
            ) : (
              <div className="space-y-10">
                {CATEGORY_ORDER.map((cat) => {
                  const catProducts = groupedProducts[cat] || []
                  if (catProducts.length === 0) return null
                  const selected = selectedProducts[cat]
                  return (
                    <section key={cat}>
                      <div className="flex items-center gap-3 mb-4">
                        <LayoutGridIcon className="size-4 text-stone-400" />
                        <h2 className="text-sm font-semibold text-stone-700 uppercase tracking-wider">{cat}</h2>
                        <div className="flex-1 h-px bg-stone-200" />
                        <span className="text-xs text-stone-400">{catProducts.length} sản phẩm</span>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                        {catProducts.map((product) => {
                          const isSelected = selected?.maSanPham === product.maSanPham
                          const src = productImageSrc(product.hinhAnh)
                          return (
                            <button key={product.maSanPham} onClick={() => toggleProduct(cat, product)}
                              className={`group relative aspect-[3/4] overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                                isSelected
                                  ? "border-amber-400 ring-2 ring-amber-400/30 shadow-lg scale-[1.02]"
                                  : "border-transparent hover:border-stone-300 hover:shadow-md"
                              }`}>
                              {src ? <img src={src} alt={product.tenSanPham} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.05]" />
                                : <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
                                    <ShoppingBagIcon className="size-6 text-stone-300" />
                                  </div>}
                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-2 pt-6">
                                <p className="text-[10px] font-medium text-white truncate">{product.tenSanPham}</p>
                                <p className="text-[9px] text-white/70">{formatCurrency(product.gia)}</p>
                              </div>
                              {isSelected && (
                                <div className="absolute top-2 left-2 rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-bold text-stone-900 shadow">
                                  CHỌN
                                </div>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </section>
                  )
                })}
              </div>
            )}

            {/* Chọn ảnh người mẫu */}
            <div className="rounded-2xl border border-stone-200 bg-white/80 p-5 shadow-sm">
              <h2 className="mb-1 text-sm font-semibold text-stone-900 flex items-center gap-2">
                <ImageIcon className="size-4 text-amber-600" /> Ảnh người mẫu
              </h2>
              <p className="mb-4 text-xs text-stone-400">Chọn ảnh người mẫu để kết hợp</p>
              <div className="grid grid-cols-2 gap-4">
                {MODEL_IMAGES.map((model) => {
                  const isSelected = selectedModelImage === model.src
                  return (
                    <button key={model.src} onClick={() => setSelectedModelImage(isSelected ? null : model.src)}
                      className={`relative overflow-hidden rounded-2xl border-2 transition-all ${
                        isSelected ? "border-amber-400 ring-2 ring-amber-400/30 shadow-lg" : "border-stone-200 hover:border-stone-400"
                      }`}>
                      <div className="w-full" style={{ aspectRatio: "3/4" }}>
                        <img src={model.src} alt={model.label} className="h-full w-full object-cover" />
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 pt-8">
                        <p className="text-sm font-medium text-white">{model.label}</p>
                      </div>
                      {isSelected && (
                        <div className="absolute top-3 right-3 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-stone-900 shadow">CHỌN</div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

          </div>

          {/* Result Panel */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-stone-200 bg-white/80 p-5 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold text-stone-900 flex items-center gap-2">
                <SparklesIcon className="size-4 text-amber-600" /> Kết quả
              </h2>
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center aspect-[3/4] rounded-xl bg-gradient-to-br from-stone-100 to-stone-200/60">
                  <Loader2Icon className="size-12 animate-spin text-amber-600" />
                  <p className="mt-4 text-sm font-medium text-stone-600">Đang tìm ảnh...</p>
                </div>
              ) : resultImage ? (
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-xl bg-stone-100">
                    <img src={resultImage} alt="Mix Match Result" className="w-full object-cover" />
                  </div>
                  <Button onClick={handleDownload} className="w-full rounded-xl bg-stone-900 text-white text-xs hover:bg-stone-700">
                    <DownloadIcon className="size-4 mr-1.5" /> Tải ảnh xuống
                  </Button>
                  <Button onClick={handleGenerate} variant="outline" className="w-full rounded-xl border-stone-200 text-stone-700 text-xs hover:bg-stone-50">
                    <RefreshCwIcon className="size-4 mr-1.5" /> Tạo lại
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center aspect-[3/4] rounded-xl bg-gradient-to-br from-stone-100 to-stone-200/60 text-center p-6">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50">
                    <Wand2Icon className="size-8 text-amber-400" strokeWidth={1} />
                  </div>
                  <p className="text-sm font-medium text-stone-600">Chưa có ảnh</p>
                  <p className="mt-1 text-xs text-stone-400 max-w-xs">
                    Chọn sản phẩm mỗi danh mục + ảnh người mẫu, bấm "Tạo mix-match"
                  </p>
                </div>
              )}
            </div>

            {/* Action buttons - nằm dưới khung kết quả */}
            <div className="mt-4 flex items-center gap-3">
              <Button onClick={handleGenerate} disabled={isGenerating || selectedList.length === 0}
                className="h-12 flex-1 rounded-2xl bg-gradient-to-r from-amber-600 to-violet-600 text-white text-sm font-semibold shadow-lg hover:from-amber-700 hover:to-violet-700 disabled:opacity-50 transition-all">
                {isGenerating ? (
                  <span className="flex items-center gap-2 justify-center"><Loader2Icon className="size-5 animate-spin" /> Đang ghép...</span>
                ) : (
                  <span className="flex items-center gap-2 justify-center"><SparklesIcon className="size-5" /> Tạo mix-match</span>
                )}
              </Button>
              <Button onClick={resetAll} variant="outline" className="h-12 rounded-2xl border-stone-200 text-stone-600">
                <RefreshCwIcon className="size-4" />
              </Button>
            </div>

            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
                <span className="whitespace-pre-line">{error}</span>
              </div>
            )}
            {success && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <CheckCircle2Icon className="mt-0.5 size-4 shrink-0" /><span>{success}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}