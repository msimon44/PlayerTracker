'use client';

import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { AXIOS_INSTANCE } from '@/lib/api-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    // Prevent duplicate requests in StrictMode
    const hasAttemptedExchange = useRef(false);

    useEffect(() => {
        // Récupérer le code d'autorisation ou une erreur
        const code = searchParams.get('code');
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        // Gestion des erreurs OAuth
        if (errorParam) {
            // Generic error message for access_denied (don't reveal it's a role restriction)
            const errorMessage =
                errorParam === 'access_denied'
                    ? 'Accès non autorisé. Veuillez vérifier vos identifiants.'
                    : errorDescription || errorParam;
            setError(errorMessage);
            toast({
                variant: 'destructive',
                title: 'Erreur de connexion',
                description: errorMessage,
            });

            // Rediriger vers login après 3 secondes
            setTimeout(() => {
                router.push('/login');
            }, 3000);
            return;
        }

        // Vérifier que le code est présent
        if (!code) {
            setError("Code d'autorisation manquant");
            toast({
                variant: 'destructive',
                title: 'Erreur OAuth',
                description: "Code d'autorisation manquant. Veuillez réessayer.",
            });

            setTimeout(() => {
                router.push('/login');
            }, 3000);
            return;
        }

        // Prevent duplicate exchange attempts (React StrictMode in dev)
        if (hasAttemptedExchange.current) {
            return;
        }
        hasAttemptedExchange.current = true;

        // Échanger le code contre les tokens avec appel API direct
        AXIOS_INSTANCE.post('/auth/exchange-code', { code })
            .then((response) => {
                // Stocker les tokens via le contexte auth
                login(response.data.tokens.accessToken, response.data.tokens.refreshToken);

                toast({
                    title: 'Connexion réussie',
                    description: 'Vous êtes maintenant connecté via OAuth',
                });

                // Rediriger vers le dashboard
                router.push('/dashboard');
            })
            .catch((error: any) => {
                const errorMessage = error?.response?.data?.message || "Échec de l'échange du code";
                setError(errorMessage);
                toast({
                    variant: 'destructive',
                    title: 'Erreur OAuth',
                    description: errorMessage,
                });

                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            });
    }, [searchParams, login, router]);

    if (error) {
        return (
            <div className='flex min-h-screen flex-col items-center justify-center p-8'>
                <div className='w-full max-w-md space-y-4'>
                    <div className='rounded-lg border border-destructive/50 bg-destructive/10 p-4'>
                        <h2 className='text-lg font-semibold text-destructive mb-2'>Erreur d'authentification</h2>
                        <p className='text-sm text-muted-foreground'>{error}</p>
                    </div>
                    <p className='text-center text-sm text-muted-foreground'>
                        Redirection vers la page de connexion...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='flex min-h-screen flex-col items-center justify-center p-8'>
            <div className='w-full max-w-md space-y-4 text-center'>
                <div className='flex justify-center'>
                    <div className='h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
                </div>
                <h2 className='text-2xl font-semibold'>Authentification en cours...</h2>
                <p className='text-sm text-muted-foreground'>
                    Veuillez patienter pendant que nous finalisons votre connexion.
                </p>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense
            fallback={
                <div className='flex min-h-screen flex-col items-center justify-center p-8'>
                    <div className='w-full max-w-md space-y-4 text-center'>
                        <div className='flex justify-center'>
                            <div className='h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
                        </div>
                        <h2 className='text-2xl font-semibold'>Chargement...</h2>
                    </div>
                </div>
            }
        >
            <AuthCallbackContent />
        </Suspense>
    );
}
