'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function CallToActionSection(): React.ReactElement {
    return (
        <section id='cta' className='bg-background py-24'>
            <div className='container mx-auto px-4 text-center'>
                <div className='max-w-3xl mx-auto'>
                    <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8'>
                        Commencez votre essai gratuit aujourd&apos;hui.
                    </h2>
                    <Link
                        href='#'
                        className={cn(
                            buttonVariants({
                                size: 'lg',
                            }),
                            'px-8 py-6 rounded-md bg-primary text-primary-foreground font-medium text-lg transition-all duration-300 hover:bg-primary/90',
                        )}
                    >
                        Commencer gratuitement
                        <ChevronRight className='ml-2 size-4' />
                    </Link>
                </div>
            </div>
        </section>
    );
}
