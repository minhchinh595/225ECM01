export const CATEGORY_SECTIONS = [
  {
    key: "ao-dai",
    image: "/lcb1.png",
    label: "Áo Dài",
    keywords: ["áo dài", "ao dai"],
    buttonLeft: "26.5%",
  },
  {
    key: "non-la",
    image: "/lcb2.png",
    label: "Nón Lá",
    keywords: ["nón lá", "non la", "nón"],
    buttonLeft: "23.5%",
  },
  {
    key: "tui",
    image: "/lcb3.png",
    label: "Túi",
    keywords: ["túi", "tui", "bag"],
    buttonLeft: "24%",
  },
  {
    key: "giay",
    image: "/lcb4.png",
    label: "Giày",
    keywords: ["giày", "giay", "dép", "dep"],
    buttonLeft: "24%",
  },
  {
    key: "trang-suc-khan-lua",
    image: "/lcb5.png",
    label: "Trang Sức & Khăn Lụa",
    keywords: ["trang sức", "trang suc", "khăn lụa", "khan lua", "khăn", "lụa", "trang", "sức"],
    buttonLeft: "41%",
  },
]

export function getProductsForSection(
  products: { tenDanhMuc?: string | null }[],
  section: (typeof CATEGORY_SECTIONS)[0]
) {
  return products.filter((p) => {
    const name = (p.tenDanhMuc ?? "").toLowerCase()
    return section.keywords.some((kw) => name.includes(kw))
  })
}
