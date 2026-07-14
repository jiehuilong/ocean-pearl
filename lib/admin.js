// Admin SDK — consistent fetch wrapper for admin API calls
const BASE = '/api/admin';

async function api(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const adminApi = {
  // Products
  getProducts: (search, page) => api(`/products?search=${encodeURIComponent(search || '')}&page=${page || 1}&limit=20`),
  getProduct: (id) => api(`/products/${id}`),
  createProduct: (data) => api('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) => api(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id) => api(`/products/${id}`, { method: 'DELETE' }),

  // Orders
  getOrders: (search, status, page) => api(`/orders?search=${encodeURIComponent(search || '')}&status=${status || ''}&page=${page || 1}&limit=15`),
  getOrder: (id) => api(`/orders/${id}`),
  updateOrderStatus: (id, status) => api(`/orders/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // Users
  getUsers: (search, role, page) => api(`/users?search=${encodeURIComponent(search || '')}&role=${role || ''}&page=${page || 1}&limit=20`),
  getUser: (id) => api(`/users/${id}`),
  updateUserRole: (id, role) => api(`/users/${id}`, { method: 'PUT', body: JSON.stringify({ role }) }),
};
