"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCartIcon } from "lucide-react"
import { getCartCount } from "@/lib/cart"
import { getStoredUser } from "@/lib/auth"

export function CartIcon() {
  const router = useRouter()
  const [count, setCount] = useState(0)

  useEffect(() => {
    setCount(getCartCount())
    const handler = () => setCount(getCartCount())
    window.addEventListener("cart-updated", handler)
    return () => window.removeEventListener("cart-updated", handler)
  }, [])

  function handleClick() {
    const user = getStoredUser()
    if (!user) {
      router.push("/login")
    } else {
      router.push("/gio-hang")
    }
  }

  return (
    <button
      onClick={handleClick}
      className="relative flex h-9 w-9 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
      aria-label="Giỏ hàng"
    >
      <ShoppingCartIcon className="size-[18px]" />
      {count > 0 && (
        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-stone-900 px-1 text-[9px] font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  )
}
