"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Bàn làm việc",
  "/dashboard/san-pham": "Sản phẩm",
  "/dashboard/thuong-hieu": "Thương hiệu",
  "/dashboard/don-hang": "Quản lý đơn hàng",
  "/dashboard/doanh-thu": "Quản lý doanh thu",
  "/dashboard/ma-giam-gia": "Mã giảm giá",
  "/dashboard/nguoi-dung": "Tài khoản người dùng",
  "/dashboard/thong-tin": "Cập nhật thông tin",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const pageTitle = PAGE_TITLES[pathname] ?? "Dashboard"

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[linear-gradient(180deg,#fcfaf6_0%,#f5ede0_100%)] min-h-svh">
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-stone-200/70 bg-white/80 backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild>
                    <Link href="/" className="text-stone-500 hover:text-stone-800">
                      Trang chủ
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild>
                    <Link href="/dashboard" className="text-stone-500 hover:text-stone-800">
                      Dashboard
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {pathname !== "/dashboard" && (
                  <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
