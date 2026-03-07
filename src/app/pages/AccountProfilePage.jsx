import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export function AccountProfilePage() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    toast.success("Cập nhật thông tin thành công!");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">Thông tin tài khoản</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Họ và tên</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Số điện thoại</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>

      {/* Change Password */}
      <div className="mt-12 pt-8 border-t">
        <h3 className="text-xl font-bold mb-6">Đổi mật khẩu</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Mật khẩu hiện tại</label>
            <input
              type="password"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Mật khẩu mới</label>
            <input
              type="password"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600">
            Đổi mật khẩu
          </button>
        </div>
      </div>
    </div>
  );
}
