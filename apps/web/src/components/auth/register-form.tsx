'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuthControllerRegister } from '@/lib/generated/auth/auth';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

// Mode de sélection du club
type ClubMode = 'create' | 'join';

const registerFormSchema = z.object({
    firstName: z.string().min(1, { message: 'Le prénom est requis' }),
    lastName: z.string().min(1, { message: 'Le nom est requis' }),
    email: z.string().email({
        message: 'Adresse email invalide',
    }),
    password: z
        .string()
        .min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
        .regex(/[A-Z]/, {
            message: 'Le mot de passe doit contenir au moins une majuscule',
        })
        .regex(/[a-z]/, {
            message: 'Le mot de passe doit contenir au moins une minuscule',
        })
        .regex(/[0-9]/, {
            message: 'Le mot de passe doit contenir au moins un chiffre',
        })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, {
            message: 'Le mot de passe doit contenir au moins un caractère spécial',
        }),
    // Création de club
    clubName: z.string().optional(),
    // Rejoindre par code (TODO)
    clubCode: z.string().optional(),
    consentGiven: z.boolean().refine((val) => val === true, {
        message: 'Vous devez accepter les conditions',
    }),
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export function RegisterForm() {
    const router = useRouter();
    const { login: authLogin } = useAuth();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [clubMode, setClubMode] = React.useState<ClubMode>('create');

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            clubName: '',
            clubCode: '',
            consentGiven: false,
        },
    });

    const { mutateAsync: registerMutation } = useAuthControllerRegister();

    async function onSubmit(data: RegisterFormValues) {
        setIsLoading(true);

        try {
            if (clubMode === 'create') {
                // Valider que le nom du club est fourni
                if (!data.clubName || data.clubName.trim().length === 0) {
                    toast({
                        variant: 'destructive',
                        title: 'Erreur',
                        description: 'Le nom du club est requis',
                    });
                    setIsLoading(false);
                    return;
                }
            } else {
                // TODO: Implémenter la fonctionnalité "rejoindre par code"
                toast({
                    variant: 'destructive',
                    title: 'Fonctionnalité à venir',
                    description: 'Rejoindre un club par code sera disponible prochainement.',
                });
                setIsLoading(false);
                return;
            }

            // Créer l'utilisateur avec le club (le club sera créé côté API)
            const response = await registerMutation({
                data: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    password: data.password,
                    clubName: data.clubName?.trim(), // L'API crée le club automatiquement
                    role: 'STAFF',
                    platform: 'web',
                    consentGiven: data.consentGiven,
                },
            });

            // Use auth context to store tokens
            if (response.tokens) {
                authLogin(response.tokens.accessToken, response.tokens.refreshToken);
            }

            toast({
                title: 'Compte créé avec succès',
                description: `Un email de vérification a été envoyé à ${response.user.email}`,
            });

            // Redirect to dashboard
            router.push('/dashboard');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string }; status?: number } };
            const backendMessage = err?.response?.data?.message || '';
            const isAccessRestriction =
                backendMessage.includes('platform') ||
                backendMessage.includes('restricted') ||
                err?.response?.status === 403;

            toast({
                variant: 'destructive',
                title: "Erreur lors de l'inscription",
                description: isAccessRestriction
                    ? 'Inscription non autorisée. Veuillez contacter votre administrateur.'
                    : backendMessage || 'Une erreur est survenue lors de la création du compte',
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='grid gap-6'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
                        <FormField
                            control={form.control}
                            name='firstName'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Prénom</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='John'
                                            autoComplete='given-name'
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
                            name='lastName'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nom</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Doe'
                                            autoComplete='family-name'
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
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
                                <FormLabel>Mot de passe</FormLabel>
                                <FormControl>
                                    <Input
                                        type='password'
                                        placeholder='Votre mot de passe'
                                        autoComplete='new-password'
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription className='text-xs'>
                                    Min. 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Section Club */}
                    <div className='space-y-3'>
                        <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                            Club
                        </label>
                        <div className='flex gap-2'>
                            <Button
                                type='button'
                                variant={clubMode === 'create' ? 'default' : 'outline'}
                                size='sm'
                                onClick={() => setClubMode('create')}
                                disabled={isLoading}
                            >
                                Créer un club
                            </Button>
                            <Button
                                type='button'
                                variant={clubMode === 'join' ? 'default' : 'outline'}
                                size='sm'
                                onClick={() => setClubMode('join')}
                                disabled={isLoading}
                            >
                                Rejoindre par code
                            </Button>
                        </div>

                        {clubMode === 'create' ? (
                            <FormField
                                control={form.control}
                                name='clubName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder='Nom de votre club' disabled={isLoading} {...field} />
                                        </FormControl>
                                        <FormDescription className='text-xs'>
                                            Vous serez administrateur de ce club
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ) : (
                            <FormField
                                control={form.control}
                                name='clubCode'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="Code d'invitation du club"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className='text-xs text-amber-600'>
                                            {/* TODO: Implémenter la fonctionnalité rejoindre par code */}
                                            Fonctionnalité à venir
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </div>
                    <FormField
                        control={form.control}
                        name='consentGiven'
                        render={({ field }) => (
                            <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                                <FormControl>
                                    <input
                                        type='checkbox'
                                        className='mt-1'
                                        disabled={isLoading}
                                        checked={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <div className='space-y-1 leading-none'>
                                    <FormLabel>
                                        J'accepte les conditions d'utilisation et la politique de confidentialité
                                    </FormLabel>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                    <Button disabled={isLoading} className='w-full' type='submit'>
                        {isLoading ? 'Création...' : 'Créer mon compte'}
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
