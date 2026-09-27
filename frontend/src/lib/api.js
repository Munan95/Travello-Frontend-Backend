const API_BASE = '/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  let data = {};
  if (res.status !== 204) {
    const text = await res.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = {};
      }
    }
  }

  if (!res.ok) {
    const err = new Error(data.message || 'Something went wrong');
    err.status = res.status;
    throw err;
  }

  return data;
}

export const api = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  verifyOtp: (body) => request('/auth/verify-otp', { method: 'POST', body: JSON.stringify(body) }),
  resendOtp: (body) => request('/auth/resend-otp', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/auth/me'),

  getDestinations: () => request('/destinations'),
  getDestination: (id) => request(`/destinations/${id}`),
  createDestination: (body) => request('/destinations', { method: 'POST', body: JSON.stringify(body) }),
  updateDestination: (id, body) =>
    request(`/destinations/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteDestination: (id) => request(`/destinations/${id}`, { method: 'DELETE' }),

  getTours: (destinationId) => {
    const q = destinationId ? `?destination=${destinationId}` : '';
    return request(`/tours${q}`);
  },
  getTour: (id) => request(`/tours/${id}`),
  createTour: (body) => request('/tours', { method: 'POST', body: JSON.stringify(body) }),
  updateTour: (id, body) => request(`/tours/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteTour: (id) => request(`/tours/${id}`, { method: 'DELETE' }),

  createBooking: (body) => request('/bookings', { method: 'POST', body: JSON.stringify(body) }),
  getMyBookings: () => request('/bookings/my'),
  cancelBooking: (id) => request(`/bookings/${id}/cancel`, { method: 'PATCH' }),
  getAllBookings: () => request('/bookings'),
  updateBookingStatus: (id, status) =>
    request(`/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};

export function coverImage(image, fallback = 'travel') {
  if (image) return image;
  const ids = {
    travel: 'photo-1488646953014-85cb44e25828',
    hills: 'photo-1506905925346-21bda4d32df4',
    beach: 'photo-1507525428034-b723cf961d3e',
    city: 'photo-1514565131-fce0801e5785',
  };
  const id = ids[fallback] || ids.travel;
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;
}

export function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatMoney(amount) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(amount);
}
