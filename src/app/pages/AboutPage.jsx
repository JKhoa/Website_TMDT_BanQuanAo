import { MapPin, Phone, Mail, Users, Award, Heart, Truck } from "lucide-react";
import { Link } from "react-router";

export function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Về FashionShop</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Thương hiệu thời trang Việt Nam với sứ mệnh mang đến phong cách hiện đại, 
          chất lượng cao với giá cả phải chăng cho mọi người.
        </p>
      </div>

      {/* Story */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
        <div>
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600"
            alt="FashionShop Store"
            className="rounded-lg w-full h-[400px] object-cover"
            loading="lazy"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4">Câu Chuyện Của Chúng Tôi</h2>
          <p className="text-gray-600 mb-4">
            FashionShop được thành lập năm 2020 với ước mơ đơn giản: giúp mọi người Việt Nam 
            có thể tiếp cận thời trang chất lượng mà không cần phải chi quá nhiều.
          </p>
          <p className="text-gray-600 mb-4">
            Từ một cửa hàng nhỏ tại TP.HCM, chúng tôi đã phát triển thành một thương hiệu 
            được hàng nghìn khách hàng tin tưởng trên toàn quốc, với hơn 10.000+ đơn hàng mỗi tháng.
          </p>
          <p className="text-gray-600">
            Chúng tôi luôn lắng nghe phản hồi của khách hàng để cải tiến sản phẩm và dịch vụ, 
            mang đến trải nghiệm mua sắm tốt nhất.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[
          { icon: Users, label: "Khách hàng", value: "50,000+" },
          { icon: Award, label: "Sản phẩm", value: "1,000+" },
          { icon: Heart, label: "Đánh giá 5 sao", value: "15,000+" },
          { icon: Truck, label: "Đơn hàng/tháng", value: "10,000+" }
        ].map((stat, i) => (
          <div key={i} className="bg-orange-50 rounded-lg p-6 text-center">
            <stat.icon className="w-8 h-8 text-orange-500 mx-auto mb-3" />
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-gray-600 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Values */}
      <div className="bg-gray-50 rounded-lg p-12 mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Giá Trị Cốt Lõi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Chất Lượng</h3>
            <p className="text-gray-600">Cam kết sử dụng nguyên liệu cao cấp, quy trình sản xuất nghiêm ngặt</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Tận Tâm</h3>
            <p className="text-gray-600">Luôn lắng nghe và phục vụ khách hàng với tâm huyết cao nhất</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Tiện Lợi</h3>
            <p className="text-gray-600">Giao hàng nhanh chóng, đổi trả dễ dàng, thanh toán linh hoạt</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Sẵn sàng khám phá?</h2>
        <Link
          to="/products"
          className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Mua sắm ngay
        </Link>
      </div>
    </div>
  );
}
