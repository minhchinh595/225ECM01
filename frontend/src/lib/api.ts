import type {
  ApiErrorResponse,
  DanhMuc,
  LoginRequest,
  LoginResponse,
  NguoiDung,
  RegisterRequest,
  SanPham,
  ThuongHieu,
  GioHang,
  GioHangItem,
  GioHangRequest,
} from "@/lib/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api"

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = "Yeu cau that bai"
    try {
      const error = (await response.json()) as ApiErrorResponse
      errorMessage = error.message || error.error || errorMessage
      if (error.details && Object.keys(error.details).length > 0) {
        errorMessage = Object.values(error.details)[0] || errorMessage
      }
    } catch {
      errorMessage = await response.text()
    }
    throw new Error(errorMessage)
  }

  return (await response.json()) as T
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/nguoi-dung/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  return parseJson<LoginResponse>(response)
}

export async function register(payload: RegisterRequest): Promise<NguoiDung> {
  const response = await fetch(`${API_URL}/nguoi-dung/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  return parseJson<NguoiDung>(response)
}

export async function getProducts(): Promise<SanPham[]> {
  const response = await fetch(`${API_URL}/san-pham`, {
    cache: "no-store",
  })
  return parseJson<SanPham[]>(response)
}

export async function getProductById(id: number): Promise<SanPham> {
  const response = await fetch(`${API_URL}/san-pham/${id}`, {
    cache: "no-store",
  })
  return parseJson<SanPham>(response)
}

export async function getCategories(): Promise<DanhMuc[]> {
  const response = await fetch(`${API_URL}/danh-muc`, {
    cache: "no-store",
  })
  return parseJson<DanhMuc[]>(response)
}

export async function getBrands(): Promise<ThuongHieu[]> {
  const response = await fetch(`${API_URL}/thuong-hieu`, {
    cache: "no-store",
  })
  return parseJson<ThuongHieu[]>(response)
}

export async function getUsers(): Promise<NguoiDung[]> {
  const response = await fetch(`${API_URL}/nguoi-dung`, {
    cache: "no-store",
  })
  return parseJson<NguoiDung[]>(response)
}

export async function updateProfile(
  id: number,
  payload: { email: string; soDienThoai: string; diaChi?: string },
): Promise<NguoiDung> {
  const response = await fetch(`${API_URL}/nguoi-dung/${id}/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  return parseJson<NguoiDung>(response)
}

export async function changePassword(
  id: number,
  payload: { matKhauCu: string; matKhauMoi: string },
): Promise<void> {
  const response = await fetch(`${API_URL}/nguoi-dung/${id}/change-password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    let errorMessage = "Đổi mật khẩu thất bại"
    try {
      const error = (await response.json()) as ApiErrorResponse
      errorMessage = error.message || error.error || errorMessage
    } catch {
      errorMessage = await response.text()
    }
    throw new Error(errorMessage)
  }
}

export { API_URL }

// ── Giỏ hàng ─────────────────────────────────────────────────

export async function getCart(maNguoiDung: number): Promise<GioHang> {
  const response = await fetch(`${API_URL}/gio-hang/${maNguoiDung}`, {
    cache: "no-store",
  })
  return parseJson<GioHang>(response)
}

export async function addToCart(maNguoiDung: number, payload: GioHangRequest): Promise<GioHang> {
  const response = await fetch(`${API_URL}/gio-hang/${maNguoiDung}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  return parseJson<GioHang>(response)
}

export async function updateCartItem(maNguoiDung: number, payload: GioHangRequest): Promise<GioHang> {
  const response = await fetch(`${API_URL}/gio-hang/${maNguoiDung}/update`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  return parseJson<GioHang>(response)
}

export async function removeFromCart(maNguoiDung: number, maSanPham: number): Promise<GioHang> {
  const response = await fetch(`${API_URL}/gio-hang/${maNguoiDung}/remove/${maSanPham}`, {
    method: "DELETE",
  })
  return parseJson<GioHang>(response)
}

export async function clearCart(maNguoiDung: number): Promise<void> {
  const response = await fetch(`${API_URL}/gio-hang/${maNguoiDung}/clear`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Xóa giỏ hàng thất bại")
}

export async function getCartCount(maNguoiDung: number): Promise<number> {
  const response = await fetch(`${API_URL}/gio-hang/${maNguoiDung}/count`, {
    cache: "no-store",
  })
  return parseJson<number>(response)
}

// ── Mã giảm giá ──────────────────────────────────────────────
export type MaGiamGia = {
  maGiamGia: number
  maCode: string
  tenChuongTrinh?: string | null
  loaiGiam: string
  giaTriGiam: number
  giaTriDonHangToiThieu?: number | null
  giamToiDa?: number | null
  soLuong?: number | null
  ngayBatDau: string
  ngayKetThuc: string
  trangThai?: boolean | null
}

export type MaGiamGiaRequest = {
  maCode: string
  tenChuongTrinh?: string
  loaiGiam: string
  giaTriGiam: number
  giaTriDonHangToiThieu?: number
  giamToiDa?: number
  soLuong?: number
  ngayBatDau: string
  ngayKetThuc: string
  trangThai?: boolean
}

export async function getMaGiamGia(): Promise<MaGiamGia[]> {
  const response = await fetch(`${API_URL}/ma-giam-gia`, { cache: "no-store" })
  return parseJson<MaGiamGia[]>(response)
}

export async function createMaGiamGia(payload: MaGiamGiaRequest): Promise<MaGiamGia> {
  const response = await fetch(`${API_URL}/ma-giam-gia`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  return parseJson<MaGiamGia>(response)
}

export async function toggleMaGiamGia(id: number): Promise<MaGiamGia> {
  const response = await fetch(`${API_URL}/ma-giam-gia/${id}/toggle`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  })
  return parseJson<MaGiamGia>(response)
}

export async function deleteMaGiamGia(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/ma-giam-gia/${id}`, { method: "DELETE" })
  if (!response.ok) throw new Error("Xóa thất bại")
}
