"use server"

import { Client } from "@gradio/client"

export async function runTryOn(
  modelImageUrl: string,
  garmentImageUrl: string,
): Promise<{ output: string } | { error: string }> {
  console.log("[TryOn] model:", modelImageUrl)
  console.log("[TryOn] garment:", garmentImageUrl)

  try {
    // Tải ảnh về dạng blob
    const [modelRes, garmentRes] = await Promise.all([
      fetch(modelImageUrl),
      fetch(garmentImageUrl),
    ])

    if (!modelRes.ok) return { error: `Không tải được ảnh người mẫu (${modelRes.status})` }
    if (!garmentRes.ok) return { error: `Không tải được ảnh trang phục (${garmentRes.status})` }

    const [modelBlob, garmentBlob] = await Promise.all([
      modelRes.blob(),
      garmentRes.blob(),
    ])

    console.log("[TryOn] Blobs loaded, model:", modelBlob.size, "garment:", garmentBlob.size)

    // Kết nối HuggingFace Space CatVTON
    console.log("[TryOn] Connecting to Space...")
    const client = await Client.connect("zhengchong/CatVTON")
    console.log("[TryOn] Connected. Calling predict...")

    const result = await client.predict("/submit", {
      person_image: modelBlob,
      cloth_image: garmentBlob,
      cloth_type: "overall",
      num_inference_steps: 50,
      guidance_scale: 2.5,
      seed: 42,
      show_type: "result only",
    })

    console.log("[TryOn] Result:", JSON.stringify(result.data))

    const data = result.data as Array<{ url?: string; path?: string } | string>
    const first = data?.[0]
    let imageUrl: string | undefined

    if (typeof first === "string") {
      imageUrl = first
    } else if (first && typeof first === "object") {
      imageUrl = first.url ?? first.path
    }

    if (!imageUrl) return { error: "Không lấy được ảnh kết quả từ API" }
    return { output: imageUrl }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error("[TryOn] Error:", msg)
    return { error: `Lỗi: ${msg}` }
  }
}
