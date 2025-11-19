const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export interface ApiError {
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

// Helper function to get token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Base request function
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }

  return data;
}

// HTTP method functions
export const api = {
  get: <T>(endpoint: string): Promise<T> => {
    return request<T>(endpoint, { method: 'GET' });
  },

  post: <T>(endpoint: string, body: any): Promise<T> => {
    return request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  put: <T>(endpoint: string, body: any): Promise<T> => {
    return request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  delete: <T>(endpoint: string): Promise<T> => {
    return request<T>(endpoint, { method: 'DELETE' });
  },
};
