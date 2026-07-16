'use client';

import { Plus, UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { EmptyState } from '@/components/shared/empty-state';
import { ListPageSkeleton } from '@/components/shared/list-page-skeleton';
import { PageHeader } from '@/components/shared/page-header';
import { TeamCard } from '@/components/teams/team-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useAuth } from '@/hooks/use-auth';
import { TeamListItemDto } from '@/lib/generated/models';
import { useSportsControllerFindAll } from '@/lib/generated/sports/sports';
import { useTeamsControllerFindAll } from '@/lib/generated/teams/teams';

type SportFilter = number | 'ALL';

export default function TeamsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [sportFilter, setSportFilter] = useState<SportFilter>('ALL');

    // Récupérer les équipes du club de l'utilisateur
    const clubId = user?.staff?.clubId || user?.player?.clubId;
    const clubIdParam = clubId ? String(clubId) : '';

    const { data: teams, isLoading: isLoadingTeams } = useTeamsControllerFindAll(
        { clubId: clubIdParam },
        {
            query: {
                enabled: !!clubId,
            },
        },
    );

    const { data: sports, isLoading: isLoadingSports } = useSportsControllerFindAll();

    const filteredTeams: TeamListItemDto[] = useMemo(() => {
        if (!teams) return [];

        return teams
            .filter((team) => {
                const matchesSport = sportFilter === 'ALL' || team.sportId === sportFilter;
                return matchesSport;
            })
            .sort((a, b) => a.id - b.id);
    }, [teams, sportFilter]);

    const getSportName = (sportId: number) => {
        const sport = (sports || []).find((s) => s.id === sportId);
        return sport?.name || 'Sport inconnu';
    };

    if (isLoadingTeams || isLoadingSports) {
        return <ListPageSkeleton gridCols={3} />;
    }

    if (!clubId) {
        return (
            <div className='space-y-6'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Équipes</h1>
                    <p className='text-muted-foreground'>Vous devez être associé à un club pour voir les équipes.</p>
                </div>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            <PageHeader
                title='Équipes'
                description='Gérez les équipes de votre club'
                action={
                    <Button onClick={() => router.push('/teams/new')}>
                        <Plus className='mr-2 h-4 w-4' />
                        Nouvelle équipe
                    </Button>
                }
            />

            <div className='flex flex-col sm:flex-row gap-4'>
                <Select
                    value={sportFilter === 'ALL' ? 'ALL' : String(sportFilter)}
                    onValueChange={(value) => setSportFilter(value === 'ALL' ? 'ALL' : Number(value))}
                >
                    <SelectTrigger className='w-full sm:w-[200px]'>
                        <SelectValue placeholder='Filtrer par sport' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='ALL'>Tous les sports</SelectItem>
                        {(sports || []).map((sport) => (
                            <SelectItem key={sport.id} value={String(sport.id)}>
                                {sport.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className='text-sm text-muted-foreground flex items-center'>
                    {filteredTeams.length} équipe{filteredTeams.length > 1 ? 's' : ''} trouvée
                    {filteredTeams.length > 1 ? 's' : ''}
                </div>
            </div>

            {filteredTeams.length === 0 ? (
                <EmptyState
                    icon={UserCircle}
                    title='Aucune équipe trouvée'
                    description='Commencez par créer votre première équipe'
                    action={
                        <Button onClick={() => router.push('/teams/new')}>
                            <Plus className='mr-2 h-4 w-4' />
                            Créer une équipe
                        </Button>
                    }
                />
            ) : (
                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    {filteredTeams.map((team) => (
                        <TeamCard
                            key={team.id}
                            team={team}
                            sportName={getSportName(team.sportId)}
                            onClick={() => router.push(`/teams/${team.id}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
