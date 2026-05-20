"use client"

import { useEffect, useMemo, useState, useCallback } from "react"
import { getProducts, getCategories, getBrands, createProduct, updateProduct, deleteProduct } from "@/lib/api"
import type { SanPham, DanhMuc, ThuongHieu } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  PackageIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  EditIcon,
  XIcon,
  ImageIcon,
  TagIcon,
  LayersIcon,
  StoreIcon,
  CircleDollarSignIcon,
  PaletteIcon,
  RulerIcon,
  FileTextIcon,
  PackageCheckIcon,
  AlertCircleIcon,
} from "lucide-react"

function formatCurrency(v: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v)
}

const emptyForm: SanPhamForm = {
  tenSanPham: "",
  gia: 0,
  soLuongTon: 0,
  size: "",
  mauSac: "",
  hinhAnh: "",
  hinhAnh2: "",
  hinhAnh3: "",
  hinhAnh4: "",
  moTa: "",
  maDanhMuc: 0,
  maThuongHieu: 0,
}

interface SanPhamForm {
  tenSanPham: string
  gia: number
  soLuongTon: number
  size: string
  mauSac: string
  hinhAnh: string
  hinhAnh2: string
  hinhAnh3: string
  hinhAnh4: string
  moTa: string
  maDanhMuc: number
  maThuongHieu: number
}

// ── Glass Stat Card ─────────────────────────────────────────────
function GlassStatCard({ icon: Icon, label, value, gradient }: {
  icon: React.ElementType
  label: string
  value: string | number
  gradient: string
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-br p-5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
      <div className={`absolute inset-0 ${gradient} opacity-80`} />
      <div className="absolute inset-0 bg-white/60 opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-400">{label}</p>
          <p className="mt-2 font-heading text-3xl font-semibold tracking-tight text-stone-900">{value}</p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 backdrop-blur-sm">
          <Icon className="size-4.5 text-stone-600" strokeWidth={1.8} />
        </div>
      </div>
    </div>
  )
}

// ── Product form dialog ─────────────────────────────────────────
function ProductFormDialog({
  open,
  onOpenChange,
  editing,
  categories,
  brands,
  onSave,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  editing: SanPham | null
  categories: DanhMuc[]
  brands: ThuongHieu[]
  onSave: (data: SanPhamForm) => Promise<void>
}) {
  const [form, setForm] = useState<SanPhamForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (open) {
      if (editing) {
        setForm({
          tenSanPham: editing.tenSanPham,
          gia: editing.gia,
          soLuongTon: editing.soLuongTon,
          size: editing.size ?? "",
          mauSac: editing.mauSac ?? "",
          hinhAnh: editing.hinhAnh ?? "",
          hinhAnh2: editing.hinhAnh2 ?? "",
          hinhAnh3: editing.hinhAnh3 ?? "",
          hinhAnh4: editing.hinhAnh4 ?? "",
          moTa: editing.moTa ?? "",
          maDanhMuc: editing.maDanhMuc,
          maThuongHieu: editing.maThuongHieu,
        })
      } else {
        setForm(emptyForm)
      }
      setError("")
    }
  }, [open, editing])

  const handleSubmit = async () => {
    setSaving(true)
    setError("")
    try {
      await onSave(form)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lưu thất bại")
    } finally {
      setSaving(false)
    }
  }

  const update = (key: keyof SanPhamForm, value: string | number) =>
    setForm((f) => ({ ...f, [key]: value }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl border border-stone-200 bg-white/95 p-0 shadow-[0_40px_80px_-16px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
        <DialogHeader className="sticky top-0 z-10 border-b border-stone-100 bg-white/90 px-7 py-5 backdrop-blur-lg">
          <DialogTitle className="flex items-center gap-3 text-lg font-semibold text-stone-900">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 ring-1 ring-stone-200">
              {editing ? <EditIcon className="size-4 text-emerald-400" /> : <PlusIcon className="size-4 text-emerald-400" />}
            </div>
            {editing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </DialogTitle>
          <DialogClose className="absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-full text-stone-400 transition hover:bg-stone-100 hover:text-stone-900">
            <XIcon className="size-4" />
          </DialogClose>
        </DialogHeader>

        <div className="space-y-5 px-7 py-6">
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Tên sản phẩm */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-400">
              <TagIcon className="size-3.5" /> Tên sản phẩm
            </label>
            <Input
              value={form.tenSanPham}
              onChange={(e) => update("tenSanPham", e.target.value)}
              placeholder="VD: Áo thun nam cổ tròn"
              className="h-11 rounded-xl border-stone-200 bg-white/70 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-300 focus:ring-0"
            />
          </div>

          {/* Giá & Tồn kho */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-400">
                <CircleDollarSignIcon className="size-3.5" /> Giá bán
              </label>
              <Input
                type="number"
                min={0}
                value={form.gia || ""}
                onChange={(e) => update("gia", Number(e.target.value))}
                placeholder="0"
                className="h-11 rounded-xl border-stone-200 bg-white/70 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-300"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-400">
                <PackageCheckIcon className="size-3.5" /> Số lượng tồn
              </label>
              <Input
                type="number"
                min={0}
                value={form.soLuongTon ?? ""}
                onChange={(e) => update("soLuongTon", Number(e.target.value))}
                placeholder="0"
                className="h-11 rounded-xl border-stone-200 bg-white/70 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-300"
              />
            </div>
          </div>

          {/* Danh mục & Thương hiệu */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-400">
                <LayersIcon className="size-3.5" /> Danh mục
              </label>
              <Select
                value={String(form.maDanhMuc)}
                onValueChange={(v) => update("maDanhMuc", Number(v))}
              >
                <SelectTrigger className="h-11 rounded-xl border-stone-200 bg-white/70 text-sm text-stone-900">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-stone-200 bg-white/95 backdrop-blur-2xl text-stone-900">
                  {categories.map((c) => (
                    <SelectItem key={c.maDanhMuc} value={String(c.maDanhMuc)} className="text-sm text-stone-900/80 hover:text-stone-900 hover:bg-white/70">
                      {c.tenDanhMuc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-400">
                <StoreIcon className="size-3.5" /> Thương hiệu
              </label>
              <Select
                value={String(form.maThuongHieu)}
                onValueChange={(v) => update("maThuongHieu", Number(v))}
              >
                <SelectTrigger className="h-11 rounded-xl border-stone-200 bg-white/70 text-sm text-stone-900">
                  <SelectValue placeholder="Chọn thương hiệu" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-stone-200 bg-white/95 backdrop-blur-2xl text-stone-900">
                  {brands.map((b) => (
                    <SelectItem key={b.maThuongHieu} value={String(b.maThuongHieu)} className="text-sm text-stone-900/80 hover:text-stone-900 hover:bg-white/70">
                      {b.tenThuongHieu}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Màu sắc & Size */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-400">
                <PaletteIcon className="size-3.5" /> Màu sắc
              </label>
              <Input
                value={form.mauSac}
                onChange={(e) => update("mauSac", e.target.value)}
                placeholder="VD: Trắng, Đen, Xanh"
                className="h-11 rounded-xl border-stone-200 bg-white/70 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-300"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-400">
                <RulerIcon className="size-3.5" /> Kích cỡ
              </label>
              <Input
                value={form.size}
                onChange={(e) => update("size", e.target.value)}
                placeholder="VD: S, M, L, XL"
                className="h-11 rounded-xl border-stone-200 bg-white/70 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-300"
              />
            </div>
          </div>

          {/* Hình ảnh */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-400">
              <ImageIcon className="size-3.5" /> Hình ảnh
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input value={form.hinhAnh} onChange={(e) => update("hinhAnh", e.target.value)} placeholder="URL ảnh chính" className="h-11 rounded-xl border-stone-200 bg-white/70 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-300" />
              <Input value={form.hinhAnh2} onChange={(e) => update("hinhAnh2", e.target.value)} placeholder="URL ảnh phụ 2" className="h-11 rounded-xl border-stone-200 bg-white/70 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-300" />
              <Input value={form.hinhAnh3} onChange={(e) => update("hinhAnh3", e.target.value)} placeholder="URL ảnh phụ 3" className="h-11 rounded-xl border-stone-200 bg-white/70 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-300" />
              <Input value={form.hinhAnh4} onChange={(e) => update("hinhAnh4", e.target.value)} placeholder="URL ảnh phụ 4" className="h-11 rounded-xl border-stone-200 bg-white/70 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-300" />
            </div>
          </div>

          {/* Mô tả */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-400">
              <FileTextIcon className="size-3.5" /> Mô tả
            </label>
            <Textarea
              value={form.moTa}
              onChange={(e) => update("moTa", e.target.value)}
              placeholder="Mô tả ngắn về sản phẩm..."
              className="min-h-24 rounded-xl border-stone-200 bg-white/70 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-300"
            />
          </div>
        </div>

        <DialogFooter className="sticky bottom-0 border-t border-stone-100 bg-white/90 px-7 py-4 backdrop-blur-lg">
          <div className="flex w-full items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-10 rounded-xl border-stone-200 bg-white/70 px-5 text-stone-900/60 hover:bg-stone-100 hover:text-stone-900"
            >
              Hủy
            </Button>
            <Button
              type="button"
              disabled={saving || !form.tenSanPham.trim() || !form.maDanhMuc || !form.maThuongHieu}
              onClick={handleSubmit}
              className="h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 text-stone-900 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50"
            >
              {saving ? "Đang lưu..." : editing ? "Cập nhật" : "Thêm sản phẩm"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Delete confirm dialog ─────────────────────────────────────
function DeleteConfirmDialog({
  open,
  onOpenChange,
  product,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  product: SanPham | null
  onConfirm: () => Promise<void>
}) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")

  const handleDelete = async () => {
    setDeleting(true)
    setError("")
    try {
      await onConfirm()
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xóa thất bại")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl border border-stone-200 bg-white/95 p-0 shadow-[0_40px_80px_-16px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
        <DialogHeader className="px-7 pt-7">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 ring-1 ring-red-500/20">
            <TrashIcon className="size-6 text-red-400" />
          </div>
          <DialogTitle className="text-center text-lg font-semibold text-stone-900">Xóa sản phẩm</DialogTitle>
          <DialogDescription className="text-center text-sm text-stone-500">
            Bạn có chắc muốn xóa <span className="font-semibold text-stone-900/80">{product?.tenSanPham}</span>?
            <br />Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="mx-7 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <DialogFooter className="flex-row-reverse gap-3 border-t border-stone-100 px-7 py-5">
          <Button
            type="button"
            disabled={deleting}
            onClick={handleDelete}
            className="h-10 flex-1 rounded-xl bg-red-500/80 text-stone-900 hover:bg-red-500 disabled:opacity-50"
          >
            {deleting ? "Đang xóa..." : "Xóa"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-10 flex-1 rounded-xl border-stone-200 bg-white/70 text-stone-900/60 hover:bg-stone-100 hover:text-stone-900"
          >
            Giữ lại
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Product row ────────────────────────────────────────────────
function ProductRow({
  product,
  onEdit,
  onDelete,
}: {
  product: SanPham
  onEdit: () => void
  onDelete: () => void
}) {
  const src = product.hinhAnh?.trim()
  const lowStock = product.soLuongTon <= 5

  return (
    <div className="group grid grid-cols-[48px_1fr_auto] gap-4 rounded-2xl border border-stone-100 bg-white/60 px-4 py-3.5 backdrop-blur-sm transition-all duration-200 hover:border-stone-200 hover:bg-white/80 sm:grid-cols-[48px_1fr_140px_100px_100px_80px] sm:items-center">
      {/* Ảnh */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-stone-100">
        {src ? (
          <img src={src} alt={product.tenSanPham} className="h-full w-full object-cover" />
        ) : (
          <PackageIcon className="size-5 text-stone-400" strokeWidth={1.5} />
        )}
      </div>

      {/* Thông tin */}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-stone-900">{product.tenSanPham}</p>
          {lowStock && (
            <Badge className="shrink-0 rounded-full border-amber-500/30 bg-amber-500/10 px-2 py-0 text-[10px] font-semibold text-amber-400">
              Sắp hết
            </Badge>
          )}
        </div>
        <p className="mt-0.5 truncate text-xs text-stone-400">
          {product.tenDanhMuc ?? "—"} · {product.tenThuongHieu ?? "—"}
          {product.mauSac && ` · ${product.mauSac}`}
          {product.size && ` · ${product.size}`}
        </p>
      </div>

      {/* Giá */}
      <div className="hidden text-right sm:block">
        <p className="text-sm font-semibold text-rose-400">{formatCurrency(product.gia)}</p>
      </div>

      {/* Tồn kho */}
      <div className="hidden text-center sm:block">
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
          lowStock ? "bg-amber-500/10 text-amber-400" : "bg-emerald-500/10 text-emerald-400"
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${lowStock ? "bg-amber-500" : "bg-emerald-500"}`} />
          {product.soLuongTon}
        </span>
      </div>

      {/* Trạng thái */}
      <div className="hidden text-xs text-stone-400 sm:block">
        {product.soLuongTon > 20 ? "Dồi dào" : lowStock ? "Cần nhập" : "Trung bình"}
      </div>

      {/* Hành động */}
      <div className="flex items-center justify-end gap-1">
        <button
          onClick={onEdit}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-stone-400 transition hover:bg-stone-100 hover:text-stone-900"
          title="Sửa"
        >
          <EditIcon className="size-3.5" />
        </button>
        <button
          onClick={onDelete}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-stone-400 transition hover:bg-red-500/10 hover:text-red-400"
          title="Xóa"
        >
          <TrashIcon className="size-3.5" />
        </button>
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────
export default function SanPhamPage() {
  const [products, setProducts] = useState<SanPham[]>([])
  const [categories, setCategories] = useState<DanhMuc[]>([])
  const [brands, setBrands] = useState<ThuongHieu[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<SanPham | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingProduct, setDeletingProduct] = useState<SanPham | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [p, c, b] = await Promise.all([getProducts(), getCategories(), getBrands()])
      setProducts(p)
      setCategories(c)
      setBrands(b)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return products
    return products.filter(
      (p) =>
        p.tenSanPham.toLowerCase().includes(q) ||
        (p.tenDanhMuc ?? "").toLowerCase().includes(q) ||
        (p.tenThuongHieu ?? "").toLowerCase().includes(q) ||
        (p.mauSac ?? "").toLowerCase().includes(q)
    )
  }, [products, search])

  const handleSave = async (data: SanPhamForm) => {
    const payload = {
      ...data,
      gia: Number(data.gia),
      soLuongTon: Number(data.soLuongTon),
      maDanhMuc: Number(data.maDanhMuc),
      maThuongHieu: Number(data.maThuongHieu),
    }
    if (editing) {
      await updateProduct(editing.maSanPham, payload)
    } else {
      await createProduct(payload)
    }
    await load()
  }

  const handleDelete = async () => {
    if (!deletingProduct) return
    await deleteProduct(deletingProduct.maSanPham)
    await load()
  }

  const openEdit = (product: SanPham) => { setEditing(product); setFormOpen(true) }
  const openCreate = () => { setEditing(null); setFormOpen(true) }
  const openDelete = (product: SanPham) => { setDeletingProduct(product); setDeleteOpen(true) }

  const lowStockCount = products.filter((p) => p.soLuongTon <= 5).length

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 shadow-lg shadow-emerald-500/5 ring-1 ring-stone-200 backdrop-blur-sm">
                <PackageIcon className="size-5 text-emerald-400" strokeWidth={1.8} />
              </div>
              <div>
                <h1 className="font-heading text-xl font-semibold tracking-tight text-stone-900">Sản phẩm</h1>
                <p className="text-xs text-stone-400">Quản lý toàn bộ sản phẩm trong hệ thống</p>
              </div>
            </div>
          </div>
          <Button
            onClick={openCreate}
            className="h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 text-sm font-semibold text-stone-900 shadow-lg shadow-emerald-500/15 transition-all hover:from-emerald-400 hover:to-cyan-400 hover:shadow-xl"
          >
            <PlusIcon className="mr-2 size-4" />
            Thêm sản phẩm
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <GlassStatCard icon={PackageIcon} label="Tổng sản phẩm" value={products.length} gradient="bg-gradient-to-br from-blue-900/40 to-indigo-900/20" />
          <GlassStatCard icon={LayersIcon} label="Danh mục" value={categories.length} gradient="bg-gradient-to-br from-amber-900/40 to-orange-900/20" />
          <GlassStatCard icon={StoreIcon} label="Thương hiệu" value={brands.length} gradient="bg-gradient-to-br from-emerald-900/40 to-teal-900/20" />
          <GlassStatCard icon={AlertCircleIcon} label="Sắp hết hàng" value={lowStockCount} gradient="bg-gradient-to-br from-red-900/40 to-rose-900/20" />
        </div>

        {/* Search */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên, danh mục, thương hiệu..."
              className="h-11 rounded-2xl border-stone-200 bg-white/70 pl-11 text-sm text-stone-900 placeholder:text-stone-400 shadow-sm transition-all focus:border-stone-300 focus:shadow-md"
            />
          </div>
          <div className="flex items-center gap-3 text-sm text-stone-400">
            <span className="hidden sm:inline">
              {loading ? "…" : <span><strong className="text-stone-600">{filtered.length}</strong> / {products.length} sản phẩm</span>}
            </span>
            {lowStockCount > 0 && (
              <Badge className="rounded-full border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
                <AlertCircleIcon className="mr-1.5 size-3" />
                {lowStockCount} sản phẩm sắp hết
              </Badge>
            )}
          </div>
        </div>

        {/* List */}
        <div className="rounded-2xl border border-stone-100 bg-white/60 p-1 shadow-sm backdrop-blur-sm">
          {loading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[68px] animate-pulse rounded-2xl bg-white/70" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/70">
                <PackageIcon className="size-8 text-stone-300" strokeWidth={1} />
              </div>
              <div>
                <p className="text-base font-semibold text-stone-600">
                  {search ? "Không tìm thấy sản phẩm" : "Chưa có sản phẩm nào"}
                </p>
                <p className="mt-0.5 text-sm text-stone-400">
                  {search ? "Thử lại với từ khóa khác" : "Bấm Thêm sản phẩm để bắt đầu"}
                </p>
              </div>
              {!search && (
                <Button onClick={openCreate} className="mt-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 text-stone-900 hover:from-emerald-400 hover:to-cyan-400">
                  <PlusIcon className="mr-2 size-4" />
                  Thêm sản phẩm đầu tiên
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-1.5 p-2">
              {/* Header row */}
              <div className="hidden grid-cols-[48px_1fr_140px_100px_100px_80px] gap-4 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-400 sm:grid">
                <span />
                <span>Sản phẩm</span>
                <span className="text-right">Giá</span>
                <span className="text-center">Tồn kho</span>
                <span className="text-center">Trạng thái</span>
                <span className="text-right">Thao tác</span>
              </div>
              {filtered.map((product) => (
                <ProductRow
                  key={product.maSanPham}
                  product={product}
                  onEdit={() => openEdit(product)}
                  onDelete={() => openDelete(product)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={editing}
        categories={categories}
        brands={brands}
        onSave={handleSave}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        product={deletingProduct}
        onConfirm={handleDelete}
      />
    </>
  )
}
