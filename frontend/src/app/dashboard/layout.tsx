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
      {/* Background full màn hình — dưới cả sidebar lẫn content */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(/bg_admin.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <AppSidebar />
      <SidebarInset className="relative min-h-svh bg-transparent">
        <div className="relative z-10 flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-white/20 bg-white/40 backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1 text-stone-400 hover:text-stone-900" />
              <Separator orientation="vertical" className="mr-2 h-4 bg-stone-200" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild>
                      <Link href="/" className="text-sm text-stone-400 hover:text-stone-700 transition-colors">
                        Trang chủ
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden text-stone-300 md:block" />
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild>
                      <Link href="/dashboard" className="text-sm text-stone-400 hover:text-stone-700 transition-colors">
                        Dashboard
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {pathname !== "/dashboard" && (
                    <>
                      <BreadcrumbSeparator className="hidden text-stone-300 md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbPage className="text-sm font-medium text-stone-700">{pageTitle}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}