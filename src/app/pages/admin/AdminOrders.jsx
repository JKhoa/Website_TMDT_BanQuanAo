import { useState, useEffect } from "react";
import { Search, Eye, ChevronDown } from "lucide-react";
import api from "../../services/api";
import { toast } from "sonner";
import { resolveImageUrl } from "../../utils/imageUrl";

const statusMap = {
  pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800" },
  shipping: { label: "Đang giao", color: "bg-purple-100 text-purple-800" },
  completed: { label: "Hoàn thành", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-800" }
};

const statusFlow = ["pending", "confirmed", "shipping", "completed"];

export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => { loadOrders(); }, [pagination.page, filterStatus]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params = { page: pagination.page, limit: 10 };
      if (filterStatus) params.status = filterStatus;
      const res = await api.getOrders(params);
      setOrders(res.orders);
      setPagination(res.pagination);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      toast.success(`Cập nhật trạng thái thành "${statusMap[newStatus].label}"`);
      loadOrders();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => { setFilterStatus(""); setPagination(p => ({ ...p, page: 1 })); }}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${!filterStatus ? "bg-orange-500 text-white" : "bg-white border hover:bg-gray-50"}`}
        >
          Tất cả
        </button>
        {Object.entries(statusMap).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => { setFilterStatus(key); setPagination(p => ({ ...p, page: 1 })); }}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${filterStatus === key ? "bg-orange-500 text-white" : "bg-white border hover:bg-gray-50"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Mã đơn</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Khách hàng</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Tổng tiền</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Trạng thái</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Ngày đặt</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12"><div className="animate-spin w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full mx-auto" /></td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-500">Không có đơn hàng nào</td></tr>
              ) : (
                orders.map((order) => (
                  <>
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">#{order.id}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium">{order.user?.name || order.shipping_name}</p>
                        <p className="text-xs text-gray-500">{order.user?.email}</p>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-orange-500">
                        {Number(order.total).toLocaleString("vi-VN")}đ
                      </td>
                      <td className="px-4 py-3 text-center">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`text-xs px-3 py-1 rounded-full border-0 cursor-pointer ${statusMap[order.status]?.color}`}
                        >
                          {Object.entries(statusMap).map(([key, { label }]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                          className="p-2 text-gray-500 hover:bg-gray-100 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                    {/* Expanded Details */}
                    {expandedOrder === order.id && (
                      <tr key={`detail-${order.id}`}>
                        <td colSpan={6} className="px-6 py-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold mb-2 text-sm">Sản phẩm</h4>
                              <div className="space-y-2">
                                {order.items?.map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-3">
                                    <img src={resolveImageUrl(item.product_image)} alt={item.product_name} className="w-10 h-10 rounded object-cover" />
                                    <div className="flex-1">
                                      <p className="text-sm">{item.product_name}</p>
                                      <p className="text-xs text-gray-500">Size: {item.size} | Màu: {item.color} | SL: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-semibold">{(Number(item.price) * item.quantity).toLocaleString("vi-VN")}đ</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2 text-sm">Giao hàng</h4>
                              <p className="text-sm">{order.shipping_name} - {order.shipping_phone}</p>
                              <p className="text-sm text-gray-600">{order.shipping_address}{order.shipping_ward && `, ${order.shipping_ward}`}{order.shipping_district && `, ${order.shipping_district}`}{order.shipping_city && `, ${order.shipping_city}`}</p>
                              <div className="mt-2 text-sm">
                                <p>Tạm tính: {Number(order.subtotal).toLocaleString("vi-VN")}đ</p>
                                <p>Phí ship: {Number(order.shipping_fee) === 0 ? "Miễn phí" : `${Number(order.shipping_fee).toLocaleString("vi-VN")}đ`}</p>
                                <p className="font-bold text-orange-500">Tổng: {Number(order.total).toLocaleString("vi-VN")}đ</p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 py-4 border-t">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setPagination(p => ({ ...p, page }))}
                className={`w-8 h-8 rounded ${pagination.page === page ? "bg-orange-500 text-white" : "hover:bg-gray-100"}`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
