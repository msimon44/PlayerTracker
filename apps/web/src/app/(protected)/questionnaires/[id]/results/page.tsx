'use client';

import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, BarChart3, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useMemo } from 'react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';

import { ChartTooltipContent } from '@/components/shared/chart-tooltip';
import { EmptyState } from '@/components/shared/empty-state';
import { PlayerAvatar } from '@/components/shared/player-avatar';
import { RadarCategoryTick } from '@/components/shared/radar-category-tick';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AXIOS_INSTANCE } from '@/lib/api-client';

type QuestionnaireResults = {
    id: number;
    title: string;
    description: string | null;
    status: string;
    scheduledAt: string | null;
    closesAt: string | null;
    team: { id: number; name: string };
    questions: Array<{
        id: number;
        title: string;
        type: string;
        order: number;
        answers: Array<{
            id: number;
            value: string;
            submittedAt: string;
            player: {
                id: number;
                firstName: string;
                lastName: string;
                nickName: string | null;
                photoUrl: string | null;
            };
        }>;
    }>;
};

interface QuestionnaireResultPageProps {
    params: Promise<{ id: string }>;
}

function formatAnswerValue(value: string) {
    const numericValue = Number(value);
    if (Number.isFinite(numericValue)) {
        return Number.isInteger(numericValue) ? String(numericValue) : numericValue.toFixed(1);
    }
    return value;
}

export default function QuestionnaireResultPage({ params }: QuestionnaireResultPageProps) {
    const router = useRouter();
    const { id } = use(params);
    const questionnaireId = Number(id);

    const { data, isLoading, error } = useQuery({
        queryKey: ['questionnaire-results', questionnaireId],
        queryFn: async () => {
            const response = await AXIOS_INSTANCE.get<QuestionnaireResults>(
                `/questionnaires/${questionnaireId}/results`,
            );
            return response.data;
        },
    });

    const summary = useMemo(() => {
        if (!data) return { answersCount: 0, playersCount: 0 };
        const playerIds = new Set<number>();
        let answersCount = 0;
        for (const question of data.questions) {
            answersCount += question.answers.length;
            question.answers.forEach((answer) => playerIds.add(answer.player.id));
        }
        return { answersCount, playersCount: playerIds.size };
    }, [data]);

    const playersResults = useMemo(() => {
        if (!data) return [];

        const playersMap = new Map<
            number,
            {
                id: number;
                firstName: string;
                lastName: string;
                nickName: string | null;
                photoUrl: string | null;
                answers: Array<{
                    id: number;
                    questionTitle: string;
                    value: string;
                    numericValue: number | null;
                    submittedAt: string;
                }>;
            }
        >();

        for (const question of data.questions) {
            for (const answer of question.answers) {
                const existing = playersMap.get(answer.player.id);
                const playerResult = existing ?? {
                    id: answer.player.id,
                    firstName: answer.player.firstName,
                    lastName: answer.player.lastName,
                    nickName: answer.player.nickName,
                    photoUrl: answer.player.photoUrl,
                    answers: [],
                };
                const numericValue = Number(answer.value);

                playerResult.answers.push({
                    id: answer.id,
                    questionTitle: question.title,
                    value: answer.value,
                    numericValue: Number.isFinite(numericValue) ? numericValue : null,
                    submittedAt: answer.submittedAt,
                });

                playersMap.set(answer.player.id, playerResult);
            }
        }

        return Array.from(playersMap.values())
            .map((player) => ({
                ...player,
                displayName: player.nickName || `${player.firstName} ${player.lastName}`,
                radarData: player.answers
                    .filter((answer) => answer.numericValue !== null)
                    .map((answer) => ({
                        metric: answer.questionTitle,
                        value: answer.numericValue ?? 0,
                        fullMark: Math.max(10, answer.numericValue ?? 10),
                    })),
            }))
            .sort((left, right) => left.displayName.localeCompare(right.displayName));
    }, [data]);

    if (isLoading) {
        return (
            <div className='space-y-6'>
                <Skeleton className='h-16 w-full' />
                <Skeleton className='h-80 w-full' />
            </div>
        );
    }

    if (error || !data) {
        return (
            <EmptyState
                icon={BarChart3}
                title='Résultats indisponibles'
                description="Les résultats d'un questionnaire sont disponibles uniquement après sa clôture."
                action={<Button onClick={() => router.back()}>Retour</Button>}
            />
        );
    }

    return (
        <div className='space-y-6'>
            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                <div className='flex items-center gap-4'>
                    <Button variant='ghost' size='icon' onClick={() => router.back()}>
                        <ArrowLeft className='h-4 w-4' />
                    </Button>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>{data.title}</h1>
                        <p className='text-muted-foreground'>Résultats du questionnaire - {data.team.name}</p>
                    </div>
                </div>
            </div>

            <div className='grid gap-4 md:grid-cols-3'>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardDescription>Questions</CardDescription>
                        <CardTitle>{data.questions.length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardDescription>Réponses</CardDescription>
                        <CardTitle>{summary.answersCount}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardDescription>Joueurs répondants</CardDescription>
                        <CardTitle className='flex items-center gap-2'>
                            <Users className='h-5 w-5' />
                            {summary.playersCount}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <div className='grid gap-4 xl:grid-cols-2'>
                {playersResults.map((player) => (
                    <Card key={player.id}>
                        <CardHeader>
                            <div className='flex items-center gap-3'>
                                <PlayerAvatar
                                    firstName={player.firstName}
                                    lastName={player.lastName}
                                    nickName={player.nickName}
                                    photoUrl={player.photoUrl}
                                    className='h-12 w-12'
                                />
                                <div>
                                    <CardTitle className='text-xl'>{player.displayName}</CardTitle>
                                    <CardDescription>
                                        {player.answers.length}/{data.questions.length} réponse
                                        {player.answers.length > 1 ? 's' : ''}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className='space-y-5'>
                            <div className='h-72 rounded-md border bg-muted/20 p-3'>
                                {player.radarData.length > 0 ? (
                                    <ResponsiveContainer
                                        width='100%'
                                        height='100%'
                                        className='overflow-visible [&_svg]:overflow-visible'
                                    >
                                        <RadarChart data={player.radarData}>
                                            <PolarGrid />
                                            <PolarAngleAxis dataKey='metric' tick={<RadarCategoryTick />} />
                                            <Radar
                                                dataKey='value'
                                                name='Valeur'
                                                stroke='#2563eb'
                                                fill='#2563eb'
                                                fillOpacity={0.24}
                                            />
                                            <Tooltip
                                                content={
                                                    <ChartTooltipContent
                                                        labels={{ value: 'Valeur' }}
                                                        units={{ value: '' }}
                                                    />
                                                }
                                            />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className='flex h-full items-center justify-center text-sm text-muted-foreground'>
                                        Aucune réponse numérique pour le radar.
                                    </div>
                                )}
                            </div>

                            <div className='space-y-2'>
                                <div className='text-sm font-medium'>Réponses</div>
                                <div className='divide-y rounded-md border'>
                                    {player.answers.map((answer) => (
                                        <div key={answer.id} className='grid gap-2 p-3 text-sm md:grid-cols-[1fr_auto]'>
                                            <div>
                                                <div className='font-medium'>{answer.questionTitle}</div>
                                                <div className='text-xs text-muted-foreground'>
                                                    {new Date(answer.submittedAt).toLocaleString('fr-FR')}
                                                </div>
                                            </div>
                                            <div className='font-semibold md:text-right'>
                                                {formatAnswerValue(answer.value)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
