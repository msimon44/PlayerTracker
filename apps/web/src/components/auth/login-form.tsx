'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { useAuthControllerLogin } from '@/lib/generated/auth/auth';

const loginFormSchema = z.object({
    email: z.string().email({
        message: 'Adresse email invalide',
    }),
    password: z.string().min(1, {
        message: 'Le mot de passe est requis',
    }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm() {
    const router = useRouter();
    const { login: authLogin } = useAuth();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const { mutateAsync: loginMutation } = useAuthControllerLogin();

    // Fonction pour récupérer l'URL de redirection depuis les cookies
    const getRedirectUrl = () => {
        if (typeof document !== 'undefined') {
            const cookies = document.cookie.split('; ');
            const redirectCookie = cookies.find((cookie) => cookie.startsWith('redirectAfterLogin='));
            if (redirectCookie) {
                const url = redirectCookie.split('=')[1];
                // Nettoyer le cookie
                document.cookie = 'redirectAfterLogin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                return url ? decodeURIComponent(url) : '/dashboard';
            }
        }
        return '/dashboard';
    };

    async function onSubmit(data: LoginFormValues) {
        setIsLoading(true);

        try {
            const response = await loginMutation({
                data: {
                    email: data.email,
                    password: data.password,
                    platform: 'web', // Platform restriction - web is for STAFF only
                },
            });

            // Use auth context to store tokens
            if (response.tokens) {
                authLogin(response.tokens.accessToken, response.tokens.refreshToken);
            }

            toast({
                title: 'Connexion réussie',
                description: `Bienvenue ${response.user.email}`,
            });

            // Redirect to saved URL or dashboard
            const redirectUrl = getRedirectUrl();
            router.push(redirectUrl);
        } catch (error: any) {
            // Generic error message - don't reveal platform/role restrictions
            const backendMessage = error?.response?.data?.message || '';
            const isAccessRestriction =
                backendMessage.includes('platform') ||
                backendMessage.includes('restricted') ||
                error?.response?.status === 403;

            toast({
                variant: 'destructive',
                title: 'Erreur de connexion',
                description: isAccessRestriction
                    ? 'Accès non autorisé. Veuillez vérifier vos identifiants.'
                    : backendMessage || 'Email ou mot de passe incorrect',
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='grid gap-6'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type='email'
                                        placeholder='nom@exemple.com'
                                        autoCapitalize='none'
                                        autoComplete='email'
                                        autoCorrect='off'
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                            <FormItem>
                                <div className='flex items-center justify-between'>
                                    <FormLabel>Mot de passe</FormLabel>
                                    <a
                                        href='/forgot-password'
                                        className='text-xs text-muted-foreground hover:text-primary underline underline-offset-4'
                                    >
                                        Mot de passe oublié ?
                                    </a>
                                </div>
                                <FormControl>
                                    <Input
                                        type='password'
                                        placeholder='Votre mot de passe'
                                        autoComplete='current-password'
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button disabled={isLoading} className='w-full' type='submit'>
                        {isLoading ? 'Connexion...' : 'Se connecter'}
                    </Button>
                </form>
            </Form>
            <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                    <span className='w-full border-t' />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                    <span className='bg-background px-2 text-muted-foreground'>Ou continuer avec</span>
                </div>
            </div>
            <Button
                variant='outline'
                type='button'
                disabled={isLoading}
                onClick={() => {
                    window.location.href = `${process.env['NEXT_PUBLIC_API_URL']}/auth/google`;
                }}
            >
                {isLoading ? (
                    'Chargement...'
                ) : (
                    <>
                        <svg className='mr-2 h-4 w-4' viewBox='0 0 24 24'>
                            <path
                                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                                fill='#4285F4'
                            />
                            <path
                                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                                fill='#34A853'
                            />
                            <path
                                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                                fill='#FBBC05'
                            />
                            <path
                                d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                                fill='#EA4335'
                            />
                        </svg>
                        Google
                    </>
                )}
            </Button>
        </div>
    );
}
