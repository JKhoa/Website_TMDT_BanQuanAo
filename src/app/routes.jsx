import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import { Layout } from "./layouts/Layout";

// Lazy load pages for code-splitting
const HomePage = lazy(() => import("./pages/HomePage").then(m => ({ default: m.HomePage })));
const ProductListPage = lazy(() => import("./pages/ProductListPage").then(m => ({ default: m.ProductListPage })));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage").then(m => ({ default: m.ProductDetailPage })));
const CartPage = lazy(() => import("./pages/CartPage").then(m => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage").then(m => ({ default: m.CheckoutPage })));
const LoginPage = lazy(() => import("./pages/LoginPage").then(m => ({ default: m.LoginPage })));
const AccountPage = lazy(() => import("./pages/AccountPage").then(m => ({ default: m.AccountPage })));
const AccountProfilePage = lazy(() => import("./pages/AccountProfilePage").then(m => ({ default: m.AccountProfilePage })));
const OrdersPage = lazy(() => import("./pages/OrdersPage").then(m => ({ default: m.OrdersPage })));
const WishlistPage = lazy(() => import("./pages/WishlistPage").then(m => ({ default: m.WishlistPage })));
const AddressesPage = lazy(() => import("./pages/AddressesPage").then(m => ({ default: m.AddressesPage })));
const LookbookPage = lazy(() => import("./pages/LookbookPage").then(m => ({ default: m.LookbookPage })));
const SearchResultsPage = lazy(() => import("./pages/SearchResultsPage").then(m => ({ default: m.SearchResultsPage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })));
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage").then(m => ({ default: m.OrderSuccessPage })));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage").then(m => ({ default: m.ForgotPasswordPage })));
const AboutPage = lazy(() => import("./pages/AboutPage").then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import("./pages/ContactPage").then(m => ({ default: m.ContactPage })));
const FAQPage = lazy(() => import("./pages/FAQPage").then(m => ({ default: m.FAQPage })));
const PolicyPage = lazy(() => import("./pages/PolicyPage").then(m => ({ default: m.PolicyPage })));

// Admin pages
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout").then(m => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts").then(m => ({ default: m.AdminProducts })));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders").then(m => ({ default: m.AdminOrders })));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers").then(m => ({ default: m.AdminCustomers })));

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500">Đang tải...</p>
      </div>
    </div>
  );
}

function SuspenseWrapper({ children }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: Layout,
      children: [
        { index: true, element: <SuspenseWrapper><HomePage /></SuspenseWrapper> },
        { path: "products", element: <SuspenseWrapper><ProductListPage /></SuspenseWrapper> },
        { path: "product/:id", element: <SuspenseWrapper><ProductDetailPage /></SuspenseWrapper> },
        { path: "cart", element: <SuspenseWrapper><CartPage /></SuspenseWrapper> },
        { path: "checkout", element: <SuspenseWrapper><CheckoutPage /></SuspenseWrapper> },
        { path: "login", element: <SuspenseWrapper><LoginPage /></SuspenseWrapper> },
        { path: "forgot-password", element: <SuspenseWrapper><ForgotPasswordPage /></SuspenseWrapper> },
        { path: "wishlist", element: <SuspenseWrapper><WishlistPage /></SuspenseWrapper> },
        { path: "lookbook", element: <SuspenseWrapper><LookbookPage /></SuspenseWrapper> },
        { path: "search", element: <SuspenseWrapper><SearchResultsPage /></SuspenseWrapper> },
        { path: "order-success", element: <SuspenseWrapper><OrderSuccessPage /></SuspenseWrapper> },
        { path: "about", element: <SuspenseWrapper><AboutPage /></SuspenseWrapper> },
        { path: "contact", element: <SuspenseWrapper><ContactPage /></SuspenseWrapper> },
        { path: "faq", element: <SuspenseWrapper><FAQPage /></SuspenseWrapper> },
        { path: "help", element: <SuspenseWrapper><FAQPage /></SuspenseWrapper> },
        { path: "policy/:type", element: <SuspenseWrapper><PolicyPage /></SuspenseWrapper> },
        {
          path: "account",
          element: <SuspenseWrapper><AccountPage /></SuspenseWrapper>,
          children: [
            { index: true, element: <SuspenseWrapper><AccountProfilePage /></SuspenseWrapper> },
            { path: "orders", element: <SuspenseWrapper><OrdersPage /></SuspenseWrapper> },
            { path: "wishlist", element: <SuspenseWrapper><WishlistPage /></SuspenseWrapper> },
            { path: "addresses", element: <SuspenseWrapper><AddressesPage /></SuspenseWrapper> }
          ]
        },
        { path: "*", element: <SuspenseWrapper><NotFoundPage /></SuspenseWrapper> }
      ]
    },
    {
      path: "/admin",
      element: <SuspenseWrapper><AdminLayout /></SuspenseWrapper>,
      children: [
        { index: true, element: <SuspenseWrapper><AdminDashboard /></SuspenseWrapper> },
        { path: "products", element: <SuspenseWrapper><AdminProducts /></SuspenseWrapper> },
        { path: "orders", element: <SuspenseWrapper><AdminOrders /></SuspenseWrapper> },
        { path: "customers", element: <SuspenseWrapper><AdminCustomers /></SuspenseWrapper> }
      ]
    }
  ],
  {
    basename: import.meta.env.BASE_URL
  }
);
