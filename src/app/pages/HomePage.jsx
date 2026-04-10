import { Link } from "react-router";
import { ChevronRight, Clock } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { products as localProducts, categories } from "../data/products";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "../services/api";

// Get flash sale end time from localStorage or set new one
function getFlashSaleEndTime() {
  const saved = localStorage.getItem("flashSaleEndTime");
  if (saved) {
    const end = new Date(saved);
    if (end > new Date()) return end;
  }
  // Set new end time: 24 hours from now
  const endTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
  localStorage.setItem("flashSaleEndTime", endTime.toISOString());
  return endTime;
}

export function HomePage() {
  const [flashSaleTime, setFlashSaleTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [newsletterEmail, setNewsletterEmail] = useState("");

  useEffect(() => {
    const endTime = getFlashSaleEndTime();

    const updateTimer = () => {
      const now = new Date();
      const diff = endTime - now;
      if (diff <= 0) {
        // Reset timer
        localStorage.removeItem("flashSaleEndTime");
        setFlashSaleTime({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setFlashSaleTime({ hours, minutes, seconds });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  const [bestSellers, setBestSellers] = useState(localProducts.filter((p) => p.isBestSeller).slice(0, 8));
  const [newArrivals, setNewArrivals] = useState(localProducts.filter((p) => p.isNewArrival).slice(0, 8));
  const [flashSaleProducts] = useState(localProducts.filter((p) => p.isFlashSale).slice(0, 4));

  // Try to fetch from API
  useEffect(() => {
    api.getProducts({ sort: 'bestseller', limit: 8 })
      .then((res) => { if (res.products?.length) setBestSellers(res.products); })
      .catch(() => {});
    api.getProducts({ sort: 'newest', limit: 8 })
      .then((res) => { if (res.products?.length) setNewArrivals(res.products); })
      .catch(() => {});
  }, []);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      toast.success("Đăng ký nhận tin thành công!");
      setNewsletterEmail("");
    }
  };

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[600px] bg-gradient-to-r from-orange-500 to-pink-500">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200"
            onError={(e) => { e.target.style.display = 'none'; }}
            alt="Hero Banner"
            className="w-full h-full object-cover opacity-90"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="max-w-xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Bộ Sưu Tập Mùa Xuân 2026
            </h1>
            <p className="text-xl mb-8">
              Khám phá xu hướng thời trang mới nhất với giá ưu đãi đặc biệt
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Mua ngay
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Flash Sale */}
      {flashSaleProducts.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-red-500 to-orange-500">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
              <div className="text-white mb-4 md:mb-0">
                <h2 className="text-3xl font-bold mb-2">⚡ Flash Sale</h2>
                <p>Ưu đãi có hạn - Nhanh tay kẻo lỡ!</p>
              </div>
              <div className="flex items-center gap-4 text-white">
                <Clock className="w-6 h-6" />
                <div className="flex gap-2">
                  <div className="bg-white text-red-500 px-4 py-2 rounded-lg font-bold min-w-[52px] text-center">
                    {String(flashSaleTime.hours).padStart(2, "0")}
                  </div>
                  <span className="text-2xl">:</span>
                  <div className="bg-white text-red-500 px-4 py-2 rounded-lg font-bold min-w-[52px] text-center">
                    {String(flashSaleTime.minutes).padStart(2, "0")}
                  </div>
                  <span className="text-2xl">:</span>
                  <div className="bg-white text-red-500 px-4 py-2 rounded-lg font-bold min-w-[52px] text-center">
                    {String(flashSaleTime.seconds).padStart(2, "0")}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {flashSaleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Danh Mục Sản Phẩm</h2>
            <p className="text-gray-600">Khám phá các danh mục thời trang của chúng tôi</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group relative aspect-square rounded-lg overflow-hidden"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6 text-white w-full">
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.subcategories.length} danh mục</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Sản Phẩm Bán Chạy</h2>
              <p className="text-gray-600">Những sản phẩm được yêu thích nhất</p>
            </div>
            <Link to="/products?sort=bestseller" className="text-orange-500 hover:text-orange-600 flex items-center gap-2">
              Xem tất cả <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Hàng Mới Về</h2>
              <p className="text-gray-600">Cập nhật xu hướng thời trang mới nhất</p>
            </div>
            <Link to="/products?sort=newest" className="text-orange-500 hover:text-orange-600 flex items-center gap-2">
              Xem tất cả <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Lookbook */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Lookbook Thời Trang</h2>
            <p className="text-gray-300">Cảm hứng phối đồ cho mọi phong cách</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Street Style", desc: "Phong cách đường phố năng động", img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600" },
              { title: "Elegant", desc: "Thanh lịch và sang trọng", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600" },
              { title: "Office", desc: "Chuyên nghiệp công sở", img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600" }
            ].map((item) => (
              <Link to="/lookbook" key={item.title} className="relative aspect-[3/4] rounded-lg overflow-hidden group">
                <img src={item.img} alt={item.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/30 flex items-end p-6">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                    <p className="text-sm opacity-90">{item.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Đăng Ký Nhận Tin</h2>
          <p className="text-gray-600 mb-8">
            Nhận thông tin về sản phẩm mới, khuyến mãi và xu hướng thời trang mới nhất
          </p>
          <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Email của bạn"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <button type="submit" className="px-8 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors">
              Đăng ký
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
