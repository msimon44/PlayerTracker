'use client';

import FlickeringGrid from '@/components/magicui/flickering-grid';
import Ripple from '@/components/magicui/ripple';
import Safari from '@/components/safari';
import Section from '@/components/section';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function Component(): React.ReactElement {
    const features = [
        {
            title: 'Analyse personnalisée des données athlètes',
            description:
                "Centralisez les infos clés sur l'état physique et mental des joueurs pour une vision claire et actionnable.",
            className: 'hover:bg-primary/10 transition-all duration-500 ease-out',
            content: (
                <Safari
                    src='/analyse.png'
                    url='https://playertracker.fr/'
                    className='-mb-32 mt-4 max-h-64 w-full px-4 select-none drop-shadow-[0_0_28px_rgba(0,0,0,.1)] group-hover:translate-y-[-10px] transition-all duration-300'
                />
            ),
        },
        {
            title: 'Sécurité et confidentialité totale',
            description: 'Les données sont protégées par un chiffrement avancé, assurant une confidentialité maximale.',
            className: 'order-3 xl:order-none hover:bg-primary/10 transition-all duration-500 ease-out',
            content: (
                <Safari
                    src='/analyse.png'
                    url='https://playertracker.fr/'
                    className='-mb-32 mt-4 max-h-64 w-full px-4 select-none drop-shadow-[0_0_28px_rgba(0,0,0,.1)] group-hover:translate-y-[-10px] transition-all duration-300'
                />
            ),
        },
        {
            title: 'Intégration simple et intuitive',
            description: "Une interface fluide, pensée pour s'adapter facilement à vos méthodes de travail.",
            className: 'md:row-span-2 hover:bg-primary/10 transition-all duration-500 ease-out',
            content: (
                <>
                    <FlickeringGrid
                        className='z-0 absolute inset-0 [mask:radial-gradient(circle_at_center,#fff_400px,transparent_0)]'
                        squareSize={4}
                        gridGap={6}
                        color='#000'
                        maxOpacity={0.1}
                        flickerChance={0.1}
                        height={800}
                        width={800}
                    />
                    <Safari
                        src='/analyse.png'
                        url='https://playertracker.fr/'
                        className='-mb-48 ml-12 mt-16 h-full px-4 select-none drop-shadow-[0_0_28px_rgba(0,0,0,.1)] group-hover:translate-x-[-10px] transition-all duration-300'
                    />
                </>
            ),
        },
        {
            title: 'Un gain de temps au quotidien',
            description:
                'Fini les tableurs et les relances manuelles : tout est automatisé pour libérer du temps aux staffs et mieux accompagner les athlètes.',
            className:
                'flex-row order-4 md:col-span-2 md:flex-row xl:order-none hover:bg-primary/10 transition-all duration-500 ease-out',
            content: (
                <>
                    <Ripple className='absolute -bottom-full' />
                    <Safari
                        src='/liste_joueur.png'
                        url='https://playertracker.fr/'
                        className='-mb-32 mt-4 max-h-64 w-full px-4 select-none drop-shadow-[0_0_28px_rgba(0,0,0,.1)] group-hover:translate-y-[-10px] transition-all duration-300'
                    />
                </>
            ),
        },
    ];

    return (
        <Section
            subtitle='Optimisez le suivi de vos joueurs en un clic'
            description='Athlete Flow est une solution intelligente, qui centralise et simplifie le suivi de la performance et du bien-être des athlètes.'
            className='bg-background'
        >
            <div className='mx-auto mt-16 grid max-w-sm grid-cols-1 gap-6 md:max-w-3xl md:grid-cols-2 xl:grid-rows-2 md:grid-rows-3 xl:max-w-6xl xl:auto-rows-fr xl:grid-cols-3'>
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        className={cn(
                            'group relative items-start overflow-hidden bg-card border border-border p-6 rounded-2xl',
                            feature.className,
                        )}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.5,
                            type: 'spring',
                            stiffness: 100,
                            damping: 30,
                            delay: index * 0.1,
                        }}
                        viewport={{ once: true }}
                    >
                        <div>
                            <h3 className='font-semibold mb-2 text-foreground'>{feature.title}</h3>
                            <p className='text-muted-foreground'>{feature.description}</p>
                        </div>
                        {feature.content}
                        <div className='absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-card pointer-events-none'></div>
                    </motion.div>
                ))}
            </div>
        </Section>
    );
}
