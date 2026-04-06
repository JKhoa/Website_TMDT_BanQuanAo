import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Vui lòng nhập email");
      return;
    }
    // Mock sending reset email
    setSent(true);
    toast.success("Đã gửi email khôi phục mật khẩu!");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {!sent ? (
            <>
              <h1 className="text-3xl font-bold text-center mb-4">
                Quên mật khẩu
              </h1>
              <p className="text-gray-600 text-center mb-8">
                Nhập email đăng ký của bạn, chúng tôi sẽ gửi hướng dẫn khôi phục mật khẩu.
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="example@email.com"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Gửi email khôi phục
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Đã gửi email!</h2>
              <p className="text-gray-600 mb-2">
                Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu đến:
              </p>
              <p className="font-semibold text-orange-500 mb-6">{email}</p>
              <p className="text-sm text-gray-500 mb-8">
                Vui lòng kiểm tra hộp thư đến (hoặc thư rác) và làm theo hướng dẫn.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-orange-500 hover:underline"
              >
                Gửi lại email
              </button>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
