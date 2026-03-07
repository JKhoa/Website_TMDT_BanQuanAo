import { createBrowserRouter } from "react-router";
import { Layout } from "./layouts/Layout";
import { HomePage } from "./pages/HomePage";
import { ProductListPage } from "./pages/ProductListPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { LoginPage } from "./pages/LoginPage";
import { AccountPage } from "./pages/AccountPage";
import { AccountProfilePage } from "./pages/AccountProfilePage";
import { OrdersPage } from "./pages/OrdersPage";
import { WishlistPage } from "./pages/WishlistPage";
import { AddressesPage } from "./pages/AddressesPage";
import { LookbookPage } from "./pages/LookbookPage";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: Layout,
      children: [
        { index: true, Component: HomePage },
        { path: "products", Component: ProductListPage },
        { path: "product/:id", Component: ProductDetailPage },
        { path: "cart", Component: CartPage },
        { path: "checkout", Component: CheckoutPage },
        { path: "login", Component: LoginPage },
        { path: "wishlist", Component: WishlistPage },
        { path: "lookbook", Component: LookbookPage },
        {
          path: "account",
          Component: AccountPage,
          children: [
            { index: true, Component: AccountProfilePage },
            { path: "orders", Component: OrdersPage },
            { path: "wishlist", Component: WishlistPage },
            { path: "addresses", Component: AddressesPage }
          ]
        }
      ]
    }
  ],
  {
    basename: import.meta.env.BASE_URL
  }
);