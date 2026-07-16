'use client';

import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function HeroSection(): React.ReactElement {
    const ref = useRef(null);
    return (
        <section id='hero' className='relative mx-auto mt-32 max-w-[80rem] px-6 text-center md:px-8'>
            {/* Small badge with primary accent */}
            <div
                className={cn(
                    'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6',
                    'translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:100ms]',
                )}
            >
                <span className='text-xs font-mono font-medium text-primary uppercase tracking-wider'>Nouveau</span>
                <span className='text-xs text-muted-foreground'>Suivi athlétique intelligent</span>
            </div>

            <div className='relative'>
                <h1
                    className={cn(
                        'py-6 text-4xl font-bold leading-none tracking-tighter text-balance sm:text-5xl md:text-6xl lg:text-7xl',
                        'text-foreground', // Charcoal in light, off-white in dark
                        'translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]',
                    )}
                >
                    Optimisez la performance de votre équipe
                    <br className='hidden md:block' /> avec un suivi personnalisé.
                </h1>
                {/* Subtle glow effect behind title */}
                <div className='absolute inset-0 -z-10 blur-3xl bg-primary/10 rounded-full'></div>
            </div>

            <p
                className={cn(
                    'mb-12 text-base tracking-tight md:text-lg text-balance',
                    'text-muted-foreground', // Medium gray - readable in both modes
                    'translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]',
                )}
            >
                Athlete Flow dédié à la santé et aux performances des athlètes.
            </p>

            {/* Primary CTA Button - uses shadcn variant */}
            <Button
                size='lg'
                className={cn(
                    'translate-y-[-1rem] animate-fade-in gap-1 rounded-lg opacity-0 ease-in-out [--animation-delay:600ms]',
                    'text-base md:text-lg px-8 py-6 h-auto',
                    'bg-primary text-primary-foreground hover:bg-primary/90',
                    'shadow-lg hover:shadow-xl transition-all duration-300',
                )}
            >
                <span className='font-bold'>Testez gratuitement</span>
                <ArrowRightIcon className='ml-1 size-5 transition-transform duration-300 ease-in-out group-hover:translate-x-1' />
            </Button>

            {/* Hero Image with gradient overlay */}
            <div
                ref={ref}
                className='relative mt-[8rem] animate-fade-up opacity-0 [--animation-delay:400ms] [perspective:2000px]'
            >
                <div className='relative rounded-xl overflow-hidden border border-border shadow-2xl'>
                    <Image
                        src='/hero-dark.png'
                        alt='Hero Image'
                        width={1920}
                        height={1080}
                        className='w-full h-full object-contain relative z-10'
                    />
                    {/* Gradient overlay - adapts to theme */}
                    <div className='absolute inset-0 z-20 bg-gradient-to-b from-transparent via-background/60 to-background top-[30%]'></div>
                </div>
            </div>
        </section>
    );
}
