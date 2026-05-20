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
  SparklesIcon,
  TagIcon,
  LayersIcon,
  StoreIcon,
  CircleDollarSignIcon,
  PaletteIcon,
  RulerIcon,
  FileTextIcon,
  PackageCheckIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
} from "lucide-react"

// ── helpers ─────────────────────────────────────────────────────
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

// ── Stat card ───────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, accent }: {
  icon: React.ElementType
  label: string
  value: string | number
  accent: string
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-stone-100 bg-white p-5 shadow-[0_4px_16px_-6px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_28px_-8px_rgba(0,0,0,0.08)] hover:-translate-y-0.5">
      <div className={`absolute inset-y-0 left-0 w-1 rounded-r-full ${accent} transition-all duration-300 group-hover:w-1.5`} />
      <div className="flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent} bg-opacity-15`}>
          <Icon className={`size-4.5 ${accent.replace("bg-", "text-")}`} strokeWidth={1.8} />
        </div>
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-tight text-stone-900">{value}</p>
      <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-stone-400">{label}</p>
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
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl border-stone-200 bg-[#fcfbf9] p-0 shadow-[0_40px_80px_-16px_rgba(0,0,0,0.15)]">
        <DialogHeader className="sticky top-0 z-10 border-b border-stone-100 bg-[#fcfbf9]/90 px-7 py-5 backdrop-blur-lg">
          <DialogTitle className="flex items-center gap-3 text-lg font-semibold text-stone-900">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-200 via-amber-100 to-orange-100 shadow-sm">
              {editing ? <EditIcon className="size-4 text-amber-700" /> : <PlusIcon className="size-4 text-amber-700" />}
            </div>
            {editing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </DialogTitle>
          <DialogClose className="absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-full text-stone-400 transition hover:bg-stone-100 hover:text-stone-700">
            <XIcon className="size-4" />
          </DialogClose>
        </DialogHeader>

        <div className="space-y-5 px-7 py-6">
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Tên sản phẩm */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500">
              <TagIcon className="size-3.5" /> Tên sản phẩm
            </label>
            <Input
              value={form.tenSanPham}
              onChange={(e) => update("tenSanPham", e.target.value)}
              placeholder="VD: Áo thun nam cổ tròn"
              className="h-11 rounded-xl border-stone-200 bg-white text-sm"
            />
          </div>

          {/* Giá & Tồn kho */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500">
                <CircleDollarSignIcon className="size-3.5" /> Giá bán
              </label>
              <Input
                type="number"
                min={0}
                value={form.gia || ""}
                onChange={(e) => update("gia", Number(e.target.value))}
                placeholder="0"
                className="h-11 rounded-xl border-stone-200 bg-white text-sm"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500">
                <PackageCheckIcon className="size-3.5" /> Số lượng tồn
              </label>
              <Input
                type="number"
                min={0}
                value={form.soLuongTon ?? ""}
                onChange={(e) => update("soLuongTon", Number(e.target.value))}
                placeholder="0"
                className="h-11 rounded-xl border-stone-200 bg-white text-sm"
              />
            </div>
          </div>

          {/* Danh mục & Thương hiệu */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500">
                <LayersIcon className="size-3.5" /> Danh mục
              </label>
              <Select
                value={String(form.maDanhMuc)}
                onValueChange={(v) => update("maDanhMuc", Number(v))}
              >
                <SelectTrigger className="h-11 rounded-xl border-stone-200 bg-white text-sm">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-stone-200">
                  {categories.map((c) => (
                    <SelectItem key={c.maDanhMuc} value={String(c.maDanhMuc)} className="text-sm">
                      {c.tenDanhMuc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500">
                <StoreIcon className="size-3.5" /> Thương hiệu
              </label>
              <Select
                value={String(form.maThuongHieu)}
                onValueChange={(v) => update("maThuongHieu", Number(v))}
              >
                <SelectTrigger className="h-11 rounded-xl border-stone-200 bg-white text-sm">
                  <SelectValue placeholder="Chọn thương hiệu" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-stone-200">
                  {brands.map((b) => (
                    <SelectItem key={b.maThuongHieu} value={String(b.maThuongHieu)} className="text-sm">
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
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500">
                <PaletteIcon className="size-3.5" /> Màu sắc
              </label>
              <Input
                value={form.mauSac}
                onChange={(e) => update("mauSac", e.target.value)}
                placeholder="VD: Trắng, Đen, Xanh"
                className="h-11 rounded-xl border-stone-200 bg-white text-sm"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500">
                <RulerIcon className="size-3.5" /> Kích cỡ
              </label>
              <Input
                value={form.size}
                onChange={(e) => update("size", e.target.value)}
                placeholder="VD: S, M, L, XL"
                className="h-11 rounded-xl border-stone-200 bg-white text-sm"
              />
            </div>
          </div>

          {/* Hình ảnh */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500">
              <ImageIcon className="size-3.5" /> Hình ảnh
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input value={form.hinhAnh} onChange={(e) => update("hinhAnh", e.target.value)} placeholder="URL ảnh chính" className="h-11 rounded-xl border-stone-200 bg-white text-sm" />
              <Input value={form.hinhAnh2} onChange={(e) => update("hinhAnh2", e.target.value)} placeholder="URL ảnh phụ 2" className="h-11 rounded-xl border-stone-200 bg-white text-sm" />
              <Input value={form.hinhAnh3} onChange={(e) => update("hinhAnh3", e.target.value)} placeholder="URL ảnh phụ 3" className="h-11 rounded-xl border-stone-200 bg-white text-sm" />
              <Input value={form.hinhAnh4} onChange={(e) => update("hinhAnh4", e.target.value)} placeholder="URL ảnh phụ 4" className="h-11 rounded-xl border-stone-200 bg-white text-sm" />
            </div>
          </div>

          {/* Mô tả */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500">
              <FileTextIcon className="size-3.5" /> Mô tả
            </label>
            <Textarea
              value={form.moTa}
              onChange={(e) => update("moTa", e.target.value)}
              placeholder="Mô tả ngắn về sản phẩm..."
              className="min-h-24 rounded-xl border-stone-200 bg-white text-sm"
            />
          </div>
        </div>

        <DialogFooter className="sticky bottom-0 border-t border-stone-100 bg-[#fcfbf9]/90 px-7 py-4 backdrop-blur-lg">
          <div className="flex w-full items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-10 rounded-xl border-stone-200 bg-white px-5 text-stone-700 hover:bg-stone-50"
            >
              Hủy
            </Button>
            <Button
              type="button"
              disabled={saving || !form.tenSanPham.trim() || !form.maDanhMuc || !form.maThuongHieu}
              onClick={handleSubmit}
              className="h-10 rounded-xl bg-stone-900 px-6 text-white hover:bg-stone-800 disabled:opacity-50"
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
      <DialogContent className="max-w-md rounded-3xl border-stone-200 bg-[#fcfbf9] p-0 shadow-[0_40px_80px_-16px_rgba(0,0,0,0.15)]">
        <DialogHeader className="px-7 pt-7">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 ring-1 ring-red-100">
            <TrashIcon className="size-6 text-red-500" />
          </div>
          <DialogTitle className="text-center text-lg font-semibold text-stone-900">Xóa sản phẩm</DialogTitle>
          <DialogDescription className="text-center text-sm text-stone-500">
            Bạn có chắc muốn xóa <span className="font-semibold text-stone-700">{product?.tenSanPham}</span>?
            <br />Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="mx-7 flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <DialogFooter className="flex-row-reverse gap-3 border-t border-stone-100 px-7 py-5">
          <Button
            type="button"
            disabled={deleting}
            onClick={handleDelete}
            className="h-10 flex-1 rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? "Đang xóa..." : "Xóa"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-10 flex-1 rounded-xl border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
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
    <div className="group grid grid-cols-[48px_1fr_auto] gap-4 rounded-2xl border border-stone-100 bg-white/80 px-4 py-3.5 shadow-[0_1px_3px_-1px_rgba(0,0,0,0.03)] transition-all duration-200 hover:border-stone-200 hover:bg-white hover:shadow-[0_4px_16px_-6px_rgba(0,0,0,0.06)] sm:grid-cols-[48px_1fr_140px_100px_100px_80px] sm:items-center">
      {/* Ảnh */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-stone-100">
        {src ? (
          <img src={src} alt={product.tenSanPham} className="h-full w-full object-cover" />
        ) : (
          <PackageIcon className="size-5 text-stone-300" strokeWidth={1.5} />
        )}
      </div>

      {/* Thông tin */}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-stone-900">{product.tenSanPham}</p>
          {lowStock && (
            <Badge className="shrink-0 rounded-full border-amber-200 bg-amber-50 px-2 py-0 text-[10px] font-semibold text-amber-700">
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
        <p className="text-sm font-semibold text-rose-700">{formatCurrency(product.gia)}</p>
      </div>

      {/* Tồn kho */}
      <div className="hidden text-center sm:block">
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
          lowStock
            ? "bg-amber-50 text-amber-700"
            : "bg-emerald-50 text-emerald-700"
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${lowStock ? "bg-amber-500" : "bg-emerald-500"}`} />
          {product.soLuongTon}
        </span>
      </div>

      {/* Số lượng tồn (label cố định) */}
      <div className="hidden text-xs text-stone-400 sm:block">
        {product.soLuongTon > 20 ? "Dồi dào" : lowStock ? "Cần nhập" : "Trung bình"}
      </div>

      {/* Hành động */}
      <div className="flex items-center justify-end gap-1">
        <button
          onClick={onEdit}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
          title="Sửa"
        >
          <EditIcon className="size-3.5" />
        </button>
        <button
          onClick={onDelete}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-stone-400 transition hover:bg-red-50 hover:text-red-500"
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

  // Dialog state
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

  const openEdit = (product: SanPham) => {
    setEditing(product)
    setFormOpen(true)
  }

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openDelete = (product: SanPham) => {
    setDeletingProduct(product)
    setDeleteOpen(true)
  }

  const stats = [
    { icon: PackageIcon, label: "Tổng sản phẩm", value: products.length, accent: "bg-stone-900" },
    { icon: LayersIcon, label: "Danh mục", value: categories.length, accent: "bg-amber-600" },
    { icon: StoreIcon, label: "Thương hiệu", value: brands.length, accent: "bg-emerald-600" },
    {
      icon: AlertCircleIcon,
      label: "Sắp hết hàng",
      value: products.filter((p) => p.soLuongTon <= 5).length,
      accent: "bg-red-500",
    },
  ]

  const lowStockCount = products.filter((p) => p.soLuongTon <= 5).length

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200 via-amber-100 to-orange-100 shadow-sm ring-1 ring-white/80">
                <PackageIcon className="size-5 text-amber-700" strokeWidth={1.8} />
              </div>
              <div>
                <h1 className="font-heading text-xl font-semibold tracking-tight text-stone-900">Sản phẩm</h1>
                <p className="text-xs text-stone-400">Quản lý toàn bộ sản phẩm trong hệ thống</p>
              </div>
            </div>
          </div>
          <Button
            onClick={openCreate}
            className="h-10 rounded-xl bg-stone-900 px-5 text-sm font-semibold text-white shadow-lg shadow-stone-900/15 transition-all hover:bg-stone-800 hover:shadow-xl"
          >
            <PlusIcon className="mr-2 size-4" />
            Thêm sản phẩm
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Search + Filter row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên, danh mục, thương hiệu..."
              className="h-11 rounded-2xl border-stone-200 bg-white pl-11 text-sm shadow-sm transition-all focus:border-stone-400 focus:shadow-md"
            />
          </div>
          <div className="flex items-center gap-3 text-sm text-stone-400">
            <span className="hidden sm:inline">
              {loading ? "…" : <span><strong className="text-stone-700">{filtered.length}</strong> / {products.length} sản phẩm</span>}
            </span>
            {lowStockCount > 0 && (
              <Badge className="rounded-full border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                <AlertCircleIcon className="mr-1.5 size-3" />
                {lowStockCount} sản phẩm sắp hết
              </Badge>
            )}
          </div>
        </div>

        {/* List */}
        <div className="rounded-2xl border border-stone-100 bg-white/70 p-1 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.04)]">
          {loading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[68px] animate-pulse rounded-2xl bg-stone-50" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-50">
                <PackageIcon className="size-8 text-stone-300" strokeWidth={1} />
              </div>
              <div>
                <p className="text-base font-semibold text-stone-700">
                  {search ? "Không tìm thấy sản phẩm" : "Chưa có sản phẩm nào"}
                </p>
                <p className="mt-0.5 text-sm text-stone-400">
                  {search ? "Thử lại với từ khóa khác" : "Bấm Thêm sản phẩm để bắt đầu"}
                </p>
              </div>
              {!search && (
                <Button onClick={openCreate} className="mt-2 rounded-xl bg-stone-900 px-5 text-white hover:bg-stone-800">
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

      {/* Dialogs */}
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