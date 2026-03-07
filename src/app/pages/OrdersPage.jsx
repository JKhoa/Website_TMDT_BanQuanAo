import { useAuth } from "../contexts/AuthContext";
import { Package, Clock, Truck, CheckCircle, XCircle } from "lucide-react";

export function OrdersPage() {
  const { orders, cancelOrder } = useAuth();

  const getStatusInfo = (status) => {
    switch (status) {
      case "pending":
        return { label: "Chờ xác nhận", icon: Clock, color: "text-yellow-600 bg-yellow-50" };
      case "processing":
        return { label: "Đang xử lý", icon: Package, color: "text-blue-600 bg-blue-50" };
      case "shipped":
        return { label: "Đang giao", icon: Truck, color: "text-purple-600 bg-purple-50" };
      case "delivered":
        return { label: "Đã giao", icon: CheckCircle, color: "text-green-600 bg-green-50" };
      case "cancelled":
        return { label: "Đã hủy", icon: XCircle, color: "text-red-600 bg-red-50" };
      default:
        return { label: status, icon: Package, color: "text-gray-600 bg-gray-50" };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h2>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600">Bạn chưa có đơn hàng nào</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;

            return (
              <div key={order.id} className="border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Mã đơn hàng: <span className="font-semibold">#{order.id}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Ngày đặt: {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusInfo.color}`}>
                    <StatusIcon className="w-5 h-5" />
                    <span className="font-semibold">{statusInfo.label}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3 mb-4">
                  {order.items.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Size: {item.size}, Màu: {item.color}
                        </p>
                        <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-orange-500">
                          {((item.salePrice || item.price) * item.quantity).toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t pt-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">
                      Tổng cộng:{" "}
                      <span className="text-xl font-bold text-orange-500">
                        {order.total.toLocaleString("vi-VN")}đ
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {order.status === "pending" && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50"
                      >
                        Hủy đơn
                      </button>
                    )}
                    <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
                      Chi tiết
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
