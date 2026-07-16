import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function TermsPage(): React.JSX.Element {
    return (
        <div className='container max-w-4xl mx-auto py-24 px-4 sm:px-6'>
            <div className='flex flex-col items-center text-center mb-12'>
                <h1 className='text-4xl font-bold tracking-tighter text-[rgb(var(--app-white))] mb-4'>
                    Conditions d&apos;utilisation
                </h1>
                <p className='text-[rgb(var(--app-white))]/80 max-w-2xl'>
                    Veuillez lire attentivement ces conditions qui régissent l&apos;utilisation de nos services.
                </p>
            </div>

            <Card className='p-8 bg-[rgb(var(--app-background))]/95 border border-[rgb(var(--primary))]/20'>
                <div className='prose prose-invert max-w-none'>
                    <h2 className='text-2xl font-semibold mb-6 text-[rgb(var(--primary))]'>
                        Bienvenue sur Athlete Flow
                    </h2>

                    <p className='mb-6 text-[rgb(var(--app-white))]/90'>
                        Athlete Flow fournit une plateforme destinée à améliorer le suivi physique et mental des
                        joueurs.
                    </p>

                    <p className='mb-6 text-[rgb(var(--app-white))]/90'>
                        L&apos;utilisation de notre service implique l&apos;acceptation de nos conditions générales.
                    </p>

                    <p className='mb-6 text-[rgb(var(--app-white))]/90'>
                        Nous nous réservons le droit de modifier ces conditions à tout moment.
                    </p>

                    <h3 className='text-xl font-semibold mt-8 mb-4 text-[rgb(var(--primary))]'>
                        Acceptation des conditions
                    </h3>

                    <p className='mb-6 text-[rgb(var(--app-white))]/90'>
                        En accédant ou en utilisant notre plateforme, vous reconnaissez avoir lu, compris et accepté
                        d&apos;être lié par ces conditions d&apos;utilisation. Si vous n&apos;acceptez pas ces
                        conditions, veuillez ne pas utiliser nos services.
                    </p>

                    <h3 className='text-xl font-semibold mt-8 mb-4 text-[rgb(var(--primary))]'>Contact</h3>

                    <p className='text-[rgb(var(--app-white))]/90'>
                        Pour toute question concernant ces conditions d&apos;utilisation, veuillez nous contacter à{' '}
                        <Link
                            href='mailto:contact@playertracker.fr'
                            className='text-[rgb(var(--primary))] hover:underline'
                        >
                            contact@playertracker.fr
                        </Link>
                        .
                    </p>
                </div>
            </Card>

            <div className='mt-12 text-center'>
                <Link href='/' className='text-[rgb(var(--primary))] hover:underline'>
                    Retour à l&apos;accueil
                </Link>
            </div>
        </div>
    );
}
