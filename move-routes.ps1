New-Item -ItemType Directory -Force src/app/(shop)
Move-Item -Force src/app/page.tsx src/app/(shop)/page.tsx

# Create a route map mapping the old component to the new Next.js route path
$routes = @{
  'products' = 'ProductListPage.jsx'
  'product/[id]' = 'ProductDetailPage.jsx'
  'cart' = 'CartPage.jsx'
  'checkout' = 'CheckoutPage.jsx'
  'login' = 'LoginPage.jsx'
  'forgot-password' = 'ForgotPasswordPage.jsx'
  'wishlist' = 'WishlistPage.jsx'
  'lookbook' = 'LookbookPage.jsx'
  'search' = 'SearchResultsPage.jsx'
  'order-success' = 'OrderSuccessPage.jsx'
  'about' = 'AboutPage.jsx'
  'contact' = 'ContactPage.jsx'
  'faq' = 'FAQPage.jsx'
  'help' = 'FAQPage.jsx'
  'policy/[type]' = 'PolicyPage.jsx'
  'account' = 'AccountProfilePage.jsx'
  'account/orders' = 'OrdersPage.jsx'
  'account/wishlist' = 'WishlistPage.jsx'
  'account/addresses' = 'AddressesPage.jsx'
}

foreach ($route in $routes.Keys) {
  New-Item -ItemType Directory -Force "src/app/(shop)/$route"
  
  $componentFile = $routes[$route]
  $componentName = $componentFile.Replace('.jsx', '')
  
  $content = "import $componentName from '@/app/pages/$componentName';

export default function Page(props) {
  return <$componentName {...props} />;
}"
  
  Set-Content -Path "src/app/(shop)/$route/page.tsx" -Value $content
}

# Admin routes
$adminRoutes = @{
  '' = 'AdminDashboard.jsx'
  'products' = 'AdminProducts.jsx'
  'orders' = 'AdminOrders.jsx'
  'customers' = 'AdminCustomers.jsx'
}

New-Item -ItemType Directory -Force "src/app/admin"

foreach ($route in $adminRoutes.Keys) {
  if ($route -ne '') {
    New-Item -ItemType Directory -Force "src/app/admin/$route"
    $dest = "src/app/admin/$route/page.tsx"
  } else {
    $dest = "src/app/admin/page.tsx"
  }
  
  $componentFile = $adminRoutes[$route]
  $componentName = $componentFile.Replace('.jsx', '')
  
  $content = "import $componentName from '@/app/pages/admin/$componentName';

export default function Page(props) {
  return <$componentName {...props} />;
}"
  
  Set-Content -Path $dest -Value $content
}
