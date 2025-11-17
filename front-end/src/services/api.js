export const API_BASE = process.env.REACT_APP_API_BASE ?? '' // empty in dev when using webpack proxy

async function req(path, init) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const body = await res.text().catch(()=>'');
    throw new Error(`${res.status} ${res.statusText} @ ${path}${body ? ' :: ' + body : ''}`);
  }
  return res.json();
}

export const api = {
  health: () => req('/api/health'),
  items: (q='') => req(`/api/items${q ? `?${q}` : ''}`),
  facilities: () => req('/api/facilities'),
  facilityItems: (slug) => req(`/api/facilities/${slug}/items`),
  login: (email, password) => req('/api/auth/student/login', { method:'POST', body: JSON.stringify({ email, password }) }),
  reserve: (payload) => req('/api/reservations', { method:'POST', body: JSON.stringify(payload) }),
  borrowals: (userId) => req(`/api/borrowals?userId=${encodeURIComponent(userId)}`),
  fines: (userId) => req(`/api/fines?userId=${encodeURIComponent(userId)}`),
  paymentsHistory: (userId) => req(`/api/payments/history?userId=${encodeURIComponent(userId)}`),
  prefsGet: (userId) => req(`/api/notifications/preferences?userId=${encodeURIComponent(userId)}`),
  prefsPut: (payload) => req('/api/notifications/preferences', { method:'PUT', body: JSON.stringify(payload) }),
  policies: () => req('/api/policies'),
  staffInventory: () => req('/api/staff/inventory'),
  // New endpoints
  dashboard: (userId) => req(`/api/dashboard?userId=${encodeURIComponent(userId)}`),
  profile: (userId) => req(`/api/users/${encodeURIComponent(userId)}`),
  reservationSlots: (params) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : '';
    return req(`/api/reservations/slots${qs}`);
  },
  staffDashboard: () => req('/api/staff/alerts'),
  staffReservations: () => req('/api/staff/reservations'),
  staffOverdue: () => req('/api/staff/overdue'),
  students: () => req('/api/users'),
};
