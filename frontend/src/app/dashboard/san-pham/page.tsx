"use client"

import { useEffect, useMemo, useState, useCallback } from "react"
import { getProducts, getCategories, getBrands, createProduct, updateProduct, deleteProduct } from "@/lib/api"
import type { SanPham, DanhMuc, ThuongHieu } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  PackageIcon, PlusIcon, SearchIcon, TrashIcon, EditIcon, XIcon,
  ImageIcon, LayersIcon, StoreIcon, CircleDollarSignIcon, PaletteIcon,
  RulerIcon, FileTextIcon, PackageCheckIcon, AlertCircleIcon, TagIcon,
  ArrowLeftIcon, LayoutGridIcon, ChevronRightIcon,
} from "lucide-react"

function formatCurrency(v: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v)
}

interface SanPhamForm {
  tenSanPham: string; gia: number; soLuongTon: number; size: string
  mauSac: string; hinhAnh: string; hinhAnh2: string; hinhAnh3: string
  hinhAnh4: string; moTa: string; maDanhMuc: number; maThuongHieu: number
}

const emptyForm: SanPhamForm = {
  tenSanPham: "", gia: 0, soLuongTon: 0, size: "", mauSac: "",
  hinhAnh: "", hinhAnh2: "", hinhAnh3: "", hinhAnh4: "", moTa: "", maDanhMuc: 0, maThuongHieu: 0,
}

function getStockLevel(qty: number) {
  if (qty <= 5) return { label: "Sắp hết", color: "text-amber-600 bg-amber-50 border-amber-200" }
  if (qty <= 20) return { label: "Trung bình", color: "text-blue-600 bg-blue-50 border-blue-200" }
  return { label: "Dồi dào", color: "text-emerald-600 bg-emerald-50 border-emerald-200" }
}

// ── Category Card ──────────────────────────────────────────────
function CategoryCard({ cat, count, onClick }: {
  cat: DanhMuc; count: number; onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-2xl border border-stone-100 bg-white p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-stone-200 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 ring-1 ring-amber-200/50">
          <LayersIcon className="size-5 text-amber-600" strokeWidth={1.8} />
        </div>
        <ChevronRightIcon className="size-5 text-stone-300 transition-all group-hover:translate-x-0.5 group-hover:text-stone-500" />
      </div>
      <div className="mt-5">
        <h3 className="text-base font-semibold text-stone-900">{cat.tenDanhMuc}</h3>
        <p className="mt-1 text-sm text-stone-400">{count} sản phẩm</p>
      </div>
      <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-stone-500 transition-colors group-hover:text-stone-800">
        Xem chi tiết
        <ChevronRightIcon className="size-3" />
      </div>
    </div>
  )
}

// ── Product Form Dialog ────────────────────────────────────────
function ProductFormDialog({ open, onOpenChange, editing, categories, brands, onSave }: {
  open: boolean; onOpenChange: (v: boolean) => void; editing: SanPham | null
  categories: DanhMuc[]; brands: ThuongHieu[]; onSave: (data: SanPhamForm) => Promise<void>
}) {
  const [form, setForm] = useState<SanPhamForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (open) {
      setForm(editing ? {
        tenSanPham: editing.tenSanPham, gia: editing.gia, soLuongTon: editing.soLuongTon,
        size: editing.size ?? "", mauSac: editing.mauSac ?? "", hinhAnh: editing.hinhAnh ?? "",
        hinhAnh2: (editing as any).hinhAnh2 ?? "", hinhAnh3: (editing as any).hinhAnh3 ?? "",
        hinhAnh4: (editing as any).hinhAnh4 ?? "", moTa: editing.moTa ?? "",
        maDanhMuc: editing.maDanhMuc, maThuongHieu: editing.maThuongHieu,
      } : emptyForm)
      setError("")
    }
  }, [open, editing])

  const handleSubmit = async () => {
    setSaving(true); setError("")
    try { await onSave(form); onOpenChange(false) }
    catch (err) { setError(err instanceof Error ? err.message : "Lưu thất bại") }
    finally { setSaving(false) }
  }

  const update = (key: keyof SanPhamForm, value: string | number) =>
    setForm((f) => ({ ...f, [key]: value }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[85vw] w-[85vw] rounded-2xl border border-stone-200 bg-white p-0 shadow-2xl overflow-hidden">
        <DialogHeader className="border-b border-stone-100 bg-white px-8 py-4">
          <DialogTitle className="flex items-center gap-3 text-base font-semibold text-stone-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 ring-1 ring-emerald-200">
              {editing ? <EditIcon className="size-4 text-emerald-600" /> : <PlusIcon className="size-4 text-emerald-600" />}
            </div>
            {editing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </DialogTitle>
        </DialogHeader>

        <div className="px-8 py-4">
          {error && (
            <div className="mb-3 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
              <AlertCircleIcon className="mt-0.5 size-4 shrink-0" /><span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-400">Tên sản phẩm</label>
                <Input value={form.tenSanPham} onChange={(e) => update("tenSanPham", e.target.value)} placeholder="VD: Áo dài lụa hoa đào" className="h-9 rounded-lg border-stone-200 bg-stone-50 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-400">Giá bán</label>
                  <Input type="number" min={0} value={form.gia || ""} onChange={(e) => update("gia", Number(e.target.value))} placeholder="0" className="h-9 rounded-lg border-stone-200 bg-stone-50 text-sm" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-400">Số lượng tồn</label>
                  <Input type="number" min={0} value={form.soLuongTon ?? ""} onChange={(e) => update("soLuongTon", Number(e.target.value))} placeholder="0" className="h-9 rounded-lg border-stone-200 bg-stone-50 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-400">Danh mục</label>
                  <Select value={String(form.maDanhMuc)} onValueChange={(v) => update("maDanhMuc", Number(v))}>
                    <SelectTrigger className="h-9 rounded-lg border-stone-200 bg-stone-50 text-sm"><SelectValue placeholder="Chọn" /></SelectTrigger>
                    <SelectContent className="rounded-xl border-stone-200 bg-white">
                      {categories.map((c) => <SelectItem key={c.maDanhMuc} value={String(c.maDanhMuc)} className="text-sm">{c.tenDanhMuc}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-400">Thương hiệu</label>
                  <Select value={String(form.maThuongHieu)} onValueChange={(v) => update("maThuongHieu", Number(v))}>
                    <SelectTrigger className="h-9 rounded-lg border-stone-200 bg-stone-50 text-sm"><SelectValue placeholder="Chọn" /></SelectTrigger>
                    <SelectContent className="rounded-xl border-stone-200 bg-white">
                      {brands.map((b) => <SelectItem key={b.maThuongHieu} value={String(b.maThuongHieu)} className="text-sm">{b.tenThuongHieu}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-400">Màu sắc</label>
                  <Input value={form.mauSac} onChange={(e) => update("mauSac", e.target.value)} placeholder="Trắng, Đen..." className="h-9 rounded-lg border-stone-200 bg-stone-50 text-sm" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-400">Kích cỡ</label>
                  <Input value={form.size} onChange={(e) => update("size", e.target.value)} placeholder="S, M, L, XL" className="h-9 rounded-lg border-stone-200 bg-stone-50 text-sm" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-400">Hình ảnh (URL)</label>
                <div className="space-y-2">
                  <Input value={form.hinhAnh} onChange={(e) => update("hinhAnh", e.target.value)} placeholder="Ảnh chính" className="h-8 rounded-lg border-stone-200 bg-stone-50 text-sm" />
                  <Input value={form.hinhAnh2} onChange={(e) => update("hinhAnh2", e.target.value)} placeholder="Ảnh phụ 2" className="h-8 rounded-lg border-stone-200 bg-stone-50 text-sm" />
                  <Input value={form.hinhAnh3} onChange={(e) => update("hinhAnh3", e.target.value)} placeholder="Ảnh phụ 3" className="h-8 rounded-lg border-stone-200 bg-stone-50 text-sm" />
                  <Input value={form.hinhAnh4} onChange={(e) => update("hinhAnh4", e.target.value)} placeholder="Ảnh phụ 4" className="h-8 rounded-lg border-stone-200 bg-stone-50 text-sm" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-400">Mô tả</label>
                <Textarea value={form.moTa} onChange={(e) => update("moTa", e.target.value)} placeholder="Mô tả ngắn về sản phẩm..." className="min-h-[72px] rounded-lg border-stone-200 bg-stone-50 text-sm" />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-stone-100 bg-white px-8 py-5 pb-8">
          <div className="flex w-full items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-9 rounded-lg border-stone-200 px-5 text-sm text-stone-600 hover:bg-stone-50">Hủy</Button>
            <Button type="button" disabled={saving || !form.tenSanPham.trim() || !form.maDanhMuc || !form.maThuongHieu} onClick={handleSubmit} className="h-9 rounded-lg bg-stone-900 px-6 text-sm text-white hover:bg-stone-800 disabled:opacity-50">
              {saving ? "Đang lưu..." : editing ? "Cập nhật" : "Thêm sản phẩm"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Delete Confirm Dialog ──────────────────────────────────────
function DeleteConfirmDialog({ open, onOpenChange, product, onConfirm }: {
  open: boolean; onOpenChange: (v: boolean) => void
  product: SanPham | null; onConfirm: () => Promise<void>
}) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")

  const handleDelete = async () => {
    setDeleting(true); setError("")
    try { await onConfirm(); onOpenChange(false) }
    catch (err) { setError(err instanceof Error ? err.message : "Xóa thất bại") }
    finally { setDeleting(false) }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border border-stone-200 bg-white p-0 shadow-2xl">
        <DialogHeader className="px-7 pt-7">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 ring-1 ring-red-200">
            <TrashIcon className="size-6 text-red-500" />
          </div>
          <DialogTitle className="text-center text-lg font-semibold text-stone-900">Xóa sản phẩm</DialogTitle>
          <DialogDescription className="text-center text-sm text-stone-500">
            Bạn có chắc muốn xóa <span className="font-semibold text-stone-800">{product?.tenSanPham}</span>?
            <br />Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <div className="mx-7 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <AlertCircleIcon className="mt-0.5 size-4 shrink-0" /><span>{error}</span>
          </div>
        )}
        <DialogFooter className="flex-row-reverse gap-3 border-t border-stone-100 px-7 py-5">
          <Button type="button" disabled={deleting} onClick={handleDelete} className="h-10 flex-1 rounded-xl bg-red-500 text-white hover:bg-red-600 disabled:opacity-50">
            {deleting ? "Đang xóa..." : "Xóa"}
          </Button>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-10 flex-1 rounded-xl border-stone-200 text-stone-600 hover:bg-stone-50">Giữ lại</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Product Row (dùng trong view chi tiết danh mục) ────────────
function ProductRow({ product, onEdit, onDelete }: {
  product: SanPham; onEdit: () => void; onDelete: () => void
}) {
  const src = product.hinhAnh?.trim()
  const stock = getStockLevel(product.soLuongTon)
  return (
    <div className="group grid grid-cols-[48px_1fr_auto] gap-4 rounded-xl border border-stone-100 bg-white/70 px-4 py-3 transition hover:border-stone-200 hover:bg-white sm:grid-cols-[48px_1fr_140px_100px_100px_80px] sm:items-center">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-stone-100">
        {src ? <img src={src} alt={product.tenSanPham} className="h-full w-full object-cover" /> : <PackageIcon className="size-5 text-stone-400" strokeWidth={1.5} />}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-stone-900">{product.tenSanPham}</p>
          {product.soLuongTon <= 5 && <Badge className="shrink-0 rounded-full border-amber-200 bg-amber-50 px-2 py-0 text-[10px] font-semibold text-amber-700">Sắp hết</Badge>}
        </div>
        <p className="mt-0.5 truncate text-xs text-stone-400">
          {product.tenDanhMuc ?? "—"} · {product.tenThuongHieu ?? "—"}
          {product.mauSac && ` · ${product.mauSac}`}{product.size && ` · ${product.size}`}
        </p>
      </div>
      <div className="hidden text-right sm:block">
        <p className="text-sm font-semibold text-rose-600">{formatCurrency(product.gia)}</p>
      </div>
      <div className="hidden text-center sm:block">
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${stock.color}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${stock.color.split(" ")[0].replace("text-", "bg-")}`} />{product.soLuongTon}
        </span>
      </div>
      <div className="hidden text-xs text-stone-400 sm:block">{stock.label}</div>
      <div className="flex items-center justify-end gap-1">
        <button onClick={onEdit} className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition hover:bg-stone-100 hover:text-stone-900" title="Sửa"><EditIcon className="size-3.5" /></button>
        <button onClick={onDelete} className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition hover:bg-red-50 hover:text-red-500" title="Xóa"><TrashIcon className="size-3.5" /></button>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────
export default function SanPhamPage() {
  const [products, setProducts] = useState<SanPham[]>([])
  const [categories, setCategories] = useState<DanhMuc[]>([])
  const [brands, setBrands] = useState<ThuongHieu[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedCat, setSelectedCat] = useState<number | null>(null)
  const [showCategoryView, setShowCategoryView] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<SanPham | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingProduct, setDeletingProduct] = useState<SanPham | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [p, c, b] = await Promise.all([getProducts(), getCategories(), getBrands()])
      setProducts(p); setCategories(c); setBrands(b)
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    let result = selectedCat !== null
      ? products.filter((p) => p.maDanhMuc === selectedCat)
      : products
    if (!q) return result
    return result.filter((p) =>
      p.tenSanPham.toLowerCase().includes(q) ||
      (p.tenDanhMuc ?? "").toLowerCase().includes(q) ||
      (p.tenThuongHieu ?? "").toLowerCase().includes(q)
    )
  }, [products, search, selectedCat])

  const handleSave = async (data: SanPhamForm) => {
    const payload = { ...data, gia: Number(data.gia), soLuongTon: Number(data.soLuongTon), maDanhMuc: Number(data.maDanhMuc), maThuongHieu: Number(data.maThuongHieu) }
    if (editing) await updateProduct(editing.maSanPham, payload)
    else await createProduct(payload)
    await load()
  }

  const handleDelete = async () => {
    if (!deletingProduct) return
    await deleteProduct(deletingProduct.maSanPham)
    await load()
  }

  const enterCategory = (catId: number) => {
    setSelectedCat(catId)
    setShowCategoryView(false)
    setSearch("")
  }

  const backToCategories = () => {
    setSelectedCat(null)
    setShowCategoryView(true)
    setSearch("")
  }

  const selectedCatName = selectedCat !== null
    ? categories.find((c) => c.maDanhMuc === selectedCat)?.tenDanhMuc ?? ""
    : ""

  const lowStockCount = products.filter((p) => p.soLuongTon <= 5).length

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-12">
        <div className="space-y-3 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-stone-200 border-t-stone-900" />
          <p className="text-sm text-stone-400">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">

        {showCategoryView ? (
          // ── VIEW 1: HIỂN THỊ DANH MỤC ──────────────────────
          <>
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 shadow-sm ring-1 ring-stone-200">
                  <LayoutGridIcon className="size-5 text-stone-600" strokeWidth={1.8} />
                </div>
                <div>
                  <h1 className="font-heading text-xl font-semibold tracking-tight text-stone-900">Kho sản phẩm</h1>
                  <p className="text-xs text-stone-500">Chọn một danh mục để xem danh sách sản phẩm</p>
                </div>
              </div>
              <Button onClick={() => { setEditing(null); setFormOpen(true) }} className="h-10 rounded-xl bg-stone-900 px-5 text-sm font-semibold text-white hover:bg-stone-800">
                <PlusIcon className="mr-2 size-4" />Thêm sản phẩm
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-400">Tổng sản phẩm</p>
                <p className="mt-2 font-heading text-3xl font-semibold text-stone-900">{products.length}</p>
              </div>
              <div className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-400">Danh mục</p>
                <p className="mt-2 font-heading text-3xl font-semibold text-stone-900">{categories.length}</p>
              </div>
              <div className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-400">Thương hiệu</p>
                <p className="mt-2 font-heading text-3xl font-semibold text-stone-900">{brands.length}</p>
              </div>
              <div className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-400">Sắp hết hàng</p>
                <p className="mt-2 font-heading text-3xl font-semibold text-stone-900">{lowStockCount}</p>
              </div>
            </div>

            {/* Category Grid */}
            {categories.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-20 text-center">
                <LayersIcon className="size-12 text-stone-300" strokeWidth={1} />
                <p className="text-sm text-stone-500">Chưa có danh mục nào</p>
                <Button onClick={() => { setEditing(null); setFormOpen(true) }} className="rounded-xl bg-stone-900 px-5 text-white hover:bg-stone-800">
                  <PlusIcon className="mr-2 size-4" />Thêm sản phẩm đầu tiên
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categories.map((cat) => (
                  <CategoryCard
                    key={cat.maDanhMuc}
                    cat={cat}
                    count={products.filter((p) => p.maDanhMuc === cat.maDanhMuc).length}
                    onClick={() => enterCategory(cat.maDanhMuc)}
                  />
                ))}
              </div>
            )}
          </>

        ) : (
          // ── VIEW 2: HIỂN THỊ SẢN PHẨM THEO DANH MỤC ──────
          <>
            {/* Header với nút quay lại */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={backToCategories}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-500 transition hover:bg-stone-50 hover:text-stone-900"
                >
                  <ArrowLeftIcon className="size-4" />
                </button>
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 ring-1 ring-amber-200/50">
                      <LayersIcon className="size-4.5 text-amber-600" strokeWidth={1.8} />
                    </div>
                    <h1 className="font-heading text-xl font-semibold tracking-tight text-stone-900">{selectedCatName}</h1>
                  </div>
                  <p className="mt-0.5 text-xs text-stone-400">
                    {filtered.length} sản phẩm ·{' '}
                    <button onClick={backToCategories} className="text-stone-500 underline underline-offset-2 hover:text-stone-800">
                      Quay lại danh mục
                    </button>
                  </p>
                </div>
              </div>
              <Button onClick={() => { setEditing(null); setFormOpen(true) }} className="h-10 rounded-xl bg-stone-900 px-5 text-sm font-semibold text-white hover:bg-stone-800">
                <PlusIcon className="mr-2 size-4" />Thêm sản phẩm
              </Button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm sản phẩm trong danh mục..." className="h-11 rounded-2xl border-stone-200 bg-white/80 pl-11 text-sm shadow-sm" />
              </div>
              <span className="text-sm text-stone-400">
                <strong className="text-stone-700">{filtered.length}</strong> / {products.filter((p) => p.maDanhMuc === selectedCat).length}
              </span>
            </div>

            {/* Product list */}
            <div className="rounded-2xl border border-stone-100 bg-white/50 p-2 shadow-sm">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-20 text-center">
                  <PackageIcon className="size-12 text-stone-300" strokeWidth={1} />
                  <p className="text-sm text-stone-500">{search ? "Không tìm thấy sản phẩm" : "Danh mục này chưa có sản phẩm"}</p>
                  {!search && (
                    <Button onClick={() => { setEditing(null); setFormOpen(true) }} className="rounded-xl bg-stone-900 px-5 text-white hover:bg-stone-800">
                      <PlusIcon className="mr-2 size-4" />Thêm sản phẩm
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-1.5 p-1">
                  <div className="hidden grid-cols-[48px_1fr_140px_100px_100px_80px] gap-4 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-400 sm:grid">
                    <span /><span>Sản phẩm</span><span className="text-right">Giá</span>
                    <span className="text-center">Tồn kho</span><span className="text-center">Trạng thái</span><span className="text-right">Thao tác</span>
                  </div>
                  {filtered.map((product) => (
                    <ProductRow key={product.maSanPham} product={product}
                      onEdit={() => { setEditing(product); setFormOpen(true) }}
                      onDelete={() => { setDeletingProduct(product); setDeleteOpen(true) }}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <ProductFormDialog open={formOpen} onOpenChange={setFormOpen} editing={editing} categories={categories} brands={brands} onSave={handleSave} />
      <DeleteConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} product={deletingProduct} onConfirm={handleDelete} />
    </>
  )
}