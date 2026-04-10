import { Link } from "react-router";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      toast.success("Đăng ký nhận tin thành công!");
      setNewsletterEmail("");
    }
  };

  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              FASHION<span className="text-orange-500">SHOP</span>
            </h3>
            <p className="text-gray-400 mb-4">
              Thời trang hiện đại, chất lượng cao với giá cả phải chăng.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-orange-500">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-orange-500">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-orange-500">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Liên kết</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/about" className="hover:text-orange-500">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-orange-500">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/lookbook" className="hover:text-orange-500">
                  Lookbook
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-orange-500">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Hỗ trợ khách hàng</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/policy/shipping" className="hover:text-orange-500">
                  Chính sách giao hàng
                </Link>
              </li>
              <li>
                <Link to="/policy/return" className="hover:text-orange-500">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link to="/policy/privacy" className="hover:text-orange-500">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-orange-500">
                  Câu hỏi thường gặp
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <span>123 Đường ABC, Quận 1, TP.HCM</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span>1900 6868</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>support@fashionshop.vn</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md mx-auto text-center">
            <h4 className="font-semibold mb-2">Đăng ký nhận tin</h4>
            <p className="text-gray-400 text-sm mb-4">
              Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt
            </p>
            <form onSubmit={handleNewsletter} className="flex gap-2">
              <input
                type="email"
                placeholder="Email của bạn"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-orange-500"
                required
              />
              <button type="submit" className="px-6 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors">
                Đăng ký
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>&copy; 2026 FashionShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
