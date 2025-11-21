export interface User {
    id: string;
    name: string;
    email: string;
}

export interface AuthResponse {
    message: string;
    token: string;
    user: User;
}

export const setToken = (token: string): void => {
    if (typeof window === 'undefined') {
        return; // Server-side: no localStorage
    }
    localStorage.setItem('token', token);
    // Also set in cookie for SSR compatibility
    document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
}

export const getToken = (): string | null => {
    if (typeof window === 'undefined') {
        // Server-side: try to get from cookies (if available in request)
        return null;
    }
    // Try localStorage first (client-side)
    const localToken = localStorage.getItem('token');
    if (localToken) {
        return localToken;
    }
    // Fallback to cookie
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(c => c.trim().startsWith('token='));
    if (tokenCookie) {
        const token = tokenCookie.split('=')[1];
        // Sync to localStorage
        if (token) {
            localStorage.setItem('token', token);
        }
        return token;
    }
    return null;
}

export const removeToken = (): void => {
    if (typeof window === 'undefined') {
        return; // Server-side: no localStorage
    }
    localStorage.removeItem('token');
    // Also remove cookie
    document.cookie = 'token=; path=/; max-age=0; SameSite=Lax';
}

export const isAuthenticated = (): boolean => {
    if (typeof window === 'undefined') {
        return false; // Server-side: not authenticated (would need cookie parsing)
    }
    return !!getToken();
}