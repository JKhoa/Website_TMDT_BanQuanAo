import { RouterProvider } from "react-router";
import { router } from "./routes";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "sonner";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" richColors />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
