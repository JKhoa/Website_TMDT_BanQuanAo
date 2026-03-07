import { useState } from "react";
import { useNavigate } from "react-router";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { CreditCard, Wallet, Building2, Check } from "lucide-react";
import { toast } from "sonner";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user, createOrder } = useAuth();

  const [step, setStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    district: "",
    ward: ""
  });
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const subtotal = getCartTotal();
  const shippingFee = shippingMethod === "express" ? 50000 : subtotal > 500000 ? 0 : 30000;
  const total = subtotal + shippingFee;

  const handleSubmitShipping = (e) => {
    e.preventDefault();
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    setStep(2);
  };

  const handleSubmitShippingMethod = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    setStep(4);
  };

  const handleConfirmOrder = () => {
    const order = {
      items: cart,
      shippingInfo,
      shippingMethod,
      paymentMethod,
      subtotal,
      shippingFee,
      total
    };

    createOrder(order);
    clearCart();
    toast.success("Đặt hàng thành công!");
    navigate("/account/orders");
  };

  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= s ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {step > s ? <Check className="w-6 h-6" /> : s}
              </div>
              {s < 4 && (
                <div
                  className={`w-20 h-1 ${step > s ? "bg-orange-500" : "bg-gray-200"}`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span className={step >= 1 ? "text-orange-500" : "text-gray-600"}>Địa chỉ</span>
          <span className={step >= 2 ? "text-orange-500" : "text-gray-600"}>Vận chuyển</span>
          <span className={step >= 3 ? "text-orange-500" : "text-gray-600"}>Thanh toán</span>
          <span className={step >= 4 ? "text-orange-500" : "text-gray-600"}>Xác nhận</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step 1: Shipping Address */}
          {step === 1 && (
            <form onSubmit={handleSubmitShipping} className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">Thông tin giao hàng</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Họ và tên *</label>
                    <input
                      type="text"
                      value={shippingInfo.name}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Số điện thoại *</label>
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Địa chỉ *</label>
                  <input
                    type="text"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Số nhà, tên đường"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Phường/Xã</label>
                    <input
                      type="text"
                      value={shippingInfo.ward}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, ward: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Quận/Huyện</label>
                    <input
                      type="text"
                      value={shippingInfo.district}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, district: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Tỉnh/Thành phố</label>
                    <input
                      type="text"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-6 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600"
              >
                Tiếp tục
              </button>
            </form>
          )}

          {/* Step 2: Shipping Method */}
          {step === 2 && (
            <form onSubmit={handleSubmitShippingMethod} className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">Phương thức vận chuyển</h2>
              <div className="space-y-4">
                <label className="flex items-center p-4 border rounded cursor-pointer hover:border-orange-500">
                  <input
                    type="radio"
                    name="shipping"
                    value="standard"
                    checked={shippingMethod === "standard"}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="w-5 h-5 text-orange-500"
                  />
                  <div className="ml-4 flex-1">
                    <div className="font-semibold">Giao hàng tiêu chuẩn</div>
                    <div className="text-sm text-gray-600">3-5 ngày làm việc</div>
                  </div>
                  <div className="font-semibold">
                    {subtotal > 500000 ? "Miễn phí" : "30.000đ"}
                  </div>
                </label>
                <label className="flex items-center p-4 border rounded cursor-pointer hover:border-orange-500">
                  <input
                    type="radio"
                    name="shipping"
                    value="express"
                    checked={shippingMethod === "express"}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="w-5 h-5 text-orange-500"
                  />
                  <div className="ml-4 flex-1">
                    <div className="font-semibold">Giao hàng nhanh</div>
                    <div className="text-sm text-gray-600">1-2 ngày làm việc</div>
                  </div>
                  <div className="font-semibold">50.000đ</div>
                </label>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600"
                >
                  Tiếp tục
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Payment Method */}
          {step === 3 && (
            <form onSubmit={handleSubmitPayment} className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">Phương thức thanh toán</h2>
              <div className="space-y-4">
                <label className="flex items-center p-4 border rounded cursor-pointer hover:border-orange-500">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-orange-500"
                  />
                  <Wallet className="ml-4 w-6 h-6 text-gray-600" />
                  <div className="ml-4">
                    <div className="font-semibold">Thanh toán khi nhận hàng (COD)</div>
                    <div className="text-sm text-gray-600">Thanh toán bằng tiền mặt khi nhận hàng</div>
                  </div>
                </label>
                <label className="flex items-center p-4 border rounded cursor-pointer hover:border-orange-500">
                  <input
                    type="radio"
                    name="payment"
                    value="bank"
                    checked={paymentMethod === "bank"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-orange-500"
                  />
                  <Building2 className="ml-4 w-6 h-6 text-gray-600" />
                  <div className="ml-4">
                    <div className="font-semibold">Chuyển khoản ngân hàng</div>
                    <div className="text-sm text-gray-600">Chuyển khoản qua internet banking</div>
                  </div>
                </label>
                <label className="flex items-center p-4 border rounded cursor-pointer hover:border-orange-500">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-orange-500"
                  />
                  <CreditCard className="ml-4 w-6 h-6 text-gray-600" />
                  <div className="ml-4">
                    <div className="font-semibold">Thanh toán bằng thẻ</div>
                    <div className="text-sm text-gray-600">Visa, Mastercard, JCB</div>
                  </div>
                </label>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600"
                >
                  Tiếp tục
                </button>
              </div>
            </form>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">Xác nhận đơn hàng</h2>
              
              {/* Shipping Info */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Thông tin giao hàng</h3>
                <div className="text-sm text-gray-600">
                  <p>{shippingInfo.name} - {shippingInfo.phone}</p>
                  <p>{shippingInfo.address}, {shippingInfo.ward}, {shippingInfo.district}, {shippingInfo.city}</p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-orange-500 hover:underline mt-2"
                >
                  Chỉnh sửa
                </button>
              </div>

              {/* Items */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Sản phẩm ({cart.length})</h3>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3 text-sm">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-gray-600">Size: {item.size}, Màu: {item.color}</p>
                        <p className="text-gray-600">SL: {item.quantity}</p>
                      </div>
                      <div className="font-semibold">
                        {((item.salePrice || item.price) * item.quantity).toLocaleString("vi-VN")}đ
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleConfirmOrder}
                className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600"
              >
                Xác nhận đặt hàng
              </button>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>
            <div className="space-y-3 mb-6 pb-6 border-b">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính</span>
                <span>{subtotal.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span>{shippingFee === 0 ? "Miễn phí" : `${shippingFee.toLocaleString("vi-VN")}đ`}</span>
              </div>
            </div>
            <div className="flex justify-between text-xl font-bold">
              <span>Tổng cộng</span>
              <span className="text-orange-500">{total.toLocaleString("vi-VN")}đ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
