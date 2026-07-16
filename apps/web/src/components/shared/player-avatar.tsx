'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn, getPlayerImageUrl } from '@/lib/utils';

type PlayerAvatarProps = {
    firstName: string;
    lastName?: string | null;
    nickName?: string | null;
    photoUrl?: string | null;
    className?: string;
};

export function PlayerAvatar({ firstName, lastName, nickName, photoUrl, className }: PlayerAvatarProps) {
    const label = nickName || `${firstName} ${lastName ?? ''}`.trim();
    const initials = (nickName || `${firstName[0] ?? ''}${lastName?.[0] ?? ''}`).slice(0, 2).toUpperCase();

    return (
        <Avatar className={cn('h-10 w-10', className)}>
            <AvatarImage
                src={getPlayerImageUrl(photoUrl) || getPlayerImageUrl('default_player.png') || undefined}
                alt={label}
            />
            <AvatarFallback>{initials || '?'}</AvatarFallback>
        </Avatar>
    );
}
