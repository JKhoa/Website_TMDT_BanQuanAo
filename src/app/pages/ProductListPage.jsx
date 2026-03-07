import { useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import { Filter, X, ChevronDown } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { products, categories } from "../data/products";

export function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedSubcategory, setSelectedSubcategory] = useState(searchParams.get("subcategory") || "");
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("newest");

  // Get unique values for filters
  const allSizes = useMemo(() => {
    const sizes = new Set();
    products.forEach((p) => p.sizes.forEach((s) => sizes.add(s)));
    return Array.from(sizes);
  }, []);

  const allColors = useMemo(() => {
    const colors = new Set();
    products.forEach((p) => p.colors.forEach((c) => colors.add(c)));
    return Array.from(colors);
  }, []);

  const allBrands = useMemo(() => {
    const brands = new Set();
    products.forEach((p) => brands.add(p.brand));
    return Array.from(brands);
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Subcategory filter
    if (selectedSubcategory) {
      filtered = filtered.filter((p) => p.subcategory === selectedSubcategory);
    }

    // Price filter
    filtered = filtered.filter((p) => {
      const price = p.salePrice || p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Size filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((p) =>
        p.sizes.some((s) => selectedSizes.includes(s))
      );
    }

    // Color filter
    if (selectedColors.length > 0) {
      filtered = filtered.filter((p) =>
        p.colors.some((c) => selectedColors.includes(c))
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) => selectedBrands.includes(p.brand));
    }

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter((p) => p.rating >= minRating);
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case "price-desc":
        filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case "bestseller":
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default: // newest
        filtered.reverse();
    }

    return filtered;
  }, [
    selectedCategory,
    selectedSubcategory,
    priceRange,
    selectedSizes,
    selectedColors,
    selectedBrands,
    minRating,
    sortBy
  ]);

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedSubcategory("");
    setPriceRange([0, 2000000]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedBrands([]);
    setMinRating(0);
  };

  const currentCategory = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {currentCategory ? currentCategory.name : "Tất cả sản phẩm"}
        </h1>
        <p className="text-gray-600">
          Tìm thấy {filteredProducts.length} sản phẩm
        </p>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside
          className={`${
            showFilters ? "fixed inset-0 z-50 bg-white" : "hidden"
          } lg:block lg:w-64 lg:sticky lg:top-24 lg:h-fit overflow-y-auto`}
        >
          <div className="lg:hidden flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold">Bộ lọc</h2>
            <button onClick={() => setShowFilters(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-4 space-y-6">
            {/* Category Filter */}
            <div>
              <h3 className="font-semibold mb-3">Danh mục</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat.id}
                      onChange={() => {
                        setSelectedCategory(cat.id);
                        setSelectedSubcategory("");
                      }}
                      className="w-4 h-4 text-orange-500"
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Subcategory Filter */}
            {currentCategory && (
              <div>
                <h3 className="font-semibold mb-3">Danh mục con</h3>
                <div className="space-y-2">
                  {currentCategory.subcategories.map((sub) => (
                    <label key={sub.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="subcategory"
                        checked={selectedSubcategory === sub.id}
                        onChange={() => setSelectedSubcategory(sub.id)}
                        className="w-4 h-4 text-orange-500"
                      />
                      <span>{sub.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range */}
            <div>
              <h3 className="font-semibold mb-3">Khoảng giá</h3>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="2000000"
                  step="100000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm">
                  <span>0đ</span>
                  <span>{priceRange[1].toLocaleString("vi-VN")}đ</span>
                </div>
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <h3 className="font-semibold mb-3">Kích thước</h3>
              <div className="flex flex-wrap gap-2">
                {allSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`px-3 py-1 border rounded ${
                      selectedSizes.includes(size)
                        ? "bg-orange-500 text-white border-orange-500"
                        : "border-gray-300 hover:border-orange-500"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div>
              <h3 className="font-semibold mb-3">Màu sắc</h3>
              <div className="flex flex-wrap gap-2">
                {allColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => toggleColor(color)}
                    className={`px-3 py-1 border rounded text-sm ${
                      selectedColors.includes(color)
                        ? "bg-orange-500 text-white border-orange-500"
                        : "border-gray-300 hover:border-orange-500"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <h3 className="font-semibold mb-3">Thương hiệu</h3>
              <div className="space-y-2">
                {allBrands.map((brand) => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="w-4 h-4 text-orange-500 rounded"
                    />
                    <span className="text-sm">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h3 className="font-semibold mb-3">Đánh giá</h3>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === rating}
                      onChange={() => setMinRating(rating)}
                      className="w-4 h-4 text-orange-500"
                    />
                    <span className="text-sm">Từ {rating} sao trở lên</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="w-full py-2 border border-orange-500 text-orange-500 rounded hover:bg-orange-50"
            >
              Xóa bộ lọc
            </button>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Sort and Filter Toggle */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded"
            >
              <Filter className="w-5 h-5" />
              Bộ lọc
            </button>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-gray-600">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="bestseller">Bán chạy</option>
                <option value="rating">Đánh giá cao</option>
              </select>
            </div>
          </div>

          {/* Products */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm phù hợp</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
