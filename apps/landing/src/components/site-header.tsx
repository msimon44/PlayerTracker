'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { AlignJustify, XIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '@playertracker/theme/web';

const menuItem = [
    {
        id: 1,
        label: 'Fonctionnalités',
        href: '/features',
    },
    {
        id: 2,
        label: 'Tarifs',
        href: '#',
    },
    {
        id: 3,
        label: 'Carrières',
        href: '#',
    },
    {
        id: 4,
        label: 'Contactez-nous',
        href: '#',
    },
];

export function SiteHeader(): React.ReactElement {
    const mobilenavbarVariant = {
        initial: {
            opacity: 0,
            scale: 1,
        },
        animate: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.2,
                ease: 'easeOut' as const,
            },
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.2,
                delay: 0.2,
                ease: 'easeOut' as const,
            },
        },
    };

    const mobileLinkVar = {
        initial: {
            y: '-20px',
            opacity: 0,
        },
        open: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.3,
                ease: 'easeOut' as const,
            },
        },
    };

    const containerVariants = {
        open: {
            transition: {
                staggerChildren: 0.06,
            },
        },
    };

    const [hamburgerMenuIsOpen, setHamburgerMenuIsOpen] = useState(false);

    useEffect(() => {
        const html = document.querySelector('html');
        if (html) html.classList.toggle('overflow-hidden', hamburgerMenuIsOpen);
    }, [hamburgerMenuIsOpen]);

    useEffect(() => {
        const closeHamburgerNavigation = () => setHamburgerMenuIsOpen(false);
        window.addEventListener('orientationchange', closeHamburgerNavigation);
        window.addEventListener('resize', closeHamburgerNavigation);

        return () => {
            window.removeEventListener('orientationchange', closeHamburgerNavigation);
            window.removeEventListener('resize', closeHamburgerNavigation);
        };
    }, [setHamburgerMenuIsOpen]);

    return (
        <>
            <header className='fixed left-0 top-0 z-50 w-full translate-y-[-1rem] animate-fade-in border-b border-border/60 bg-background/80 opacity-0 backdrop-blur-[12px] [--animation-delay:600ms]'>
                <div className='container flex h-[3.5rem] items-center justify-between'>
                    <Link
                        className='text-md flex items-center text-primary font-bold hover:opacity-90 transition-opacity'
                        href='/'
                    >
                        Athlete Flow
                    </Link>

                    <div className='ml-auto flex h-full items-center gap-3'>
                        <Link className='text-sm text-foreground hover:text-primary transition-colors' href='/#'>
                            Connexion
                        </Link>
                        <Link
                            className={cn(
                                buttonVariants({ variant: 'default', size: 'sm' }),
                                'bg-primary text-primary-foreground hover:bg-primary/90',
                            )}
                            href='/#'
                        >
                            Inscription
                        </Link>
                        <Link
                            className={cn(
                                buttonVariants({ variant: 'secondary', size: 'sm' }),
                                'hidden md:inline-flex bg-secondary text-secondary-foreground hover:bg-secondary/90',
                            )}
                            href='/#'
                        >
                            Testez gratuitement
                        </Link>
                        <ThemeToggle />
                    </div>
                    <button
                        className='ml-6 md:hidden text-foreground hover:text-primary transition-colors'
                        onClick={() => setHamburgerMenuIsOpen((open) => !open)}
                    >
                        <span className='sr-only'>Toggle menu</span>
                        {hamburgerMenuIsOpen ? <XIcon /> : <AlignJustify />}
                    </button>
                </div>
            </header>
            <AnimatePresence>
                <motion.nav
                    initial='initial'
                    exit='exit'
                    variants={mobilenavbarVariant}
                    animate={hamburgerMenuIsOpen ? 'animate' : 'exit'}
                    className={cn(
                        'fixed left-0 top-0 z-50 h-screen w-full overflow-auto bg-background/95 backdrop-blur-[12px]',
                        {
                            'pointer-events-none': !hamburgerMenuIsOpen,
                        },
                    )}
                >
                    <div className='container flex h-[3.5rem] items-center justify-between'>
                        <Link className='text-md flex items-center text-primary font-bold' href='/'>
                            Athlete Flow
                        </Link>

                        <div className='flex items-center gap-2'>
                            <ThemeToggle />
                            <button
                                className='ml-2 md:hidden text-foreground hover:text-primary transition-colors'
                                onClick={() => setHamburgerMenuIsOpen((open) => !open)}
                            >
                                <span className='sr-only'>Toggle menu</span>
                                {hamburgerMenuIsOpen ? <XIcon /> : <AlignJustify />}
                            </button>
                        </div>
                    </div>
                    <motion.ul
                        className='flex flex-col md:flex-row md:items-center uppercase md:normal-case ease-in'
                        variants={containerVariants}
                        initial='initial'
                        animate={hamburgerMenuIsOpen ? 'open' : 'exit'}
                    >
                        {menuItem.map((item) => (
                            <motion.li
                                variants={mobileLinkVar}
                                key={item.id}
                                className='border-primary/20 pl-6 py-0.5 border-b md:border-none'
                            >
                                <Link
                                    className={`text-foreground hover:text-primary flex h-[var(--navigation-height)] w-full items-center text-xl transition-[color,transform] duration-300 md:translate-y-0 md:text-sm md:transition-colors ${
                                        hamburgerMenuIsOpen ? '[&_a]:translate-y-0' : ''
                                    }`}
                                    href={item.href}
                                >
                                    {item.label}
                                </Link>
                            </motion.li>
                        ))}
                    </motion.ul>
                </motion.nav>
            </AnimatePresence>
        </>
    );
}
