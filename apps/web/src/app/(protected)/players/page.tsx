'use client';

import { Plus, Search, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { PlayerCard } from '@/components/players/player-card';
import { EmptyState } from '@/components/shared/empty-state';
import { ListPageSkeleton } from '@/components/shared/list-page-skeleton';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useAuth } from '@/hooks/use-auth';
import { PlayerListItemDto } from '@/lib/generated/models';
import { usePlayersControllerFindAll } from '@/lib/generated/players/players';
import { usePositionsControllerFindAll } from '@/lib/generated/positions/positions';
import { useSportsControllerFindAll } from '@/lib/generated/sports/sports';

export default function PlayersPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');

    const clubId = user?.staff?.clubId || user?.player?.clubId;
    const clubIdParam = clubId ? String(clubId) : '';

    const { data: players, isLoading: isLoadingPlayers } = usePlayersControllerFindAll(
        { clubId: clubIdParam },
        {
            query: {
                enabled: !!clubId,
            },
        },
    );

    const { data: positions } = usePositionsControllerFindAll();

    const { data: sports } = useSportsControllerFindAll();

    const filteredPlayers: PlayerListItemDto[] = useMemo(() => {
        if (!players) return [];

        return players
            .filter((player) => {
                const fullName = `${player.firstName} ${player.lastName}`.toLowerCase();
                const nickName = (player.nickName || '').toLowerCase();
                const searchLower = searchQuery.toLowerCase();

                return fullName.includes(searchLower) || nickName.includes(searchLower);
            })
            .sort((a, b) => {
                // First sort by team name
                const teamA = a.team?.id || 0;
                const teamB = b.team?.id || 0;
                const teamComparison = teamA - teamB;

                if (teamComparison !== 0) {
                    return teamComparison;
                }

                // Then sort by position name
                const positionA = a.position?.id || 0;
                const positionB = b.position?.id || 0;
                return positionA - positionB;
            });
    }, [players, searchQuery]);

    const getPositionName = (positionId: number | null | undefined) => {
        if (!positionId) return null;
        const position = (positions || []).find((p) => p.id === positionId);
        return position?.name || null;
    };

    const getSportName = (sportId: number | null | undefined) => {
        if (!sportId) return null;
        const sport = (sports || []).find((s) => s.id === sportId);
        return sport?.name || null;
    };

    if (isLoadingPlayers) {
        return <ListPageSkeleton showSearch={true} gridCols={2} />;
    }

    if (!clubId) {
        return (
            <div className='space-y-6'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Joueurs</h1>
                    <p className='text-muted-foreground'>Vous devez être associé à un club pour voir les joueurs.</p>
                </div>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            <PageHeader
                title='Joueurs'
                description='Gérez les joueurs de votre club'
                action={
                    <Button onClick={() => router.push('/players/new')}>
                        <Plus className='mr-2 h-4 w-4' />
                        Ajouter un joueur
                    </Button>
                }
            />

            <div className='relative'>
                <Search
                    className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground'
                    aria-hidden='true'
                />
                <Input
                    placeholder='Rechercher par nom ou surnom...'
                    aria-label='Rechercher un joueur par nom ou surnom'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='pl-10'
                />
            </div>

            <div className='text-sm text-muted-foreground'>
                {filteredPlayers.length} joueur{filteredPlayers.length > 1 ? 's' : ''} trouvé
                {filteredPlayers.length > 1 ? 's' : ''}
            </div>

            {filteredPlayers.length === 0 ? (
                <EmptyState
                    icon={User}
                    title='Aucun joueur trouvé'
                    description={
                        searchQuery ? 'Aucun joueur ne correspond à votre recherche' : 'Aucun joueur dans ce club'
                    }
                />
            ) : (
                <div className='grid gap-4 md:grid-cols-1 lg:grid-cols-2'>
                    {filteredPlayers.map((player) => (
                        <PlayerCard
                            key={player.id}
                            player={player}
                            sportName={player.position?.sportId ? getSportName(player.position.sportId) : null}
                            positionName={getPositionName(player.positionId)}
                            onClick={() => router.push(`/players/${player.id}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
