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
    localStorage.setItem('token', token);
}

export const getToken = (): string | null => {
    return localStorage.getItem('token');
}

export const removeToken = (): void => {
    localStorage.removeItem('token');
}

export const isAuthenticated = (): boolean => {
    return !!getToken();
}