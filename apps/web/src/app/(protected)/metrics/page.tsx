'use client';

import { format, isAfter, isBefore, parseISO, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Activity, BarChart3, ClipboardList, LineChart as LineChartIcon, Moon, Rows3, Trophy } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    PolarAngleAxis,
    PolarGrid,
    Radar,
    RadarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import { ChartCard } from '@/components/shared/chart-card';
import { ChartTooltipContent } from '@/components/shared/chart-tooltip';
import { EmptyState } from '@/components/shared/empty-state';
import { RadarCategoryTick } from '@/components/shared/radar-category-tick';
import { StatCard } from '@/components/shared/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { useMetricsControllerFindAll } from '@/lib/generated/metrics/metrics';
import { usePlayersControllerFindAll } from '@/lib/generated/players/players';
import { useQuestionnairesControllerFindAll } from '@/lib/generated/questionnaires/questionnaires';

type Metric = {
    id: number;
    playerId: number;
    questionnaireId: number | null;
    type: string;
    value: number;
    unit: string | null;
    recordedAt: string;
    player: {
        id: number;
        firstName: string;
        lastName: string;
        nickName?: string | null;
        clubId: number;
    };
};

type CompletedQuestionnaireMetric = {
    id: number;
    title: string;
    completedAt: string;
    playersCount: number;
    metricsCount: number;
    averages: Array<{
        type: string;
        value: number;
    }>;
};

type PlayerFilter = number | 'ALL';
type PeriodFilter = '7d' | '30d' | 'all';

const metricLabels: Record<string, string> = {
    WELLNESS_SCORE: 'Ressenti',
    SLEEP_HOURS: 'Sommeil',
    MEALS_COUNT: 'Repas',
    PHYSICAL_FEELING: 'Physique',
    MOTIVATION: 'Motivation',
    PRE_MATCH_GAMES: 'Parties avant match',
    POST_MATCH_FEELING: 'Après match',
};

const metricColors: Record<string, string> = {
    WELLNESS_SCORE: '#2563eb',
    SLEEP_HOURS: '#7c3aed',
    MEALS_COUNT: '#16a34a',
    PHYSICAL_FEELING: '#ea580c',
    MOTIVATION: '#dc2626',
    PRE_MATCH_GAMES: '#0891b2',
    POST_MATCH_FEELING: '#db2777',
};

const metricUnits: Record<string, string> = {
    WELLNESS_SCORE: '/10',
    SLEEP_HOURS: 'h',
    MEALS_COUNT: 'repas',
    PHYSICAL_FEELING: '/10',
    MOTIVATION: '/10',
    PRE_MATCH_GAMES: 'parties',
    POST_MATCH_FEELING: '/10',
};

const periodLabels: Record<PeriodFilter, string> = {
    '7d': '7 derniers jours',
    '30d': '30 derniers jours',
    all: 'Toute la période',
};

function formatMetricValue(type: string, value: unknown) {
    const numericValue = typeof value === 'number' ? value : Number(value);
    const formattedValue = Number.isFinite(numericValue)
        ? Number.isInteger(numericValue)
            ? String(numericValue)
            : numericValue.toFixed(1)
        : String(value ?? '-');
    const unit = metricUnits[type];

    if (!unit) return formattedValue;
    if (unit.startsWith('/')) return `${formattedValue}${unit}`;
    return `${formattedValue} ${unit}`;
}

export default function MetricsPage() {
    const { user } = useAuth();
    const clubId = user?.staff?.clubId || user?.player?.clubId;
    const [playerFilter, setPlayerFilter] = useState<PlayerFilter>('ALL');
    const [metricFilter, setMetricFilter] = useState<string>('ALL');
    const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('30d');

    const { data: metricsData, isLoading: isLoadingMetrics } = useMetricsControllerFindAll() as any;
    const { data: players, isLoading: isLoadingPlayers } = usePlayersControllerFindAll(
        { clubId: clubId ? String(clubId) : '' },
        { query: { enabled: !!clubId } },
    );
    const { data: questionnaires, isLoading: isLoadingQuestionnaires } = useQuestionnairesControllerFindAll(
        { clubId: clubId ? String(clubId) : '' },
        { query: { enabled: !!clubId } },
    );

    const metrics = useMemo(() => {
        const allMetrics = ((metricsData as Metric[]) ?? []).filter((metric) => metric.player?.clubId === clubId);
        const now = new Date();
        const periodStart = periodFilter === '7d' ? subDays(now, 7) : periodFilter === '30d' ? subDays(now, 30) : null;

        return allMetrics
            .filter((metric) => playerFilter === 'ALL' || metric.playerId === playerFilter)
            .filter((metric) => metricFilter === 'ALL' || metric.type === metricFilter)
            .filter((metric) => {
                if (!periodStart) return true;
                const date = parseISO(metric.recordedAt);
                return isAfter(date, periodStart) && isBefore(date, now);
            })
            .sort((a, b) => parseISO(b.recordedAt).getTime() - parseISO(a.recordedAt).getTime());
    }, [clubId, metricFilter, metricsData, periodFilter, playerFilter]);

    const metricTypes = useMemo(() => {
        return Array.from(
            new Set(
                ((metricsData as Metric[]) ?? [])
                    .filter((metric) => metric.player?.clubId === clubId)
                    .map((metric) => metric.type),
            ),
        ).sort();
    }, [clubId, metricsData]);

    const latestByType = useMemo(() => {
        const latest = new Map<string, Metric>();
        for (const metric of metrics) {
            const current = latest.get(metric.type);
            if (!current || parseISO(metric.recordedAt) > parseISO(current.recordedAt)) {
                latest.set(metric.type, metric);
            }
        }
        return Array.from(latest.values());
    }, [metrics]);

    const evolutionData = useMemo(() => {
        const grouped = new Map<string, Record<string, string | number>>();
        const groupedValues = new Map<string, Map<string, number[]>>();

        for (const metric of metrics) {
            const day = format(parseISO(metric.recordedAt), 'yyyy-MM-dd');
            if (!groupedValues.has(day)) groupedValues.set(day, new Map());
            const typeValues = groupedValues.get(day)!;
            typeValues.set(metric.type, [...(typeValues.get(metric.type) ?? []), metric.value]);
        }

        Array.from(groupedValues.entries())
            .sort(([left], [right]) => left.localeCompare(right))
            .forEach(([day, valuesByType]) => {
                const row: Record<string, string | number> = {
                    date: format(parseISO(`${day}T00:00:00.000Z`), 'dd/MM', { locale: fr }),
                };
                valuesByType.forEach((values, type) => {
                    row[type] = Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
                });
                grouped.set(day, row);
            });

        return Array.from(grouped.values());
    }, [metrics]);

    const evolutionTypes = useMemo(() => {
        if (metricFilter !== 'ALL') return [metricFilter];
        return metricTypes.filter((type) => evolutionData.some((day) => typeof day[type] === 'number'));
    }, [evolutionData, metricFilter, metricTypes]);

    const metricAverages = useMemo(() => {
        const byType = new Map<string, number[]>();
        metrics.forEach((metric) => {
            byType.set(metric.type, [...(byType.get(metric.type) ?? []), metric.value]);
        });

        return Array.from(byType.entries())
            .map(([type, values]) => ({
                type,
                label: metricLabels[type] ?? type,
                value: Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2)),
                unit: metricUnits[type] ?? '',
                fill: metricColors[type] ?? '#475569',
            }))
            .sort((left, right) => left.label.localeCompare(right.label));
    }, [metrics]);

    const radarData = useMemo(() => {
        return latestByType
            .filter((metric) =>
                ['WELLNESS_SCORE', 'PHYSICAL_FEELING', 'MOTIVATION', 'POST_MATCH_FEELING'].includes(metric.type),
            )
            .map((metric) => ({
                metric: metricLabels[metric.type] ?? metric.type,
                value: metric.value,
                fullMark: 10,
            }));
    }, [latestByType]);

    const completedQuestionnaireCount = useMemo(() => {
        return new Set(metrics.map((metric) => metric.questionnaireId).filter(Boolean)).size;
    }, [metrics]);

    const completedQuestionnaires = useMemo<CompletedQuestionnaireMetric[]>(() => {
        const completedById = new Map(
            (questionnaires ?? [])
                .filter((questionnaire) => questionnaire.status === 'COMPLETED')
                .map((questionnaire) => [questionnaire.id, questionnaire]),
        );
        const metricsByQuestionnaire = new Map<number, Metric[]>();

        metrics.forEach((metric) => {
            if (!metric.questionnaireId || !completedById.has(metric.questionnaireId)) return;
            metricsByQuestionnaire.set(metric.questionnaireId, [
                ...(metricsByQuestionnaire.get(metric.questionnaireId) ?? []),
                metric,
            ]);
        });

        return Array.from(metricsByQuestionnaire.entries())
            .map(([questionnaireId, questionnaireMetrics]) => {
                const questionnaire = completedById.get(questionnaireId)!;
                const byType = new Map<string, number[]>();
                questionnaireMetrics.forEach((metric) => {
                    byType.set(metric.type, [...(byType.get(metric.type) ?? []), metric.value]);
                });

                return {
                    id: questionnaireId,
                    title: questionnaire.title,
                    completedAt:
                        typeof questionnaire.closesAt === 'string' ? questionnaire.closesAt : questionnaire.updatedAt,
                    playersCount: new Set(questionnaireMetrics.map((metric) => metric.playerId)).size,
                    metricsCount: questionnaireMetrics.length,
                    averages: Array.from(byType.entries())
                        .map(([type, values]) => ({
                            type,
                            value: Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2)),
                        }))
                        .sort((left, right) =>
                            (metricLabels[left.type] ?? left.type).localeCompare(
                                metricLabels[right.type] ?? right.type,
                            ),
                        ),
                };
            })
            .sort((left, right) => parseISO(right.completedAt).getTime() - parseISO(left.completedAt).getTime());
    }, [metrics, questionnaires]);

    const sleepMetrics = metrics.filter((metric) => metric.type === 'SLEEP_HOURS');
    const motivationMetrics = metrics.filter((metric) => metric.type === 'MOTIVATION');
    const sleepAverage =
        sleepMetrics.length > 0
            ? (sleepMetrics.reduce((sum, metric) => sum + metric.value, 0) / sleepMetrics.length).toFixed(1)
            : '-';
    const motivationAverage =
        motivationMetrics.length > 0
            ? (motivationMetrics.reduce((sum, metric) => sum + metric.value, 0) / motivationMetrics.length).toFixed(1)
            : '-';

    if (isLoadingMetrics || isLoadingPlayers || isLoadingQuestionnaires) {
        return (
            <div className='space-y-6'>
                <Skeleton className='h-16 w-full' />
                <div className='grid gap-4 lg:grid-cols-3'>
                    <Skeleton className='h-72' />
                    <Skeleton className='h-72 lg:col-span-2' />
                </div>
                <Skeleton className='h-96 w-full' />
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Métriques</h1>
                    <p className='text-muted-foreground'>Statistiques issues uniquement des questionnaires complétés</p>
                </div>
                <div className='flex flex-wrap gap-2'>
                    <Select
                        value={playerFilter === 'ALL' ? 'ALL' : String(playerFilter)}
                        onValueChange={(value) => setPlayerFilter(value === 'ALL' ? 'ALL' : Number(value))}
                    >
                        <SelectTrigger className='w-[210px]'>
                            <SelectValue placeholder='Joueur' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='ALL'>Tous les joueurs</SelectItem>
                            {(players ?? []).map((player) => (
                                <SelectItem key={player.id} value={String(player.id)}>
                                    {player.nickName || `${player.firstName} ${player.lastName}`}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={metricFilter} onValueChange={setMetricFilter}>
                        <SelectTrigger className='w-[210px]'>
                            <SelectValue placeholder='Métrique' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='ALL'>Toutes les métriques</SelectItem>
                            {metricTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {metricLabels[type] ?? type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={periodFilter} onValueChange={(value) => setPeriodFilter(value as PeriodFilter)}>
                        <SelectTrigger className='w-[180px]'>
                            <SelectValue placeholder='Période' />
                        </SelectTrigger>
                        <SelectContent>
                            {(Object.entries(periodLabels) as Array<[PeriodFilter, string]>).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {metrics.length === 0 ? (
                <EmptyState
                    icon={Activity}
                    title='Aucune métrique'
                    description='Aucune donnée ne correspond aux filtres sélectionnés.'
                />
            ) : (
                <>
                    <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
                        <StatCard
                            icon={Trophy}
                            title='Questionnaires complétés'
                            value={completedQuestionnaireCount}
                            description='Dans le périmètre filtré'
                        />
                        <StatCard
                            icon={Moon}
                            title='Sommeil moyen'
                            value={sleepAverage === '-' ? '-' : `${sleepAverage}h`}
                            description={`${sleepMetrics.length} valeur(s)`}
                        />
                        <StatCard
                            icon={Activity}
                            title='Motivation moyenne'
                            value={motivationAverage === '-' ? '-' : `${motivationAverage}/10`}
                            description={`${motivationMetrics.length} valeur(s)`}
                        />
                        <StatCard
                            icon={Rows3}
                            title='Métriques suivies'
                            value={metrics.length}
                            description='Uniquement questionnaires complétés'
                        />
                    </div>

                    <div className='grid gap-4 xl:grid-cols-3'>
                        <ChartCard
                            className='xl:col-span-2'
                            title={
                                <span className='flex items-center gap-2'>
                                    <LineChartIcon className='h-5 w-5' />
                                    Évolution temporelle
                                </span>
                            }
                            description='Moyenne quotidienne par type de métrique, selon les filtres actifs'
                        >
                            {evolutionData.length > 0 ? (
                                <ResponsiveContainer width='100%' height='100%'>
                                    <LineChart data={evolutionData}>
                                        <CartesianGrid strokeDasharray='3 3' />
                                        <XAxis dataKey='date' tick={{ fontSize: 12 }} />
                                        <YAxis />
                                        <Tooltip
                                            content={<ChartTooltipContent labels={metricLabels} units={metricUnits} />}
                                            cursor={{ stroke: '#94a3b8', strokeDasharray: '4 4' }}
                                        />
                                        <Legend />
                                        {evolutionTypes.map((type) => (
                                            <Line
                                                key={type}
                                                type='monotone'
                                                name={metricLabels[type] ?? type}
                                                dataKey={type}
                                                stroke={metricColors[type] ?? '#475569'}
                                                strokeWidth={2}
                                                dot={{ r: 3 }}
                                                connectNulls
                                            />
                                        ))}
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className='flex h-full items-center justify-center text-sm text-muted-foreground'>
                                    Pas assez de données pour cette période.
                                </div>
                            )}
                        </ChartCard>

                        <ChartCard
                            title={
                                <span className='flex items-center gap-2'>
                                    <BarChart3 className='h-5 w-5' />
                                    Latest metrics
                                </span>
                            }
                            description='Radar des derniers scores normalisés'
                        >
                            {radarData.length > 0 ? (
                                <ResponsiveContainer
                                    width='100%'
                                    height='100%'
                                    className='overflow-visible [&_svg]:overflow-visible'
                                >
                                    <RadarChart data={radarData}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey='metric' tick={<RadarCategoryTick />} />
                                        <Radar dataKey='value' stroke='#2563eb' fill='#2563eb' fillOpacity={0.25} />
                                        <Tooltip
                                            content={
                                                <ChartTooltipContent
                                                    labels={{ value: 'Score' }}
                                                    units={{ value: '/10' }}
                                                />
                                            }
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className='flex h-full items-center justify-center text-sm text-muted-foreground'>
                                    Aucun score normalisé dans les filtres.
                                </div>
                            )}
                        </ChartCard>
                    </div>

                    <ChartCard
                        title={
                            <span className='flex items-center gap-2'>
                                <BarChart3 className='h-5 w-5' />
                                Moyennes par métrique
                            </span>
                        }
                        description='Vue agrégée par type de donnée, sans entrée individuelle joueur'
                    >
                        <ResponsiveContainer width='100%' height='100%'>
                            <BarChart data={metricAverages}>
                                <CartesianGrid strokeDasharray='3 3' />
                                <XAxis dataKey='label' tick={{ fontSize: 12 }} />
                                <YAxis />
                                <Tooltip content={<ChartTooltipContent labels={{ value: 'Moyenne' }} />} />
                                <Bar dataKey='value' name='Moyenne' radius={[4, 4, 0, 0]}>
                                    {metricAverages.map((entry) => (
                                        <Cell key={entry.type} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2 text-xl'>
                                <ClipboardList className='h-5 w-5' />
                                Questionnaires complétés
                            </CardTitle>
                            <CardDescription>
                                Synthèse des questionnaires complétés correspondant aux filtres actifs
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='overflow-x-auto'>
                            <table className='w-full text-sm'>
                                <thead>
                                    <tr className='border-b text-left text-muted-foreground'>
                                        <th className='py-3 pr-4 font-medium'>Date</th>
                                        <th className='py-3 pr-4 font-medium'>Questionnaire</th>
                                        <th className='py-3 pr-4 font-medium'>Joueurs</th>
                                        <th className='py-3 pr-4 font-medium'>Moyennes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {completedQuestionnaires.slice(0, 20).map((questionnaire) => (
                                        <tr key={questionnaire.id} className='border-b last:border-0 align-top'>
                                            <td className='py-3 pr-4 whitespace-nowrap'>
                                                {format(parseISO(questionnaire.completedAt), 'dd MMM yyyy HH:mm', {
                                                    locale: fr,
                                                })}
                                            </td>
                                            <td className='py-3 pr-4 font-medium'>{questionnaire.title}</td>
                                            <td className='py-3 pr-4'>
                                                {questionnaire.playersCount} joueur
                                                {questionnaire.playersCount > 1 ? 's' : ''}
                                            </td>
                                            <td className='py-3 pr-4'>
                                                <div className='flex flex-wrap gap-2'>
                                                    {questionnaire.averages.map((average) => (
                                                        <span
                                                            key={average.type}
                                                            className='rounded-md border px-2 py-1 text-xs font-medium'
                                                        >
                                                            {metricLabels[average.type] ?? average.type}:{' '}
                                                            {formatMetricValue(average.type, average.value)}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {completedQuestionnaires.length > 20 && (
                                <div className='mt-4 flex justify-end'>
                                    <Button variant='outline' disabled>
                                        Pagination prête - {completedQuestionnaires.length - 20} lignes restantes
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
