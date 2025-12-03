const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export interface ApiError {
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

// Helper function to get token from localStorage
const getToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null; // Server-side: no localStorage
  }
  return localStorage.getItem('token');
};

// Base request function
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  providedToken?: string | null,
  cookieHeader?: string | null
): Promise<T> {
  const token = providedToken !== undefined ? providedToken : getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Forward cookies if provided (for server-side requests)
  if (cookieHeader) {
    headers['Cookie'] = cookieHeader;
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Include cookies in the request
  });

  let data;
  try {
    data = await response.json();
  } catch (jsonError) {
    // If response is not JSON, create a simple error object
    const text = await response.text();
    throw new Error(`Invalid response from server: ${text || response.statusText}`);
  }

  if (!response.ok) {
    // Log error details in development
    if (import.meta.env.DEV) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        data,
        endpoint: `${API_URL}${endpoint}`,
        token: token ? 'present' : 'missing',
      });
    }
    throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
  }

  return data;
}

// HTTP method functions
export const api = {
  get: <T>(endpoint: string, token?: string | null, cookieHeader?: string | null): Promise<T> => {
    return request<T>(endpoint, { method: 'GET' }, token, cookieHeader);
  },

  post: <T>(endpoint: string, body: any, token?: string | null, cookieHeader?: string | null): Promise<T> => {
    return request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }, token, cookieHeader);
  },

  put: <T>(endpoint: string, body: any, token?: string | null, cookieHeader?: string | null): Promise<T> => {
    return request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    }, token, cookieHeader);
  },

  delete: <T>(endpoint: string, token?: string | null, cookieHeader?: string | null): Promise<T> => {
    return request<T>(endpoint, { method: 'DELETE' }, token, cookieHeader);
  },
};
