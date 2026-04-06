import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Heart, ShoppingCart, Star, Minus, Plus, Truck, Shield, RefreshCcw, Zap, ThumbsUp } from "lucide-react";
import { products, mockReviews } from "../data/products";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { ProductCard } from "../components/ProductCard";
import { toast } from "sonner";

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === parseInt(id));
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
        <Link to="/products" className="text-orange-500 hover:underline">
          Quay lại danh sách sản phẩm
        </Link>
      </div>
    );
  }

  const productReviews = mockReviews.filter((r) => r.productId === product.id);
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const categoryName = { nam: "Nam", nu: "Nữ", "tre-em": "Trẻ em", "phu-kien": "Phụ kiện" };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Vui lòng chọn kích thước");
      return;
    }
    if (!selectedColor) {
      toast.error("Vui lòng chọn màu sắc");
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
    toast.success("Đã thêm vào giỏ hàng!");
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error("Vui lòng chọn kích thước");
      return;
    }
    if (!selectedColor) {
      toast.error("Vui lòng chọn màu sắc");
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
    navigate("/checkout");
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá");
      return;
    }
    toast.success("Cảm ơn bạn đã đánh giá sản phẩm!");
    setNewReview({ rating: 5, comment: "" });
  };

  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
        <Link to="/" className="hover:text-orange-500">Trang chủ</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category}`} className="hover:text-orange-500">
          {categoryName[product.category] || product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Images */}
        <div>
          <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-gray-100">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === idx ? "border-orange-500" : "border-gray-200"
                }`}
              >
                <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-sm text-gray-500 mb-4">SKU: {product.sku}</p>

          {/* Rating */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {product.rating} ({product.reviews} đánh giá)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              {product.salePrice ? (
                <>
                  <span className="text-3xl font-bold text-orange-500">
                    {product.salePrice.toLocaleString("vi-VN")}đ
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    {product.price.toLocaleString("vi-VN")}đ
                  </span>
                  <span className="bg-red-500 text-white px-3 py-1 rounded">
                    -{discount}%
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold">
                  {product.price.toLocaleString("vi-VN")}đ
                </span>
              )}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="font-semibold">Kích thước</label>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-6 py-2 border rounded transition-colors ${
                    selectedSize === size
                      ? "bg-orange-500 text-white border-orange-500"
                      : "border-gray-300 hover:border-orange-500"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <label className="font-semibold mb-3 block">Màu sắc</label>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-6 py-2 border rounded transition-colors ${
                    selectedColor === color
                      ? "bg-orange-500 text-white border-orange-500"
                      : "border-gray-300 hover:border-orange-500"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <label className="font-semibold mb-3 block">Số lượng</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-100">
                  <Minus className="w-5 h-5" />
                </button>
                <span className="px-6 py-2 border-x">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-2 hover:bg-gray-100">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <span className="text-sm text-gray-600">{product.stock} sản phẩm có sẵn</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mb-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              Thêm vào giỏ
            </button>
            <button
              onClick={() => {
                toggleWishlist(product);
                toast.success(isInWishlist(product.id) ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích");
              }}
              className={`px-6 py-3 border rounded-lg transition-colors ${
                isInWishlist(product.id) ? "bg-red-500 text-white border-red-500" : "border-gray-300 hover:border-orange-500"
              }`}
            >
              <Heart className="w-5 h-5" fill={isInWishlist(product.id) ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Buy Now */}
          <button
            onClick={handleBuyNow}
            className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 flex items-center justify-center gap-2 transition-colors mb-8"
          >
            <Zap className="w-5 h-5" />
            Mua ngay
          </button>

          {/* Features */}
          <div className="border-t pt-6 space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="w-5 h-5 text-orange-500" />
              <span>Miễn phí vận chuyển cho đơn hàng trên 500.000đ</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <RefreshCcw className="w-5 h-5 text-orange-500" />
              <span>Đổi trả miễn phí trong 7 ngày</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="w-5 h-5 text-orange-500" />
              <span>Bảo hành chính hãng</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-16">
        <div className="border-b mb-6">
          <div className="flex gap-8">
            {[
              { key: "description", label: "Mô tả sản phẩm" },
              { key: "specs", label: "Thông số" },
              { key: "reviews", label: `Đánh giá (${productReviews.length})` }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-4 transition-colors ${
                  activeTab === tab.key
                    ? "border-b-2 border-orange-500 text-orange-500"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "description" && (
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">{product.description}</p>
            {product.tags && (
              <div className="flex flex-wrap gap-2 mt-4">
                {product.tags.map((tag) => (
                  <span key={tag} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "specs" && (
          <div className="space-y-3">
            {[
              { label: "Thương hiệu", value: product.brand },
              { label: "Chất liệu", value: product.material },
              { label: "Hướng dẫn giặt", value: product.washGuide },
              { label: "SKU", value: product.sku }
            ].map((spec) => (
              <div key={spec.label} className="flex py-3 border-b">
                <span className="w-1/3 font-semibold">{spec.label}:</span>
                <span>{spec.value}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            {/* Review List */}
            {productReviews.length > 0 ? (
              <div className="space-y-6 mb-8">
                {productReviews.map((review) => (
                  <div key={review.id} className="border-b pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-orange-500 font-semibold">
                            {review.userName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold">{review.userName}</p>
                          <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString("vi-VN")}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{review.comment}</p>
                    <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500">
                      <ThumbsUp className="w-4 h-4" />
                      Hữu ích ({review.helpful})
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 mb-8">Chưa có đánh giá nào cho sản phẩm này.</p>
            )}

            {/* Write Review */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Viết đánh giá</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Đánh giá</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="p-1"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= newReview.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Nội dung</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows="4"
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Gửi đánh giá
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
