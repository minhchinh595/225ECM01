"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { getBrands, getCategories, getProducts, getUsers } from "@/lib/api"
import { getStoredUser } from "@/lib/auth"
import type { DanhMuc, NguoiDung, SanPham, ThuongHieu } from "@/lib/types"
import Link from "next/link"
import { PackageIcon, ShapesIcon, TagsIcon, UsersIcon } from "lucide-react"
import { useEffect, useState } from "react"

export default function Page() {
  const [products, setProducts] = useState<SanPham[]>([])
  const [categories, setCategories] = useState<DanhMuc[]>([])
  const [brands, setBrands] = useState<ThuongHieu[]>([])
  const [users, setUsers] = useState<NguoiDung[]>([])
  const [currentUser, setCurrentUser] = useState<NguoiDung | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    setCurrentUser(getStoredUser())

    let active = true
    async function loadDashboard() {
      try {
        const [productsData, categoriesData, brandsData, usersData] =
          await Promise.all([
            getProducts(),
            getCategories(),
            getBrands(),
            getUsers(),
          ])

        if (!active) {
          return
        }

        setProducts(productsData)
        setCategories(categoriesData)
        setBrands(brandsData)
        setUsers(usersData)
      } catch (loadError) {
        if (!active) {
          return
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Khong the tai dashboard",
        )
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      active = false
    }
  }, [])

  const stats = [
    {
      title: "San pham",
      value: products.length,
      icon: <PackageIcon className="size-5" />,
      tone: "bg-stone-950 text-white",
    },
    {
      title: "Danh muc",
      value: categories.length,
      icon: <ShapesIcon className="size-5" />,
      tone: "bg-amber-100 text-amber-900",
    },
    {
      title: "Thuong hieu",
      value: brands.length,
      icon: <TagsIcon className="size-5" />,
      tone: "bg-emerald-100 text-emerald-900",
    },
    {
      title: "Nguoi dung",
      value: users.length,
      icon: <UsersIcon className="size-5" />,
      tone: "bg-rose-100 text-rose-900",
    },
  ]

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[linear-gradient(180deg,#fcfaf6_0%,#f2eadf_100%)]">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-stone-200/80 bg-white/70 transition-[width,height] ease-linear backdrop-blur group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild>
                    <Link href="/">Storefront</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
          <section className="rounded-[2rem] border border-stone-200 bg-white/80 p-6 shadow-[0_24px_80px_rgba(88,62,39,0.08)] backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-stone-500">
                  Quan ly backend
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-stone-900">
                  {currentUser
                    ? `Xin chao, ${currentUser.tenDangNhap}.`
                    : "Dashboard dang ket noi backend."}
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-stone-600">
                  Trang nay dang goi cac API that de hien thi san pham, danh muc,
                  thuong hieu va nguoi dung. Ban co the dung no nhu man hinh test
                  contract frontend-backend.
                </p>
              </div>
              <Button asChild className="rounded-full bg-stone-900 px-6 text-white hover:bg-stone-800">
                <Link href="/">Mo trang san pham</Link>
              </Button>
            </div>
          </section>

          {error ? (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.title} className={`rounded-[1.75rem] border-none shadow-[0_18px_40px_rgba(96,74,44,0.08)] ${stat.tone}`}>
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] opacity-70">
                      {stat.title}
                    </p>
                    <p className="mt-3 text-4xl font-semibold">{loading ? "..." : stat.value}</p>
                  </div>
                  <div className="rounded-full bg-white/15 p-3">{stat.icon}</div>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <Card className="rounded-[1.75rem] border-none bg-white/85 shadow-[0_18px_40px_rgba(96,74,44,0.08)]">
              <CardHeader>
                <CardTitle>San pham moi ket noi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {products.slice(0, 6).map((product) => (
                  <div
                    key={product.maSanPham}
                    className="flex items-center justify-between rounded-2xl border border-stone-200 px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-stone-900">
                        {product.tenSanPham}
                      </p>
                      <p className="text-sm text-stone-500">
                        {product.tenDanhMuc} · {product.tenThuongHieu}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-rose-700">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(product.gia)}
                      </p>
                      <p className="text-sm text-stone-500">
                        Ton {product.soLuongTon}
                      </p>
                    </div>
                  </div>
                ))}
                {!loading && products.length === 0 ? (
                  <p className="text-sm text-stone-500">
                    Chua co san pham nao trong backend.
                  </p>
                ) : null}
              </CardContent>
            </Card>

            <div className="grid gap-6">
              <Card className="rounded-[1.75rem] border-none bg-white/85 shadow-[0_18px_40px_rgba(96,74,44,0.08)]">
                <CardHeader>
                  <CardTitle>Danh muc</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <span
                      key={category.maDanhMuc}
                      className="rounded-full bg-stone-100 px-3 py-2 text-sm text-stone-700"
                    >
                      {category.tenDanhMuc}
                    </span>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-[1.75rem] border-none bg-white/85 shadow-[0_18px_40px_rgba(96,74,44,0.08)]">
                <CardHeader>
                  <CardTitle>Nguoi dung gan day</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {users.slice(0, 5).map((user) => (
                    <div
                      key={user.maNguoiDung}
                      className="rounded-2xl border border-stone-200 px-4 py-3"
                    >
                      <p className="font-medium text-stone-900">
                        {user.tenDangNhap}
                      </p>
                      <p className="text-sm text-stone-500">{user.email}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
