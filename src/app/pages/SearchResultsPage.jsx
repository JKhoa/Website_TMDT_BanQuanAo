import { useState } from "react";
import { useSearchParams, Link } from "react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { useSearch } from "../contexts/SearchContext";
import { ProductCard } from "../components/ProductCard";

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const { searchProducts, addRecentSearch } = useSearch();
  const [sortBy, setSortBy] = useState("relevance");

  // Search and add to recent
  const results = searchProducts(q);
  if (q) addRecentSearch(q);

  // Sort results
  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return (a.salePrice || a.price) - (b.salePrice || b.price);
      case "price-desc":
        return (b.salePrice || b.price) - (a.salePrice || a.price);
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return b.id - a.id;
      default: // relevance - already sorted by score
        return 0;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Kết quả tìm kiếm cho "{q}"
        </h1>
        <p className="text-gray-600">
          Tìm thấy {sortedResults.length} sản phẩm
        </p>
      </div>

      {sortedResults.length > 0 ? (
        <>
          {/* Sort */}
          <div className="flex items-center justify-end mb-6">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="relevance">Liên quan nhất</option>
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="rating">Đánh giá cao</option>
              </select>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedResults.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold mb-2">Không tìm thấy kết quả</h2>
          <p className="text-gray-600 mb-4">
            Không có sản phẩm nào phù hợp với từ khóa "{q}"
          </p>
          <div className="text-gray-500 text-sm mb-8">
            <p>Gợi ý:</p>
            <ul className="mt-2 space-y-1">
              <li>• Kiểm tra lỗi chính tả</li>
              <li>• Sử dụng từ khóa khác</li>
              <li>• Tìm kiếm với từ khóa ngắn hơn</li>
            </ul>
          </div>
          <Link
            to="/products"
            className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>
      )}
    </div>
  );
}
