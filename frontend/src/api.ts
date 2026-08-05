const API_BASE = '/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit & { token?: string } = {}
): Promise<ApiResponse<T>> {
  const { token, ...fetchOptions } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// Auth
export const authApi = {
  signup: (email: string, name: string, password: string) =>
    apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, name, password }),
    }),

  login: (email: string, password: string) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  forgotPassword: (email: string) =>
    apiCall('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, newPassword: string) =>
    apiCall('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    }),
};

// Events
export const eventsApi = {
  getAll: () => apiCall('/events', { method: 'GET' }),

  getOne: (id: string) => apiCall(`/events/${id}`, { method: 'GET' }),

  create: (event: any, token: string) =>
    apiCall('/events', {
      method: 'POST',
      body: JSON.stringify(event),
      token,
    }),

  update: (id: string, event: any, token: string) =>
    apiCall(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(event),
      token,
    }),

  delete: (id: string, token: string) =>
    apiCall(`/events/${id}`, {
      method: 'DELETE',
      token,
    }),
};

// Photos
export const photosApi = {
  getAll: () => apiCall('/photos', { method: 'GET' }),

  create: (photo: any, token: string) =>
    apiCall('/photos', {
      method: 'POST',
      body: JSON.stringify(photo),
      token,
    }),

  delete: (id: string, token: string) =>
    apiCall(`/photos/${id}`, {
      method: 'DELETE',
      token,
    }),
};

// Reminders
export const remindersApi = {
  subscribe: (eventId: string, token: string) =>
    apiCall('/reminders/subscribe', {
      method: 'POST',
      body: JSON.stringify({ eventId }),
      token,
    }),

  unsubscribe: (eventId: string, token: string) =>
    apiCall('/reminders/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ eventId }),
      token,
    }),

  getMySubscriptions: (token: string) =>
    apiCall('/reminders/my-subscriptions', {
      method: 'GET',
      token,
    }),
};

// Admin
export const adminApi = {
  getUsers: (token: string) =>
    apiCall('/admin/users', {
      method: 'GET',
      token,
    }),

  getStats: (token: string) =>
    apiCall('/admin/stats', {
      method: 'GET',
      token,
    }),
};
