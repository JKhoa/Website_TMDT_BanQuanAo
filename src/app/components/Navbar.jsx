import { useState } from "react";
import { Link } from "react-router";
import { Search, ShoppingCart, Heart, User, Menu, X } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useAuth } from "../contexts/AuthContext";
import { categories } from "../data/products";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-black text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <p>Miễn phí vận chuyển cho đơn hàng trên 500.000đ</p>
          <div className="hidden md:flex gap-4">
            <Link to="/help" className="hover:text-gray-300">Hỗ trợ</Link>
            <Link to="/track" className="hover:text-gray-300">Theo dõi đơn hàng</Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            FASHION<span className="text-orange-500">SHOP</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className="hover:text-orange-500">Trang chủ</Link>
            <div
              className="relative"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <button className="hover:text-orange-500">Danh mục</button>
              {isMegaMenuOpen && (
                <div className="absolute left-0 top-full pt-2 w-screen max-w-4xl">
                  <div className="bg-white shadow-lg rounded-lg p-6 grid grid-cols-4 gap-6">
                    {categories.map((cat) => (
                      <div key={cat.id}>
                        <Link
                          to={`/products?category=${cat.id}`}
                          className="font-semibold text-lg mb-3 block hover:text-orange-500"
                        >
                          {cat.name}
                        </Link>
                        <ul className="space-y-2">
                          {cat.subcategories.map((sub) => (
                            <li key={sub.id}>
                              <Link
                                to={`/products?category=${cat.id}&subcategory=${sub.id}`}
                                className="text-gray-600 hover:text-orange-500 text-sm"
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Link to="/products?sale=true" className="hover:text-orange-500 text-red-500">
              Sale
            </Link>
            <Link to="/lookbook" className="hover:text-orange-500">Lookbook</Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full px-4 py-2 pr-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <Link to="/wishlist" className="relative hover:text-orange-500">
              <Heart className="w-6 h-6" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative hover:text-orange-500">
              <ShoppingCart className="w-6 h-6" />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>
            <Link to={user ? "/account" : "/login"} className="hover:text-orange-500">
              <User className="w-6 h-6" />
            </Link>
            <button
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full px-4 py-2 pr-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
            <Link to="/" className="block hover:text-orange-500">Trang chủ</Link>
            {categories.map((cat) => (
              <div key={cat.id}>
                <button
                  onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                  className="flex justify-between items-center w-full hover:text-orange-500"
                >
                  <span>{cat.name}</span>
                  <span>{activeCategory === cat.id ? "−" : "+"}</span>
                </button>
                {activeCategory === cat.id && (
                  <div className="ml-4 mt-2 space-y-2">
                    {cat.subcategories.map((sub) => (
                      <Link
                        key={sub.id}
                        to={`/products?category=${cat.id}&subcategory=${sub.id}`}
                        className="block text-gray-600 hover:text-orange-500"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link to="/products?sale=true" className="block hover:text-orange-500 text-red-500">
              Sale
            </Link>
            <Link to="/lookbook" className="block hover:text-orange-500">Lookbook</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
