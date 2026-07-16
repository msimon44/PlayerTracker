import { DiscordLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

const footerNavs = [
    {
        label: 'Produit',
        items: [
            {
                href: '/',
                name: "Collecte d'emails",
            },
            {
                href: '/pricing',
                name: 'Tarification',
            },
            {
                href: '/faq',
                name: 'FAQ',
            },
        ],
    },

    {
        label: 'Communauté',
        items: [
            {
                href: '/',
                name: 'Discord',
            },
            {
                href: '/',
                name: 'Twitter',
            },
            {
                href: 'mailto:hello@chatcollect.com',
                name: 'Email',
            },
        ],
    },
    {
        label: 'Légal',
        items: [
            {
                href: '/terms',
                name: 'Conditions',
            },

            {
                href: '/privacy',
                name: 'Confidentialité',
            },
        ],
    },
];

const footerSocials = [
    {
        href: '',
        name: 'Discord',
        icon: <DiscordLogoIcon className='h-4 w-4' />,
    },
    {
        href: '',
        name: 'Twitter',
        icon: <TwitterLogoIcon className='h-4 w-4' />,
    },
];

export function SiteFooter(): React.ReactElement {
    return (
        <footer className='bg-card border-t border-border'>
            <div className='mx-auto w-full max-w-screen-xl xl:pb-2'>
                <div className='md:flex md:justify-between px-8 p-4 py-16 sm:pb-16 gap-4'>
                    <div className='mb-12 flex-col flex gap-4'>
                        <Link href='/' className='flex items-center gap-2'>
                            <span className='self-center text-2xl font-semibold text-primary hover:opacity-90 transition-opacity'>
                                Athlete Flow
                            </span>
                        </Link>
                        <p className='max-w-xs text-muted-foreground'>
                            La solution digitale pour optimiser la santé et la performance des athlètes.
                        </p>
                    </div>
                    <div className='grid grid-cols-1 gap-8 sm:gap-10 sm:grid-cols-3'>
                        {footerNavs.map((nav) => (
                            <div key={nav.label}>
                                <h2 className='mb-6 text-sm tracking-tighter font-medium text-primary uppercase'>
                                    {nav.label}
                                </h2>
                                <ul className='gap-2 grid'>
                                    {nav.items.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className='cursor-pointer text-muted-foreground hover:text-primary transition-colors duration-200 font-[450] text-sm'
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='px-8 py-6 border-t border-border'>
                    <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
                        <p className='text-sm text-muted-foreground'>© 2025 Athlete Flow. Tous droits réservés.</p>
                        <div className='flex gap-4'>
                            {footerSocials.map((social) => (
                                <Link
                                    key={social.name}
                                    href={social.href}
                                    className='text-muted-foreground hover:text-primary transition-colors'
                                    aria-label={social.name}
                                >
                                    {social.icon}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {/*   <SiteBanner /> */}
        </footer>
    );
}
