import { RoleBadge } from '@/components/players/role-badge';
import { SportBadge } from '@/components/shared/sport-badge';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getPlayerImageUrl } from '@/lib/utils';

type PlayerCardProps = {
    player: {
        id: number;
        firstName: string;
        lastName: string;
        nickName?: string | null;
        photoUrl?: string | null;
        positionId?: number | null;
        position?: {
            id: number;
            name: string;
            sportId?: number;
        } | null;
        isActive: boolean;
    };
    sportName: string | null;
    positionName: string | null;
    onClick: () => void;
};

export function PlayerCard({ player, sportName, positionName, onClick }: PlayerCardProps) {
    return (
        <Card
            className='hover:shadow-lg hover:bg-secondary/10 transition-all cursor-pointer overflow-hidden relative'
            onClick={onClick}
        >
            <div className='flex h-48'>
                {/* Left side - Content */}
                <div className='flex-1 flex flex-col justify-between p-6'>
                    <div>
                        <h3 className='text-xl font-bold'>
                            {player.nickName || `${player.firstName} ${player.lastName}`}
                        </h3>
                        <p className='text-sm text-muted-foreground mt-1'>
                            {player.firstName} {player.lastName}
                        </p>
                    </div>
                    {/* Sport with logo */}
                    {sportName && (
                        <div className='mt-2'>
                            <SportBadge sportName={sportName} size='md' showLabel={true} />
                        </div>
                    )}

                    {/* Role with image only */}
                    {sportName && positionName && (
                        <div className='mt-2'>
                            <RoleBadge sportName={sportName} roleName={positionName} />
                        </div>
                    )}
                </div>

                {/* Right side - Player image */}
                <div className='w-1/2 overflow-hidden'>
                    <img
                        src={getPlayerImageUrl(player.photoUrl) || getPlayerImageUrl('default_player.png') || ''}
                        alt={player.firstName}
                        className='w-full h-full object-contain'
                        onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            if (!img.src.includes('default_player.png')) {
                                img.src = getPlayerImageUrl('default_player.png') || '';
                            }
                        }}
                    />
                </div>
            </div>

            {/* Status badge - Absolute positioned */}
            <div className='absolute bottom-4 right-4'>
                <Badge variant={player.isActive ? 'default' : 'secondary'} className='flex-shrink-0'>
                    {player.isActive ? 'Actif' : 'Inactif'}
                </Badge>
            </div>
        </Card>
    );
}
