import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function PrivacyPage(): React.JSX.Element {
    return (
        <div className='container max-w-4xl mx-auto py-24 px-4 sm:px-6'>
            <div className='flex flex-col items-center text-center mb-12'>
                <h1 className='text-4xl font-bold tracking-tighter text-[rgb(var(--app-white))] mb-4'>
                    Politique de confidentialité
                </h1>
                <p className='text-[rgb(var(--app-white))]/80 max-w-2xl'>
                    Comment nous protégeons vos données et respectons votre vie privée.
                </p>
            </div>

            <Card className='p-8 bg-[rgb(var(--app-background))]/95 border border-[rgb(var(--primary))]/20'>
                <div className='prose prose-invert max-w-none'>
                    <h2 className='text-2xl font-semibold mb-6 text-[rgb(var(--primary))]'>
                        Confidentialité chez Athlete Flow
                    </h2>

                    <p className='mb-6 text-[rgb(var(--app-white))]/90'>
                        Nous respectons la vie privée de nos utilisateurs.
                    </p>

                    <p className='mb-6 text-[rgb(var(--app-white))]/90'>
                        Les données collectées via Athlete Flow sont utilisées uniquement pour le suivi et
                        l&apos;amélioration des performances des joueurs.
                    </p>

                    <p className='mb-6 text-[rgb(var(--app-white))]/90'>
                        Aucune donnée ne sera partagée avec des tiers sans consentement.
                    </p>

                    <h3 className='text-xl font-semibold mt-8 mb-4 text-[rgb(var(--primary))]'>Données collectées</h3>

                    <p className='mb-6 text-[rgb(var(--app-white))]/90'>
                        Les données que nous collectons peuvent inclure des informations personnelles et des
                        statistiques de performance fournies volontairement par les utilisateurs ou générées lors de
                        l&apos;utilisation de notre plateforme.
                    </p>

                    <h3 className='text-xl font-semibold mt-8 mb-4 text-[rgb(var(--primary))]'>Sécurité des données</h3>

                    <p className='mb-6 text-[rgb(var(--app-white))]/90'>
                        Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos
                        données contre tout accès non autorisé, modification, divulgation ou destruction.
                    </p>

                    <h3 className='text-xl font-semibold mt-8 mb-4 text-[rgb(var(--primary))]'>Vos droits</h3>

                    <p className='mb-6 text-[rgb(var(--app-white))]/90'>
                        Vous avez le droit d&apos;accéder à vos données, de les rectifier, de les supprimer ou d&apos;en
                        limiter le traitement. Pour exercer ces droits, veuillez nous contacter à l&apos;adresse
                        indiquée ci-dessous.
                    </p>

                    <h3 className='text-xl font-semibold mt-8 mb-4 text-[rgb(var(--primary))]'>Contact</h3>

                    <p className='text-[rgb(var(--app-white))]/90'>
                        Pour toute question concernant notre politique de confidentialité, veuillez nous contacter à{' '}
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
