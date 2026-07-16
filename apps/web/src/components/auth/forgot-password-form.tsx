'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuthControllerForgotPassword } from '@/lib/generated/auth/auth';
import { toast } from '@/hooks/use-toast';

const forgotPasswordFormSchema = z.object({
    email: z.string().email({
        message: 'Adresse email invalide',
    }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;

export function ForgotPasswordForm() {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [emailSent, setEmailSent] = React.useState<boolean>(false);

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordFormSchema),
        defaultValues: {
            email: '',
        },
    });

    const { mutateAsync: forgotPassword } = useAuthControllerForgotPassword();

    async function onSubmit(data: ForgotPasswordFormValues) {
        setIsLoading(true);

        try {
            await forgotPassword({
                data: {
                    email: data.email,
                },
            });

            setEmailSent(true);
            toast({
                title: 'Email envoyé',
                description: 'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.',
            });
        } catch (error: any) {
            // L'API retourne toujours succès pour des raisons de sécurité
            // Mais on affiche quand même un message en cas d'erreur réseau
            toast({
                variant: 'destructive',
                title: 'Erreur',
                description: error?.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    if (emailSent) {
        return (
            <div className='space-y-4 text-center'>
                <div className='rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950'>
                    <p className='text-sm text-green-800 dark:text-green-200'>
                        Un email de réinitialisation a été envoyé si un compte existe avec cette adresse.
                    </p>
                    <p className='mt-2 text-xs text-green-600 dark:text-green-400'>
                        Vérifiez votre boîte de réception et vos spams.
                    </p>
                </div>
                <Button
                    variant='outline'
                    className='w-full'
                    onClick={() => {
                        setEmailSent(false);
                        form.reset();
                    }}
                >
                    Renvoyer un email
                </Button>
            </div>
        );
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
                    <Button disabled={isLoading} className='w-full' type='submit'>
                        {isLoading ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
