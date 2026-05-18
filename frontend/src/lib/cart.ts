export type CartItem = {
  maSanPham: number
  tenSanPham: string
  gia: number
  hinhAnh?: string | null
  tenThuongHieu?: string | null
  soLuong: number
}

const CART_KEY = "visilk_cart"

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? "[]")
  } catch {
    return []
  }
}

export function saveCart(items: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export function addToCart(item: Omit<CartItem, "soLuong"> & { soLuong?: number }): void {
  const cart = getCart()
  const existing = cart.find((c) => c.maSanPham === item.maSanPham)
  if (existing) {
    existing.soLuong += item.soLuong ?? 1
  } else {
    cart.push({ ...item, soLuong: item.soLuong ?? 1 })
  }
  saveCart(cart)
  window.dispatchEvent(new Event("cart-updated"))
}

export function removeFromCart(maSanPham: number): void {
  const cart = getCart().filter((c) => c.maSanPham !== maSanPham)
  saveCart(cart)
  window.dispatchEvent(new Event("cart-updated"))
}

export function updateCartQty(maSanPham: number, soLuong: number): void {
  const cart = getCart()
  const item = cart.find((c) => c.maSanPham === maSanPham)
  if (item) {
    item.soLuong = soLuong
    if (item.soLuong <= 0) {
      removeFromCart(maSanPham)
      return
    }
  }
  saveCart(cart)
  window.dispatchEvent(new Event("cart-updated"))
}

export function clearCart(): void {
  saveCart([])
  window.dispatchEvent(new Event("cart-updated"))
}

export function getCartCount(): number {
  return getCart().reduce((sum, item) => sum + item.soLuong, 0)
}

export function getCartTotal(): number {
  return getCart().reduce((sum, item) => sum + item.gia * item.soLuong, 0)
}
