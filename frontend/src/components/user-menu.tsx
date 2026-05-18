"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  UserIcon,
  LockKeyholeIcon,
  LogOutIcon,
  ChevronDownIcon,
  ReceiptTextIcon,
} from "lucide-react"
import { clearStoredUser, getStoredUser } from "@/lib/auth"
import type { NguoiDung } from "@/lib/types"

export function UserMenu({ initialUser }: { initialUser: NguoiDung }) {
  const router = useRouter()
  const [user, setUser] = useState<NguoiDung>(initialUser)
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Đọc lại localStorage mỗi khi mở để lấy hoTen mới nhất
  const handleOpen = () => {
    const stored = getStoredUser()
    if (stored) setUser(stored)
    setOpen((o) => !o)
  }

  // Tên hiển thị: ưu tiên hoTen nếu có, fallback về tenDangNhap
  const displayName = user.hoTen?.trim() || user.tenDangNhap
  const initials = displayName.slice(0, 2).toUpperCase()

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [])

  const handleLogout = () => {
    setOpen(false)
    clearStoredUser()
    window.location.href = "/"
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger */}
      <button
        onClick={handleOpen}
        className="flex h-9 items-center gap-2 rounded-full border border-stone-200/80 bg-white/80 pl-2 pr-3 shadow-sm backdrop-blur-sm transition hover:border-stone-300 hover:bg-white hover:shadow-md"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 via-rose-100 to-violet-200 text-[10px] font-bold text-stone-800 shadow-sm ring-1 ring-white/80">
          {initials}
        </div>
        <span className="max-w-[100px] truncate text-sm font-medium text-stone-800">
          {displayName}
        </span>
        <ChevronDownIcon
          className={`size-3.5 text-stone-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-[0_16px_48px_-12px_rgba(28,25,23,0.18)] ring-1 ring-stone-900/5">
          {/* User info */}
          <div className="border-b border-stone-100 bg-gradient-to-br from-amber-50/80 via-rose-50/40 to-white px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200 via-rose-100 to-violet-200 text-sm font-bold text-stone-800 shadow-sm ring-1 ring-white/80">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-stone-900">{displayName}</p>
                <p className="truncate text-xs text-stone-500">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="p-1.5">
            <button
              onClick={() => { setOpen(false); router.push("/profile") }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-stone-700 transition hover:bg-stone-50 hover:text-stone-900"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                <UserIcon className="size-3.5" />
              </span>
              Cập nhật thông tin
            </button>

            <button
              onClick={() => { setOpen(false); router.push("/change-password") }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-stone-700 transition hover:bg-stone-50 hover:text-stone-900"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                <LockKeyholeIcon className="size-3.5" />
              </span>
              Đổi mật khẩu
            </button>

            <button
              onClick={() => { setOpen(false); router.push("/lich-su-don-hang") }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-stone-700 transition hover:bg-stone-50 hover:text-stone-900"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <ReceiptTextIcon className="size-3.5" />
              </span>
              Lịch sử đơn hàng
            </button>

            <div className="my-1 h-px bg-stone-100" />

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50 hover:text-red-700"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100 text-red-600">
                <LogOutIcon className="size-3.5" />
              </span>
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
