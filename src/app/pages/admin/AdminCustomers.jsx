import { useState, useEffect } from "react";
import { Search, Mail, Phone, Calendar } from "lucide-react";
import api from "../../services/api";
import { toast } from "sonner";

export function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { loadCustomers(); }, [pagination.page]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const params = { page: pagination.page, limit: 10 };
      if (search) params.search = search;
      const res = await api.getCustomers(params);
      setCustomers(res.customers);
      setPagination(res.pagination);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(p => ({ ...p, page: 1 }));
    loadCustomers();
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm khách hàng..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Tìm</button>
      </form>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Khách hàng</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">SĐT</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Xác thực</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Ngày tham gia</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-12"><div className="animate-spin w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full mx-auto" /></td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-gray-500">Không có khách hàng nào</td></tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-500 font-semibold">{customer.name?.charAt(0)}</span>
                      </div>
                      <span className="font-medium">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{customer.email}</td>
                  <td className="px-4 py-3 text-center text-sm">{customer.phone || "—"}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${customer.email_verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {customer.email_verified ? "Đã xác thực" : "Chưa xác thực"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">
                    {(() => {
                      const d = new Date(customer.created_at || customer.createdAt);
                      return isNaN(d) ? "—" : d.toLocaleDateString("vi-VN");
                    })()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

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
