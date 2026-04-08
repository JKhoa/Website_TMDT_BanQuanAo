const configuredApiBase = (import.meta.env.VITE_API_BASE_URL || '').trim();
const isGithubPages =
  typeof window !== 'undefined' && window.location.hostname.endsWith('github.io');
const shouldUseMockMode = import.meta.env.PROD && isGithubPages && !configuredApiBase;
const API_BASE = (configuredApiBase || 'http://localhost:3001/api').replace(/\/$/, '');

class ApiService {
  constructor() {
    this.baseUrl = API_BASE;
    this.useMockMode = shouldUseMockMode;
  }

  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('accessToken');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }

  async request(method, endpoint, body = null) {
    if (this.useMockMode) {
      return this.mockRequest(method, endpoint, body);
    }

    const config = {
      method,
      headers: this.getHeaders()
    };
    if (body) config.body = JSON.stringify(body);

    let response;
    try {
      response = await fetch(`${this.baseUrl}${endpoint}`, config);
    } catch (error) {
      if (this.isNetworkError(error)) {
        return this.mockRequest(method, endpoint, body);
      }
      throw error;
    }

    // Auto-refresh on 401
    if (response.status === 401) {
      const data = await response.json();
      if (data.code === 'TOKEN_EXPIRED') {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          config.headers = this.getHeaders();
          response = await fetch(`${this.baseUrl}${endpoint}`, config);
        }
      }
    }

    let result = {};
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      result = await response.json();
    } else if (!response.ok) {
      result = { error: 'Không thể kết nối backend API. Vui lòng cấu hình VITE_API_BASE_URL.' };
    }

    if (!response.ok) {
      throw new Error(result.error || 'Lỗi server');
    }
    return result;
  }

  isNetworkError(error) {
    if (!(error instanceof Error)) return false;
    return /Failed to fetch|NetworkError|Load failed/i.test(error.message);
  }

  mockRequest(method, endpoint, body = null) {
    const user = (() => {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    })();
    const orders = (() => {
      const raw = localStorage.getItem('orders');
      return raw ? JSON.parse(raw) : [];
    })();

    if (endpoint === '/auth/me' && method === 'GET') {
      if (!user) throw new Error('Bạn chưa đăng nhập');
      return { user };
    }
    if (endpoint === '/auth/logout' && method === 'POST') {
      return { success: true };
    }
    if (endpoint.startsWith('/orders') && method === 'GET') {
      return {
        orders,
        pagination: {
          total: orders.length,
          page: 1,
          limit: 10,
          totalPages: 1
        }
      };
    }
    if (endpoint === '/admin/dashboard' && method === 'GET') {
      return {
        stats: {
          totalRevenue: orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0),
          totalOrders: orders.length,
          pendingOrders: orders.filter((order) => order.status === 'pending').length,
          completedOrders: orders.filter((order) => order.status === 'completed').length,
          totalProducts: 0,
          totalCustomers: 0,
          conversionRate: 0
        },
        recentOrders: orders.slice(0, 5),
        lowStockProducts: []
      };
    }
    if (endpoint.startsWith('/admin/revenue') && method === 'GET') {
      return { data: [] };
    }
    if (endpoint.startsWith('/admin/customers') && method === 'GET') {
      return {
        customers: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1
        }
      };
    }
    if (endpoint.startsWith('/products') && method === 'GET') {
      return {
        products: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1
        }
      };
    }
    if (endpoint === '/health' && method === 'GET') {
      return { status: 'mock' };
    }

    if (this.useMockMode) {
      throw new Error('Backend chưa được cấu hình. Hãy đặt VITE_API_BASE_URL để dùng database thật.');
    }

    throw new Error('Không thể kết nối backend API. Vui lòng kiểm tra server và cấu hình URL.');
  }

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;

      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) {
        this.clearTokens();
        return false;
      }

      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return true;
    } catch {
      this.clearTokens();
      return false;
    }
  }

  clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // Auth
  login(email, password) { return this.request('POST', '/auth/login', { email, password }); }
  register(email, password, name) { return this.request('POST', '/auth/register', { email, password, name }); }
  logout() { return this.request('POST', '/auth/logout'); }
  getMe() { return this.request('GET', '/auth/me'); }
  updateProfile(data) { return this.request('PUT', '/auth/update-profile', data); }
  changePassword(data) { return this.request('PUT', '/auth/change-password', data); }

  // Products
  getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request('GET', `/products?${query}`);
  }
  getProduct(id) { return this.request('GET', `/products/${id}`); }
  createProduct(data) { return this.request('POST', '/products', data); }
  updateProduct(id, data) { return this.request('PUT', `/products/${id}`, data); }
  deleteProduct(id) { return this.request('DELETE', `/products/${id}`); }
  createReview(productId, data) { return this.request('POST', `/products/${productId}/reviews`, data); }

  // Categories
  getCategories() { return this.request('GET', '/products/categories'); }

  // Orders
  createOrder(data) { return this.request('POST', '/orders', data); }
  getOrders(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request('GET', `/orders?${query}`);
  }
  getOrder(id) { return this.request('GET', `/orders/${id}`); }
  updateOrderStatus(id, status) { return this.request('PUT', `/orders/${id}/status`, { status }); }
  cancelOrder(id) { return this.request('PUT', `/orders/${id}/cancel`); }

  // Admin
  getDashboard() { return this.request('GET', '/admin/dashboard'); }
  getRevenue(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request('GET', `/admin/revenue?${query}`);
  }
  getTopProducts(limit = 10) { return this.request('GET', `/admin/top-products?limit=${limit}`); }
  getCustomers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request('GET', `/admin/customers?${query}`);
  }

  // Health
  health() { return this.request('GET', '/health'); }
}

const api = new ApiService();
export default api;
