const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api').replace(/\/$/, '');

class ApiService {
  constructor() {
    this.baseUrl = API_BASE;
  }

  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('accessToken');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }

  async request(method, endpoint, body = null) {
    const config = {
      method,
      headers: this.getHeaders()
    };
    if (body) config.body = JSON.stringify(body);

    let response = await fetch(`${this.baseUrl}${endpoint}`, config);

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

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Lỗi server');
    }
    return result;
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
