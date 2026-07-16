'use client';

import {
    useAuthControllerGetProfile,
    useAuthControllerLogout,
    getAuthControllerGetProfileQueryKey,
} from '@/lib/generated/auth/auth';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface User {
    id: number;
    email: string;
    avatarUrl: string | null | { [key: string]: unknown };
    role: string;
    isEmailVerified: boolean;
    player?: any;
    staff?: any;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (accessToken: string, refreshToken: string) => void;
    logout: () => void;
    refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const queryClient = useQueryClient();

    // Récupérer le profil utilisateur
    const {
        data: profileData,
        isLoading,
        refetch,
    } = useAuthControllerGetProfile({
        query: {
            enabled: isAuthenticated,
            retry: false,
        },
    });

    const { mutateAsync: logoutMutation } = useAuthControllerLogout();

    // Vérifier si l'utilisateur est connecté au démarrage
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setIsAuthenticated(true);
            // Stocker le token dans les cookies pour le middleware avec attributs corrects
            document.cookie = `accessToken=${token}; path=/; max-age=31536000; SameSite=Lax`;
        }
        setIsInitialized(true);
    }, []);

    const login = useCallback((accessToken: string, refreshToken: string) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        // Stocker aussi dans les cookies pour le middleware avec attributs corrects
        document.cookie = `accessToken=${accessToken}; path=/; max-age=31536000; SameSite=Lax`;
        setIsAuthenticated(true);
    }, []);

    const logout = useCallback(async () => {
        try {
            await logoutMutation();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Invalider la query du profil utilisateur avant de nettoyer le stockage
            queryClient.invalidateQueries({ queryKey: getAuthControllerGetProfileQueryKey() });
            queryClient.removeQueries({ queryKey: getAuthControllerGetProfileQueryKey() });

            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            // Supprimer le cookie
            document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            setIsAuthenticated(false);
            router.push('/login');
        }
    }, [logoutMutation, router, queryClient]);

    const refetchUser = useCallback(() => {
        refetch();
    }, [refetch]);

    // Ne pas afficher le contenu tant que l'initialisation n'est pas terminée
    if (!isInitialized) {
        return null;
    }

    return (
        <AuthContext.Provider
            value={{
                user: profileData || null,
                isLoading,
                isAuthenticated,
                login,
                logout,
                refetchUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
