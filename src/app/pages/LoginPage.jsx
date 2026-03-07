import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      const result = login(formData.email, formData.password);
      if (result.success) {
        toast.success("Đăng nhập thành công!");
        navigate("/account");
      }
    } else {
      // Register logic would go here
      toast.success("Đăng ký thành công!");
      navigate("/account");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            {isLogin ? "Đăng nhập" : "Đăng ký"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold mb-2">Họ và tên</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Mật khẩu</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            {isLogin && (
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-orange-500 rounded" />
                  <span className="text-sm">Ghi nhớ đăng nhập</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-orange-500 hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600"
            >
              {isLogin ? "Đăng nhập" : "Đăng ký"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-gray-600"
            >
              {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
              <span className="text-orange-500 hover:underline">
                {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
              </span>
            </button>
          </div>

          {/* Social Login */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border rounded-lg hover:bg-gray-50">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                <span>Tiếp tục với Google</span>
              </button>
              <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border rounded-lg hover:bg-gray-50">
                <img src="https://www.facebook.com/favicon.ico" alt="Facebook" className="w-5 h-5" />
                <span>Tiếp tục với Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
