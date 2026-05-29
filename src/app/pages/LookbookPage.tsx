"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, ShoppingBag, Heart, ChevronRight, X, Star, ArrowRight, Sparkles, TrendingUp, Calendar } from "lucide-react";
import { products } from "../data/products";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { toast } from "sonner";

/* ─── Data: Lookbook Collections ─── */
const lookbookCollections = [
  {
    id: 1,
    title: "Street Style 2026",
    subtitle: "Phong cách đường phố",
    description: "Phong cách đường phố năng động và cá tính cho những bạn trẻ yêu thích sự tự do, phóng khoáng. Mix & match cùng sneaker và phụ kiện thời thượng.",
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1200",
    season: "Quanh năm",
    style: "Street",
    trending: true,
    productIds: [1, 4, 8, 25],
    tips: ["Layer áo thun với áo khoác bomber", "Phối quần jogger cùng sneaker trắng", "Thêm kính mát để tăng thêm cá tính"]
  },
  {
    id: 2,
    title: "Elegant Evening",
    subtitle: "Dạ tiệc sang trọng",
    description: "Sang trọng và thanh lịch cho buổi tối. Bộ sưu tập dành cho những sự kiện quan trọng, từ tiệc cocktail đến dạ hội.",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200",
    season: "Quanh năm",
    style: "Elegant",
    trending: false,
    productIds: [5, 15, 7, 19],
    tips: ["Chọn váy maxi tông trầm để tôn da", "Kết hợp clutch nhỏ gọn thay vì túi lớn", "Giày cao gót 7-9cm là lựa chọn lý tưởng"]
  },
  {
    id: 3,
    title: "Office Chic",
    subtitle: "Công sở hiện đại",
    description: "Phong cách công sở hiện đại, thanh lịch nhưng không nhàm chán. Gợi ý outfit hoàn hảo cho những ngày đi làm tự tin.",
    image: "https://images.unsplash.com/photo-1618008797651-3eb256213400?w=1200",
    season: "Quanh năm",
    style: "Office",
    trending: true,
    productIds: [2, 6, 16, 19],
    tips: ["Sơ mi trắng + quần culottes là combo bất bại", "Thắt lưng da giúp tổng thể chỉn chu hơn", "Ưu tiên tông màu trung tính: trắng, be, xám"]
  },
  {
    id: 4,
    title: "Summer Vibes",
    subtitle: "Rực rỡ mùa hè",
    description: "Tươi mát và năng động cho mùa hè. Những outfit nhẹ nhàng, thoáng mát giúp bạn tự tin dạo phố dưới nắng vàng.",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200",
    season: "Hè",
    style: "Casual",
    trending: false,
    productIds: [14, 17, 12, 20],
    tips: ["Croptop + quần short là công thức mùa hè", "Kính mát chống UV là phụ kiện bắt buộc", "Chọn chất liệu cotton thấm hút mồ hôi"]
  },
  {
    id: 5,
    title: "Winter Warmth",
    subtitle: "Ấm áp mùa đông",
    description: "Ấm áp và phong cách cho mùa đông. Layer thông minh giúp bạn vừa giữ ấm vừa thời trang trong những ngày se lạnh.",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200",
    season: "Đông",
    style: "Street",
    trending: false,
    productIds: [3, 24, 4, 13],
    tips: ["Bomber jacket + hoodie là combo giữ ấm tuyệt vời", "Jeans đậm màu phối với giày boot cổ cao", "Layering 3 lớp: áo thun + áo nỉ + áo khoác"]
  },
  {
    id: 6,
    title: "Casual Comfort",
    subtitle: "Thoải mái hàng ngày",
    description: "Thoải mái và dễ phối đồ hàng ngày. Phong cách Casual không cần cầu kỳ nhưng vẫn gọn gàng, tự tin.",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1200",
    season: "Quanh năm",
    style: "Casual",
    trending: true,
    productIds: [13, 25, 8, 20],
    tips: ["Áo henley tạo điểm nhấn so với áo thun trơn", "Sneaker trắng phối được với mọi outfit casual", "Accessory đơn giản: đồng hồ hoặc vòng tay da"]
  }
];

const styleFilters = ["Tất cả", "Street", "Elegant", "Office", "Casual"];
const seasonFilters = ["Tất cả", "Quanh năm", "Hè", "Đông"];

/* ─── Lookbook Detail Modal ─── */
function LookbookModal({ collection, onClose }: { collection: typeof lookbookCollections[0]; onClose: () => void }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const collectionProducts = collection.productIds
    .map((pid) => products.find((p) => p.id === pid))
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur p-2 rounded-full shadow hover:bg-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        {/* Hero */}
        <div className="relative h-72 md:h-96 overflow-hidden rounded-t-2xl">
          <img src={collection.image} alt={collection.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">{collection.style}</span>
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {collection.season}
              </span>
              {collection.trending && (
                <span className="bg-orange-500/90 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Trending
                </span>
              )}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-1">{collection.title}</h2>
            <p className="text-white/80 text-sm md:text-base">{collection.subtitle}</p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* Description */}
          <p className="text-gray-600 text-base mb-8 leading-relaxed">{collection.description}</p>

          {/* Styling Tips */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 mb-8 border border-orange-100">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              Mẹo phối đồ
            </h3>
            <ul className="space-y-2">
              {collection.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm">
                  <ChevronRight className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Products in this look */}
          <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-orange-500" />
            Sản phẩm trong bộ sưu tập ({collectionProducts.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {collectionProducts.map((product: any) => {
              const inWishlist = isInWishlist(product.id);
              return (
                <div key={product.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all group bg-white">
                  <Link href={`/product/${product.id}`} onClick={onClose} className="shrink-0">
                    <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-lg group-hover:scale-105 transition-transform" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${product.id}`} onClick={onClose}>
                      <h4 className="font-semibold text-sm truncate hover:text-orange-500 transition-colors">{product.name}</h4>
                    </Link>
                    <div className="flex items-center gap-1 my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
                      ))}
                      <span className="text-xs text-gray-400 ml-1">({product.reviews})</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {product.salePrice ? (
                        <>
                          <span className="text-orange-500 font-bold text-sm">{product.salePrice.toLocaleString("vi-VN")}đ</span>
                          <span className="text-gray-400 line-through text-xs">{product.price.toLocaleString("vi-VN")}đ</span>
                        </>
                      ) : (
                        <span className="font-bold text-sm">{product.price.toLocaleString("vi-VN")}đ</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          addToCart(product, product.sizes?.[0] || "M", product.colors?.[0] || "Đen", 1);
                          toast.success(`Đã thêm "${product.name}" vào giỏ!`);
                        }}
                        className="bg-orange-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-1"
                      >
                        <ShoppingBag className="w-3 h-3" /> Thêm vào giỏ
                      </button>
                      <button
                        onClick={() => {
                          toggleWishlist(product);
                          toast.success(inWishlist ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích");
                        }}
                        className={`p-1.5 rounded-lg border transition-colors ${inWishlist ? "bg-red-50 border-red-200 text-red-500" : "border-gray-200 text-gray-400 hover:border-orange-200 hover:text-orange-500"}`}
                      >
                        <Heart className="w-3.5 h-3.5" fill={inWishlist ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total price */}
          <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tổng giá trị bộ sưu tập</p>
              <p className="text-2xl font-bold text-orange-500">
                {collectionProducts.reduce((sum: number, p: any) => sum + (p.salePrice || p.price), 0).toLocaleString("vi-VN")}đ
              </p>
            </div>
            <button
              onClick={() => {
                collectionProducts.forEach((p: any) => {
                  addToCart(p, p.sizes?.[0] || "M", p.colors?.[0] || "Đen", 1);
                });
                toast.success("Đã thêm toàn bộ sản phẩm vào giỏ hàng!");
                onClose();
              }}
              className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> Mua cả set
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main LookbookPage ─── */
export function LookbookPage() {
  const [activeStyle, setActiveStyle] = useState("Tất cả");
  const [activeSeason, setActiveSeason] = useState("Tất cả");
  const [selectedCollection, setSelectedCollection] = useState<typeof lookbookCollections[0] | null>(null);

  const filtered = lookbookCollections.filter((lb) => {
    const matchStyle = activeStyle === "Tất cả" || lb.style === activeStyle;
    const matchSeason = activeSeason === "Tất cả" || lb.season === activeSeason;
    return matchStyle && matchSeason;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative h-[420px] md:h-[520px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1600"
          alt="Lookbook Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" /> BST Xuân – Hè 2026
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Lookbook <span className="text-orange-400">Thời Trang</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
            Khám phá xu hướng thời trang mới nhất và cảm hứng phối đồ cho mọi phong cách. 
            Mỗi bộ sưu tập là một câu chuyện thời trang riêng biệt.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Phong cách</p>
            <div className="flex flex-wrap gap-2">
              {styleFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveStyle(f)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeStyle === f
                      ? "bg-gray-900 text-white shadow-md"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="md:ml-auto">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Mùa</p>
            <div className="flex flex-wrap gap-2">
              {seasonFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveSeason(f)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeSeason === f
                      ? "bg-orange-500 text-white shadow-md"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-6">Hiển thị <strong className="text-gray-900">{filtered.length}</strong> bộ sưu tập</p>

        {/* Lookbook Grid – Masonry-like */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Không tìm thấy bộ sưu tập phù hợp với bộ lọc hiện tại.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((lb, index) => {
              const collectionProducts = lb.productIds.map((pid) => products.find((p) => p.id === pid)).filter(Boolean);
              const isLarge = index === 0;
              return (
                <div
                  key={lb.id}
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 ${
                    isLarge ? "md:col-span-2 md:row-span-2" : ""
                  }`}
                  onClick={() => setSelectedCollection(lb)}
                >
                  <div className={`relative ${isLarge ? "aspect-[16/10]" : "aspect-[3/4]"} bg-gray-200`}>
                    <img
                      src={lb.image}
                      alt={lb.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-medium">
                        {lb.style}
                      </span>
                      {lb.trending && (
                        <span className="bg-orange-500/90 px-3 py-1 rounded-full text-white text-xs font-medium flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> Hot
                        </span>
                      )}
                    </div>

                    {/* Quick view icon */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <div className="bg-white/90 backdrop-blur p-2.5 rounded-full shadow-lg">
                        <Eye className="w-5 h-5 text-gray-800" />
                      </div>
                    </div>

                    {/* Content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className={`font-bold mb-1 ${isLarge ? "text-3xl" : "text-xl"}`}>{lb.title}</h3>
                      <p className="text-white/70 text-sm mb-4">{lb.subtitle}</p>

                      {/* Product mini previews */}
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {collectionProducts.slice(0, 4).map((p: any) => (
                            <img
                              key={p.id}
                              src={p.image}
                              alt={p.name}
                              className="w-9 h-9 rounded-full border-2 border-white object-cover"
                            />
                          ))}
                        </div>
                        <span className="text-white/70 text-xs">{collectionProducts.length} sản phẩm</span>
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <span className="bg-white text-gray-900 px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1 hover:bg-orange-500 hover:text-white transition-colors">
                            Khám phá <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Trending Outfits Section */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Outfit Đang <span className="text-orange-500">Thịnh Hành</span></h2>
            <p className="text-gray-500">Những bộ đồ được yêu thích nhất tuần này</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {lookbookCollections
              .filter((lb) => lb.trending)
              .flatMap((lb) => lb.productIds.slice(0, 2).map((pid) => products.find((p) => p.id === pid)))
              .filter(Boolean)
              .slice(0, 8)
              .map((product: any) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group relative rounded-xl overflow-hidden aspect-[3/4] bg-gray-100"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="font-semibold text-sm truncate">{product.name}</p>
                    <p className="text-orange-300 text-sm font-bold">
                      {(product.salePrice || product.price).toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>

        {/* Style Guide */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white flex flex-col justify-between md:row-span-2">
            <div>
              <span className="text-orange-400 text-sm font-semibold uppercase tracking-wider">Style Guide</span>
              <h3 className="text-2xl font-bold mt-2 mb-4">Bí quyết phối đồ chuẩn sao</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Không cần là fashionista chuyên nghiệp, bạn vẫn có thể tạo nên những outfit ấn tượng với những nguyên tắc phối đồ đơn giản mà hiệu quả.
              </p>
            </div>
            <div className="mt-6 space-y-4">
              {[
                { num: "01", text: "Quy tắc 3 màu: Không quá 3 màu trong 1 outfit" },
                { num: "02", text: "Cân bằng tỷ lệ: Áo rộng đi cùng quần ôm và ngược lại" },
                { num: "03", text: "Điểm nhấn: Chọn 1 item nổi bật làm trung tâm" }
              ].map((rule) => (
                <div key={rule.num} className="flex items-start gap-3">
                  <span className="text-orange-400 font-bold text-lg">{rule.num}</span>
                  <p className="text-gray-300 text-sm">{rule.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-orange-50 rounded-xl p-4 mb-4 flex items-center gap-3">
              <div className="bg-orange-500 text-white p-2 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
              <div>
                <p className="font-bold text-sm">Xu hướng #1</p>
                <p className="text-xs text-gray-500">Được yêu thích nhất</p>
              </div>
            </div>
            <h4 className="font-bold mb-2">Minimalism – Tối giản</h4>
            <p className="text-gray-500 text-sm">Ít hơn là nhiều hơn. Phong cách tối giản với tông trung tính, đường cắt sắc nét đang thống trị mọi sàn diễn.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-blue-50 rounded-xl p-4 mb-4 flex items-center gap-3">
              <div className="bg-blue-500 text-white p-2 rounded-lg"><Sparkles className="w-5 h-5" /></div>
              <div>
                <p className="font-bold text-sm">Xu hướng #2</p>
                <p className="text-xs text-gray-500">Đang lên ngôi</p>
              </div>
            </div>
            <h4 className="font-bold mb-2">Oversized – Rộng thoải mái</h4>
            <p className="text-gray-500 text-sm">Phong cách oversize mang lại sự thoải mái tối đa. Kết hợp với phụ kiện nhỏ gọn tạo sự cân đối cho tổng thể.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-green-50 rounded-xl p-4 mb-4 flex items-center gap-3">
              <div className="bg-green-500 text-white p-2 rounded-lg"><Calendar className="w-5 h-5" /></div>
              <div>
                <p className="font-bold text-sm">Xu hướng #3</p>
                <p className="text-xs text-gray-500">Bền vững</p>
              </div>
            </div>
            <h4 className="font-bold mb-2">Eco Fashion – Thời trang bền vững</h4>
            <p className="text-gray-500 text-sm">Lựa chọn chất liệu organic, tái chế. Thời trang xanh không chỉ bảo vệ môi trường mà còn mang lại sự sang trọng.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-2xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tạo phong cách riêng của bạn</h2>
            <p className="text-lg mb-8 text-white/90 max-w-xl mx-auto">
              Khám phá bộ sưu tập thời trang đa dạng và tìm kiếm outfit hoàn hảo cho bạn ngay hôm nay
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3.5 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              <ShoppingBag className="w-5 h-5" /> Mua sắm ngay
            </Link>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedCollection && (
        <LookbookModal collection={selectedCollection} onClose={() => setSelectedCollection(null)} />
      )}
    </div>
  );
}
