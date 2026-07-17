import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getPlayerImageUrl } from '@/lib/utils';
import { Edit, Trash2 } from 'lucide-react';

type PlayerHeaderCardProps = {
    player: {
        firstName: string;
        lastName: string;
        nickName?: string | null;
        photoUrl?: string | null;
        isActive: boolean;
    };
    onEdit: () => void;
    onDelete: () => void;
    children?: React.ReactNode;
};

export function PlayerHeaderCard({ player, onEdit, onDelete, children }: PlayerHeaderCardProps) {
    return (
        <div className='overflow-hidden relative'>
            <div className='flex h-64'>
                {/* Left side - Header content */}
                <div className='flex-1 flex flex-col justify-between p-8'>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>
                            {player.nickName || `${player.firstName} ${player.lastName}`}
                        </h1>
                        <p className='text-lg text-muted-foreground mt-2'>
                            {player.firstName} {player.lastName}
                        </p>
                    </div>
                    {children}
                </div>

                {/* Right side - Player image */}
                <div className='w-1/2 overflow-hidden justify-center flex items-center'>
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
                <Badge variant={player.isActive ? 'default' : 'secondary'}>
                    {player.isActive ? 'Actif' : 'Inactif'}
                </Badge>
            </div>

            {/* Update button - Top right */}
            <div className='absolute top-4 right-4 flex gap-2'>
                <Button
                    variant='outline'
                    size='icon'
                    onClick={onEdit}
                    className='bg-background/80 backdrop-blur-sm'
                    aria-label='Modifier le joueur'
                >
                    <Edit className='h-4 w-4' aria-hidden='true' />
                </Button>
                <Button
                    variant='destructive'
                    size='icon'
                    onClick={onDelete}
                    className='bg-destructive/80 backdrop-blur-sm hover:bg-destructive'
                    aria-label='Supprimer le joueur'
                >
                    <Trash2 className='h-4 w-4' aria-hidden='true' />
                </Button>
            </div>
        </div>
    );
}
