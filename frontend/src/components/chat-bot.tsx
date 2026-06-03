"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircleIcon, XIcon, SendHorizonalIcon, SparklesIcon } from "lucide-react"

interface Message {
  role: "user" | "bot"
  text: string
}

interface ProductDetail {
  ten: string
  moTa: string
  moTaChiTiet?: string
  gia: string
  chatLieu?: string
  mauSac: string
  size: string
  thuongHieu: string
  baoQuan?: string
  phuHop?: string
}

// Dữ liệu sản phẩm chi tiết cho chatbot
const PRODUCT_DATA: Record<string, ProductDetail> = {
  "áo dài lụa xanh ngọc": {
    ten: "Áo Dài Lụa Xanh Ngọc",
    moTa: "Áo dài lụa xanh ngọc sang trọng, mềm mại, phù hợp sự kiện trang trọng.",
    moTaChiTiet: "Áo dài được may từ lụa tơ tằm cao cấp, màu xanh ngọc quý phái. Cổ áo cao 4cm, tay dài, thân áo ôm nhẹ tôn dáng. Họa tiết thêu tay tinh xảo.",
    gia: "790,000₫",
    chatLieu: "Lụa tơ tằm cao cấp",
    mauSac: "Xanh ngọc",
    size: "S, M, L, XL",
    thuongHieu: "Local Brand",
    baoQuan: "Giặt tay nhẹ nhàng, không dùng chất tẩy mạnh, phơi nơi thoáng mát",
    phuHop: "Sự kiện trang trọng, lễ hội, chụp ảnh cưới",
  },
  "áo dài lụa hoa đào": {
    ten: "Áo Dài Lụa Hoa Đào",
    moTa: "Áo dài lụa in họa tiết hoa đào tinh tế, nhẹ nhàng và nữ tính.",
    moTaChiTiet: "Chất lụa mềm mịn, in họa tiết hoa đào Nhật Tân. Tay lỡ thanh lịch, phối khăn voan cùng tông.",
    gia: "850,000₫",
    chatLieu: "Lụa in họa tiết",
    mauSac: "Kem hoa đào",
    size: "S, M, L",
    thuongHieu: "Local Brand",
    baoQuan: "Giặt khô hoặc giặt tay, ủi ở nhiệt độ thấp",
    phuHop: "Dạo phố, du lịch, chụp ảnh",
  },
  "áo dài trắng học sinh": {
    ten: "Áo Dài Trắng Học Sinh",
    moTa: "Áo dài trắng tinh khôi phù hợp học sinh, sinh viên.",
    moTaChiTiet: "Chất vải cotton lụa thoáng mát, form dáng chuẩn học sinh. Cổ sen cao, tay dài, eo ôm nhẹ.",
    gia: "550,000₫",
    chatLieu: "Cotton lụa cao cấp",
    mauSac: "Trắng",
    size: "S, M, L, XL",
    thuongHieu: "Local Brand",
    baoQuan: "Ngâm nước lạnh trước khi giặt, tránh ánh nắng trực tiếp",
    phuHop: "Đồng phục học sinh, sinh viên, chụp kỷ yếu",
  },
  "áo dài cách tân hoa nhí": {
    ten: "Áo Dài Cách Tân Hoa Nhí",
    moTa: "Áo dài cách tân trẻ trung với họa tiết hoa nhí nhẹ nhàng.",
    moTaChiTiet: "Thiết kế cách tân với tay ngắn, cổ thuyền hiện đại. Chất lụa mềm mại, in họa tiết hoa nhí tinh tế.",
    gia: "690,000₫",
    chatLieu: "Lụa in họa tiết",
    mauSac: "Kem hoa nhí",
    size: "S, M, L",
    thuongHieu: "Local Brand",
    baoQuan: "Giặt tay, không vắt mạnh, phơi trong bóng râm",
    phuHop: "Dạo phố, cà phê, du lịch, mặc hàng ngày",
  },
  "áo dài thêu cổ điển": {
    ten: "Áo Dài Thêu Cổ Điển",
    moTa: "Áo dài thêu họa tiết cổ điển, phù hợp sự kiện trang trọng.",
    moTaChiTiet: "Áo dài được thêu tay hoàn toàn với họa tiết cổ điển tinh xảo. Chất liệu gấm cao cấp, đứng form.",
    gia: "920,000₫",
    chatLieu: "Gấm cao cấp, thêu tay",
    mauSac: "Đỏ đô",
    size: "S, M, L",
    thuongHieu: "Local Brand",
    baoQuan: "Giặt khô chuyên nghiệp, bảo quản trong túi vải",
    phuHop: "Đám cưới, lễ hội, sự kiện quan trọng",
  },
  "áo dài minimal trắng kem": {
    ten: "Áo Dài Minimal Trắng Kem",
    moTa: "Áo dài tối giản màu trắng kem, thanh lịch và dễ mặc.",
    moTaChiTiet: "Thiết kế minimal không họa tiết, tập trung vào đường cắt may tinh tế. Màu trắng kem dễ phối đồ.",
    gia: "650,000₫",
    chatLieu: "Lụa mờ đục cao cấp",
    mauSac: "Trắng kem",
    size: "S, M, L",
    thuongHieu: "Local Brand",
    baoQuan: "Giặt nhẹ tay, ủi ở chế độ lụa",
    phuHop: "Sự kiện bán trang trọng, tiệc nhẹ, chụp ảnh",
  },
  "áo dài cưới đính ngọc": {
    ten: "Áo Dài Cưới Đính Ngọc",
    moTa: "Áo dài cưới cao cấp đính ngọc trai, lộng lẫy cho cô dâu.",
    moTaChiTiet: "Áo dài cưới được đính kết ngọc trai thật và pha lê Swarovski. Tay áo ren hoa, tà áo dài thướt tha.",
    gia: "1,200,000₫",
    chatLieu: "Lụa cao cấp, đính ngọc trai thật",
    mauSac: "Trắng ngọc",
    size: "S, M, L",
    thuongHieu: "Local Brand",
    baoQuan: "Giặt khô chuyên nghiệp, bảo quản trong hộp riêng",
    phuHop: "Đám cưới, tiệc cưới, chụp ảnh cưới",
  },
  "nón lá truyền thống": {
    ten: "Nón Lá Truyền Thống",
    moTa: "Nón lá truyền thống Việt Nam, nhẹ và bền.",
    gia: "180,000₫",
    mauSac: "Tự nhiên",
    size: "Một cỡ",
    thuongHieu: "Local Brand",
  },
  "nón lá thêu hoa": {
    ten: "Nón Lá Thêu Hoa",
    moTa: "Nón lá thêu họa tiết hoa tinh tế, độc đáo.",
    gia: "250,000₫",
    mauSac: "Tự nhiên + thêu",
    size: "Một cỡ",
    thuongHieu: "Local Brand",
  },
  "nón lá quai lụa": {
    ten: "Nón Lá Quai Lụa",
    moTa: "Nón lá quai lụa mềm mại, thanh lịch.",
    gia: "220,000₫",
    mauSac: "Tự nhiên + lụa hồng",
    size: "Một cỡ",
    thuongHieu: "Local Brand",
  },
  "nón lá vintage": {
    ten: "Nón Lá Vintage",
    moTa: "Nón lá phong cách vintage hoài cổ.",
    gia: "200,000₫",
    mauSac: "Nâu vintage",
    size: "Một cỡ",
    thuongHieu: "Local Brand",
  },
  "túi cói truyền thống": {
    ten: "Túi Cói Truyền Thống",
    moTa: "Túi cói đan tay truyền thống, bền đẹp và thân thiện môi trường.",
    gia: "290,000₫",
    mauSac: "Tự nhiên",
    size: "30x25cm",
    thuongHieu: "Local Brand",
  },
  "túi lụa tối giản": {
    ten: "Túi Lụa Tối Giản",
    moTa: "Túi lụa tối giản, nhẹ nhàng và thanh lịch.",
    gia: "350,000₫",
    mauSac: "Kem, Đen",
    size: "25x20cm",
    thuongHieu: "Local Brand",
  },
  "túi clutch ngọc trai": {
    ten: "Túi Clutch Ngọc Trai",
    moTa: "Túi clutch đính ngọc trai cao cấp, sang trọng.",
    gia: "420,000₫",
    mauSac: "Trắng ngọc",
    size: "20x15cm",
    thuongHieu: "Local Brand",
  },
  "túi vintage gam": {
    ten: "Túi Vintage Gấm",
    moTa: "Túi gấm phong cách vintage, hoa văn cổ điển.",
    gia: "320,000₫",
    mauSac: "Đỏ gấm, Xanh gấm",
    size: "25x20cm",
    thuongHieu: "Local Brand",
  },
  "giày sneaker trắng": {
    ten: "Giày Sneaker Trắng",
    moTa: "Giày sneaker trắng phong cách thể thao, thoải mái.",
    gia: "450,000₫",
    mauSac: "Trắng",
    size: "36-42",
    thuongHieu: "Local Brand",
  },
  "guốc gỗ truyền thống": {
    ten: "Guốc Gỗ Truyền Thống",
    moTa: "Guốc gỗ truyền thống Việt Nam, mộc mạc và duyên dáng.",
    gia: "320,000₫",
    mauSac: "Nâu gỗ",
    size: "36-40",
    thuongHieu: "Local Brand",
  },
  "guốc thêu hoa": {
    ten: "Guốc Thêu Hoa",
    moTa: "Guốc thêu họa tiết hoa tinh tế, nữ tính.",
    gia: "380,000₫",
    mauSac: "Trắng thêu hoa",
    size: "36-40",
    thuongHieu: "Local Brand",
  },
  "cao gót nude": {
    ten: "Cao Gót Nude",
    moTa: "Giày cao gót màu nude thanh lịch, phù hợp mọi trang phục.",
    gia: "520,000₫",
    mauSac: "Nude",
    size: "36-40",
    thuongHieu: "Local Brand",
  },
  "sandal ngọc trai": {
    ten: "Sandal Ngọc Trai",
    moTa: "Sandal đính ngọc trai cao cấp, sang trọng và thoải mái.",
    gia: "480,000₫",
    mauSac: "Trắng kem",
    size: "36-40",
    thuongHieu: "Local Brand",
  },
  "vòng tay ngọc trai": {
    ten: "Vòng Tay Ngọc Trai",
    moTa: "Vòng tay ngọc trai tinh tế, sang trọng.",
    gia: "350,000₫",
    mauSac: "Trắng ngọc",
    size: "Dài 18cm",
    thuongHieu: "Local Brand",
  },
  "vòng tay tối giản": {
    ten: "Vòng Tay Tối Giản",
    moTa: "Vòng tay bạc thiết kế tối giản, hiện đại.",
    gia: "180,000₫",
    mauSac: "Bạc",
    size: "Dài 17cm",
    thuongHieu: "Local Brand",
  },
  "vòng tay vintage": {
    ten: "Vòng Tay Vintage",
    moTa: "Vòng tay phong cách vintage hoài cổ.",
    gia: "250,000₫",
    mauSac: "Đồng cổ",
    size: "Dài 18cm",
    thuongHieu: "Local Brand",
  },
  "vòng tay lụa đỏ": {
    ten: "Vòng Tay Lụa Đỏ",
    moTa: "Vòng tay lụa đỏ may mắn, phong thủy.",
    gia: "120,000₫",
    mauSac: "Đỏ",
    size: "Dài 20cm",
    thuongHieu: "Local Brand",
  },
  "vòng tay bạc": {
    ten: "Vòng Tay Bạc",
    moTa: "Vòng tay bạc cao cấp, tinh tế.",
    gia: "280,000₫",
    mauSac: "Bạc",
    size: "Dài 18cm",
    thuongHieu: "Local Brand",
  },
  "khăn lụa pastel": {
    ten: "Khăn Lụa Pastel",
    moTa: "Khăn lụa màu pastel nhẹ nhàng, mềm mại.",
    gia: "280,000₫",
    mauSac: "Hồng pastel, Xanh pastel",
    size: "90x90cm",
    thuongHieu: "Local Brand",
  },
  "khăn lụa đỏ truyền thống": {
    ten: "Khăn Lụa Đỏ Truyền Thống",
    moTa: "Khăn lụa đỏ truyền thống, may mắn và sang trọng.",
    gia: "300,000₫",
    mauSac: "Đỏ",
    size: "100x100cm",
    thuongHieu: "Local Brand",
  },
  "khăn lụa luxury": {
    ten: "Khăn Lụa Luxury",
    moTa: "Khăn lụa cao cấp nhập khẩu, sang trọng.",
    gia: "550,000₫",
    mauSac: "Vàng gold, Bạc",
    size: "100x100cm",
    thuongHieu: "Local Brand",
  },
  "khăn lụa thêu hoa": {
    ten: "Khăn Lụa Thêu Hoa",
    moTa: "Khăn lụa thêu hoa tinh tế, độc đáo.",
    gia: "380,000₫",
    mauSac: "Trắng thêu hoa",
    size: "90x90cm",
    thuongHieu: "Local Brand",
  },
  "khăn lụa công sở": {
    ten: "Khăn Lụa Công Sở",
    moTa: "Khăn lụa phong cách công sở thanh lịch.",
    gia: "250,000₫",
    mauSac: "Xanh navy, Đen",
    size: "80x80cm",
    thuongHieu: "Local Brand",
  },
}

// Phản hồi cho các danh mục
const CATEGORY_RESPONSES: Record<string, string> = {
  "áo dài": "🌸 **Danh mục Áo Dài** - Biểu tượng văn hóa Việt Nam\n\nChúng tôi có các mẫu:\n• Áo dài lụa xanh ngọc - 790,000₫\n• Áo dài lụa hoa đào - 850,000₫\n• Áo dài trắng học sinh - 550,000₫\n• Áo dài cách tân hoa nhí - 690,000₫\n• Áo dài thêu cổ điển - 920,000₫\n• Áo dài minimal trắng kem - 650,000₫\n• Áo dài cưới đính ngọc - 1,200,000₫\n\nBạn muốn tìm hiểu thêm về sản phẩm nào không?",
  "nón lá": "🌿 **Danh mục Nón Lá** - Nét duyên Việt\n\nChúng tôi có các mẫu:\n• Nón lá truyền thống - 180,000₫\n• Nón lá thêu hoa - 250,000₫\n• Nón lá quai lụa - 220,000₫\n• Nón lá vintage - 200,000₫\n\nBạn muốn biết thêm chi tiết về mẫu nào?",
  "túi": "👜 **Danh mục Túi** - Phụ kiện thời trang\n\nChúng tôi có các mẫu:\n• Túi cói truyền thống - 290,000₫\n• Túi lụa tối giản - 350,000₫\n• Túi clutch ngọc trai - 420,000₫\n• Túi vintage gấm - 320,000₫\n\nBạn muốn xem thông tin chi tiết túi nào?",
  "giày": "👟 **Danh mục Giày** - Phong cách từ đôi chân\n\nChúng tôi có các mẫu:\n• Giày sneaker trắng - 450,000₫\n• Guốc gỗ truyền thống - 320,000₫\n• Guốc thêu hoa - 380,000₫\n• Cao gót nude - 520,000₫\n• Sandal ngọc trai - 480,000₫\n\nBạn thích mẫu giày nào?",
  "trang sức": "💎 **Danh mục Trang Sức & Khăn Lụa**\n\n**Trang sức:**\n• Vòng tay ngọc trai - 350,000₫\n• Vòng tay bạc - 280,000₫\n• Vòng tay vintage - 250,000₫\n• Vòng tay lụa đỏ - 120,000₫\n• Vòng tay tối giản - 180,000₫\n\n**Khăn lụa:**\n• Khăn lụa pastel - 280,000₫\n• Khăn lụa đỏ truyền thống - 300,000₫\n• Khăn lụa luxury - 550,000₫\n• Khăn lụa thêu hoa - 380,000₫\n• Khăn lụa công sở - 250,000₫\n\nBạn muốn xem trang sức hay khăn lụa?",
  "khăn lụa": "💎 **Danh mục Khăn Lụa**\n\n• Khăn lụa pastel - 280,000₫\n• Khăn lụa đỏ truyền thống - 300,000₫\n• Khăn lụa luxury - 550,000₫\n• Khăn lụa thêu hoa - 380,000₫\n• Khăn lụa công sở - 250,000₫\n\nBạn muốn biết thêm về khăn nào?",
}

function findProduct(input: string): string | null {
  const lower = input.toLowerCase().trim()

  for (const [key, product] of Object.entries(PRODUCT_DATA)) {
    if (lower.includes(key)) {
      let response = `✨ **${product.ten}**\n`
      response += `\n📝 **Mô tả:** ${product.moTa}`
      if (product.moTaChiTiet) response += `\n🔍 **Chi tiết:** ${product.moTaChiTiet}`
      response += `\n💰 **Giá:** ${product.gia}`
      if (product.chatLieu) response += `\n🧵 **Chất liệu:** ${product.chatLieu}`
      response += `\n🎨 **Màu sắc:** ${product.mauSac}`
      response += `\n📏 **Kích cỡ:** ${product.size}`
      response += `\n🏷️ **Thương hiệu:** ${product.thuongHieu}`
      if (product.phuHop) response += `\n🎯 **Phù hợp:** ${product.phuHop}`
      if (product.baoQuan) response += `\n🧺 **Bảo quản:** ${product.baoQuan}`
      response += `\n\nBạn có muốn đặt mua sản phẩm này không? Nếu cần tư vấn thêm, cứ hỏi nhé! 😊`
      return response
    }
  }
  return null
}

function findCategory(input: string): string | null {
  const lower = input.toLowerCase().trim()

  if (lower.includes("áo dài") || lower.includes("ao dai")) return "áo dài"
  if (lower.includes("nón lá") || lower.includes("non la") || lower.includes("nón") || lower.includes("non")) return "nón lá"
  if (lower.includes("túi") || lower.includes("tui") || lower.includes("bag")) return "túi"
  if (lower.includes("giày") || lower.includes("giay") || lower.includes("dép") || lower.includes("dep") || lower.includes("guốc") || lower.includes("guoc")) return "giày"
  if (lower.includes("trang sức") || lower.includes("trang suc") || lower.includes("vòng tay") || lower.includes("vong tay") || lower.includes("khăn") || lower.includes("khan")) {
    if (lower.includes("khăn") || lower.includes("khan")) return "khăn lụa"
    return "trang sức"
  }

  return null
}

const GREETINGS = [
  "Chào bạn! 👋 Mình là trợ lý ảo của Visilk. Bạn cần tư vấn về sản phẩm nào?",
  "Xin chào! 😊 Rất vui được hỗ trợ bạn. Bạn muốn tìm hiểu về áo dài, nón lá, túi, giày hay trang sức?",
  "Chào bạn! 🌸 Mình có thể giúp gì cho bạn? Hãy hỏi mình về các sản phẩm nhé!",
]

const FALLBACK_RESPONSES = [
  "Xin lỗi, mình chưa hiểu câu hỏi của bạn. Bạn có thể hỏi về:\n• Áo dài (lụa xanh ngọc, hoa đào, trắng học sinh...)\n• Nón lá (truyền thống, thêu hoa, quai lụa...)\n• Túi (cói, lụa, clutch, vintage...)\n• Giày (sneaker, guốc, cao gót, sandal...)\n• Trang sức & Khăn lụa (vòng tay, khăn lụa...)\n\nBạn muốn tư vấn về gì ạ?",
  "Mình chưa hiểu ý bạn lắm. Bạn thử hỏi cụ thể tên sản phẩm hoặc danh mục nhé!\n\nVí dụ: \"Giá áo dài lụa xanh ngọc bao nhiêu?\" hoặc \"Có những mẫu nón lá nào?\"",
  "Rất tiếc, mình chưa có thông tin về điều này. Bạn muốn xem các sản phẩm của Visilk không?",
]

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  function handleToggle() {
    if (!isOpen && messages.length === 0) {
      // Mở lần đầu - gửi lời chào
      const greeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)]
      setMessages([{ role: "bot", text: greeting }])
    }
    setIsOpen(!isOpen)
  }

  function handleSend() {
    const text = input.trim()
    if (!text) return

    setMessages((prev) => [...prev, { role: "user", text }])
    setInput("")

    // Xử lý phản hồi
    setTimeout(() => {
      const lower = text.toLowerCase()

      // Kiểm tra chào hỏi
      if (lower.includes("chào") || lower.includes("hello") || lower.includes("hi") || lower.includes("xin chào")) {
        const greeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)]
        setMessages((prev) => [...prev, { role: "bot", text: greeting }])
        return
      }

      // Cảm ơn / tạm biệt
      if (lower.includes("cảm ơn") || lower.includes("cam on") || lower.includes("thanks")) {
        setMessages((prev) => [...prev, { role: "bot", text: "Cảm ơn bạn! 😊 Nếu cần hỗ trợ thêm, cứ chat với mình nhé. Chúc bạn một ngày tốt lành!" }])
        return
      }
      if (lower.includes("tạm biệt") || lower.includes("tam biet") || lower.includes("bye")) {
        setMessages((prev) => [...prev, { role: "bot", text: "Tạm biệt bạn! 🌸 Chúc bạn mua sắm vui vẻ tại Visilk. Hẹn gặp lại!" }])
        return
      }

      // Hỏi giá
      if (lower.includes("giá") || lower.includes("gia") || lower.includes("bao nhiêu") || lower.includes("bao nhieu") || lower.includes("mấy tiền") || lower.includes("may tien")) {
        const productResult = findProduct(text)
        if (productResult) {
          setMessages((prev) => [...prev, { role: "bot", text: productResult }])
          return
        }
        const catResult = findCategory(text)
        if (catResult && CATEGORY_RESPONSES[catResult]) {
          setMessages((prev) => [...prev, { role: "bot", text: `Sản phẩm trong danh mục này:\n${CATEGORY_RESPONSES[catResult]}` }])
          return
        }
      }

      // Tìm sản phẩm cụ thể
      const productResult = findProduct(text)
      if (productResult) {
        setMessages((prev) => [...prev, { role: "bot", text: productResult }])
        return
      }

      // Tìm danh mục
      const catResult = findCategory(text)
      if (catResult && CATEGORY_RESPONSES[catResult]) {
        setMessages((prev) => [...prev, { role: "bot", text: CATEGORY_RESPONSES[catResult] }])
        return
      }

      // Tư vấn / giới thiệu
      if (lower.includes("tư vấn") || lower.includes("tu van") || lower.includes("giới thiệu") || lower.includes("gioi thieu") || lower.includes("gợi ý") || lower.includes("goi y") || lower.includes("sản phẩm") || lower.includes("san pham")) {
        setMessages((prev) => [...prev, {
          role: "bot",
          text: "🌿 **Visilk** - Thương hiệu thời trang truyền thống Việt Nam\n\nChúng tôi có các danh mục:\n• 🌸 **Áo Dài** - Từ 550,000₫ - Biểu tượng văn hóa Việt\n• 🌿 **Nón Lá** - Từ 180,000₫ - Nét duyên Việt\n• 👜 **Túi** - Từ 290,000₫ - Phụ kiện thời trang\n• 👟 **Giày** - Từ 320,000₫ - Phong cách từ đôi chân\n• 💎 **Trang Sức & Khăn Lụa** - Từ 120,000₫\n\nBạn muốn tìm hiểu danh mục nào?"
        }])
        return
      }

      // Fallback
      const fallback = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)]
      setMessages((prev) => [...prev, { role: "bot", text: fallback }])
    }, 500)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat button */}
      <button
        onClick={handleToggle}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-violet-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        aria-label="Chat hỗ trợ"
      >
        {isOpen ? <XIcon className="size-6" /> : <MessageCircleIcon className="size-6" />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl border border-stone-200 bg-white shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-violet-500 p-4 text-white">
            <div className="flex items-center gap-2">
              <SparklesIcon className="size-5" />
              <span className="font-semibold text-sm">Visilk AI - Trợ lý thời trang</span>
            </div>
            <p className="text-xs text-white/70 mt-0.5">Hỏi mình về sản phẩm nhé! 🌸</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[400px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-stone-900 text-white rounded-br-md"
                      : "bg-stone-100 text-stone-800 rounded-bl-md"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-stone-100 p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập câu hỏi..."
                className="flex-1 h-10 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none focus:border-stone-400 focus:bg-white transition"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-white transition hover:bg-stone-700 disabled:opacity-40"
              >
                <SendHorizonalIcon className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}