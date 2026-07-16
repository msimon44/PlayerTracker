import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import { secureStorage } from './secure-storage';

// Configuration de base de l'API
export const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3001';

// Security: Enforce HTTPS in production
if (process.env.NODE_ENV === 'production' && !API_URL.startsWith('https://')) {
    throw new Error('Security Error: Production API must use HTTPS. Current URL: ' + API_URL);
}

// Instance Axios personnalisée
export const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Track if we're currently refreshing the token
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Subscribe to token refresh
function subscribeTokenRefresh(callback: (token: string) => void) {
    refreshSubscribers.push(callback);
}

// Notify all subscribers when token is refreshed
function onTokenRefreshed(token: string) {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
}

// Intercepteur pour ajouter le token d'authentification
axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const token = await secureStorage.getAccessToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Intercepteur pour gérer les erreurs et rafraîchir le token
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Wait for the token to be refreshed
                return new Promise((resolve) => {
                    subscribeTokenRefresh((token: string) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        resolve(axiosInstance(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = await secureStorage.getRefreshToken();

                if (!refreshToken) {
                    // No refresh token, clear storage and reject
                    await secureStorage.clearAll();
                    return Promise.reject(error);
                }

                // Call refresh endpoint with token in Authorization header
                const response = await axios.post(
                    `${API_URL}/auth/refresh`,
                    {}, // Empty body
                    {
                        headers: {
                            Authorization: `Bearer ${refreshToken}`,
                        },
                    },
                );

                const { accessToken, refreshToken: newRefreshToken } = response.data.tokens;

                // Save new tokens
                await secureStorage.setTokens(accessToken, newRefreshToken);
                await secureStorage.setUser(response.data.user);

                // Update the original request with new token
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                }

                // Notify all waiting requests
                onTokenRefreshed(accessToken);

                isRefreshing = false;

                // Retry the original request
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Refresh failed, clear storage
                isRefreshing = false;
                await secureStorage.clearAll();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

// Custom instance pour Orval
export const customInstance = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance({
        ...config,
        ...options,
    }).then(({ data }) => data);
};

export default customInstance;
