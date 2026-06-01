"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { SanPham } from "@/lib/types"
import { productImageSrc } from "@/lib/product-image"
import { XIcon, ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from "lucide-react"

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
  const [isPlaying, setIsPlaying] = useState(true)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const activeSection = sections.find((s) => s.key === activeCategory)
  const categoryProducts = activeSection ? getProductsForSection(activeSection) : []
  const images = categoryProducts
    .map((p) => productImageSrc(p.hinhAnh))
    .filter((src): src is string => src !== null)

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (isPlaying && images.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
      }, 3000)
    }
  }, [isPlaying, images.length])

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
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={onClose} className="flex items-center gap-2 text-white/80 hover:text-white transition">
          <XIcon className="size-6" />
          <span className="text-sm font-medium">Đóng</span>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white/80 hover:text-white transition p-1"
            title={isPlaying ? "Tạm dừng" : "Tiếp tục"}
          >
            {isPlaying ? <PauseIcon className="size-5" /> : <PlayIcon className="size-5" />}
          </button>
          <span className="text-white/60 text-sm">
            {currentImageIndex + 1}/{images.length || 0}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {images.length > 0 ? (
          <img
            src={images[currentImageIndex]}
            alt={`Reel ${currentImageIndex + 1}`}
            className="h-full w-auto max-w-full object-contain"
          />
        ) : (
          <div className="text-white/50 text-center">
            <p className="text-lg">Không có sản phẩm trong danh mục này</p>
          </div>
        )}

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition"
            >
              <ChevronLeftIcon className="size-6" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition"
            >
              <ChevronRightIcon className="size-6" />
            </button>
          </>
        )}

        {/* Bottom gradient */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
      </div>

      {/* Category dots + Progress bar */}
      <div className="px-4 py-4 bg-black">
        {/* Progress bars */}
        <div className="flex gap-1 mb-4">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goToImage(i)}
              className="flex-1 h-0.5 rounded-full overflow-hidden bg-white/20"
            >
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  i === currentImageIndex
                    ? "bg-white w-full"
                    : i < currentImageIndex
                    ? "bg-white/60 w-full"
                    : "bg-white/20 w-0"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Category dots */}
        <div className="flex items-center justify-center gap-3">
          {sections.map((section, idx) => {
            const isActive = activeCategory === section.key
            return (
              <button
                key={section.key}
                onClick={() => {
                  setActiveCategory(section.key)
                  setCurrentImageIndex(0)
                }}
                className="flex flex-col items-center gap-1 group"
              >
                <div
                  className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                    isActive
                      ? "border-amber-400 ring-2 ring-amber-400/40 scale-110"
                      : "border-white/40 hover:border-white/70"
                  }`}
                >
                  <img
                    src={section.image}
                    alt={section.label}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span
                  className={`text-[10px] font-medium transition ${
                    isActive ? "text-amber-400" : "text-white/50 group-hover:text-white/80"
                  }`}
                >
                  {section.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}