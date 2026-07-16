import { Metadata } from 'next';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = {
    title: 'Inscription - PlayerTracker',
    description: 'Créez votre compte PlayerTracker',
};

export const dynamic = 'force-dynamic';

export default function RegisterPage() {
    return (
        <div className='container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
            <div className='relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r'>
                <div className='absolute inset-0 bg-zinc-900' />
                <div className='relative z-20 flex items-center text-lg font-medium'>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='mr-2 h-6 w-6'
                    >
                        <path d='M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' />
                    </svg>
                    PlayerTracker
                </div>
                <div className='relative z-20 mt-auto'>
                    <blockquote className='space-y-2'>
                        <p className='text-lg'>
                            "Rejoignez des milliers d'athlètes et de coachs qui optimisent leurs performances avec
                            PlayerTracker."
                        </p>
                        <footer className='text-sm'>Équipe PlayerTracker</footer>
                    </blockquote>
                </div>
            </div>
            <div className='lg:p-8'>
                <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]'>
                    <div className='flex flex-col space-y-2 text-center'>
                        <h1 className='text-2xl font-semibold tracking-tight'>Créer un compte</h1>
                        <p className='text-sm text-muted-foreground'>Entrez vos informations pour créer votre compte</p>
                    </div>
                    <RegisterForm />
                    <p className='px-8 text-center text-sm text-muted-foreground'>
                        <Link href='/login' className='underline underline-offset-4 hover:text-primary'>
                            Vous avez déjà un compte? Connectez-vous
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
