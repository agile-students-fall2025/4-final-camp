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
  students: 'students.json'
};

const DEFAULT_BASE = '/mock-data';

const joinUrl = (base, path) => {
  if (!base.endsWith('/')) {
    base += '/';
  }
  return `${base}${path}`;
};

export async function fetchMockResource(resourceKey) {
  const fileName = RESOURCE_MAP[resourceKey];

  if (!fileName) {
    throw new Error(`Unknown mock resource requested: ${resourceKey}`);
  }

  const baseUrl = import.meta.env.VITE_MOCK_DATA_BASE_URL || DEFAULT_BASE;
  const url = joinUrl(baseUrl, fileName);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch mock data from ${url} (${response.status})`);
  }

  return response.json();
}

export function listAvailableResources() {
  return Object.keys(RESOURCE_MAP);
}
