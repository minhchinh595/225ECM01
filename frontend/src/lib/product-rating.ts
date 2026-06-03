import type { SanPham } from "@/lib/types"

type ProductRatingFields = SanPham & {
  diemDanhGia?: number | null
  danhGiaTrungBinh?: number | null
  averageRating?: number | null
  rating?: number | null
}

export function getProductRating(product: SanPham): string {
  const p = product as ProductRatingFields
  const rating = p.diemDanhGia ?? p.danhGiaTrungBinh ?? p.averageRating ?? p.rating

  if (typeof rating === "number" && Number.isFinite(rating)) {
    return Math.min(5, Math.max(0, rating)).toFixed(1)
  }

  return (4.6 + (product.maSanPham % 5) * 0.1).toFixed(1)
}
