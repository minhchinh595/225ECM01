"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
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
  GalleryVerticalEndIcon,
  LayoutDashboardIcon,
  HomeIcon,
  PackageIcon,
  TagsIcon,
  UsersIcon,
  ShoppingCartIcon,
  BarChart3Icon,
  TicketPercentIcon,
  UserCogIcon,
  ChevronRightIcon,
  ShapesIcon,
} from "lucide-react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const [userName, setUserName] = React.useState("Khách")
  const [email, setEmail] = React.useState("guest@example.com")

  React.useEffect(() => {
    const user = getStoredUser()
    if (!user) return
    setUserName(user.hoTen?.trim() || user.tenDangNhap)
    setEmail(user.email)
  }, [])

  const isActive = (url: string) => pathname === url

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="px-2 pt-2">
          <Link href="/" className="block">
            <TeamSwitcher
              teams={[
                {
                  name: "Thương Mại",
                  logo: <GalleryVerticalEndIcon />,
                  plan: "Quản trị hệ thống",
                },
              ]}
            />
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* ── Bảng điều khiển ── */}
        <SidebarGroup>
          <SidebarGroupLabel>Bảng điều khiển</SidebarGroupLabel>
          <SidebarMenu>
            {/* Tổng quan — collapsible */}
            <Collapsible
              asChild
              defaultOpen={pathname.startsWith("/dashboard")}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip="Tổng quan">
                    <LayoutDashboardIcon />
                    <span>Tổng quan</span>
                    <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isActive("/dashboard")}>
                        <Link href="/dashboard">
                          <span>Bàn làm việc</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isActive("/")}>
                        <Link href="/">
                          <span>Trang chủ</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>

            {/* Danh mục — collapsible */}
            <Collapsible
              asChild
              defaultOpen={
                pathname.startsWith("/dashboard/san-pham") ||
                pathname.startsWith("/dashboard/thuong-hieu")
              }
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip="Danh mục">
                    <ShapesIcon />
                    <span>Danh mục</span>
                    <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isActive("/dashboard/san-pham")}>
                        <Link href="/dashboard/san-pham">
                          <span>Sản phẩm</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isActive("/dashboard/thuong-hieu")}>
                        <Link href="/dashboard/thuong-hieu">
                          <span>Thương hiệu</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>

        {/* ── Quản lý ── */}
        <SidebarGroup>
          <SidebarGroupLabel>Quản lý</SidebarGroupLabel>
          <SidebarMenu>
            {[
              {
                title: "Quản lý đơn hàng",
                url: "/dashboard/don-hang",
                icon: <ShoppingCartIcon />,
              },
              {
                title: "Quản lý doanh thu",
                url: "/dashboard/doanh-thu",
                icon: <BarChart3Icon />,
              },
              {
                title: "Mã giảm giá",
                url: "/dashboard/ma-giam-gia",
                icon: <TicketPercentIcon />,
              },
              {
                title: "Tài khoản người dùng",
                url: "/dashboard/nguoi-dung",
                icon: <UsersIcon />,
              },
            ].map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isActive(item.url)}
                >
                  <Link href={item.url}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

            {/* More — Cập nhật thông tin */}
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Cập nhật thông tin"
                isActive={isActive("/dashboard/thong-tin")}
              >
                <Link href="/dashboard/thong-tin">
                  <UserCogIcon />
                  <span>Cập nhật thông tin</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={{ name: userName, email, avatar: "" }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
