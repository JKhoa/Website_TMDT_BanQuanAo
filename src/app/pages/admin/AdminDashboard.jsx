import { useState, useEffect } from "react";
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import api from "../../services/api";
import { Link } from "react-router";

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [dashRes, revRes] = await Promise.all([
        api.getDashboard(),
        api.getRevenue({ period: "daily", months: 1 })
      ]);
      setStats(dashRes);
      setRevenueData(revRes.data || []);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!stats) return <p>Không thể tải dữ liệu</p>;

  const statCards = [
    { icon: DollarSign, label: "Tổng doanh thu", value: `${stats.stats.totalRevenue.toLocaleString("vi-VN")}đ`, color: "bg-green-500", change: "+12%" },
    { icon: ShoppingCart, label: "Tổng đơn hàng", value: stats.stats.totalOrders, color: "bg-blue-500", sub: `${stats.stats.pendingOrders} chờ xác nhận` },
    { icon: Package, label: "Sản phẩm", value: stats.stats.totalProducts, color: "bg-purple-500" },
    { icon: Users, label: "Khách hàng", value: stats.stats.totalCustomers, color: "bg-orange-500" },
  ];

  const statusMap = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    shipping: "Đang giao",
    completed: "Hoàn thành",
    cancelled: "Đã hủy"
  };
  const statusColor = {
    pending: "text-yellow-600 bg-yellow-100",
    confirmed: "text-blue-600 bg-blue-100",
    shipping: "text-purple-600 bg-purple-100",
    completed: "text-green-600 bg-green-100",
    cancelled: "text-red-600 bg-red-100"
  };

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.color} text-white`}>
                <card.icon className="w-6 h-6" />
              </div>
              {card.change && (
                <span className="flex items-center gap-1 text-green-500 text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  {card.change}
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold">{card.value}</h3>
            <p className="text-gray-500 text-sm">{card.label}</p>
            {card.sub && <p className="text-orange-500 text-xs mt-1">{card.sub}</p>}
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">Doanh thu theo ngày</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(value) => `${Number(value).toLocaleString("vi-VN")}đ`} />
              <Bar dataKey="revenue" fill="#f97316" radius={[4, 4, 0, 0]} name="Doanh thu" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">Đơn hàng theo ngày</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="Đơn hàng" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Đơn hàng gần đây</h3>
            <Link to="/admin/orders" className="text-orange-500 text-sm hover:underline">Xem tất cả</Link>
          </div>
          <div className="space-y-3">
            {stats.recentOrders?.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="font-medium">#{order.id}</p>
                  <p className="text-sm text-gray-500">{order.user?.name || "Khách"}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{Number(order.total).toLocaleString("vi-VN")}đ</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColor[order.status]}`}>
                    {statusMap[order.status]}
                  </span>
                </div>
              </div>
            ))}
            {(!stats.recentOrders || stats.recentOrders.length === 0) && (
              <p className="text-gray-500 text-center py-4">Chưa có đơn hàng</p>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-bold">Sản phẩm sắp hết hàng</h3>
          </div>
          <div className="space-y-3">
            {stats.lowStockProducts?.map((product) => (
              <div key={product.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover" />
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${product.stock <= 5 ? "text-red-500" : "text-orange-500"}`}>
                  Còn {product.stock}
                </span>
              </div>
            ))}
            {(!stats.lowStockProducts || stats.lowStockProducts.length === 0) && (
              <p className="text-green-500 text-center py-4">Tất cả sản phẩm đều đủ hàng ✓</p>
            )}
          </div>
        </div>
      </div>

      {/* Conversion Rate */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold mb-2">Tỷ lệ chuyển đổi</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-gray-200 rounded-full h-4">
            <div
              className="bg-orange-500 h-4 rounded-full transition-all"
              style={{ width: `${stats.stats.conversionRate}%` }}
            />
          </div>
          <span className="text-2xl font-bold text-orange-500">{stats.stats.conversionRate}%</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {stats.stats.completedOrders} / {stats.stats.totalOrders} đơn hoàn thành
        </p>
      </div>
    </div>
  );
}
