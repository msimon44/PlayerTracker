'use client';

import {
    Calendar,
    ChevronUp,
    ClipboardList,
    Home,
    LogOut,
    Settings,
    TrendingUp,
    UserCircle,
    Users,
} from 'lucide-react';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/use-auth';

// Menu items
const mainMenuItems = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: Home,
    },
    {
        title: 'Joueurs',
        url: '/players',
        icon: Users,
    },
    {
        title: 'Équipes',
        url: '/teams',
        icon: UserCircle,
    },
    {
        title: 'Calendrier',
        url: '/calendar',
        icon: Calendar,
    },
    {
        title: 'Questionnaires',
        url: '/questionnaires',
        icon: ClipboardList,
    },
    {
        title: 'Métriques',
        url: '/metrics',
        icon: TrendingUp,
    },
];

const settingsMenuItems = [
    {
        title: 'Paramètres',
        url: '/settings',
        icon: Settings,
    },
];

export function AppSidebar() {
    const { user, logout } = useAuth();
    const { state } = useSidebar();

    return (
        <TooltipProvider delayDuration={0}>
            <Sidebar collapsible='icon' variant='inset'>
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size='lg' asChild>
                                <Link href='/dashboard'>
                                    <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
                                        <TrendingUp className='size-4' />
                                    </div>
                                    <div className='flex flex-col gap-0.5 leading-none'>
                                        <span className='font-semibold'>PlayerTracker</span>
                                        <span className='text-xs text-muted-foreground'>Gestion sportive</span>
                                    </div>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {mainMenuItems.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <SidebarMenuButton asChild>
                                                    <Link href={item.url}>
                                                        <item.icon />
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </TooltipTrigger>
                                            <TooltipContent side='right'>
                                                <p>{item.title}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel>Configuration</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {settingsMenuItems.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <SidebarMenuButton asChild>
                                                    <Link href={item.url}>
                                                        <item.icon />
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </TooltipTrigger>
                                            <TooltipContent side='right'>
                                                <p>{item.title}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                        size='lg'
                                        className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                                    >
                                        <Avatar className='h-8 w-8'>
                                            <AvatarImage
                                                src={typeof user?.avatarUrl === 'string' ? user.avatarUrl : undefined}
                                                alt={user?.email}
                                            />
                                            <AvatarFallback className='bg-primary text-primary-foreground'>
                                                {user?.email?.charAt(0).toUpperCase() || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className='grid flex-1 text-left text-sm leading-tight'>
                                            <span className='truncate font-semibold'>
                                                {user?.email || 'Utilisateur'}
                                            </span>
                                            <span className='truncate text-xs text-muted-foreground'>
                                                {user?.role || 'PLAYER'}
                                            </span>
                                        </div>
                                        <ChevronUp className='ml-auto size-4' />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
                                    side={state === 'collapsed' ? 'right' : 'bottom'}
                                    align='end'
                                    sideOffset={4}
                                >
                                    <DropdownMenuItem asChild>
                                        <Link href='/settings'>
                                            <Settings className='mr-2 size-4' />
                                            Paramètres
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={logout}>
                                        <LogOut className='mr-2 size-4' />
                                        Déconnexion
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
        </TooltipProvider>
    );
}
