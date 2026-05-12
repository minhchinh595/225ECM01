import type {
  ApiErrorResponse,
  DanhMuc,
  LoginRequest,
  LoginResponse,
  NguoiDung,
  RegisterRequest,
  SanPham,
  ThuongHieu,
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

export { API_URL }
