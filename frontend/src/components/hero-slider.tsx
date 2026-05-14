"use client"

import { useEffect, useState, useCallback } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

const SLIDES = [
  { src: "/localbrand.png",  alt: "Local Brand Việt Nam — lookbook 1" },
  { src: "/localbrand1.png", alt: "Local Brand Việt Nam — lookbook 2" },
  { src: "/localbrand2.png", alt: "Local Brand Việt Nam — lookbook 3" },
  { src: "/localbrand3.png", alt: "Local Brand Việt Nam — lookbook 4" },
]

const AUTO_PLAY_MS = 4500

export function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [animDir, setAnimDir] = useState<"left" | "right">("right")

  const goTo = useCallback((index: number, dir: "left" | "right" = "right") => {
    setAnimDir(dir)
    setCurrent(index)
  }, [])

  const prev = useCallback(() => {
    goTo((current - 1 + SLIDES.length) % SLIDES.length, "left")
  }, [current, goTo])

  const next = useCallback(() => {
    goTo((current + 1) % SLIDES.length, "right")
  }, [current, goTo])

  // Auto-play
  useEffect(() => {
    if (paused) return
    const timer = setInterval(next, AUTO_PLAY_MS)
    return () => clearInterval(timer)
  }, [paused, next])

  return (
    <div
      className="relative overflow-hidden bg-stone-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <div className="relative w-full">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            className={`transition-opacity duration-700 ${
              i === current
                ? "relative opacity-100"
                : "pointer-events-none absolute inset-0 opacity-0"
            }`}
            aria-hidden={i !== current}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              className="block w-full"
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
            />
          </div>
        ))}
      </div>

      {/* Bottom overlay + caption */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent px-6 pb-6 pt-16 sm:px-8 sm:pb-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/55">
          Lookbook
        </p>
        <p className="mt-1.5 text-sm font-medium text-white/90 sm:text-base">
          Thương hiệu địa phương — chất riêng, phối đồ urban.
        </p>
      </div>

      {/* Prev / Next buttons */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 sm:left-4"
        aria-label="Ảnh trước"
      >
        <ChevronLeftIcon className="size-4" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 sm:right-4"
        aria-label="Ảnh tiếp theo"
      >
        <ChevronRightIcon className="size-4" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 right-5 z-10 flex items-center gap-1.5 sm:bottom-5 sm:right-6">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? "right" : "left")}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-5 bg-white"
                : "w-1.5 bg-white/40 hover:bg-white/70"
            } h-1.5`}
            aria-label={`Ảnh ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
