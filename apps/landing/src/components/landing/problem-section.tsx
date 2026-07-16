'use client';

import { cn } from '@/lib/utils';

export default function ProblemSection(): React.ReactElement {
    return (
        <section id='problem' className='py-14 px-4 md:px-8'>
            <div className='mx-auto max-w-screen-xl text-center'>
                <div className='mb-16'>
                    <h2
                        className={cn(
                            'text-4xl md:text-5xl font-bold tracking-tight',
                            'text-foreground', // Readable in both modes
                        )}
                    >
                        Gérer la santé des joueurs sans outil adapté,
                        <br />
                        c&apos;est galère.
                    </h2>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-12'>
                    {/* Suivi Dispersé Card */}
                    <div className='flex flex-col items-start text-left space-y-4'>
                        <div className='size-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0'>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-6 w-6 text-primary'
                                viewBox='0 0 20 20'
                                fill='currentColor'
                            >
                                <path
                                    fillRule='evenodd'
                                    d='M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z'
                                    clipRule='evenodd'
                                />
                            </svg>
                        </div>
                        <h3 className='text-xl font-semibold text-foreground'>Suivi Dispersé</h3>
                        <p className='text-muted-foreground'>
                            Sans plateforme centralisée, les données de bien-être et de performance des joueurs sont
                            éparpillées, rendant difficile une vision claire et continue de leur état.
                        </p>
                    </div>

                    {/* Réactions Tardives Card */}
                    <div className='flex flex-col items-start text-left space-y-4'>
                        <div className='size-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0'>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-6 w-6 text-primary'
                                viewBox='0 0 20 20'
                                fill='currentColor'
                            >
                                <path
                                    fillRule='evenodd'
                                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                                    clipRule='evenodd'
                                />
                            </svg>
                        </div>
                        <h3 className='text-xl font-semibold text-foreground'>Réactions Tardives</h3>
                        <p className='text-muted-foreground'>
                            Les signaux d&apos;alerte comme la fatigue ou le surmenage passent souvent inaperçus, car
                            les remontées d&apos;informations ne sont ni automatisées ni en temps réel.
                        </p>
                    </div>

                    {/* Manque d'Engagement Card */}
                    <div className='flex flex-col items-start text-left space-y-4'>
                        <div className='size-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0'>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-6 w-6 text-primary'
                                viewBox='0 0 20 20'
                                fill='currentColor'
                            >
                                <path
                                    fillRule='evenodd'
                                    d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                                    clipRule='evenodd'
                                />
                            </svg>
                        </div>
                        <h3 className='text-xl font-semibold text-foreground'>Manque d&apos;Engagement</h3>
                        <p className='text-muted-foreground'>
                            Les outils actuels sont peu adaptés au quotidien des joueurs, ce qui entraîne une faible
                            participation et limite l&apos;efficacité du suivi.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
