import { useState, useEffect } from "react";
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, AlertTriangle, Trophy } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "../../services/api";
import { Link } from "react-router";
import { resolveImageUrl } from "../../utils/imageUrl";
import { products as localProducts } from "../../data/products";

// ── Mock fallback data for when backend is offline ──
function generateMockDashboard() {
  const now = new Date();
  const mockRevenueData = [];
  let totalRevenue = 0;
  let totalOrders = 0;

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const orders = isWeekend ? Math.floor(Math.random() * 15) + 12 : Math.floor(Math.random() * 10) + 6;
    const avgOrderValue = 400000 + Math.floor(Math.random() * 300000);
    const revenue = orders * avgOrderValue;
    totalRevenue += revenue;
    totalOrders += orders;
    mockRevenueData.push({
      date: d.toISOString().split("T")[0],
      revenue,
      orders
    });
  }

  return {
    stats: {
      totalRevenue,
      totalOrders,
      totalProducts: localProducts.length,
      totalCustomers: 20,
      pendingOrders: Math.floor(totalOrders * 0.05),
      completedOrders: Math.floor(totalOrders * 0.75),
      conversionRate: 75
    },
    recentOrders: [],
    lowStockProducts: localProducts.filter((p) => p.stock < 50).slice(0, 5).map((p) => ({
      ...p,
      sku: p.sku || "N/A"
    })),
    revenueData: mockRevenueData,
    topProducts: localProducts
      .sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
      .slice(0, 5)
      .map((p, i) => ({
        product_id: p.id,
        product_name: p.name,
        product_image: p.image,
        total_sold: Math.floor(Math.random() * 80) + 30,
        total_revenue: (p.salePrice || p.price) * (Math.floor(Math.random() * 80) + 30)
      }))
  };
}

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [dashRes, revRes, topRes] = await Promise.all([
        api.getDashboard(),
        api.getRevenue({ period: "daily", months: 3 }),
        api.getTopProducts(8)
      ]);

      // Check if API returned real data
      const hasRealData = dashRes.stats && dashRes.stats.totalOrders > 0;

      if (hasRealData) {
        setStats(dashRes);
        setRevenueData(revRes.data || []);
        setTopProducts(topRes.products || []);
        setUsingMock(false);
      } else {
        // API responded but DB is empty — use mock
        loadMockData();
      }
    } catch (error) {
      console.error("Dashboard error:", error);
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    const mock = generateMockDashboard();
    setStats(mock);
    setRevenueData(mock.revenueData);
    setTopProducts(mock.topProducts);
    setUsingMock(true);
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

  // Custom tooltip for currency
  const CurrencyTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white shadow-lg rounded-lg p-3 border text-sm">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }}>
            {entry.name}: {entry.name === "Doanh thu"
              ? `${Number(entry.value).toLocaleString("vi-VN")}đ`
              : entry.value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Mock Data Banner */}
      {usingMock && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">Đang hiển thị dữ liệu demo</p>
            <p className="text-xs text-amber-600">
              Chạy <code className="bg-amber-100 px-1 rounded">node server/src/seed-enrich.js</code> để nạp dữ liệu phong phú vào database.
            </p>
          </div>
          <button onClick={loadDashboard} className="text-sm text-amber-700 hover:underline whitespace-nowrap">Thử lại</button>
        </div>
      )}

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
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => { const d = new Date(v); return `${d.getDate()}/${d.getMonth() + 1}`; }}
              />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
              <Tooltip content={<CurrencyTooltip />} />
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
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => { const d = new Date(v); return `${d.getDate()}/${d.getMonth() + 1}`; }}
              />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CurrencyTooltip />} />
              <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Đơn hàng" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-bold">Sản phẩm bán chạy</h3>
          </div>
          <div className="space-y-3">
            {topProducts.length > 0 ? topProducts.map((item, index) => (
              <div key={item.product_id || index} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : index === 2 ? "bg-amber-600" : "bg-gray-300"
                  }`}>{index + 1}</span>
                  {item.product_image && (
                    <img src={resolveImageUrl(item.product_image)} alt="" className="w-10 h-10 rounded object-cover" />
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate max-w-[180px]">{item.product_name}</p>
                    <p className="text-xs text-gray-500">{item.total_sold} đã bán</p>
                  </div>
                </div>
                <span className="font-semibold text-sm text-orange-500 whitespace-nowrap">
                  {Number(item.total_revenue).toLocaleString("vi-VN")}đ
                </span>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-4">Chưa có dữ liệu</p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Đơn hàng gần đây</h3>
            <Link to="/admin/orders" className="text-orange-500 text-sm hover:underline">Xem tất cả</Link>
          </div>
          <div className="space-y-3">
            {stats.recentOrders?.length > 0 ? stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="font-medium">#{order.id}</p>
                  <p className="text-sm text-gray-500">{order.user?.name || order.shipping_name || "Khách"}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{Number(order.total).toLocaleString("vi-VN")}đ</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColor[order.status]}`}>
                    {statusMap[order.status]}
                  </span>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-4">Chưa có đơn hàng</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-bold">Sản phẩm sắp hết hàng</h3>
          </div>
          <div className="space-y-3">
            {stats.lowStockProducts?.length > 0 ? stats.lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <img src={resolveImageUrl(product.image)} alt={product.name} className="w-10 h-10 rounded object-cover" />
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${product.stock <= 5 ? "text-red-500" : "text-orange-500"}`}>
                  Còn {product.stock}
                </span>
              </div>
            )) : (
              <p className="text-green-500 text-center py-4">Tất cả sản phẩm đều đủ hàng ✓</p>
            )}
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">Tỷ lệ chuyển đổi</h3>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1 bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-orange-400 to-orange-600 h-4 rounded-full transition-all"
                style={{ width: `${stats.stats.conversionRate}%` }}
              />
            </div>
            <span className="text-2xl font-bold text-orange-500">{stats.stats.conversionRate}%</span>
          </div>
          <p className="text-sm text-gray-500">
            {stats.stats.completedOrders} / {stats.stats.totalOrders} đơn hoàn thành
          </p>
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-lg font-bold text-yellow-500">{stats.stats.pendingOrders}</p>
              <p className="text-xs text-gray-500">Chờ xác nhận</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-green-500">{stats.stats.completedOrders}</p>
              <p className="text-xs text-gray-500">Hoàn thành</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-red-400">{stats.stats.totalOrders - stats.stats.completedOrders - stats.stats.pendingOrders}</p>
              <p className="text-xs text-gray-500">Khác</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
