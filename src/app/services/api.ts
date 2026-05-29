import { products as localProducts, categories } from "../data/products";

// A simplified API service to replace the old mock API,
// gradually moving towards direct Supabase calls.

class ApiService {
  // Auth is now handled by Supabase (Server Actions)
  login(...args: any[]) { throw new Error("Vui lòng sử dụng Server Action loginAction"); }
  register(...args: any[]) { throw new Error("Vui lòng sử dụng Server Action registerAction"); }
  logout(...args: any[]) { throw new Error("Vui lòng sử dụng Server Action logoutAction"); }
  getMe(...args: any[]) { return null; }
  updateProfile(...args: any[]) { throw new Error("Vui lòng sử dụng AuthContext updateProfile"); }
  changePassword(...args: any[]) { throw new Error("Vui lòng sử dụng Supabase API"); }

  // Products - Temporary fallback to static data until products table is fully populated
  async getProducts(params: any = {}) {
    let result = [...localProducts];
    
    if (params.category) {
      result = result.filter(p => p.category === params.category);
    }
    if (params.subcategory) {
      result = result.filter(p => p.subcategory === params.subcategory);
    }
    if (params.sale === 'true') {
      result = result.filter(p => p.salePrice != null);
    }
    
    return {
      products: result,
      pagination: { total: result.length, page: 1, limit: 100, totalPages: 1 }
    };
  }
  
  async getProduct(...args: any[]): Promise<any> {
    const p = localProducts.find(p => p.id === args[0]);
    if (!p) throw new Error("Sản phẩm không tồn tại");
    return p;
  }

  // Categories
  async getCategories() {
    return categories;
  }

  // Orders
  async getOrders(...args: any[]): Promise<any> {
    return { orders: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 1 } };
  }
  
  async getDashboard(...args: any[]): Promise<any> {
    return {
      stats: { totalRevenue: 0, totalOrders: 0, pendingOrders: 0, completedOrders: 0, totalProducts: 0, totalCustomers: 0, conversionRate: 0 },
      recentOrders: [],
      lowStockProducts: []
    };
  }

  async getCustomers(...args: any[]): Promise<any> {
    return { customers: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 1 } };
  }

  async getRevenue(...args: any[]): Promise<any> {
    return { labels: [], datasets: [] };
  }

  async getTopProducts(...args: any[]): Promise<any> {
    return [];
  }

  async updateOrderStatus(...args: any[]): Promise<any> { return true; }
  async updateProduct(...args: any[]): Promise<any> { return true; }
  async createProduct(...args: any[]): Promise<any> { return true; }
  async deleteProduct(...args: any[]): Promise<any> { return true; }
  async forgotPassword(...args: any[]): Promise<any> { return true; }
  async createReview(...args: any[]): Promise<any> { return true; }
}

const api = new ApiService();
export default api;
