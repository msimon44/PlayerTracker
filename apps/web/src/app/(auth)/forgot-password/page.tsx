import { Metadata } from 'next';
import Link from 'next/link';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export const metadata: Metadata = {
    title: 'Mot de passe oublié - PlayerTracker',
    description: 'Réinitialisez votre mot de passe',
};

export const dynamic = 'force-dynamic';

export default function ForgotPasswordPage() {
    return (
        <div className='container relative min-h-screen flex-col items-center justify-center flex'>
            <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
                <div className='flex flex-col space-y-2 text-center'>
                    <h1 className='text-2xl font-semibold tracking-tight'>Mot de passe oublié</h1>
                    <p className='text-sm text-muted-foreground'>
                        Entrez votre email pour recevoir un lien de réinitialisation
                    </p>
                </div>
                <ForgotPasswordForm />
                <p className='px-8 text-center text-sm text-muted-foreground'>
                    <Link href='/login' className='underline underline-offset-4 hover:text-primary'>
                        Retour à la connexion
                    </Link>
                </p>
            </div>
        </div>
    );
}
