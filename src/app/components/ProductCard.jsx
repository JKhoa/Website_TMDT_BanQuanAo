import { memo } from "react";
import { Link } from "react-router";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";
import { toast } from "sonner";

export const ProductCard = memo(function ProductCard({ product }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, product.sizes[0], product.colors[0], 1);
    toast.success("Đã thêm vào giỏ hàng!");
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
    toast.success(
      isInWishlist(product.id) ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích"
    );
  };

  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {product.isNewArrival && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                Mới
              </span>
            )}
            {discount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                -{discount}%
              </span>
            )}
            {product.isFlashSale && (
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded animate-pulse">
                Flash Sale
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleToggleWishlist}
              className={`p-2 rounded-full ${
                isInWishlist(product.id)
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-700"
              } hover:scale-110 transition-transform shadow-sm`}
            >
              <Heart className="w-5 h-5" fill={isInWishlist(product.id) ? "currentColor" : "none"} />
            </button>
            <button
              onClick={handleAddToCart}
              className="p-2 bg-white rounded-full text-gray-700 hover:scale-110 transition-transform shadow-sm"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-medium mb-1 line-clamp-2 group-hover:text-orange-500 transition-colors">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            {product.salePrice ? (
              <>
                <span className="text-lg font-semibold text-orange-500">
                  {product.salePrice.toLocaleString("vi-VN")}đ
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {product.price.toLocaleString("vi-VN")}đ
                </span>
              </>
            ) : (
              <span className="text-lg font-semibold">
                {product.price.toLocaleString("vi-VN")}đ
              </span>
            )}
          </div>

          {/* Stock */}
          {product.stock < 10 && product.stock > 0 && (
            <p className="text-sm text-red-500 mt-2">Chỉ còn {product.stock} sản phẩm</p>
          )}
          {product.stock === 0 && (
            <p className="text-sm text-gray-500 mt-2">Hết hàng</p>
          )}
        </div>
      </div>
    </Link>
  );
});
