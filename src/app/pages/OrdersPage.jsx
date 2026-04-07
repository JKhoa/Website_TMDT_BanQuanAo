import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Package, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { Link } from "react-router";
import { resolveImageUrl } from "../utils/imageUrl";

const statusMap = {
  pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800" },
  processing: { label: "Đang xử lý", color: "bg-blue-100 text-blue-800" },
  shipping: { label: "Đang giao hàng", color: "bg-purple-100 text-purple-800" },
  delivered: { label: "Đã giao", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-800" }
};

export function OrdersPage() {
  const { orders } = useAuth();
  const [expandedOrder, setExpandedOrder] = useState(null);

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h2>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-xl font-bold mb-2">Chưa có đơn hàng</p>
          <p className="text-gray-600 mb-6">Hãy bắt đầu mua sắm ngay!</p>
          <Link
            to="/products"
            className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600"
          >
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusMap[order.status] || statusMap.pending;
            const isExpanded = expandedOrder === order.id;

            return (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                {/* Order Header */}
                <button
                  onClick={() => toggleOrder(order.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div>
                      <p className="font-semibold flex items-center gap-2">
                        Đơn hàng #{order.id}
                        <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.date).toLocaleDateString("vi-VN")} • {order.items?.length || 0} sản phẩm
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-orange-500">
                      {order.total?.toLocaleString("vi-VN")}đ
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Order Details */}
                {isExpanded && (
                  <div className="border-t">
                    {/* Items */}
                    <div className="p-4 space-y-3">
                      {order.items?.map((item, idx) => (
                        <Link
                          key={idx}
                          to={`/product/${item.id}`}
                          className="flex gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
                        >
                          <img
                            src={resolveImageUrl(item.image)}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded"
                            loading="lazy"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              Size: {item.size} | Màu: {item.color}
                            </p>
                            <p className="text-sm text-gray-600">
                              Số lượng: {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold">
                            {((item.salePrice || item.price) * item.quantity).toLocaleString("vi-VN")}đ
                          </p>
                        </Link>
                      ))}
                    </div>

                    {/* Shipping Info */}
                    {order.shippingInfo && (
                      <div className="p-4 border-t bg-gray-50">
                        <h4 className="font-semibold mb-2 text-sm">Thông tin giao hàng</h4>
                        <p className="text-sm text-gray-600">
                          {order.shippingInfo.name} - {order.shippingInfo.phone}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.shippingInfo.address}
                          {order.shippingInfo.ward && `, ${order.shippingInfo.ward}`}
                          {order.shippingInfo.district && `, ${order.shippingInfo.district}`}
                          {order.shippingInfo.city && `, ${order.shippingInfo.city}`}
                        </p>
                      </div>
                    )}

                    {/* Summary */}
                    <div className="p-4 border-t">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Tạm tính</span>
                        <span>{order.subtotal?.toLocaleString("vi-VN")}đ</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Phí vận chuyển</span>
                        <span>{order.shippingFee === 0 ? "Miễn phí" : `${order.shippingFee?.toLocaleString("vi-VN")}đ`}</span>
                      </div>
                      <div className="flex justify-between font-semibold pt-2 border-t">
                        <span>Tổng cộng</span>
                        <span className="text-orange-500">{order.total?.toLocaleString("vi-VN")}đ</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
