import { API_URL } from "./api"

const API_ORIGIN = API_URL.replace(/\/api\/?$/, "")

export function productImageSrc(hinhAnh?: string | null): string | null {
  if (!hinhAnh?.trim()) return null
  const p = hinhAnh.trim()
  // URL tuyệt đối -> giữ nguyên
  if (/^https?:\/\//i.test(p)) return p
  // Có / ở đầu -> lấy từ backend (API)
  if (p.startsWith("/")) return `${API_ORIGIN}${p}`
  // Tên file không có / -> lấy từ frontend public
  return `/${p}`
}
