"use client"

import { useEffect, useState, useTransition } from "react"
import {
  getMaGiamGia, createMaGiamGia, toggleMaGiamGia, deleteMaGiamGia,
  type MaGiamGia, type MaGiamGiaRequest,
} from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  TicketPercentIcon, PlusIcon, XIcon, CheckIcon,
  ToggleLeftIcon, ToggleRightIcon, Trash2Icon,
  CalendarIcon, TagIcon, ZapIcon, CoinsIcon,
  SparklesIcon, ClockIcon,
} from "lucide-react"

// ── helpers ──────────────────────────────────────────────────
function fmt(v: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v)
}
function fmtDate(s: string) {
  return new Date(s).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
}
function isExpired(end: string) { return new Date(end) < new Date() }
function isActive(m: MaGiamGia) { return m.trangThai && !isExpired(m.ngayKetThuc) }

/** Chuẩn hóa loại giảm — DB dùng "PhanTram" và "TienMat" */
function isPhanTram(loaiGiam: string): boolean {
  const v = (loaiGiam ?? "").toLowerCase().trim()
  return v === "phantram" || v === "phan_tram" || v === "percent" || v === "%"
}

function fmtGiaTri(m: MaGiamGia): string {
  return isPhanTram(m.loaiGiam) ? `${m.giaTriGiam}%` : fmt(m.giaTriGiam)
}

// ── Status badge ─────────────────────────────────────────────
function StatusBadge({ m }: { m: MaGiamGia }) {
  if (!m.trangThai) return (
    <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-500">
      Tắt
    </span>
  )
  if (isExpired(m.ngayKetThuc)) return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-semibold text-red-600">
      Hết hạn
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
      <span className="size-1.5 rounded-full bg-emerald-500" />
      Đang chạy
    </span>
  )
}

// ── Create Modal ──────────────────────────────────────────────
function CreateModal({
  open, onClose, onCreated,
}: {
  open: boolean
  onClose: () => void
  onCreated: (m: MaGiamGia) => void
}) {
  const [form, setForm] = useState<MaGiamGiaRequest>({
    maCode: "", tenChuongTrinh: "", loaiGiam: "PhanTram",
    giaTriGiam: 0, giaTriDonHangToiThieu: 0, giamToiDa: undefined,
    soLuong: 100, ngayBatDau: "", ngayKetThuc: "", trangThai: true,
  })
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  const patch = (key: keyof MaGiamGiaRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const val = e.target.type === "number" ? Number(e.target.value) : e.target.value
      setForm(f => ({ ...f, [key]: val }))
    }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setError("")
    startTransition(async () => {
      try {
        const created = await createMaGiamGia({
          ...form,
          maCode: form.maCode.toUpperCase().trim(),
          ngayBatDau: new Date(form.ngayBatDau).toISOString(),
          ngayKetThuc: new Date(form.ngayKetThuc).toISOString(),
        })
        onCreated(created); onClose()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Tạo mã thất bại")
      }
    })
  }

  if (!open) return null

  const inputClass = "h-10 rounded-xl border-stone-200 bg-stone-50/80 text-sm shadow-sm transition focus-visible:border-violet-300/70 focus-visible:bg-white focus-visible:ring-violet-200/40"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-lg">
        <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_32px_80px_-20px_rgba(28,25,23,0.25)]">

          {/* Modal header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 px-7 pb-6 pt-7">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,255,255,0.15),transparent)]" aria-hidden />
            <div className="relative flex items-start justify-between">
              <div>
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm ring-1 ring-white/30">
                  <TicketPercentIcon className="size-5 text-white" />
                </div>
                <h2 className="font-heading text-xl font-semibold text-white">Tạo mã giảm giá</h2>
                <p className="mt-1 text-sm text-white/70">Điền thông tin để tạo chương trình khuyến mãi mới.</p>
              </div>
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white">
                <XIcon className="size-4" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4 px-7 py-6">
            {/* Mã code + Tên chương trình */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">Mã code *</label>
                <Input required value={form.maCode} onChange={patch("maCode")}
                  placeholder="SUMMER30" className={`${inputClass} font-mono font-bold tracking-widest uppercase`} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">Tên chương trình</label>
                <Input value={form.tenChuongTrinh} onChange={patch("tenChuongTrinh")}
                  placeholder="Khuyến mãi hè 2025" className={inputClass} />
              </div>
            </div>

            {/* Loại giảm + Giá trị */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">Loại giảm *</label>
                <select
                  value={form.loaiGiam}
                  onChange={patch("loaiGiam")}
                  className="h-10 w-full rounded-xl border border-stone-200 bg-stone-50/80 px-3 text-sm shadow-sm transition focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-200/40"
                >
                  <option value="PhanTram">Phần trăm (%)</option>
                  <option value="TienMat">Tiền mặt (₫)</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Giá trị giảm * {isPhanTram(form.loaiGiam) ? "(%)" : "(₫)"}
                </label>
                <Input required type="number" min={0} max={isPhanTram(form.loaiGiam) ? 100 : undefined}
                  value={form.giaTriGiam || ""} onChange={patch("giaTriGiam")}
                  placeholder={isPhanTram(form.loaiGiam) ? "30" : "50000"} className={inputClass} />
              </div>
            </div>

            {/* Đơn hàng tối thiểu + Giảm tối đa */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">Đơn hàng tối thiểu (₫)</label>
                <Input type="number" min={0} value={form.giaTriDonHangToiThieu || ""}
                  onChange={patch("giaTriDonHangToiThieu")} placeholder="200000" className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Giảm tối đa (₫) {!isPhanTram(form.loaiGiam) && <span className="text-stone-300">— không cần</span>}
                </label>
                <Input type="number" min={0} value={form.giamToiDa || ""}
                  onChange={patch("giamToiDa")} placeholder="100000"
                  disabled={!isPhanTram(form.loaiGiam)}
                  className={`${inputClass} disabled:opacity-40`} />
              </div>
            </div>

            {/* Số lượng + Ngày */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">Số lượng</label>
                <Input type="number" min={0} value={form.soLuong || ""}
                  onChange={patch("soLuong")} placeholder="100" className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">Ngày bắt đầu *</label>
                <Input required type="datetime-local" value={form.ngayBatDau}
                  onChange={patch("ngayBatDau")} className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">Ngày kết thúc *</label>
                <Input required type="datetime-local" value={form.ngayKetThuc}
                  onChange={patch("ngayKetThuc")} className={inputClass} />
              </div>
            </div>

            {/* Preview */}
            {form.maCode && (
              <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50/60 p-4">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-violet-500">Xem trước</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
                    <TicketPercentIcon className="size-5 text-white" />
                  </div>
                  <div>
                    <p className="font-mono text-base font-bold tracking-widest text-violet-900">
                      {form.maCode.toUpperCase() || "CODE"}
                    </p>
                    <p className="text-xs text-violet-600">
                      Giảm {isPhanTram(form.loaiGiam) ? `${form.giaTriGiam}%` : fmt(form.giaTriGiam)}
                      {form.giaTriDonHangToiThieu ? ` · Đơn từ ${fmt(form.giaTriDonHangToiThieu)}` : ""}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700">{error}</p>
            )}

            <div className="flex gap-2.5 pt-1">
              <Button type="button" variant="outline" onClick={onClose}
                className="h-11 flex-1 rounded-xl border-stone-200 text-sm font-medium text-stone-700 hover:bg-stone-50">
                Huỷ
              </Button>
              <Button type="submit" disabled={isPending}
                className="h-11 flex-1 rounded-xl border-0 bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-60">
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Đang tạo...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <SparklesIcon className="size-4" /> Tạo mã giảm giá
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// ── Coupon Card ───────────────────────────────────────────────
function CouponCard({
  m, onToggle, onDelete,
}: {
  m: MaGiamGia
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}) {
  const active = isActive(m)
  const expired = isExpired(m.ngayKetThuc)

  return (
    <div className={`group relative overflow-hidden rounded-[1.5rem] border transition hover:-translate-y-0.5 hover:shadow-lg ${
      active
        ? "border-violet-200/60 bg-gradient-to-br from-white to-violet-50/40 shadow-[0_8px_24px_rgba(124,58,237,0.08)]"
        : "border-stone-200/60 bg-white/70 shadow-[0_4px_16px_rgba(28,25,23,0.06)]"
    }`}>
      {/* Top stripe */}
      <div className={`h-1.5 w-full ${active ? "bg-gradient-to-r from-violet-500 to-indigo-500" : "bg-stone-200"}`} />

      <div className="p-5">
        {/* Header row */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              active ? "bg-violet-600" : "bg-stone-200"
            }`}>
              <TicketPercentIcon className={`size-5 ${active ? "text-white" : "text-stone-400"}`} />
            </div>
            <div>
              <p className={`font-mono text-lg font-bold tracking-widest ${active ? "text-violet-900" : "text-stone-400"}`}>
                {m.maCode}
              </p>
              {m.tenChuongTrinh && (
                <p className="text-xs text-stone-500">{m.tenChuongTrinh}</p>
              )}
            </div>
          </div>
          <StatusBadge m={m} />
        </div>

        {/* Value highlight */}
        <div className={`mb-4 rounded-2xl px-4 py-3 ${active ? "bg-violet-50" : "bg-stone-50"}`}>
          <div className="flex items-center gap-2">
            {isPhanTram(m.loaiGiam) ? (
              <ZapIcon className={`size-4 ${active ? "text-violet-600" : "text-stone-400"}`} />
            ) : (
              <CoinsIcon className={`size-4 ${active ? "text-violet-600" : "text-stone-400"}`} />
            )}
            <span className={`font-heading text-2xl font-bold ${active ? "text-violet-700" : "text-stone-400"}`}>
              {fmtGiaTri(m)}
            </span>
            <span className="text-xs text-stone-400">
              {isPhanTram(m.loaiGiam) ? "giảm" : "giảm trực tiếp"}
            </span>
          </div>
          {(m.giaTriDonHangToiThieu ?? 0) > 0 && (
            <p className="mt-1 text-xs text-stone-500">
              Đơn tối thiểu {fmt(m.giaTriDonHangToiThieu!)}
              {m.giamToiDa ? ` · Giảm tối đa ${fmt(m.giamToiDa)}` : ""}
            </p>
          )}
        </div>

        {/* Meta info */}
        <div className="mb-4 grid grid-cols-2 gap-2 text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <TagIcon className="size-3.5 shrink-0 text-stone-400" />
            <span>{m.soLuong ?? 0} lượt</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="size-3.5 shrink-0 text-stone-400" />
            <span>{fmtDate(m.ngayBatDau)}</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2">
            <ClockIcon className="size-3.5 shrink-0 text-stone-400" />
            <span className={expired ? "text-red-500" : ""}>
              Hết hạn: {fmtDate(m.ngayKetThuc)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 border-t border-stone-100 pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onToggle(m.maGiamGia)}
            className={`flex-1 rounded-xl text-xs font-medium transition ${
              m.trangThai
                ? "border-stone-200 text-stone-600 hover:bg-stone-50"
                : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            }`}
          >
            {m.trangThai ? (
              <><ToggleRightIcon className="mr-1.5 size-3.5" /> Tắt mã</>
            ) : (
              <><ToggleLeftIcon className="mr-1.5 size-3.5" /> Bật mã</>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onDelete(m.maGiamGia)}
            className="rounded-xl border-red-200 text-red-500 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2Icon className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function MaGiamGiaPage() {
  const [list, setList] = useState<MaGiamGia[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all")

  useEffect(() => {
    getMaGiamGia().then(setList).finally(() => setLoading(false))
  }, [])

  const filtered = list.filter((m) => {
    const matchSearch = m.maCode.toLowerCase().includes(search.toLowerCase()) ||
      (m.tenChuongTrinh ?? "").toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === "all" ? true :
      filter === "active" ? isActive(m) :
      !isActive(m)
    return matchSearch && matchFilter
  })

  const handleToggle = async (id: number) => {
    try {
      const updated = await toggleMaGiamGia(id)
      setList(l => l.map(m => m.maGiamGia === id ? updated : m))
    } catch {}
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Xác nhận xóa mã giảm giá này?")) return
    try {
      await deleteMaGiamGia(id)
      setList(l => l.filter(m => m.maGiamGia !== id))
    } catch {}
  }

  const stats = [
    { label: "Tổng mã", value: list.length, color: "text-stone-900", bg: "bg-white/85" },
    { label: "Đang chạy", value: list.filter(isActive).length, color: "text-violet-700", bg: "bg-violet-50" },
    { label: "Hết hạn / Tắt", value: list.filter(m => !isActive(m)).length, color: "text-stone-400", bg: "bg-stone-50" },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-stone-900">Mã giảm giá</h1>
          <p className="mt-1 text-sm text-stone-500">Tạo và quản lý các chương trình khuyến mãi.</p>
        </div>
        <Button
          onClick={() => setShowCreate(true)}
          className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 text-white shadow-lg shadow-violet-500/25 hover:from-violet-700 hover:to-indigo-700"
        >
          <PlusIcon className="mr-2 size-4" />
          Tạo mã giảm giá
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className={`rounded-[1.5rem] border-none shadow-[0_8px_24px_rgba(96,74,44,0.07)] ${s.bg}`}>
            <CardContent className="p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-stone-400">{s.label}</p>
              <p className={`font-heading mt-2 text-3xl font-semibold ${s.color}`}>
                {loading ? "…" : s.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <TicketPercentIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm mã code, tên chương trình..."
            className="h-11 rounded-2xl border-stone-200 bg-white/80 pl-11 text-sm shadow-sm"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "inactive"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === f
                  ? "bg-stone-900 text-white shadow-md"
                  : "border border-stone-200 bg-white/80 text-stone-600 hover:bg-white"
              }`}
            >
              {f === "all" ? "Tất cả" : f === "active" ? "Đang chạy" : "Không hoạt động"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-[1.5rem] bg-stone-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="rounded-[1.75rem] border-none bg-white/85 shadow-[0_12px_32px_rgba(96,74,44,0.08)]">
          <CardContent className="flex flex-col items-center gap-4 py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100">
              <TicketPercentIcon className="size-8 text-violet-400" strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <p className="font-heading text-lg font-semibold text-stone-900">Chưa có mã giảm giá</p>
              <p className="mt-1 text-sm text-stone-500">Bấm "Tạo mã giảm giá" để bắt đầu.</p>
            </div>
            <Button
              onClick={() => setShowCreate(true)}
              className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-6 text-white shadow-lg shadow-violet-500/25"
            >
              <PlusIcon className="mr-2 size-4" /> Tạo ngay
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <CouponCard key={m.maGiamGia} m={m} onToggle={handleToggle} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <CreateModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={(m) => setList(l => [m, ...l])}
      />
    </div>
  )
}
