import { createBrowserRouter, isRouteErrorResponse, useRouteError } from "react-router";
import { lazy, Suspense } from "react";
import { Layout } from "./layouts/Layout";

const CHUNK_ERROR_PATTERN = /Failed to fetch dynamically imported module|Importing a module script failed|Loading chunk [\d]+ failed/i;

function lazyWithRetry(importer, retryKey) {
  return lazy(async () => {
    try {
      return await importer();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      if (typeof window !== "undefined" && CHUNK_ERROR_PATTERN.test(message)) {
        const sessionKey = `lazy-retry:${retryKey}`;
        const alreadyRetried = sessionStorage.getItem(sessionKey);

        if (!alreadyRetried) {
          sessionStorage.setItem(sessionKey, "1");
          window.location.reload();
        } else {
          sessionStorage.removeItem(sessionKey);
        }
      }

      throw error;
    }
  });
}

// Lazy load pages for code-splitting
const HomePage = lazyWithRetry(() => import("./pages/HomePage").then(m => ({ default: m.HomePage })), "HomePage");
const ProductListPage = lazyWithRetry(() => import("./pages/ProductListPage").then(m => ({ default: m.ProductListPage })), "ProductListPage");
const ProductDetailPage = lazyWithRetry(() => import("./pages/ProductDetailPage").then(m => ({ default: m.ProductDetailPage })), "ProductDetailPage");
const CartPage = lazyWithRetry(() => import("./pages/CartPage").then(m => ({ default: m.CartPage })), "CartPage");
const CheckoutPage = lazyWithRetry(() => import("./pages/CheckoutPage").then(m => ({ default: m.CheckoutPage })), "CheckoutPage");
const LoginPage = lazyWithRetry(() => import("./pages/LoginPage").then(m => ({ default: m.LoginPage })), "LoginPage");
const AccountPage = lazyWithRetry(() => import("./pages/AccountPage").then(m => ({ default: m.AccountPage })), "AccountPage");
const AccountProfilePage = lazyWithRetry(() => import("./pages/AccountProfilePage").then(m => ({ default: m.AccountProfilePage })), "AccountProfilePage");
const OrdersPage = lazyWithRetry(() => import("./pages/OrdersPage").then(m => ({ default: m.OrdersPage })), "OrdersPage");
const WishlistPage = lazyWithRetry(() => import("./pages/WishlistPage").then(m => ({ default: m.WishlistPage })), "WishlistPage");
const AddressesPage = lazyWithRetry(() => import("./pages/AddressesPage").then(m => ({ default: m.AddressesPage })), "AddressesPage");
const LookbookPage = lazyWithRetry(() => import("./pages/LookbookPage").then(m => ({ default: m.LookbookPage })), "LookbookPage");
const SearchResultsPage = lazyWithRetry(() => import("./pages/SearchResultsPage").then(m => ({ default: m.SearchResultsPage })), "SearchResultsPage");
const NotFoundPage = lazyWithRetry(() => import("./pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })), "NotFoundPage");
const OrderSuccessPage = lazyWithRetry(() => import("./pages/OrderSuccessPage").then(m => ({ default: m.OrderSuccessPage })), "OrderSuccessPage");
const ForgotPasswordPage = lazyWithRetry(() => import("./pages/ForgotPasswordPage").then(m => ({ default: m.ForgotPasswordPage })), "ForgotPasswordPage");
const AboutPage = lazyWithRetry(() => import("./pages/AboutPage").then(m => ({ default: m.AboutPage })), "AboutPage");
const ContactPage = lazyWithRetry(() => import("./pages/ContactPage").then(m => ({ default: m.ContactPage })), "ContactPage");
const FAQPage = lazyWithRetry(() => import("./pages/FAQPage").then(m => ({ default: m.FAQPage })), "FAQPage");
const PolicyPage = lazyWithRetry(() => import("./pages/PolicyPage").then(m => ({ default: m.PolicyPage })), "PolicyPage");

// Admin pages
const AdminLayout = lazyWithRetry(() => import("./pages/admin/AdminLayout").then(m => ({ default: m.AdminLayout })), "AdminLayout");
const AdminDashboard = lazyWithRetry(() => import("./pages/admin/AdminDashboard").then(m => ({ default: m.AdminDashboard })), "AdminDashboard");
const AdminProducts = lazyWithRetry(() => import("./pages/admin/AdminProducts").then(m => ({ default: m.AdminProducts })), "AdminProducts");
const AdminOrders = lazyWithRetry(() => import("./pages/admin/AdminOrders").then(m => ({ default: m.AdminOrders })), "AdminOrders");
const AdminCustomers = lazyWithRetry(() => import("./pages/admin/AdminCustomers").then(m => ({ default: m.AdminCustomers })), "AdminCustomers");

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

function RouteErrorFallback() {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : "Đã xảy ra lỗi không mong muốn";

  const isChunkError = CHUNK_ERROR_PATTERN.test(message);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-sm border p-6 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Không thể tải trang</h2>
        <p className="text-gray-600">
          {isChunkError
            ? "Website vừa được cập nhật. Vui lòng tải lại để nhận phiên bản mới nhất."
            : "Đã có lỗi xảy ra khi mở trang này."}
        </p>
        <p className="text-sm text-gray-500 break-all">{message}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600"
          >
            Tải lại trang
          </button>
          <a
            href={import.meta.env.BASE_URL}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: Layout,
      errorElement: <RouteErrorFallback />,
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
        {
          path: "admin",
          element: <SuspenseWrapper><AdminLayout /></SuspenseWrapper>,
          errorElement: <RouteErrorFallback />,
          children: [
            { index: true, element: <SuspenseWrapper><AdminDashboard /></SuspenseWrapper> },
            { path: "products", element: <SuspenseWrapper><AdminProducts /></SuspenseWrapper> },
            { path: "orders", element: <SuspenseWrapper><AdminOrders /></SuspenseWrapper> },
            { path: "customers", element: <SuspenseWrapper><AdminCustomers /></SuspenseWrapper> }
          ]
        },
        { path: "*", element: <SuspenseWrapper><NotFoundPage /></SuspenseWrapper> }
      ]
    }
  ],
  {
    basename: import.meta.env.BASE_URL
  }
);
