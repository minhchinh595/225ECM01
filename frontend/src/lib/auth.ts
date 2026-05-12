import type { NguoiDung } from "@/lib/types"

const STORAGE_KEY = "webthoitrang-user"

export function saveUser(user: NguoiDung) {
  if (typeof window === "undefined") {
    return
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function getStoredUser(): NguoiDung | null {
  if (typeof window === "undefined") {
    return null
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as NguoiDung
  } catch {
    return null
  }
}

export function clearStoredUser() {
  if (typeof window === "undefined") {
    return
  }
  window.localStorage.removeItem(STORAGE_KEY)
}
