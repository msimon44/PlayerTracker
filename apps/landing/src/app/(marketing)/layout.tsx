import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

interface MarketingLayoutProps {
    readonly children: React.ReactNode;
}

export default async function MarketingLayout({
    children,
}: Readonly<MarketingLayoutProps>): Promise<React.JSX.Element> {
    return (
        <>
            {/* <SiteBanner /> */}
            <SiteHeader />
            <main className='mx-auto flex-1 overflow-hidden'>{children}</main>
            <SiteFooter />
        </>
    );
}
