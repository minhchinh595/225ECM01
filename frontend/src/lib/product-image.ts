import { API_URL } from "./api"

const API_ORIGIN = API_URL.replace(/\/api\/?$/, "")

export function productImageSrc(hinhAnh?: string | null): string | null {
  if (!hinhAnh?.trim()) return null
  const p = hinhAnh.trim()
  if (/^https?:\/\//i.test(p)) return p
  if (p.startsWith("/")) return `${API_ORIGIN}${p}`
  return `/${p}`
}