import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Plus, Edit2, Trash2, MapPin } from "lucide-react";
import { toast } from "sonner";

export function AddressesPage() {
  const { user, addAddress, updateAddress, deleteAddress } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    isDefault: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateAddress(editingId, formData);
      toast.success("Cập nhật địa chỉ thành công!");
    } else {
      addAddress(formData);
      toast.success("Thêm địa chỉ thành công!");
    }
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: "", address: "", phone: "", isDefault: false });
  };

  const handleEdit = (address) => {
    setFormData(address);
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm("Bạn có chắc muốn xóa địa chỉ này?")) {
      deleteAddress(id);
      toast.success("Đã xóa địa chỉ");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Địa chỉ của tôi</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ name: "", address: "", phone: "", isDefault: false });
          }}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          <Plus className="w-5 h-5" />
          Thêm địa chỉ mới
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 border rounded-lg bg-gray-50">
          <h3 className="font-semibold mb-4">{editingId ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Tên địa chỉ</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ví dụ: Nhà riêng, Văn phòng..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Địa chỉ</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows="3"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Số điện thoại</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="w-4 h-4 text-orange-500 rounded"
              />
              <span className="text-sm">Đặt làm địa chỉ mặc định</span>
            </label>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              {editingId ? "Cập nhật" : "Thêm địa chỉ"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      {user?.addresses?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.addresses.map((address) => (
            <div
              key={address.id}
              className="border rounded-lg p-4 relative hover:border-orange-500 transition-colors"
            >
              {address.isDefault && (
                <span className="absolute top-4 right-4 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                  Mặc định
                </span>
              )}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{address.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{address.address}</p>
                  <p className="text-sm text-gray-600">{address.phone}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(address)}
                  className="flex items-center gap-1 text-sm text-orange-500 hover:text-orange-600"
                >
                  <Edit2 className="w-4 h-4" />
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>Chưa có địa chỉ nào được lưu</p>
        </div>
      )}
    </div>
  );
}
