import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// ------------------------------------------------------------------
// YOUR EXISTING CODE FOR CLASS MERGING
// ------------------------------------------------------------------
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ------------------------------------------------------------------
// NEW CODE FOR AUTHENTICATION UTILITIES
// ------------------------------------------------------------------

/**
 * Retrieves the JWT from storage.
 * @returns The token string or null if not found.
 */
export const getToken = (): string | null => {
    return localStorage.getItem('deepfake-token');
};

/**
 * Utility function to make authenticated GET/POST requests.
 * It automatically attaches the JWT header.
 */
export const makeAuthenticatedRequest = async (url: string, method: 'GET' | 'POST', body?: any) => {
    const token = getToken();
    if (!token) {
        // Handle unauthenticated state: clear storage and redirect
        localStorage.removeItem('deepfake-token');
        window.location.href = '/signin'; // Forces a redirect to the login page
        throw new Error('User is not authenticated. Redirecting to sign in.');
    }

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        // Attaching the JWT in the 'x-auth-token' header
        'x-auth-token': token, 
    };

    const config: RequestInit = {
        method: method,
        headers: headers,
        body: body ? JSON.stringify(body) : undefined,
    };
    
    // Assumes backend is running on port 5000. Adjust if necessary.
    const response = await fetch(`http://localhost:5000${url}`, config);

    // If the token is invalid or expired (401 status from the backend)
    if (response.status === 401) {
        // Clear invalid token and redirect to login
        localStorage.removeItem('deepfake-token');
        window.location.href = '/signin';
        throw new Error('Session expired. Redirecting to sign in.');
    }

    return response;
};