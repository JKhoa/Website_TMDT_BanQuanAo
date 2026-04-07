import { Link } from "react-router";
import { Heart, ShoppingCart } from "lucide-react";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";
import { toast } from "sonner";
import { resolveImageUrl } from "../utils/imageUrl";

export function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product, product.sizes[0], product.colors[0], 1);
    toast.success("Đã thêm vào giỏ hàng!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sản phẩm yêu thích</h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-24 h-24 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold mb-4">Chưa có sản phẩm yêu thích</h2>
          <p className="text-gray-600 mb-8">Hãy thêm các sản phẩm bạn thích vào danh sách này</p>
          <Link
            to="/products"
            className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden group">
              <Link to={`/product/${product.id}`} className="block relative aspect-square bg-gray-100">
                <img
                  src={resolveImageUrl(product.image)}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>

              <div className="p-4">
                <Link
                  to={`/product/${product.id}`}
                  className="font-medium mb-2 line-clamp-2 hover:text-orange-500"
                >
                  {product.name}
                </Link>

                <div className="flex items-center gap-2 mb-3">
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

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-orange-500 text-white py-2 rounded hover:bg-orange-600 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span className="text-sm">Thêm vào giỏ</span>
                  </button>
                  <button
                    onClick={() => {
                      removeFromWishlist(product.id);
                      toast.success("Đã xóa khỏi yêu thích");
                    }}
                    className="p-2 border border-gray-300 rounded hover:bg-red-50 hover:border-red-500 hover:text-red-500"
                  >
                    <Heart className="w-5 h-5" fill="currentColor" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
