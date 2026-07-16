'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useState } from 'react';

// Fonction pour lire le cookie côté client
function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    // Lire le cookie au moment de l'initialisation du state
    const [defaultOpen] = useState(() => {
        const sidebarState = getCookie('sidebar_state');
        return sidebarState === 'false' ? false : true;
    });

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <SidebarInset>
                <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
                    <SidebarTrigger className='-ml-1' />
                    <Separator orientation='vertical' className='mr-2 h-4' />
                </header>
                <div className='flex-1 bg-muted/50 p-4 md:p-6'>{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}
