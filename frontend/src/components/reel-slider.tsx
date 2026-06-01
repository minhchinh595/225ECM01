"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { SanPham } from "@/lib/types"
import { productImageSrc } from "@/lib/product-image"
import { XIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

interface ReelSection {
  key: string
  label: string
  image: string
  keywords: string[]
  [key: string]: any
}

interface ReelSliderProps {
  products: SanPham[]
  sections: ReelSection[]
  getProductsForSection: (section: ReelSection) => SanPham[]
  isOpen: boolean
  onClose: () => void
}

export default function ReelSlider({ products, sections, getProductsForSection, isOpen, onClose }: ReelSliderProps) {
  const [activeCategory, setActiveCategory] = useState<string>("ao-dai")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const activeSection = sections.find((s) => s.key === activeCategory)
  const categoryProducts = activeSection ? getProductsForSection(activeSection) : []
  const images = categoryProducts
    .map((p) => productImageSrc(p.hinhAnh))
    .filter((src): src is string => src !== null)

  // Lấy ảnh đại diện cho mỗi danh mục (từ sản phẩm đầu tiên)
  function getCategoryImage(section: ReelSection): string {
    const prods = getProductsForSection(section)
    for (const p of prods) {
      const src = productImageSrc(p.hinhAnh)
      if (src) return src
    }
    return section.image
  }

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (images.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
      }, 3000)
    }
  }, [images.length])

  useEffect(() => {
    setCurrentImageIndex(0)
  }, [activeCategory])

  useEffect(() => {
    resetTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [resetTimer])

  function goToImage(index: number) {
    setCurrentImageIndex(index)
    resetTimer()
  }

  function goPrev() {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    resetTimer()
  }

  function goNext() {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
    resetTimer()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl w-[90vw] max-w-[500px]" onClick={(e) => e.stopPropagation()}>
        
        {/* Close button */}
        <button onClick={onClose} className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition">
          <XIcon className="size-4" />
        </button>

        {/* Image area */}
        <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
          {images.length > 0 ? (
            <img src={images[currentImageIndex]} alt="" className="h-full w-full object-contain bg-stone-100" />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-stone-100 text-stone-400 text-sm">
              Không có sản phẩm
            </div>
          )}

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button onClick={goPrev} className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-stone-700 hover:bg-white shadow-md transition">
                <ChevronLeftIcon className="size-5" />
              </button>
              <button onClick={goNext} className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-stone-700 hover:bg-white shadow-md transition">
                <ChevronRightIcon className="size-5" />
              </button>
            </>
          )}

          {/* Progress bars */}
          {images.length > 1 && (
            <div className="absolute top-3 left-3 right-12 flex gap-1">
              {images.map((_, i) => (
                <button key={i} onClick={() => goToImage(i)} className="flex-1 h-1 rounded-full overflow-hidden bg-white/40">
                  <div className={`h-full rounded-full transition-all duration-300 ${
                    i === currentImageIndex ? "bg-white w-full" : i < currentImageIndex ? "bg-white/60 w-full" : "w-0"
                  }`} />
                </button>
              ))}
            </div>
          )}

          {/* Counter */}
          <div className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-0.5 text-xs text-white">
            {currentImageIndex + 1}/{images.length || 0}
          </div>
        </div>

        {/* Category dots */}
        <div className="flex items-center justify-center gap-4 px-4 py-4">
          {sections.map((section) => {
            const isActive = activeCategory === section.key
            const thumbSrc = getCategoryImage(section)
            return (
              <button
                key={section.key}
                onClick={() => { setActiveCategory(section.key); setCurrentImageIndex(0) }}
                className="flex flex-col items-center group"
              >
                <div className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                  isActive ? "border-amber-400 ring-2 ring-amber-400/40 scale-110" : "border-stone-300 hover:border-stone-500"
                }`}>
                  <img src={thumbSrc} alt="" className="h-full w-full object-cover" />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}