'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { useAuth } from '@/hooks/use-auth';
import type { QuestionnaireListItemDtoStatus } from '@/lib/generated/models';
import { useQuestionnairesControllerFindAll } from '@/lib/generated/questionnaires/questionnaires';
import { useTeamsControllerFindAll } from '@/lib/generated/teams/teams';

import { QuestionnaireList } from '@/components/questionnaires/questionnaire-list';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

type StatusFilter = QuestionnaireListItemDtoStatus | 'ALL';
type TeamFilter = number | 'ALL';

type Team = {
    id: number;
    name: string;
};

const statusLabels: Record<StatusFilter, string> = {
    ALL: 'Tous les statuts',
    DRAFT: 'Brouillon',
    ACTIVE: 'Actif',
    ARCHIVED: 'Archivé',
    COMPLETED: 'Complété',
};

export default function QuestionnairesPage() {
    const router = useRouter();
    const { user } = useAuth();

    const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
    const [teamFilter, setTeamFilter] = useState<TeamFilter>('ALL');

    const clubId = user?.staff?.clubId || user?.player?.clubId;

    const { data: questionnaires, isLoading: isLoadingQuestionnaires } = useQuestionnairesControllerFindAll(
        { clubId },
        {
            query: {
                enabled: !!clubId,
            },
        },
    ) as any;

    const { data: teams, isLoading: isLoadingTeams } = useTeamsControllerFindAll(
        { clubId },
        {
            query: {
                enabled: !!clubId,
            },
        },
    ) as any;

    const filteredQuestionnaires = useMemo(() => {
        if (!questionnaires) return [];

        return (questionnaires as any[]).filter((q: any) => {
            const matchesStatus = statusFilter === 'ALL' || q.status === statusFilter;
            const matchesTeam = teamFilter === 'ALL' || q.teamId === teamFilter;
            return matchesStatus && matchesTeam;
        });
    }, [questionnaires, statusFilter, teamFilter]);

    const handleNewQuestionnaire = () => {
        router.push('/questionnaires/new');
    };

    if (isLoadingQuestionnaires || isLoadingTeams) {
        return (
            <div className='space-y-6'>
                <div>
                    <Skeleton className='h-10 w-64' />
                    <Skeleton className='mt-2 h-5 w-96' />
                </div>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='flex flex-1 gap-2'>
                        <Skeleton className='h-10 w-48' />
                        <Skeleton className='h-10 w-48' />
                    </div>
                    <Skeleton className='h-10 w-48' />
                </div>
                <Skeleton className='h-96 w-full' />
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            <div>
                <h1 className='text-3xl font-bold tracking-tight'>Questionnaires</h1>
                <p className='text-muted-foreground'>Gérez les questionnaires envoyés aux joueurs</p>
            </div>

            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div className='flex flex-1 gap-2'>
                    <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                        <SelectTrigger className='w-[180px]'>
                            <SelectValue placeholder='Filtrer par statut' />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(statusLabels).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={teamFilter === 'ALL' ? 'ALL' : String(teamFilter)}
                        onValueChange={(value) => setTeamFilter(value === 'ALL' ? 'ALL' : Number(value))}
                    >
                        <SelectTrigger className='w-[180px]'>
                            <SelectValue placeholder='Filtrer par équipe' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='ALL'>Toutes les équipes</SelectItem>
                            {Array.isArray(teams) &&
                                teams.map((team: Team) => (
                                    <SelectItem key={team.id} value={String(team.id)}>
                                        {team.name}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                </div>

                <Button onClick={handleNewQuestionnaire}>
                    <Plus className='mr-2 h-4 w-4' />
                    Nouveau questionnaire
                </Button>
            </div>

            <QuestionnaireList questionnaires={filteredQuestionnaires} />
        </div>
    );
}
