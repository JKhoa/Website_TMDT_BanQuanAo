import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export function AccountProfilePage() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender || "",
    birthday: user?.birthday || ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    updateProfile(formData);
    toast.success("Cập nhật thông tin thành công!");
    setIsEditing(false);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    if (!passwordData.currentPassword) {
      toast.error("Vui lòng nhập mật khẩu hiện tại");
      return;
    }
    // Mock password change
    toast.success("Đổi mật khẩu thành công!");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setShowPasswordForm(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Thông tin tài khoản</h2>

      {/* Profile Form */}
      <form onSubmit={handleUpdate} className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Họ và tên</label>
              <input
                type="text" value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email" value={formData.email}
                disabled
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Số điện thoại</label>
              <input
                type="tel" value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 disabled:text-gray-600"
                placeholder="0xx xxx xxxx"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Giới tính</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 disabled:text-gray-600"
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Ngày sinh</label>
              <input
                type="date"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          {isEditing ? (
            <>
              <button type="submit" className="bg-orange-500 text-white px-8 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                Lưu thay đổi
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="border px-8 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Hủy
              </button>
            </>
          ) : (
            <button type="button" onClick={() => setIsEditing(true)} className="bg-orange-500 text-white px-8 py-2 rounded-lg hover:bg-orange-600 transition-colors">
              Chỉnh sửa
            </button>
          )}
        </div>
      </form>

      {/* Password Change */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Đổi mật khẩu</h3>
          {!showPasswordForm && (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="text-orange-500 hover:underline text-sm"
            >
              Đổi mật khẩu
            </button>
          )}
        </div>

        {showPasswordForm && (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Mật khẩu hiện tại</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Mật khẩu mới</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
                minLength={6}
              />
              <p className="text-sm text-gray-500 mt-1">Ít nhất 6 ký tự</p>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div className="flex gap-4">
              <button type="submit" className="bg-orange-500 text-white px-8 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                Đổi mật khẩu
              </button>
              <button type="button" onClick={() => setShowPasswordForm(false)} className="border px-8 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Hủy
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
