import { Link, useSearchParams } from "react-router";
import { CheckCircle, Package, ArrowRight, ShoppingBag } from "lucide-react";

export function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-14 h-14 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Đặt hàng thành công!</h1>
        <p className="text-gray-600 mb-2">
          Cảm ơn bạn đã mua hàng tại FashionShop
        </p>
        {orderId && (
          <p className="text-gray-600 mb-2">
            Mã đơn hàng: <span className="font-semibold text-orange-500">#{orderId}</span>
          </p>
        )}
        <p className="text-gray-600 mb-8">
          Chúng tôi sẽ xác nhận đơn hàng qua email và tin nhắn SMS. 
          Dự kiến giao hàng trong <span className="font-semibold">3-5 ngày làm việc</span>.
        </p>

        <div className="bg-orange-50 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-center gap-2 text-orange-800 mb-2">
            <Package className="w-5 h-5" />
            <span className="font-semibold">Theo dõi đơn hàng</span>
          </div>
          <p className="text-sm text-orange-700">
            Bạn có thể theo dõi trạng thái đơn hàng trong mục "Đơn hàng của tôi"
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/account/orders"
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Package className="w-5 h-5" />
            Xem đơn hàng
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 border border-gray-300 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
}
