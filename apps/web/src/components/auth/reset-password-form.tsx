'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuthControllerResetPassword } from '@/lib/generated/auth/auth';
import { toast } from '@/hooks/use-toast';

const resetPasswordFormSchema = z
    .object({
        password: z
            .string()
            .min(8, {
                message: 'Le mot de passe doit contenir au moins 8 caractères',
            })
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
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Les mots de passe ne correspondent pas',
        path: ['confirmPassword'],
    });

type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;

export function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordFormSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const { mutateAsync: resetPassword } = useAuthControllerResetPassword();

    async function onSubmit(data: ResetPasswordFormValues) {
        if (!token) {
            toast({
                variant: 'destructive',
                title: 'Token manquant',
                description: 'Le lien de réinitialisation est invalide.',
            });
            return;
        }

        setIsLoading(true);

        try {
            await resetPassword({
                data: {
                    token,
                    password: data.password,
                    confirmPassword: data.confirmPassword,
                },
            });

            toast({
                title: 'Mot de passe réinitialisé',
                description: 'Votre mot de passe a été changé avec succès.',
            });

            // Redirect to login
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Erreur',
                description:
                    error?.response?.data?.message ||
                    'Le lien est invalide ou expiré. Veuillez demander un nouveau lien.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    if (!token) {
        return (
            <div className='rounded-lg border border-destructive/50 bg-destructive/10 p-4'>
                <p className='text-sm text-destructive'>Le lien de réinitialisation est invalide ou manquant.</p>
                <p className='mt-2 text-xs text-muted-foreground'>
                    Veuillez demander un nouveau lien depuis la page "Mot de passe oublié".
                </p>
            </div>
        );
    }

    return (
        <div className='grid gap-6'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                    <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nouveau mot de passe</FormLabel>
                                <FormControl>
                                    <Input
                                        type='password'
                                        placeholder='Votre nouveau mot de passe'
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
                    <FormField
                        control={form.control}
                        name='confirmPassword'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirmer le mot de passe</FormLabel>
                                <FormControl>
                                    <Input
                                        type='password'
                                        placeholder='Confirmez votre mot de passe'
                                        autoComplete='new-password'
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button disabled={isLoading} className='w-full' type='submit'>
                        {isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
