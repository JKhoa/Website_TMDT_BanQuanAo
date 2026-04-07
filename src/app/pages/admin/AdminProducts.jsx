import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, X } from "lucide-react";
import api from "../../services/api";
import { toast } from "sonner";
import { resolveImageUrl } from "../../utils/imageUrl";

const emptyProduct = {
  name: "", sku: "", description: "", price: "", sale_price: "",
  stock: "", brand: "", material: "", category: "nam", subcategory: "",
  image: "", sizes: "S,M,L,XL", colors: "Đen,Trắng",
  tags: "", is_active: true, is_best_seller: false, is_new_arrival: false, is_flash_sale: false
};

export function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState(emptyProduct);

  useEffect(() => { loadProducts(); }, [pagination.page]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = { page: pagination.page, limit: 10 };
      if (search) params.search = search;
      const res = await api.getProducts(params);
      setProducts(res.products);
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
    loadProducts();
  };

  const openCreate = () => {
    setEditProduct(null);
    setFormData(emptyProduct);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setFormData({
      ...product,
      sizes: Array.isArray(product.sizes) ? product.sizes.join(",") : product.sizes || "",
      colors: Array.isArray(product.colors) ? product.colors.join(",") : product.colors || "",
      tags: Array.isArray(product.tags) ? product.tags.join(",") : product.tags || "",
      images: Array.isArray(product.images) ? product.images.join(",") : product.images || "",
      sale_price: product.sale_price || ""
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        price: Number(formData.price),
        sale_price: formData.sale_price ? Number(formData.sale_price) : null,
        stock: Number(formData.stock) || 0,
        sizes: formData.sizes ? formData.sizes.split(",").map(s => s.trim()) : [],
        colors: formData.colors ? formData.colors.split(",").map(s => s.trim()) : [],
        tags: formData.tags ? formData.tags.split(",").map(s => s.trim()) : [],
        images: formData.images ? (typeof formData.images === 'string' ? formData.images.split(",").map(s => s.trim()) : formData.images) : []
      };

      if (editProduct) {
        await api.updateProduct(editProduct.id, data);
        toast.success("Cập nhật sản phẩm thành công");
      } else {
        await api.createProduct(data);
        toast.success("Thêm sản phẩm thành công");
      }
      setShowModal(false);
      loadProducts();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (product) => {
    if (!confirm(`Xóa sản phẩm "${product.name}"?`)) return;
    try {
      await api.deleteProduct(product.id);
      toast.success("Xóa sản phẩm thành công");
      loadProducts();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm sản phẩm..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Tìm</button>
        </form>
        <button onClick={openCreate} className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
          <Plus className="w-5 h-5" />
          Thêm sản phẩm
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Sản phẩm</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">SKU</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Giá</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Kho</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Trạng thái</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12"><div className="animate-spin w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full mx-auto" /></td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-500">Không có sản phẩm nào</td></tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={resolveImageUrl(product.image)} alt={product.name} className="w-12 h-12 rounded object-cover" />
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{product.sku}</td>
                    <td className="px-4 py-3 text-right">
                      {product.sale_price ? (
                        <div>
                          <span className="text-orange-500 font-semibold">{Number(product.sale_price).toLocaleString("vi-VN")}đ</span>
                          <br />
                          <span className="text-xs text-gray-400 line-through">{Number(product.price).toLocaleString("vi-VN")}đ</span>
                        </div>
                      ) : (
                        <span className="font-semibold">{Number(product.price).toLocaleString("vi-VN")}đ</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-semibold ${product.stock < 10 ? "text-red-500" : "text-green-600"}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-1 rounded-full ${product.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {product.is_active ? "Hoạt động" : "Ẩn"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(product)} className="p-2 text-blue-500 hover:bg-blue-50 rounded">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(product)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">{editProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h2>
              <button onClick={() => setShowModal(false)}><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Tên *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">SKU *</label>
                  <input type="text" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Mô tả</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows="3" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Giá *</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Giá sale</label>
                  <input type="number" value={formData.sale_price} onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Kho *</label>
                  <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Danh mục</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                    <option value="nam">Nam</option>
                    <option value="nu">Nữ</option>
                    <option value="tre-em">Trẻ em</option>
                    <option value="phu-kien">Phụ kiện</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Thương hiệu</label>
                  <input type="text" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">URL hình ảnh</label>
                <input type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Sizes (cách nhau bởi dấu phẩy)</label>
                  <input type="text" value={formData.sizes} onChange={(e) => setFormData({ ...formData, sizes: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="S,M,L,XL" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Màu sắc (cách nhau bởi dấu phẩy)</label>
                  <input type="text" value={formData.colors} onChange={(e) => setFormData({ ...formData, colors: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Đen,Trắng" />
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2"><input type="checkbox" checked={formData.is_best_seller} onChange={(e) => setFormData({ ...formData, is_best_seller: e.target.checked })} /> Bán chạy</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={formData.is_new_arrival} onChange={(e) => setFormData({ ...formData, is_new_arrival: e.target.checked })} /> Hàng mới</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={formData.is_flash_sale} onChange={(e) => setFormData({ ...formData, is_flash_sale: e.target.checked })} /> Flash Sale</label>
              </div>
              <div className="flex gap-4 pt-4 border-t">
                <button type="submit" className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600">
                  {editProduct ? "Cập nhật" : "Thêm sản phẩm"}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border py-2 rounded-lg hover:bg-gray-50">Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
