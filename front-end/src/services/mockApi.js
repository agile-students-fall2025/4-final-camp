// src/lib/mockAPI.js
const RESOURCE_MAP = {
  dashboard: 'dashboard.json',
  items: 'items.json',
  reservationSlots: 'reservation-slots.json',
  borrowals: 'borrowals.json',
  fines: 'fines.json',
  paymentHistory: 'payment-history.json',
  profile: 'profile.json',
  staffDashboard: 'staff-dashboard.json',
  staffInventory: 'staff-inventory.json',
  staffReservations: 'staff-reservations.json',
  staffOverdue: 'staff-overdue.json',
  students: 'students.json',
};

const LIVE_ENDPOINTS = {
  // public
  items: () => `/api/items`,
  reservationSlots: (params) => {
    // e.g., facility, date -> /api/reservations/slots?facility=...&date=...
    const qs = params ? `?${new URLSearchParams(params).toString()}` : '';
    return `/api/reservations/slots${qs}`;
  },
  borrowals: ({ userId }) => `/api/borrowals?userId=${encodeURIComponent(userId)}`,
  fines: ({ userId }) => `/api/fines?userId=${encodeURIComponent(userId)}`,
  paymentHistory: ({ userId }) => `/api/payments/history?userId=${encodeURIComponent(userId)}`,
  profile: ({ userId }) => `/api/users/${encodeURIComponent(userId)}`,
  dashboard: ({ userId }) => `/api/dashboard?userId=${encodeURIComponent(userId)}`,
  // staff
  staffDashboard: () => `/api/staff/alerts`,            // or a real dashboard aggregate when you add it
  staffInventory: () => `/api/staff/inventory`,
  staffReservations: () => `/api/staff/reservations`,
  staffOverdue: () => `/api/staff/overdue`,
  students: () => `/api/users`,                          // adjust per your design
  // optional: facilities (if you need them)
  facilities: () => `/api/facilities`,
};

const DEFAULT_BASE = '/mock-data';
const API_BASE = import.meta.env.VITE_API_BASE ?? ''; // empty when using Vite proxy
const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true').toLowerCase() === 'true';

const joinUrl = (base, path) => (base.endsWith('/') ? `${base}${path}` : `${base}/${path}`);

/**
 * Unified fetch: uses mock JSON when VITE_USE_MOCK=true,
 * otherwise hits live backend endpoints (when defined).
 *
 * @param {string} resourceKey - one of listAvailableResources()
 * @param {object} [params] - optional params for endpoint builders (e.g., { userId })
 */
export async function fetchResource(resourceKey, params = {}) {
  if (USE_MOCK) return fetchMockResource(resourceKey);

  // live mode
  const builder = LIVE_ENDPOINTS[resourceKey];
  if (!builder) {
    // fallback to mock if live endpoint not wired yet
    return fetchMockResource(resourceKey);
  }
  const path = builder(params);
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error(`Failed to fetch live resource ${resourceKey} from ${url} (${res.status})`);
  return res.json();
}

/** Keep your original mock fetch (unchanged) */
export async function fetchMockResource(resourceKey) {
  const fileName = RESOURCE_MAP[resourceKey];
  if (!fileName) throw new Error(`Unknown mock resource requested: ${resourceKey}`);
  const baseUrl = import.meta.env.VITE_MOCK_DATA_BASE_URL || DEFAULT_BASE;
  const url = joinUrl(baseUrl, fileName);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch mock data from ${url} (${response.status})`);
  return response.json();
}

export function listAvailableResources() {
  return Object.keys(RESOURCE_MAP);
}
