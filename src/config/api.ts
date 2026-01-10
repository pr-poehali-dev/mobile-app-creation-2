// Backend API URLs
export const API_URLS = {
  auth: 'https://functions.poehali.dev/8b581e64-770d-4733-8dde-1c8e15721ca3',
  bookings: 'https://functions.poehali.dev/e1d40269-67c7-460a-9838-394d23af5658',
};

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface Session {
  id: number;
  session_date: string;
  start_time: string;
  end_time: string;
  available_slots: number;
  total_slots: number;
  trainer_name: string;
  specialization: string;
}

export interface Booking {
  id: number;
  status: string;
  booked_at: string;
  session_date: string;
  start_time: string;
  end_time: string;
  trainer_name: string;
  specialization: string;
}

export const authAPI = {
  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
  }) => {
    const response = await fetch(API_URLS.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', ...data }),
    });
    return response.json();
  },

  login: async (email: string, password: string) => {
    const response = await fetch(API_URLS.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email, password }),
    });
    return response.json();
  },
};

export const bookingsAPI = {
  getSessions: async (date?: string) => {
    const timestamp = Date.now();
    const url = date
      ? `${API_URLS.bookings}?date=${date}&_t=${timestamp}`
      : `${API_URLS.bookings}?_t=${timestamp}`;
    const response = await fetch(url, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    });
    return response.json();
  },

  getUserBookings: async (userId: number) => {
    const timestamp = Date.now();
    const response = await fetch(`${API_URLS.bookings}?userId=${userId}&_t=${timestamp}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    });
    return response.json();
  },

  bookSession: async (userId: number, sessionId: number) => {
    const response = await fetch(API_URLS.bookings, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'book', userId, sessionId }),
    });
    return response.json();
  },

  cancelBooking: async (bookingId: number) => {
    const response = await fetch(API_URLS.bookings, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'cancel', bookingId }),
    });
    return response.json();
  },
};