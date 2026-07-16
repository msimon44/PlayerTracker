'use client';

import {
    addDays,
    addMonths,
    addWeeks,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    parseISO,
    startOfMonth,
    startOfWeek,
    subMonths,
    subWeeks,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarDays, ChevronLeft, ChevronRight, ClipboardList, Dumbbell, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { AXIOS_INSTANCE } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { useQuestionnairesControllerFindAll } from '@/lib/generated/questionnaires/questionnaires';
import { useTeamsControllerFindAll } from '@/lib/generated/teams/teams';

type CalendarView = 'month' | 'week' | 'day';
type TeamFilter = number | 'ALL';

type CalendarEvent = {
    id: number;
    teamId: number;
    title: string;
    description: string | null;
    type: 'MATCH' | 'TRAINING' | 'REVIEW' | 'OTHER';
    startsAt: string;
    endsAt: string;
    opponent: string | null;
    location: string | null;
    team: { id: number; name: string; clubId: number };
    questionnaires: Array<{
        id: number;
        title: string;
        status: string;
        scheduledAt: string | null;
        closesAt: string | null;
    }>;
};

type CalendarItem = {
    id: string;
    date: Date;
    title: string;
    teamId: number;
    teamName: string;
    kind: 'MATCH' | 'TRAINING' | 'QUESTIONNAIRE';
    questionnaireId?: number;
    meta?: string;
};

const viewLabels: Record<CalendarView, string> = {
    month: 'Mois',
    week: 'Semaine',
    day: 'Jour',
};

const itemStyles: Record<CalendarItem['kind'], string> = {
    MATCH: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-100',
    TRAINING:
        'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100',
    QUESTIONNAIRE:
        'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100',
};

export default function CalendarPage() {
    const router = useRouter();
    const { user } = useAuth();
    const clubId = user?.staff?.clubId || user?.player?.clubId;
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<CalendarView>('month');
    const [teamFilter, setTeamFilter] = useState<TeamFilter>('ALL');

    const { data: teams, isLoading: isLoadingTeams } = useTeamsControllerFindAll(
        { clubId: clubId ? String(clubId) : '' },
        { query: { enabled: !!clubId } },
    );

    const { data: questionnaires, isLoading: isLoadingQuestionnaires } = useQuestionnairesControllerFindAll(
        { clubId },
        { query: { enabled: !!clubId } },
    ) as any;

    const { data: events, isLoading: isLoadingEvents } = useQuery({
        queryKey: ['calendar-events', clubId, teamFilter],
        enabled: !!clubId,
        queryFn: async () => {
            const params = new URLSearchParams();
            if (clubId) params.set('clubId', String(clubId));
            if (teamFilter !== 'ALL') params.set('teamId', String(teamFilter));
            const response = await AXIOS_INSTANCE.get<CalendarEvent[]>(`/calendar-events?${params.toString()}`);
            return response.data;
        },
    });

    const items = useMemo<CalendarItem[]>(() => {
        const eventItems: CalendarItem[] =
            events?.map((event) => ({
                id: `event-${event.id}`,
                date: parseISO(event.startsAt),
                title: event.title,
                teamId: event.teamId,
                teamName: event.team.name,
                kind: event.type === 'MATCH' ? 'MATCH' : 'TRAINING',
                meta: [event.opponent, event.location].filter(Boolean).join(' - '),
            })) ?? [];

        const questionnaireItems =
            ((questionnaires as any[]) ?? [])
                .filter((questionnaire) => questionnaire.scheduledAt)
                .filter((questionnaire) => teamFilter === 'ALL' || questionnaire.teamId === teamFilter)
                .map((questionnaire) => ({
                    id: `questionnaire-${questionnaire.id}`,
                    date: parseISO(questionnaire.scheduledAt),
                    title: questionnaire.title,
                    teamId: questionnaire.teamId,
                    teamName: questionnaire.team?.name ?? 'Équipe',
                    kind: 'QUESTIONNAIRE' as const,
                    questionnaireId: questionnaire.id,
                    meta: questionnaire.status === 'COMPLETED' ? 'Complété' : 'Planifié',
                })) ?? [];

        return [...eventItems, ...questionnaireItems].sort((a, b) => a.date.getTime() - b.date.getTime());
    }, [events, questionnaires, teamFilter]);

    const days = useMemo(() => {
        if (view === 'day') return [currentDate];
        if (view === 'week') {
            const start = startOfWeek(currentDate, { weekStartsOn: 1 });
            return Array.from({ length: 7 }, (_, index) => addDays(start, index));
        }

        const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
        const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
        const diff = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
        return Array.from({ length: diff }, (_, index) => addDays(start, index));
    }, [currentDate, view]);

    const goPrevious = () => setCurrentDate((date) => (view === 'month' ? subMonths(date, 1) : subWeeks(date, 1)));
    const goNext = () => setCurrentDate((date) => (view === 'month' ? addMonths(date, 1) : addWeeks(date, 1)));

    if (isLoadingTeams || isLoadingQuestionnaires || isLoadingEvents) {
        return (
            <div className='space-y-6'>
                <Skeleton className='h-16 w-full' />
                <Skeleton className='h-[620px] w-full' />
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Calendrier</h1>
                    <p className='text-muted-foreground'>Questionnaires planifiés, matchs et entraînements officiels</p>
                </div>
                <div className='flex flex-wrap gap-2'>
                    <Select
                        value={teamFilter === 'ALL' ? 'ALL' : String(teamFilter)}
                        onValueChange={(value) => setTeamFilter(value === 'ALL' ? 'ALL' : Number(value))}
                    >
                        <SelectTrigger className='w-[220px]'>
                            <SelectValue placeholder='Filtrer par équipe' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='ALL'>Toutes les équipes</SelectItem>
                            {(teams ?? []).map((team) => (
                                <SelectItem key={team.id} value={String(team.id)}>
                                    {team.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className='flex rounded-md border p-1'>
                        {(Object.keys(viewLabels) as CalendarView[]).map((nextView) => (
                            <Button
                                key={nextView}
                                size='sm'
                                variant={view === nextView ? 'default' : 'ghost'}
                                onClick={() => setView(nextView)}
                            >
                                {viewLabels[nextView]}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader className='gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                        <CardTitle className='text-xl capitalize'>
                            {format(currentDate, 'MMMM yyyy', { locale: fr })}
                        </CardTitle>
                        <CardDescription>
                            {items.length} événement{items.length > 1 ? 's' : ''} dans la sélection
                        </CardDescription>
                    </div>
                    <div className='flex gap-2'>
                        <Button variant='outline' size='icon' onClick={goPrevious}>
                            <ChevronLeft className='h-4 w-4' />
                        </Button>
                        <Button variant='outline' onClick={() => setCurrentDate(new Date())}>
                            Aujourd’hui
                        </Button>
                        <Button variant='outline' size='icon' onClick={goNext}>
                            <ChevronRight className='h-4 w-4' />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {items.length === 0 ? (
                        <EmptyState
                            icon={CalendarDays}
                            title='Aucun événement'
                            description='Aucun questionnaire ou événement officiel ne correspond aux filtres.'
                        />
                    ) : (
                        <div
                            className={cn(
                                'grid gap-px overflow-hidden rounded-md border bg-border',
                                view === 'day' ? 'grid-cols-1' : 'grid-cols-7',
                            )}
                        >
                            {days.map((day) => {
                                const dayItems = items.filter((item) => isSameDay(item.date, day));
                                return (
                                    <div
                                        key={day.toISOString()}
                                        className={cn(
                                            'min-h-36 bg-background p-3',
                                            !isSameMonth(day, currentDate) &&
                                                view === 'month' &&
                                                'bg-muted/40 text-muted-foreground',
                                        )}
                                    >
                                        <div className='mb-3 flex items-center justify-between text-sm font-medium'>
                                            <span className='capitalize'>
                                                {format(day, view === 'day' ? 'EEEE d MMMM' : 'EEE d', { locale: fr })}
                                            </span>
                                        </div>
                                        <div className='space-y-2'>
                                            {dayItems.map((item) => (
                                                <button
                                                    key={item.id}
                                                    type='button'
                                                    className={cn(
                                                        'w-full rounded-md border p-2 text-left text-xs transition hover:shadow-sm',
                                                        itemStyles[item.kind],
                                                    )}
                                                    onClick={() =>
                                                        item.questionnaireId &&
                                                        router.push(`/questionnaires/${item.questionnaireId}`)
                                                    }
                                                >
                                                    <div className='flex items-center gap-2 font-semibold'>
                                                        {item.kind === 'MATCH' && <Trophy className='h-3.5 w-3.5' />}
                                                        {item.kind === 'TRAINING' && (
                                                            <Dumbbell className='h-3.5 w-3.5' />
                                                        )}
                                                        {item.kind === 'QUESTIONNAIRE' && (
                                                            <ClipboardList className='h-3.5 w-3.5' />
                                                        )}
                                                        {format(item.date, 'HH:mm')}
                                                    </div>
                                                    <div className='mt-1 line-clamp-2'>{item.title}</div>
                                                    <div className='mt-1 truncate opacity-80'>{item.teamName}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
