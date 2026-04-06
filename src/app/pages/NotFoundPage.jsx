import { Link } from "react-router";
import { Home, Search, ArrowLeft } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-9xl font-bold text-orange-500 mb-4">404</div>
        <h1 className="text-3xl font-bold mb-4">Trang không tồn tại</h1>
        <p className="text-gray-600 mb-8">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Home className="w-5 h-5" />
            Về trang chủ
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 border border-orange-500 text-orange-500 px-8 py-3 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <Search className="w-5 h-5" />
            Tìm sản phẩm
          </Link>
        </div>
      </div>
    </div>
  );
}
