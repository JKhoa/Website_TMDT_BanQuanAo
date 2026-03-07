export const products = [
  // Nam - Áo thun
  {
    id: 1,
    name: "Áo Thun Nam Premium",
    category: "nam",
    subcategory: "ao-thun",
    price: 299000,
    salePrice: 199000,
    rating: 4.5,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1759572095329-1dcf9522762b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3VtbWVyJTIwdHNoaXJ0fGVufDF8fHx8MTc3Mjg3MjU2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1759572095329-1dcf9522762b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3VtbWVyJTIwdHNoaXJ0fGVufDF8fHx8MTc3Mjg3MjU2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1759572095329-1dcf9522762b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3VtbWVyJTIwdHNoaXJ0fGVufDF8fHx8MTc3Mjg3MjU2M3ww&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Đen", "Trắng", "Xám", "Navy"],
    brand: "Fashion Co.",
    material: "100% Cotton",
    description: "Áo thun nam cao cấp, chất liệu cotton thoáng mát, form dáng regular fit phù hợp mọi vóc dáng.",
    washGuide: "Giặt máy ở nhiệt độ thường, không sử dụng chất tẩy",
    stock: 150,
    isBestSeller: true,
    isNewArrival: true
  },
  {
    id: 2,
    name: "Áo Sơ Mi Nam Công Sở",
    category: "nam",
    subcategory: "ao-so-mi",
    price: 450000,
    salePrice: 350000,
    rating: 4.8,
    reviews: 96,
    image: "https://images.unsplash.com/photo-1618008797651-3eb256213400?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBtYWxlJTIwc2hpcnR8ZW58MXx8fHwxNzcyODcyNTYwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1618008797651-3eb256213400?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBtYWxlJTIwc2hpcnR8ZW58MXx8fHwxNzcyODcyNTYwfDA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Trắng", "Xanh nhạt", "Hồng", "Xám"],
    brand: "Office Style",
    material: "Cotton pha polyester",
    description: "Áo sơ mi nam công sở, thiết kế thanh lịch, dễ dàng phối đồ.",
    washGuide: "Giặt tay hoặc giặt máy nhẹ nhàng",
    stock: 80,
    isBestSeller: true,
    isNewArrival: false
  },
  {
    id: 3,
    name: "Áo Khoác Bomber Nam",
    category: "nam",
    subcategory: "ao-khoac",
    price: 890000,
    salePrice: 690000,
    rating: 4.7,
    reviews: 75,
    image: "https://images.unsplash.com/photo-1630724725268-8272ac390de7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBtYWxlJTIwamFja2V0fGVufDF8fHx8MTc3Mjg3MjU2MXww&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1630724725268-8272ac390de7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBtYWxlJTIwamFja2V0fGVufDF8fHx8MTc3Mjg3MjU2MXww&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Đen", "Navy", "Xanh rêu"],
    brand: "Urban Fashion",
    material: "Polyester cao cấp",
    description: "Áo khoác bomber phong cách năng động, giữ ấm tốt.",
    washGuide: "Giặt khô hoặc giặt tay",
    stock: 45,
    isBestSeller: false,
    isNewArrival: true
  },
  {
    id: 4,
    name: "Quần Jeans Nam Slim Fit",
    category: "nam",
    subcategory: "quan-jeans",
    price: 550000,
    salePrice: 450000,
    rating: 4.6,
    reviews: 142,
    image: "https://images.unsplash.com/photo-1602585198422-d795fa9bfd6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwamVhbnMlMjBkZW5pbXxlbnwxfHx8fDE3NzI4MTYzNDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1602585198422-d795fa9bfd6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwamVhbnMlMjBkZW5pbXxlbnwxfHx8fDE3NzI4MTYzNDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    sizes: ["29", "30", "31", "32", "33", "34"],
    colors: ["Xanh đậm", "Xanh nhạt", "Đen"],
    brand: "Denim Co.",
    material: "Denim cotton",
    description: "Quần jeans nam form slim fit ôm vừa phải, tôn dáng.",
    washGuide: "Giặt ngược mặt, không ngâm lâu",
    stock: 120,
    isBestSeller: true,
    isNewArrival: false
  },

  // Nữ
  {
    id: 5,
    name: "Váy Maxi Nữ Dự Tiệc",
    category: "nu",
    subcategory: "vay",
    price: 750000,
    salePrice: 550000,
    rating: 4.9,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1747707500073-65dd5c1407b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBmZW1hbGUlMjBkcmVzc3xlbnwxfHx8fDE3NzI4NzI1NjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1747707500073-65dd5c1407b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBmZW1hbGUlMjBkcmVzc3xlbnwxfHx8fDE3NzI4NzI1NjF8MA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    sizes: ["S", "M", "L"],
    colors: ["Đỏ", "Đen", "Trắng", "Xanh navy"],
    brand: "Elegant Style",
    material: "Lụa cao cấp",
    description: "Váy maxi sang trọng, phù hợp dự tiệc và sự kiện quan trọng.",
    washGuide: "Giặt khô",
    stock: 30,
    isBestSeller: true,
    isNewArrival: true
  },
  {
    id: 6,
    name: "Áo Kiểu Nữ Công Sở",
    category: "nu",
    subcategory: "ao-kieu",
    price: 350000,
    salePrice: 250000,
    rating: 4.5,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1612357917631-d8697c2af152?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBmZW1hbGUlMjBibG91c2V8ZW58MXx8fHwxNzcyODcyNTYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1612357917631-d8697c2af152?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBmZW1hbGUlMjBibG91c2V8ZW58MXx8fHwxNzcyODcyNTYyfDA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Trắng", "Be", "Xanh nhạt", "Hồng"],
    brand: "Office Lady",
    material: "Vải lụa tơ tằm",
    description: "Áo kiểu nữ thanh lịch, dễ phối đồ công sở.",
    washGuide: "Giặt tay, không vắt mạnh",
    stock: 95,
    isBestSeller: true,
    isNewArrival: false
  },

  // Phụ kiện
  {
    id: 7,
    name: "Túi Xách Tote Cao Cấp",
    category: "phu-kien",
    subcategory: "tui-xach",
    price: 890000,
    salePrice: 690000,
    rating: 4.8,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1559563458-527698bf5295?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXMlMjBiYWd8ZW58MXx8fHwxNzcyNzgxODA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1559563458-527698bf5295?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXMlMjBiYWd8ZW58MXx8fHwxNzcyNzgxODA4fDA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    sizes: ["One Size"],
    colors: ["Đen", "Nâu", "Be"],
    brand: "Luxury Bag",
    material: "Da PU cao cấp",
    description: "Túi xách tote thời trang, thiết kế sang trọng.",
    washGuide: "Lau sạch bằng khăn ẩm",
    stock: 60,
    isBestSeller: true,
    isNewArrival: true
  },
  {
    id: 8,
    name: "Giày Sneaker Thể Thao",
    category: "phu-kien",
    subcategory: "giay",
    price: 1200000,
    salePrice: 950000,
    rating: 4.7,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1650320079970-b4ee8f0dae33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc25lYWtlcnMlMjBzaG9lc3xlbnwxfHx8fDE3NzI4NTczODB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1650320079970-b4ee8f0dae33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc25lYWtlcnMlMjBzaG9lc3xlbnwxfHx8fDE3NzI4NTczODB8MA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    sizes: ["38", "39", "40", "41", "42", "43"],
    colors: ["Trắng", "Đen", "Trắng/Đen"],
    brand: "Sport Elite",
    material: "Da tổng hợp + mesh",
    description: "Giày sneaker thể thao năng động, êm ái khi di chuyển.",
    washGuide: "Lau sạch, không ngâm nước",
    stock: 75,
    isBestSeller: true,
    isNewArrival: false
  },

  // Trẻ em
  {
    id: 9,
    name: "Bộ Đồ Trẻ Em",
    category: "tre-em",
    subcategory: "bo-do",
    price: 350000,
    salePrice: 250000,
    rating: 4.6,
    reviews: 92,
    image: "https://images.unsplash.com/photo-1758782213532-bbb5fd89885e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwa2lkcyUyMGNsb3RoaW5nfGVufDF8fHx8MTc3Mjg3MjU2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1758782213532-bbb5fd89885e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwa2lkcyUyMGNsb3RoaW5nfGVufDF8fHx8MTc3Mjg3MjU2M3ww&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    sizes: ["2-3 tuổi", "4-5 tuổi", "6-7 tuổi", "8-9 tuổi"],
    colors: ["Xanh", "Hồng", "Vàng"],
    brand: "Kids Fashion",
    material: "Cotton organic",
    description: "Bộ đồ trẻ em an toàn, thoáng mát cho bé.",
    washGuide: "Giặt máy ở nhiệt độ thấp",
    stock: 100,
    isBestSeller: false,
    isNewArrival: true
  },

  // Thêm sản phẩm
  {
    id: 10,
    name: "Áo Phao Mùa Đông",
    category: "nam",
    subcategory: "ao-khoac",
    price: 1500000,
    salePrice: 1200000,
    rating: 4.9,
    reviews: 64,
    image: "https://images.unsplash.com/photo-1768134152610-27355e256513?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwd2ludGVyJTIwY29hdHxlbnwxfHx8fDE3NzI4NzI1NjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1768134152610-27355e256513?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwd2ludGVyJTIwY29hdHxlbnwxfHx8fDE3NzI4NzI1NjN8MA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Đen", "Xanh navy", "Xám"],
    brand: "Winter Style",
    material: "Polyester chần bông",
    description: "Áo phao mùa đông giữ ấm cực tốt, chống thấm nước.",
    washGuide: "Giặt khô",
    stock: 40,
    isBestSeller: true,
    isNewArrival: true,
    isFlashSale: true,
    flashSaleEndTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  }
];

export const categories = [
  {
    id: "nam",
    name: "Nam",
    image: "https://images.unsplash.com/photo-1618008797651-3eb256213400?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBtYWxlJTIwc2hpcnR8ZW58MXx8fHwxNzcyODcyNTYwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    subcategories: [
      { id: "ao-thun", name: "Áo thun" },
      { id: "ao-so-mi", name: "Áo sơ mi" },
      { id: "ao-khoac", name: "Áo khoác" },
      { id: "quan-jeans", name: "Quần jeans" },
      { id: "quan-short", name: "Quần short" }
    ]
  },
  {
    id: "nu",
    name: "Nữ",
    image: "https://images.unsplash.com/photo-1747707500073-65dd5c1407b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBmZW1hbGUlMjBkcmVzc3xlbnwxfHx8fDE3NzI4NzI1NjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    subcategories: [
      { id: "vay", name: "Váy" },
      { id: "ao-kieu", name: "Áo kiểu" },
      { id: "ao-thun", name: "Áo thun" },
      { id: "quan", name: "Quần" }
    ]
  },
  {
    id: "tre-em",
    name: "Trẻ em",
    image: "https://images.unsplash.com/photo-1758782213532-bbb5fd89885e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwa2lkcyUyMGNsb3RoaW5nfGVufDF8fHx8MTc3Mjg3MjU2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    subcategories: [
      { id: "bo-do", name: "Bộ đồ" },
      { id: "ao", name: "Áo" },
      { id: "quan", name: "Quần" }
    ]
  },
  {
    id: "phu-kien",
    name: "Phụ kiện",
    image: "https://images.unsplash.com/photo-1559563458-527698bf5295?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXMlMjBiYWd8ZW58MXx8fHwxNzcyNzgxODA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    subcategories: [
      { id: "tui-xach", name: "Túi xách" },
      { id: "giay", name: "Giày dép" },
      { id: "non", name: "Nón" },
      { id: "that-lung", name: "Thắt lưng" }
    ]
  }
];
