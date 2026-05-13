import type { NguoiDung } from "@/lib/types"

const STORAGE_KEY = "webthoitrang-user"
// Key riêng cho hoTen — không bị xóa khi đăng xuất
const HO_TEN_KEY = "webthoitrang-hoten"

export function saveUser(user: NguoiDung) {
  if (typeof window === "undefined") return

  // Nếu user có hoTen, lưu riêng vào key bền vững theo maNguoiDung
  if (user.hoTen?.trim()) {
    window.localStorage.setItem(
      `${HO_TEN_KEY}-${user.maNguoiDung}`,
      user.hoTen.trim(),
    )
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function getStoredUser(): NguoiDung | null {
  if (typeof window === "undefined") return null

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    const user = JSON.parse(raw) as NguoiDung
    // Khôi phục hoTen từ key bền vững nếu chưa có
    if (!user.hoTen?.trim()) {
      const savedHoTen = window.localStorage.getItem(
        `${HO_TEN_KEY}-${user.maNguoiDung}`,
      )
      if (savedHoTen) {
        user.hoTen = savedHoTen
      }
    }
    return user
  } catch {
    return null
  }
}

export function clearStoredUser() {
  if (typeof window === "undefined") return
  // Chỉ xóa session, KHÔNG xóa hoTen
  window.localStorage.removeItem(STORAGE_KEY)
}
