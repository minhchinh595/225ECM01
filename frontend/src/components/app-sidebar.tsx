"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { getStoredUser } from "@/lib/auth"
import {
  LayoutDashboardIcon,
  PackageIcon,
  UsersIcon,
  ShoppingCartIcon,
  BarChart3Icon,
  TicketPercentIcon,
  UserCogIcon,
  ChevronRightIcon,
  ShapesIcon,
  LogOutIcon,
} from "lucide-react"
import { clearStoredUser } from "@/lib/auth"
import { useRouter } from "next/navigation"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const router = useRouter()
  const [userName, setUserName] = React.useState("Khách")
  const [email, setEmail] = React.useState("guest@example.com")

  React.useEffect(() => {
    const user = getStoredUser()
    if (!user) return
    setUserName(user.hoTen?.trim() || user.tenDangNhap)
    setEmail(user.email)
  }, [])

  const isActive = (url: string) => pathname === url

  function handleLogout() {
    clearStoredUser()
    router.push("/")
  }

  const initials = userName.slice(0, 2).toUpperCase()

  return (
    <Sidebar
      collapsible="none"
      className="relative z-10 flex h-screen flex-col border-r border-white/20 bg-white/30 backdrop-blur-md sticky top-0 self-start"
      {...props}
    >
      {/* Header nhỏ gọn */}
      <div className="px-4 pb-2 pt-4">
        <Link href="/" className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
          <svg width="22" height="22" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="17" stroke="#5c4f3d" strokeWidth="1.5" />
            <path d="M11.5 13.5 L18 23 L24.5 13.5" stroke="#5c4f3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5c4f3d]">ViSilk Admin</span>
        </Link>
      </div>

      <SidebarContent className="px-2 flex-1 overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a09080] px-2">
            Bảng điều khiển
          </SidebarGroupLabel>
          <SidebarMenu>
            <Collapsible asChild defaultOpen={pathname.startsWith("/dashboard")} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="rounded-lg text-[#6b5e4e] hover:bg-[#d4c9bb] hover:text-[#3d3228] data-[active=true]:bg-[#d4c9bb] data-[active=true]:text-[#3d3228]">
                    <LayoutDashboardIcon className="size-4" />
                    <span className="text-sm">Tổng quan</span>
                    <ChevronRightIcon className="ml-auto size-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="border-l border-[#c4b8a8] ml-3">
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isActive("/dashboard")} className="text-[#6b5e4e] hover:text-[#3d3228] hover:bg-[#d4c9bb] data-[active=true]:bg-[#d4c9bb] data-[active=true]:text-[#3d3228] rounded-lg text-sm">
                        <Link href="/dashboard">Bàn làm việc</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isActive("/")} className="text-[#6b5e4e] hover:text-[#3d3228] hover:bg-[#d4c9bb] data-[active=true]:bg-[#d4c9bb] data-[active=true]:text-[#3d3228] rounded-lg text-sm">
                        <Link href="/">Trang chủ</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>

            <Collapsible asChild defaultOpen={pathname.startsWith("/dashboard/san-pham") || pathname.startsWith("/dashboard/thuong-hieu")} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="rounded-lg text-[#6b5e4e] hover:bg-[#d4c9bb] hover:text-[#3d3228] data-[active=true]:bg-[#d4c9bb] data-[active=true]:text-[#3d3228]">
                    <ShapesIcon className="size-4" />
                    <span className="text-sm">Danh mục</span>
                    <ChevronRightIcon className="ml-auto size-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="border-l border-[#c4b8a8] ml-3">
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isActive("/dashboard/san-pham")} className="text-[#6b5e4e] hover:text-[#3d3228] hover:bg-[#d4c9bb] data-[active=true]:bg-[#d4c9bb] data-[active=true]:text-[#3d3228] rounded-lg text-sm">
                        <Link href="/dashboard/san-pham">Sản phẩm</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isActive("/dashboard/thuong-hieu")} className="text-[#6b5e4e] hover:text-[#3d3228] hover:bg-[#d4c9bb] data-[active=true]:bg-[#d4c9bb] data-[active=true]:text-[#3d3228] rounded-lg text-sm">
                        <Link href="/dashboard/thuong-hieu">Thương hiệu</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a09080] px-2">
            Quản lý
          </SidebarGroupLabel>
          <SidebarMenu>
            {[
              { title: "Quản lý đơn hàng", url: "/dashboard/don-hang", icon: ShoppingCartIcon },
              { title: "Quản lý doanh thu", url: "/dashboard/doanh-thu", icon: BarChart3Icon },
              { title: "Mã giảm giá", url: "/dashboard/ma-giam-gia", icon: TicketPercentIcon },
              { title: "Tài khoản người dùng", url: "/dashboard/nguoi-dung", icon: UsersIcon },
              { title: "Cập nhật thông tin", url: "/dashboard/thong-tin", icon: UserCogIcon },
            ].map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.url)}
                  className="rounded-lg text-[#6b5e4e] hover:bg-[#d4c9bb] hover:text-[#3d3228] data-[active=true]:bg-[#d4c9bb] data-[active=true]:text-[#3d3228]"
                >
                  <Link href={item.url}>
                    <item.icon className="size-4" />
                    <span className="text-sm">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer — user info dưới cùng */}
      <SidebarFooter className="mt-auto border-t border-[#c4b8a8]/50 px-3 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#c4b8a8] text-[11px] font-bold text-[#3d3228]">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-[#3d3228]">{userName}</p>
            <p className="truncate text-[10px] text-[#a09080]">{email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#a09080] transition hover:bg-[#d4c9bb] hover:text-[#3d3228]"
            title="Đăng xuất"
          >
            <LogOutIcon className="size-3.5" />
          </button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
