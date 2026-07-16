import { Metadata } from 'next';
import Link from 'next/link';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export const metadata: Metadata = {
    title: 'Réinitialiser le mot de passe - PlayerTracker',
    description: 'Choisissez un nouveau mot de passe',
};

export const dynamic = 'force-dynamic';

export default function ResetPasswordPage() {
    return (
        <div className='container relative min-h-screen flex-col items-center justify-center flex'>
            <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
                <div className='flex flex-col space-y-2 text-center'>
                    <h1 className='text-2xl font-semibold tracking-tight'>Nouveau mot de passe</h1>
                    <p className='text-sm text-muted-foreground'>Choisissez un nouveau mot de passe sécurisé</p>
                </div>
                <ResetPasswordForm />
                <p className='px-8 text-center text-sm text-muted-foreground'>
                    <Link href='/login' className='underline underline-offset-4 hover:text-primary'>
                        Retour à la connexion
                    </Link>
                </p>
            </div>
        </div>
    );
}
