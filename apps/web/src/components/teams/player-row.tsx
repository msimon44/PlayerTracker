import { Button } from '@/components/ui/button';
import { formatRoleNameForImage, formatSportNameForImage } from '@/lib/image-utils';
import { getPlayerImageUrl, getPositionImageUrl } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { MouseEvent } from 'react';

type Player = {
    id: number;
    firstName: string;
    lastName: string;
    nickName?: string | null;
    photoUrl?: string | null;
    positionId?: number | null;
    position?: { id: number; name: string } | null;
    isActive: boolean;
};

type PlayerRowProps = {
    player: Player;
    positionName: string | null;
    sportName: string | null;
    onRemove: () => void;
};

export function PlayerRow({ player, positionName, sportName, onRemove }: PlayerRowProps) {
    const router = useRouter();

    const handlePlayerClick = (e: MouseEvent) => {
        if ((e.target as HTMLElement).closest('button')) {
            return;
        }
        router.push(`/players/${player.id}`);
    };

    return (
        <div
            className='flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/10 hover:shadow-md transition-all cursor-pointer'
            onClick={handlePlayerClick}
        >
            <div className='flex items-center gap-4 flex-1'>
                <div className='h-16 w-16 overflow-hidden rounded-full flex-shrink-0'>
                    <img
                        src={getPlayerImageUrl(player.photoUrl) || getPlayerImageUrl('default_player.png') || ''}
                        alt={player.firstName}
                        className='w-full h-full object-cover'
                        onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            if (!img.src.includes('default_player.png')) {
                                img.src = getPlayerImageUrl('default_player.png') || '';
                            }
                        }}
                    />
                </div>
                {sportName && positionName && (
                    <div className='h-8 w-8 overflow-hidden rounded flex-shrink-0'>
                        <img
                            src={
                                getPositionImageUrl(
                                    `${formatSportNameForImage(sportName)}_${formatRoleNameForImage(positionName)}.png`,
                                ) || ''
                            }
                            alt={positionName}
                            className='w-full h-full object-cover'
                            onError={(e) => {
                                e.currentTarget.parentElement!.innerHTML = `<span class='flex items-center justify-center h-full text-xs font-medium'>${positionName}</span>`;
                            }}
                        />
                    </div>
                )}
                <div className='flex-1'>
                    <p className='font-semibold text-base'>
                        {player.nickName || `${player.firstName} ${player.lastName}`}
                    </p>
                    <p className='text-sm text-muted-foreground mt-1'>
                        {player.firstName} {player.lastName}
                    </p>
                </div>
            </div>
            <Button
                variant='ghost'
                size='sm'
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                }}
            >
                <Trash2 className='h-4 w-4' />
            </Button>
        </div>
    );
}
