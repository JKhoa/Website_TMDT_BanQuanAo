import { Link } from "react-router";
import { ChevronRight, Clock } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { products, categories } from "../data/products";
import { useState, useEffect } from "react";

export function HomePage() {
  const [flashSaleTime, setFlashSaleTime] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setFlashSaleTime((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) hours = 23;
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 8);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 8);
  const flashSaleProducts = products.filter((p) => p.isFlashSale).slice(0, 4);

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[600px] bg-gradient-to-r from-orange-500 to-pink-500">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1761470744784-3e1ab858ab5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYmFubmVyJTIwbW9kZXJufGVufDF8fHx8MTc3Mjg3MjU2NHww&ixlib=rb-4.1.0&q=80&w=1080"
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
                  <div className="bg-white text-red-500 px-4 py-2 rounded-lg font-bold">
                    {String(flashSaleTime.hours).padStart(2, "0")}
                  </div>
                  <span className="text-2xl">:</span>
                  <div className="bg-white text-red-500 px-4 py-2 rounded-lg font-bold">
                    {String(flashSaleTime.minutes).padStart(2, "0")}
                  </div>
                  <span className="text-2xl">:</span>
                  <div className="bg-white text-red-500 px-4 py-2 rounded-lg font-bold">
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
            <Link
              to="/products?bestseller=true"
              className="text-orange-500 hover:text-orange-600 flex items-center gap-2"
            >
              Xem tất cả
              <ChevronRight className="w-5 h-5" />
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
            <Link
              to="/products?newarrival=true"
              className="text-orange-500 hover:text-orange-600 flex items-center gap-2"
            >
              Xem tất cả
              <ChevronRight className="w-5 h-5" />
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
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1590884226650-3611f205c13e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbG9va2Jvb2slMjBsaWZlc3R5bGV8ZW58MXx8fHwxNzcyODcyNTY0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Lookbook 1"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 flex items-end p-6">
                <div>
                  <h3 className="text-xl font-bold mb-1">Street Style</h3>
                  <p className="text-sm opacity-90">Phong cách đường phố năng động</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1747707500073-65dd5c1407b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBmZW1hbGUlMjBkcmVzc3xlbnwxfHx8fDE3NzI4NzI1NjF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Lookbook 2"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 flex items-end p-6">
                <div>
                  <h3 className="text-xl font-bold mb-1">Elegant</h3>
                  <p className="text-sm opacity-90">Thanh lịch và sang trọng</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1618008797651-3eb256213400?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBtYWxlJTIwc2hpcnR8ZW58MXx8fHwxNzcyODcyNTYwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Lookbook 3"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 flex items-end p-6">
                <div>
                  <h3 className="text-xl font-bold mb-1">Office</h3>
                  <p className="text-sm opacity-90">Chuyên nghiệp công sở</p>
                </div>
              </div>
            </div>
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
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Email của bạn"
              className="flex-1 px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button className="px-8 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors">
              Đăng ký
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
