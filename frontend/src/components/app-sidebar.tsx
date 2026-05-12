"use client"

import * as React from "react"

import Link from "next/link"
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { getStoredUser } from "@/lib/auth"
import {
  GalleryVerticalEndIcon,
  HomeIcon,
  Layers3Icon,
  PackageIcon,
  ShoppingBagIcon,
  TagsIcon,
  UsersIcon,
} from "lucide-react"

const baseData = {
  teams: [
    {
      name: "Web Thoi Trang",
      logo: <GalleryVerticalEndIcon />,
      plan: "Spring Boot + Next.js",
    },
  ],
  navMain: [
    {
      title: "Tong quan",
      url: "/dashboard",
      icon: <HomeIcon />,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
        },
        {
          title: "Trang chu",
          url: "/",
        },
      ],
    },
    {
      title: "Danh muc",
      url: "/dashboard",
      icon: <Layers3Icon />,
      items: [
        {
          title: "San pham",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Tai nguyen",
      url: "/dashboard",
      icon: <TagsIcon />,
      items: [
        {
          title: "Thuong hieu",
          url: "/dashboard",
        },
      ],
    },
  ],
  projects: [
    {
      name: "San pham",
      url: "/dashboard",
      icon: <PackageIcon />,
    },
    {
      name: "Nguoi dung",
      url: "/dashboard",
      icon: <UsersIcon />,
    },
    {
      name: "Ban hang",
      url: "/",
      icon: <ShoppingBagIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userName, setUserName] = React.useState("Khach")
  const [email, setEmail] = React.useState("guest@example.com")

  React.useEffect(() => {
    const user = getStoredUser()
    if (!user) {
      return
    }
    setUserName(user.tenDangNhap)
    setEmail(user.email)
  }, [])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="px-2 pt-2">
          <Link href="/" className="block">
            <TeamSwitcher teams={baseData.teams} />
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={baseData.navMain} />
        <NavProjects projects={baseData.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: userName,
            email,
            avatar: "",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
