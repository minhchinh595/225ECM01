"use client"

import { useEffect, useState } from "react"
import { getUsers } from "@/lib/api"
import type { NguoiDung } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UsersIcon, PlusIcon, SearchIcon, ShieldCheckIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

const ROLE_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: "Admin", color: "bg-rose-100 text-rose-700" },
  2: { label: "Nhân viên", color: "bg-violet-100 text-violet-700" },
  3: { label: "Khách hàng", color: "bg-emerald-100 text-emerald-700" },
}

export default function NguoiDungPage() {
  const [users, setUsers] = useState<NguoiDung[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUsers().then(setUsers).finally(() => setLoading(false))
  }, [])

  const filtered = users.filter((u) =>
    u.tenDangNhap.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-stone-900">Tài khoản người dùng</h1>
          <p className="mt-1 text-sm text-stone-500">Quản lý tất cả tài khoản trong hệ thống.</p>
        </div>
        <Button className="rounded-full bg-stone-900 px-5 text-white hover:bg-stone-800">
          <PlusIcon className="mr-2 size-4" />
          Thêm tài khoản
        </Button>
      </div>

      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên đăng nhập, email..."
          className="h-11 rounded-2xl border-stone-200 bg-white/80 pl-11 text-sm shadow-sm"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Tổng tài khoản", value: users.length, color: "text-stone-900" },
          { label: "Khách hàng", value: users.filter(u => u.maVaiTro === 3).length, color: "text-emerald-700" },
          { label: "Nhân viên & Admin", value: users.filter(u => (u.maVaiTro ?? 0) < 3).length, color: "text-violet-700" },
        ].map((s) => (
          <Card key={s.label} className="rounded-[1.5rem] border-none bg-white/85 shadow-[0_8px_24px_rgba(96,74,44,0.07)]">
            <CardContent className="p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-stone-400">{s.label}</p>
              <p className={`font-heading mt-2 text-3xl font-semibold ${s.color}`}>
                {loading ? "…" : s.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-[1.75rem] border-none bg-white/85 shadow-[0_12px_32px_rgba(96,74,44,0.08)]">
        <CardHeader className="pb-4">
          <CardTitle className="font-heading text-lg font-semibold text-stone-900">
            Danh sách tài khoản
            {!loading && <span className="ml-2 text-sm font-normal text-stone-400">({filtered.length})</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-2xl bg-stone-100" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-stone-400">
              <UsersIcon className="size-10 opacity-40" strokeWidth={1} />
              <p className="text-sm">Không tìm thấy tài khoản nào.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((user) => {
                const role = ROLE_LABELS[user.maVaiTro ?? 3] ?? ROLE_LABELS[3]
                return (
                  <div
                    key={user.maNguoiDung}
                    className="flex items-center justify-between rounded-2xl border border-stone-100 bg-stone-50/60 px-4 py-3.5 transition hover:border-stone-200 hover:bg-white"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-200 via-rose-100 to-violet-200 text-sm font-bold text-stone-800">
                        {user.tenDangNhap.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-stone-900">{user.tenDangNhap}</p>
                        <p className="truncate text-xs text-stone-400">{user.email}</p>
                      </div>
                    </div>
                    <div className="ml-4 flex shrink-0 items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${role.color}`}>
                        {role.label}
                      </span>
                      <span className={`rounded-full px-2 py-1 text-[11px] font-medium ${user.trangThai ? "bg-emerald-50 text-emerald-600" : "bg-stone-100 text-stone-400"}`}>
                        {user.trangThai ? "Hoạt động" : "Vô hiệu"}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
