import { useParams } from "react-router";
import { Link } from "react-router";
import { Shield, Truck, RefreshCcw } from "lucide-react";

const policies = {
  shipping: {
    title: "Chính Sách Giao Hàng",
    icon: Truck,
    sections: [
      { heading: "Phạm vi giao hàng", content: "FashionShop giao hàng toàn quốc, bao gồm tất cả 63 tỉnh thành tại Việt Nam." },
      { heading: "Phí vận chuyển", content: "• Miễn phí vận chuyển cho đơn hàng trên 500.000đ\n• Đơn hàng dưới 500.000đ: phí giao hàng tiêu chuẩn 30.000đ\n• Giao hàng nhanh: 50.000đ" },
      { heading: "Thời gian giao hàng", content: "• Giao hàng tiêu chuẩn: 3-5 ngày làm việc\n• Giao hàng nhanh: 1-2 ngày làm việc\n• Khu vực nội thành TP.HCM và Hà Nội: giao hàng trong ngày (đặt trước 12:00)" },
      { heading: "Theo dõi đơn hàng", content: "Bạn có thể theo dõi trạng thái đơn hàng qua mục 'Đơn hàng của tôi' trong tài khoản, hoặc liên hệ hotline 1900 xxxx." }
    ]
  },
  return: {
    title: "Chính Sách Đổi Trả",
    icon: RefreshCcw,
    sections: [
      { heading: "Điều kiện đổi trả", content: "• Sản phẩm chưa qua sử dụng, còn nguyên tem mác\n• Trong vòng 7 ngày kể từ ngày nhận hàng\n• Có hóa đơn mua hàng" },
      { heading: "Trường hợp được đổi trả", content: "• Sản phẩm bị lỗi do nhà sản xuất\n• Sản phẩm không đúng mô tả, màu sắc khác biệt\n• Sai size, sai sản phẩm\n• Sản phẩm bị hư hỏng trong quá trình vận chuyển" },
      { heading: "Trường hợp không được đổi trả", content: "• Sản phẩm đã qua sử dụng, giặt ủi\n• Không còn nguyên tem mác\n• Quá 7 ngày kể từ ngày nhận hàng\n• Hỏng do lỗi của khách hàng" },
      { heading: "Quy trình đổi trả", content: "1. Liên hệ hotline 1900 xxxx hoặc email support@fashionshop.vn\n2. Cung cấp mã đơn hàng và lý do đổi trả\n3. Gửi lại sản phẩm (miễn phí vận chuyển)\n4. Nhận sản phẩm mới hoặc hoàn tiền trong 3-5 ngày" }
    ]
  },
  privacy: {
    title: "Chính Sách Bảo Mật",
    icon: Shield,
    sections: [
      { heading: "Thu thập thông tin", content: "Chúng tôi thu thập các thông tin cần thiết khi bạn đăng ký tài khoản hoặc đặt hàng, bao gồm: họ tên, email, số điện thoại, địa chỉ giao hàng." },
      { heading: "Sử dụng thông tin", content: "• Xử lý đơn hàng và giao hàng\n• Gửi thông tin khuyến mãi (nếu bạn đồng ý)\n• Cải thiện dịch vụ và trải nghiệm khách hàng\n• Hỗ trợ khách hàng" },
      { heading: "Bảo vệ thông tin", content: "• Thông tin được mã hóa SSL\n• Không chia sẻ thông tin cá nhân cho bên thứ ba\n• Hệ thống bảo mật được cập nhật thường xuyên\n• Nhân viên được đào tạo về bảo mật dữ liệu" },
      { heading: "Quyền của khách hàng", content: "Bạn có quyền yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân bất cứ lúc nào bằng cách liên hệ chúng tôi qua email hoặc hotline." }
    ]
  }
};

export function PolicyPage() {
  const { type } = useParams();
  const policy = policies[type];

  if (!policy) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Trang không tồn tại</h1>
        <Link to="/" className="text-orange-500 hover:underline">
          Quay về trang chủ
        </Link>
      </div>
    );
  }

  const Icon = policy.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 text-orange-500" />
        </div>
        <h1 className="text-4xl font-bold mb-4">{policy.title}</h1>
      </div>

      <div className="space-y-8">
        {policy.sections.map((section, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-3 text-gray-900">{section.heading}</h2>
            <div className="text-gray-600 whitespace-pre-line leading-relaxed">
              {section.content}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-orange-50 rounded-lg p-6 text-center">
        <p className="text-gray-700 mb-2">Bạn cần thêm hỗ trợ?</p>
        <p className="text-gray-600 text-sm">
          Liên hệ hotline <span className="font-semibold">1900 xxxx</span> hoặc email{" "}
          <a href="mailto:support@fashionshop.vn" className="text-orange-500 hover:underline">
            support@fashionshop.vn
          </a>
        </p>
      </div>
    </div>
  );
}
