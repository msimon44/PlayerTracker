import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'playertracker_access_token';
const REFRESH_TOKEN_KEY = 'playertracker_refresh_token';
const USER_KEY = 'playertracker_user';

export const secureStorage = {
    // Token management
    async setTokens(accessToken: string, refreshToken: string): Promise<void> {
        await Promise.all([
            SecureStore.setItemAsync(TOKEN_KEY, accessToken),
            SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
        ]);
    },

    async getAccessToken(): Promise<string | null> {
        return await SecureStore.getItemAsync(TOKEN_KEY);
    },

    async getRefreshToken(): Promise<string | null> {
        return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    },

    async removeTokens(): Promise<void> {
        await Promise.all([SecureStore.deleteItemAsync(TOKEN_KEY), SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY)]);
    },

    // User data management
    async setUser(user: unknown): Promise<void> {
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    },

    async getUser<T>(): Promise<T | null> {
        const user = await SecureStore.getItemAsync(USER_KEY);
        return user ? JSON.parse(user) : null;
    },

    async removeUser(): Promise<void> {
        await SecureStore.deleteItemAsync(USER_KEY);
    },

    // Clear all auth data
    async clearAll(): Promise<void> {
        await Promise.all([this.removeTokens(), this.removeUser()]);
    },
};
