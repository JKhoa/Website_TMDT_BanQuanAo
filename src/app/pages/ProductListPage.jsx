import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router";
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { products as localProducts, categories } from "../data/products";
import { ProductCard } from "../components/ProductCard";
import api from "../services/api";

const ITEMS_PER_PAGE = 12;

export function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [apiProducts, setApiProducts] = useState(null); // null = not loaded, [] = loaded empty
  const [apiTotal, setApiTotal] = useState(0); // Stores total products count from API
  const [loadingApi, setLoadingApi] = useState(true);

  // Read state from URL params
  const selectedCategory = searchParams.get("category") || "";
  const selectedSubcategory = searchParams.get("subcategory") || "";
  const sortBy = searchParams.get("sort") || "newest";
  const currentPage = parseInt(searchParams.get("page") || "1");
  const saleOnly = searchParams.get("sale") === "true";

  // Price range from URL
  const minPrice = parseInt(searchParams.get("minPrice") || "0");
  const maxPrice = parseInt(searchParams.get("maxPrice") || "10000000");

  // Fetch products from API
  useEffect(() => {
    let cancelled = false;
    setLoadingApi(true);
    const params = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      sort: sortBy
    };
    if (selectedCategory) params.category = selectedCategory;
    if (selectedSubcategory) params.subcategory = selectedSubcategory;
    if (saleOnly) params.sale = "true";
    if (minPrice > 0) params.minPrice = minPrice;
    if (maxPrice < 10000000) params.maxPrice = maxPrice;

    api.getProducts(params)
      .then((res) => {
        if (!cancelled) {
          if (res.products && res.products.length > 0) {
            setApiProducts(res.products);
          } else {
            setApiProducts([]);
          }
          if (res.pagination) {
            setApiTotal(res.pagination.total || 0);
          }
        }
      })
      .catch(() => {
        // Backend unavailable, will use local data
      })
      .finally(() => {
        if (!cancelled) setLoadingApi(false);
      });
    return () => { cancelled = true; };
  }, [selectedCategory, selectedSubcategory, sortBy, currentPage, saleOnly, minPrice, maxPrice]);

  const updateParam = useCallback((key, value) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (!value || value === "0" || (key === "maxPrice" && value === "10000000")) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
      // Reset page when changing filters
      if (key !== "page") {
        newParams.delete("page");
      }
      return newParams;
    });
  }, [setSearchParams]);

  // Use API products if available, otherwise fallback to local
  const productsSource = apiProducts && apiProducts.length > 0 ? apiProducts : localProducts;

  const filteredProducts = useMemo(() => {
    // If products came from API, they're already filtered server-side
    if (apiProducts && apiProducts.length > 0) {
      return apiProducts;
    }

    // Fallback: local filtering
    let result = [...productsSource];

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (selectedSubcategory) {
      result = result.filter((p) => p.subcategory === selectedSubcategory);
    }
    if (saleOnly) {
      result = result.filter((p) => p.salePrice);
    }
    result = result.filter((p) => {
      const price = p.salePrice || p.price;
      return price >= minPrice && price <= maxPrice;
    });

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case "price-desc":
        result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "bestseller":
        result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
      case "newest":
      default:
        result.sort((a, b) => b.id - a.id);
        break;
    }

    return result;
  }, [apiProducts, productsSource, selectedCategory, selectedSubcategory, sortBy, saleOnly, minPrice, maxPrice]);

  // Pagination — check if we're actually using API data (not just that it responded)
  const usingApiData = apiProducts && apiProducts.length > 0;
  const totalPages = usingApiData
    ? Math.ceil(apiTotal / ITEMS_PER_PAGE)
    : Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  
  const paginatedProducts = usingApiData
    ? filteredProducts // API already paginated
    : filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      );

  const currentCategory = categories.find((c) => c.id === selectedCategory);
  const categoryName = { nam: "Nam", nu: "Nữ", "tre-em": "Trẻ em", "phu-kien": "Phụ kiện" };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-orange-500">Trang chủ</Link>
        <span>/</span>
        <span className="text-gray-900">
          {selectedCategory ? categoryName[selectedCategory] || "Sản phẩm" : "Tất cả sản phẩm"}
          {saleOnly && " - Giảm giá"}
        </span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            {saleOnly ? "🔥 Sản Phẩm Giảm Giá" : selectedCategory ? categoryName[selectedCategory] : "Tất Cả Sản Phẩm"}
          </h1>
          <p className="text-gray-600 mt-1">{usingApiData ? apiTotal : filteredProducts.length} sản phẩm</p>
        </div>
        <button
          className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="w-5 h-5" />
          Bộ lọc
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <div className={`lg:block ${showFilters ? "block" : "hidden"}`}>
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <h2 className="text-lg font-bold">Bộ lọc</h2>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Danh mục</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    updateParam("category", "");
                    updateParam("subcategory", "");
                  }}
                  className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    !selectedCategory ? "bg-orange-500 text-white" : "hover:bg-orange-50"
                  }`}
                >
                  Tất cả
                </button>
                {categories.map((cat) => (
                  <div key={cat.id}>
                    <button
                      onClick={() => {
                        updateParam("category", cat.id);
                        updateParam("subcategory", "");
                      }}
                      className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        selectedCategory === cat.id ? "bg-orange-500 text-white" : "hover:bg-orange-50"
                      }`}
                    >
                      {cat.name}
                    </button>
                    {selectedCategory === cat.id && (
                      <div className="ml-4 mt-1 space-y-1">
                        {cat.subcategories.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => updateParam("subcategory", sub.id)}
                            className={`block w-full text-left px-3 py-1 rounded text-sm transition-colors ${
                              selectedSubcategory === sub.id ? "text-orange-500 font-semibold" : "text-gray-600 hover:text-orange-500"
                            }`}
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Mức giá</h3>
              <div className="space-y-2">
                {[
                  { label: "Dưới 200.000đ", min: 0, max: 200000 },
                  { label: "200.000đ - 500.000đ", min: 200000, max: 500000 },
                  { label: "500.000đ - 1.000.000đ", min: 500000, max: 1000000 },
                  { label: "Trên 1.000.000đ", min: 1000000, max: 10000000 }
                ].map((range) => (
                  <button
                    key={range.label}
                    onClick={() => {
                      updateParam("minPrice", String(range.min));
                      updateParam("maxPrice", String(range.max));
                    }}
                    className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      minPrice === range.min && maxPrice === range.max
                        ? "bg-orange-500 text-white"
                        : "hover:bg-orange-50"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sale filter */}
            <div className="mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saleOnly}
                  onChange={(e) => updateParam("sale", e.target.checked ? "true" : "")}
                  className="w-4 h-4 text-orange-500 rounded"
                />
                <span className="text-sm">Chỉ sản phẩm giảm giá</span>
              </label>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => setSearchParams({})}
              className="w-full text-orange-500 border border-orange-500 px-4 py-2 rounded-lg hover:bg-orange-50 text-sm"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {/* Sort */}
          <div className="flex items-center justify-end mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => updateParam("sort", e.target.value)}
                className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="rating">Đánh giá cao</option>
                <option value="bestseller">Bán chạy</option>
              </select>
            </div>
          </div>

          {loadingApi ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
            </div>
          ) : paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => updateParam("page", String(currentPage - 1))}
                    className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => updateParam("page", String(page))}
                      className={`w-10 h-10 rounded-lg transition-colors ${
                        currentPage === page
                          ? "bg-orange-500 text-white"
                          : "border hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => updateParam("page", String(currentPage + 1))}
                    className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl font-bold mb-4">Không tìm thấy sản phẩm nào</p>
              <p className="text-gray-600 mb-6">Thử thay đổi bộ lọc để xem thêm sản phẩm</p>
              <button
                onClick={() => setSearchParams({})}
                className="text-orange-500 hover:underline"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
