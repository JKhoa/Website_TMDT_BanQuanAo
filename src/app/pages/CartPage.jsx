import { Link } from "react-router";
import { Minus, Plus, X, ShoppingBag, Tag } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useState } from "react";
import { resolveImageUrl } from "../utils/imageUrl";
import { toast } from "sonner";

export function CartPage() {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const [voucher, setVoucher] = useState("");
  const [discount, setDiscount] = useState(0);

  const subtotal = getCartTotal();
  const shipping = subtotal > 500000 ? 0 : 30000;
  const total = subtotal - discount + shipping;

  const applyVoucher = () => {
    if (!voucher.trim()) {
      toast.error("Vui lòng nhập mã giảm giá");
      return;
    }
    // TODO: Integrate with backend voucher API when available
    if (voucher.toUpperCase() === "SALE10") {
      setDiscount(subtotal * 0.1);
      toast.success("Áp dụng mã giảm giá thành công! Giảm 10%");
    } else {
      setDiscount(0);
      toast.error("Mã giảm giá không hợp lệ hoặc đã hết hạn");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
        <p className="text-gray-600 mb-8">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
        <Link
          to="/products"
          className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            {cart.map((item, index) => (
              <div
                key={`${item.id}-${item.size}-${item.color}`}
                className={`p-6 ${index !== cart.length - 1 ? "border-b" : ""}`}
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <Link to={`/product/${item.id}`} className="flex-shrink-0">
                    <img
                      src={resolveImageUrl(item.image)}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <Link
                        to={`/product/${item.id}`}
                        className="font-semibold hover:text-orange-500"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id, item.size, item.color)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="text-sm text-gray-600 mb-2">
                      <p>Size: {item.size}</p>
                      <p>Màu: {item.color}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity */}
                      <div className="flex items-center border rounded">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.size, item.color, item.quantity - 1)
                          }
                          className="p-2 hover:bg-gray-100"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 border-x min-w-[60px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.size, item.color, item.quantity + 1)
                          }
                          className="p-2 hover:bg-gray-100"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-semibold text-orange-500">
                          {((item.salePrice || item.price) * item.quantity).toLocaleString("vi-VN")}đ
                        </p>
                        {item.salePrice && (
                          <p className="text-sm text-gray-400 line-through">
                            {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>

            {/* Voucher */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Mã giảm giá</label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={voucher}
                    onChange={(e) => setVoucher(e.target.value)}
                    placeholder="Nhập mã"
                    className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <button
                  onClick={applyVoucher}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                >
                  Áp dụng
                </button>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-3 mb-6 pb-6 border-b">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính</span>
                <span>{subtotal.toLocaleString("vi-VN")}đ</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá</span>
                  <span>-{discount.toLocaleString("vi-VN")}đ</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span>{shipping === 0 ? "Miễn phí" : `${shipping.toLocaleString("vi-VN")}đ`}</span>
              </div>
            </div>

            <div className="flex justify-between text-xl font-bold mb-6">
              <span>Tổng cộng</span>
              <span className="text-orange-500">{total.toLocaleString("vi-VN")}đ</span>
            </div>

            <Link
              to="/checkout"
              className="block w-full bg-orange-500 text-white text-center py-3 rounded-lg hover:bg-orange-600 mb-3"
            >
              Tiến hành thanh toán
            </Link>

            <Link
              to="/products"
              className="block w-full text-center py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Tiếp tục mua sắm
            </Link>

            {/* Free shipping notice */}
            {shipping > 0 && (
              <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-orange-800">
                  Mua thêm {(500000 - subtotal).toLocaleString("vi-VN")}đ để được miễn phí vận chuyển
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
