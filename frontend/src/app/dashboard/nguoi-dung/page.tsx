"use client"

import { useEffect, useState } from "react"
import { getUsers } from "@/lib/api"
import { getStoredUser } from "@/lib/auth"
import type { NguoiDung } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AddUserModal } from "@/components/add-user-modal"
import { toast } from "sonner"
import {
  UsersIcon, PlusIcon, SearchIcon,
  UserCheckIcon, UserXIcon, ShieldIcon,
  FilterIcon, RefreshCwIcon,
} from "lucide-react"

// ── Constants ─────────────────────────────────────────────────
const ROLES: Record<number, { label: string; dot: string; badge: string }> = {
  1: { label: "Admin",      dot: "bg-rose-500",    badge: "bg-rose-50 text-rose-700 ring-rose-200/60" },
  2: { label: "Nhân viên",  dot: "bg-violet-500",  badge: "bg-violet-50 text-violet-700 ring-violet-200/60" },
  3: { label: "Khách hàng", dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 ring-emerald-200/60" },
}

const AVATAR_GRADIENTS = [
  "from-amber-300 via-rose-200 to-violet-300",
  "from-sky-300 via-indigo-200 to-violet-300",
  "from-emerald-300 via-teal-200 to-cyan-300",
  "from-rose-300 via-pink-200 to-fuchsia-300",
  "from-amber-300 via-orange-200 to-rose-300",
]

// ── Skeleton row ──────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <div className="size-10 shrink-0 animate-pulse rounded-2xl bg-stone-100" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-32 animate-pulse rounded-full bg-stone-100" />
        <div className="h-3 w-48 animate-pulse rounded-full bg-stone-100/70" />
      </div>
      <div className="h-6 w-20 animate-pulse rounded-full bg-stone-100" />
      <div className="h-6 w-16 animate-pulse rounded-full bg-stone-100" />
    </div>
  )
}

// ── Stat card ─────────────────────────────────────────────────
function StatCard({
  icon: Icon, label, value, loading, accent,
}: {
  icon: React.ElementType; label: string; value: number
  loading: boolean; accent: string
}) {
  return (
    <div className="group relative overflow-hidden rounded-[1.5rem] border border-stone-200/60 bg-white/90 p-5 shadow-[0_4px_20px_rgba(28,25,23,0.06)] transition hover:shadow-[0_8px_28px_rgba(28,25,23,0.10)]">
      <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${accent}`}>
        <Icon className="size-4" />
      </div>
      <p className="text-xs font-medium uppercase tracking-wider text-stone-400">{label}</p>
      <p className="font-heading mt-1.5 text-3xl font-semibold text-stone-900">
        {loading ? <span className="inline-block h-8 w-12 animate-pulse rounded-lg bg-stone-100" /> : value}
      </p>
    </div>
  )
}

// ── User row ──────────────────────────────────────────────────
function UserRow({ user, index }: { user: NguoiDung; index: number }) {
  const role = ROLES[user.maVaiTro ?? 3] ?? ROLES[3]
  const grad = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length]
  const initials = user.tenDangNhap.slice(0, 2).toUpperCase()

  return (
    <div className="grid grid-cols-[2.5rem_1fr_9rem_8rem_8rem] items-center gap-4 border-b border-stone-100 px-5 py-3.5 transition-colors last:border-0 hover:bg-stone-50/70">
      {/* Avatar */}
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${grad} text-xs font-bold text-stone-800 shadow-sm ring-1 ring-white`}>
        {initials}
      </div>

      {/* Info */}
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-stone-900">{user.tenDangNhap}</p>
        <p className="truncate text-xs text-stone-400">{user.email}</p>
      </div>

      {/* Phone */}
      <p className="text-xs text-stone-500 tabular-nums">
        {user.soDienThoai || "—"}
      </p>

      {/* Role badge */}
      <div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${role.badge}`}>
          <span className={`size-1.5 rounded-full ${role.dot}`} />
          {role.label}
        </span>
      </div>

      {/* Status */}
      <div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ${
          user.trangThai
            ? "bg-emerald-50 text-emerald-700 ring-emerald-200/60"
            : "bg-stone-50 text-stone-400 ring-stone-200/60"
        }`}>
          {user.trangThai
            ? <><UserCheckIcon className="size-3" /> Hoạt động</>
            : <><UserXIcon className="size-3" /> Vô hiệu</>
          }
        </span>
      </div>
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────
function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-20">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100">
        <UsersIcon className="size-8 text-stone-300" strokeWidth={1.5} />
      </div>
      <div className="text-center">
        <p className="font-heading text-base font-semibold text-stone-700">
          {query ? "Không tìm thấy kết quả" : "Chưa có tài khoản nào"}
        </p>
        <p className="mt-1 text-sm text-stone-400">
          {query ? `Không có tài khoản nào khớp với "${query}"` : "Bắt đầu bằng cách thêm tài khoản mới."}
        </p>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────
export default function NguoiDungPage() {
  const [users, setUsers] = useState<NguoiDung[]>([])
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [currentUser, setCurrentUser] = useState<NguoiDung | null>(null)

  const load = () => {
    setLoading(true)
    getUsers().then(setUsers).finally(() => setLoading(false))
  }

  useEffect(() => {
    setCurrentUser(getStoredUser())
    load()
  }, [])

  const isAdmin = currentUser?.maVaiTro === 1

  const filtered = users.filter((u) => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      u.tenDangNhap.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.soDienThoai ?? "").includes(q)
    const matchRole = roleFilter === null || u.maVaiTro === roleFilter
    return matchSearch && matchRole
  })

  const handleCreated = (user: NguoiDung) => {
    setUsers(prev => [user, ...prev])
    toast.success("Tạo tài khoản thành công", {
      description: `@${user.tenDangNhap} đã được thêm vào hệ thống.`,
    })
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">

      {/* ── Page header ── */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white/80 px-3 py-1 text-xs font-medium text-stone-500 shadow-sm backdrop-blur-sm">
            <UsersIcon className="size-3.5" />
            Quản lý hệ thống
          </div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
            Tài khoản người dùng
          </h1>
          <p className="mt-1.5 text-sm text-stone-500">
            {loading ? "Đang tải..." : `${users.length} tài khoản trong hệ thống`}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={load}
            className="h-9 rounded-xl border-stone-200 bg-white/80 text-stone-600 shadow-sm hover:bg-white"
          >
            <RefreshCwIcon className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          </Button>
          {isAdmin && (
            <Button
              onClick={() => setShowAdd(true)}
              className="h-9 rounded-xl border-0 bg-gradient-to-r from-violet-600 to-indigo-600 px-4 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:from-violet-700 hover:to-indigo-700 hover:shadow-xl"
            >
              <PlusIcon className="mr-1.5 size-4" />
              Thêm tài khoản
            </Button>
          )}
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={UsersIcon}     label="Tổng tài khoản" value={users.length}                                                                    loading={loading} accent="bg-stone-100 text-stone-600" />
        <StatCard icon={ShieldIcon}    label="Admin"          value={users.filter(u => u.maVaiTro === 1).length}                                       loading={loading} accent="bg-rose-100 text-rose-600" />
        <StatCard icon={UserCheckIcon} label="Nhân viên"      value={users.filter(u => u.maVaiTro === 2).length}                                       loading={loading} accent="bg-violet-100 text-violet-600" />
        <StatCard icon={UsersIcon}     label="Khách hàng"     value={users.filter(u => u.maVaiTro === 3 || !u.maVaiTro).length}                        loading={loading} accent="bg-emerald-100 text-emerald-600" />
      </div>

      {/* ── Table card ── */}
      <div className="overflow-hidden rounded-[1.75rem] border border-stone-200/60 bg-white/90 shadow-[0_8px_32px_rgba(28,25,23,0.07)]">

        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-stone-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm tên, email, số điện thoại..."
              className="h-9 rounded-xl border-stone-200 bg-stone-50/80 pl-10 text-sm shadow-none transition focus-visible:border-violet-300 focus-visible:bg-white focus-visible:ring-violet-200/40"
            />
          </div>

          {/* Role filter */}
          <div className="flex items-center gap-2">
            <FilterIcon className="size-3.5 shrink-0 text-stone-400" />
            <div className="flex gap-1.5">
              {[
                { value: null, label: "Tất cả" },
                { value: 1,    label: "Admin" },
                { value: 2,    label: "Nhân viên" },
                { value: 3,    label: "Khách hàng" },
              ].map((f) => (
                <button
                  key={String(f.value)}
                  onClick={() => setRoleFilter(f.value)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    roleFilter === f.value
                      ? "bg-stone-900 text-white shadow-sm"
                      : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Column headers */}
        <div className="hidden grid-cols-[2.5rem_1fr_9rem_8rem_8rem] items-center gap-4 border-b border-stone-100 bg-stone-50/60 px-5 py-2.5 sm:grid">
          <div />
          <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Tài khoản</p>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Điện thoại</p>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Vai trò</p>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Trạng thái</p>
        </div>

        {/* Rows */}
        {loading ? (
          <div className="divide-y divide-stone-100">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState query={search} />
        ) : (
          <div>
            {filtered.map((user, i) => (
              <UserRow key={user.maNguoiDung} user={user} index={i} />
            ))}
          </div>
        )}

        {/* Footer */}
        {!loading && filtered.length > 0 && (
          <div className="border-t border-stone-100 bg-stone-50/40 px-5 py-3">
            <p className="text-xs text-stone-400">
              Hiển thị <span className="font-medium text-stone-600">{filtered.length}</span> / {users.length} tài khoản
              {roleFilter !== null && ` · Lọc: ${ROLES[roleFilter]?.label}`}
              {search && ` · Tìm: "${search}"`}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AddUserModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onCreated={handleCreated}
      />
    </div>
  )
}
