"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BarChart3Icon } from "lucide-react"

export default function DoanhThuPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-stone-900">Quản lý doanh thu</h1>
        <p className="mt-1 text-sm text-stone-500">Thống kê và phân tích doanh thu theo thời gian.</p>
      </div>
      <Card className="rounded-[1.75rem] border-none bg-white/85 shadow-[0_12px_32px_rgba(96,74,44,0.08)]">
        <CardContent className="flex flex-col items-center gap-4 py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
            <BarChart3Icon className="size-8 text-emerald-700" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <p className="font-heading text-lg font-semibold text-stone-900">Chức năng đang phát triển</p>
            <p className="mt-1 text-sm text-stone-500">Báo cáo doanh thu sẽ sớm được ra mắt.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
