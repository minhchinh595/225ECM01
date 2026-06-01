import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { mainProduct, accessoryProduct, modelDescription } = await request.json()

    const HF_TOKEN = process.env.HUGGINGFACE_TOKEN
    if (!HF_TOKEN) {
      return NextResponse.json({
        success: false,
        error: "missing_token",
        message: "Vui lòng cấu hình HUGGINGFACE_TOKEN trong file .env.local"
      }, { status: 400 })
    }

    // Xây dựng prompt mô tả
    const prompt = buildPrompt(mainProduct, accessoryProduct, modelDescription)

    console.log("🎯 Prompt:", prompt)
    console.log("🔑 Token (first 10 chars):", HF_TOKEN.substring(0, 10) + "...")

    // Gọi Hugging Face Inference API
    const response = await fetch(
      "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
        signal: AbortSignal.timeout(60000), // timeout 60s
      }
    )

    console.log("📡 Response status:", response.status)

    if (!response.ok) {
      let errorText = ""
      try {
        errorText = await response.text()
      } catch {
        errorText = "Unknown error"
      }
      console.error("❌ HF API error:", response.status, errorText.substring(0, 200))

      if (response.status === 503 && errorText.includes("loading")) {
        return NextResponse.json({
          success: false,
          loading: true,
          message: "Model đang khởi động. Thử lại sau 30 giây."
        })
      }

      if (response.status === 401 || response.status === 403) {
        return NextResponse.json({
          success: false,
          error: "invalid_token",
          message: "Token không hợp lệ hoặc hết hạn. Vui lòng tạo token mới tại https://huggingface.co/settings/tokens"
        })
      }

      return NextResponse.json({
        success: false,
        error: `HTTP ${response.status}: ${errorText.substring(0, 300)}`
      })
    }

    // Đọc response dạng blob (ảnh)
    const contentType = response.headers.get("content-type") || ""
    console.log("📦 Content-Type:", contentType)

    if (contentType.includes("application/json")) {
      const json = await response.json()
      console.error("❌ JSON error:", json)
      return NextResponse.json({
        success: false,
        error: JSON.stringify(json).substring(0, 300)
      })
    }

    const blob = await response.blob()
    const arrayBuffer = await blob.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString("base64")

    return NextResponse.json({
      success: true,
      imageUrl: `data:image/webp;base64,${base64}`,
      prompt: prompt,
    })
  } catch (error: any) {
    console.error("💥 Mix-match error:", error?.message || error)

    if (error?.name === "TimeoutError" || error?.name === "AbortError") {
      return NextResponse.json({
        success: false,
        error: "timeout",
        message: "Yêu cầu tới Hugging Face bị timeout (60s). Model có thể quá tải, thử lại sau."
      })
    }

    if (error?.cause === "ERR_NETWORK" || error?.message?.includes("fetch")) {
      return NextResponse.json({
        success: false,
        error: "network_error",
        message: "Không thể kết nối tới Hugging Face. Kiểm tra kết nối internet."
      })
    }

    return NextResponse.json({
      success: false,
      error: error?.message || "Loi khong xac dinh"
    })
  }
}

function buildPrompt(
  mainProduct: { ten: string; moTa?: string; mau?: string } | null,
  accessoryProduct?: { ten: string; moTa?: string; mau?: string } | null,
  modelDescription?: string
): string {
  const parts: string[] = []

  if (modelDescription) {
    parts.push(modelDescription)
  } else {
    parts.push("A young beautiful Vietnamese woman with long black hair, elegant appearance, professional fashion model, full body shot")
  }

  if (mainProduct) {
    parts.push(`wearing ${mainProduct.ten}`)
    if (mainProduct.mau) parts.push(`in ${mainProduct.mau} color`)
    if (mainProduct.moTa) parts.push(mainProduct.moTa)
  }

  if (accessoryProduct?.ten) {
    parts.push(`with matching ${accessoryProduct.ten}`)
    if (accessoryProduct.mau) parts.push(`in ${accessoryProduct.mau}`)
    if (accessoryProduct.moTa) parts.push(accessoryProduct.moTa)
  }

  parts.push("studio lighting, white background, fashion photography, Vietnamese traditional fashion, sharp details, realistic photo, high quality")

  return parts.join(", ")
}