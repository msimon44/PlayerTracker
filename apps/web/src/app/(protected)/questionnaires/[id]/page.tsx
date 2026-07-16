'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, BarChart3, CheckCircle2, Circle, Lock, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';

import type { QuestionNestedDto } from '@/lib/generated/models';
import {
    getQuestionnairesControllerFindOneQueryKey,
    useQuestionnairesControllerFindOne,
    useQuestionnairesControllerUpdate,
} from '@/lib/generated/questionnaires/questionnaires';

import { QuestionBuilder } from '@/components/questionnaires/question-builder';
import { QuestionnaireActions } from '@/components/questionnaires/questionnaire-actions';
import { QuestionnaireForm } from '@/components/questionnaires/questionnaire-form';
import { QuestionnairePreview } from '@/components/questionnaires/questionnaire-preview';
import { QuestionsList } from '@/components/questionnaires/questions-list';
import { PlayerAvatar } from '@/components/shared/player-avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { AXIOS_INSTANCE } from '@/lib/api-client';

interface EditQuestionnairePageProps {
    params: Promise<{
        id: string;
    }>;
}

type RespondentsSummary = {
    id: number;
    title: string;
    status: string;
    answeredCount: number;
    totalPlayers: number;
    players: Array<{
        id: number;
        firstName: string;
        lastName: string;
        nickName: string | null;
        photoUrl: string | null;
        hasAnswered: boolean;
        submittedAt: string | null;
    }>;
};

export default function EditQuestionnairePage({ params }: EditQuestionnairePageProps) {
    const router = useRouter();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { id } = use(params);
    const questionnaireId = parseInt(id, 10);

    const [isBuilderOpen, setIsBuilderOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<QuestionNestedDto | null>(null);

    const { data: questionnaire, isLoading, error } = useQuestionnairesControllerFindOne(questionnaireId);
    const { data: respondents, isLoading: isLoadingRespondents } = useQuery({
        queryKey: ['questionnaire-respondents', questionnaireId],
        queryFn: async () => {
            const response = await AXIOS_INSTANCE.get<RespondentsSummary>(
                `/questionnaires/${questionnaireId}/respondents`,
            );
            return response.data;
        },
    });
    const updateMutation = useQuestionnairesControllerUpdate();

    // Debug: afficher les erreurs API
    if (error) {
        console.error('Erreur lors du chargement du questionnaire:', error);
    }

    const handleUpdateQuestionnaire = async (data: { title: string; description: string; teamId: number }) => {
        try {
            const payload: any = {
                title: data.title,
                teamId: data.teamId,
            };

            if (data.description && data.description.trim()) {
                payload.description = data.description;
            }

            await updateMutation.mutateAsync({
                id: questionnaireId,
                data: payload,
            });

            await queryClient.invalidateQueries({
                queryKey: getQuestionnairesControllerFindOneQueryKey(questionnaireId),
            });

            toast({
                title: 'Questionnaire mis à jour',
                description: 'Les informations ont été enregistrées.',
            });
        } catch (error: any) {
            toast({
                title: 'Erreur',
                description: error?.response?.data?.message || 'Une erreur est survenue lors de la mise à jour.',
                variant: 'destructive',
            });
        }
    };

    const handleAddQuestion = () => {
        setEditingQuestion(null);
        setIsBuilderOpen(true);
    };

    const handleEditQuestion = (question: QuestionNestedDto) => {
        setEditingQuestion(question);
        setIsBuilderOpen(true);
    };

    const handleQuestionSaved = async () => {
        // Rafraîchir immédiatement les données du questionnaire
        await queryClient.refetchQueries({
            queryKey: getQuestionnairesControllerFindOneQueryKey(questionnaireId),
        });
        setIsBuilderOpen(false);
        setEditingQuestion(null);
    };

    const handleStatusChanged = async () => {
        // Rafraîchir les données après changement de statut
        await queryClient.refetchQueries({
            queryKey: getQuestionnairesControllerFindOneQueryKey(questionnaireId),
        });
    };

    if (isLoading) {
        return (
            <div className='space-y-6'>
                <div className='flex items-center gap-4'>
                    <Skeleton className='h-10 w-10' />
                    <Skeleton className='h-10 w-64' />
                </div>
                <Skeleton className='h-64 w-full' />
                <Skeleton className='h-96 w-full' />
            </div>
        );
    }

    if (!questionnaire) {
        return (
            <div className='flex flex-col items-center justify-center py-12'>
                <p className='text-muted-foreground'>Questionnaire introuvable</p>
                <Button onClick={() => router.push('/questionnaires')} className='mt-4'>
                    Retour à la liste
                </Button>
            </div>
        );
    }

    const teams = questionnaire.team ? [questionnaire.team] : [];
    const closesAt =
        typeof questionnaire.closesAt === 'string' || typeof questionnaire.closesAt === 'number'
            ? new Date(questionnaire.closesAt)
            : questionnaire.closesAt instanceof Date
              ? questionnaire.closesAt
              : null;
    const isClosed =
        questionnaire.status === 'COMPLETED' ||
        questionnaire.status === 'ARCHIVED' ||
        (closesAt !== null && closesAt <= new Date());
    const isActive = questionnaire.status === 'ACTIVE';
    const isCompleted = questionnaire.status === 'COMPLETED';
    const isLocked = isActive || isClosed;
    const shouldShowRespondents = isActive || isCompleted;

    return (
        <div className='space-y-6'>
            {/* Header responsive */}
            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                <div className='flex items-center gap-4'>
                    <Button variant='ghost' size='icon' onClick={() => router.back()}>
                        <ArrowLeft className='h-4 w-4' />
                    </Button>
                    <div>
                        <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>{questionnaire.title}</h1>
                        <p className='text-sm text-muted-foreground md:text-base'>
                            {isLocked
                                ? isActive
                                    ? 'Questionnaire actif'
                                    : 'Questionnaire clôturé'
                                : 'Modifier le questionnaire'}
                        </p>
                    </div>
                </div>
                <div className='flex flex-wrap gap-2'>
                    {questionnaire.questions.length > 0 && <QuestionnairePreview questionnaire={questionnaire} />}
                    {isCompleted ? (
                        <Button onClick={() => router.push(`/questionnaires/${questionnaireId}/results`)}>
                            <BarChart3 className='mr-2 h-4 w-4' />
                            Voir les résultats
                        </Button>
                    ) : !isLocked ? (
                        <QuestionnaireActions questionnaire={questionnaire} onStatusChanged={handleStatusChanged} />
                    ) : null}
                </div>
            </div>

            {isLocked && (
                <Card className='border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100'>
                    <CardContent className='flex items-center gap-3 p-4'>
                        <Lock className='h-5 w-5' />
                        <p className='text-sm'>
                            {isActive
                                ? 'Ce questionnaire est actif. Les paramètres et les questions sont verrouillés pendant la collecte des réponses.'
                                : 'Ce questionnaire est clôturé. Les paramètres et les questions sont verrouillés, mais les résultats restent consultables.'}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Informations générales */}
            <Card>
                <CardHeader>
                    <CardTitle>Informations générales</CardTitle>
                    <CardDescription>Titre, description et équipe cible du questionnaire</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLocked ? (
                        <div className='grid gap-4 text-sm md:grid-cols-3'>
                            <div>
                                <div className='text-muted-foreground'>Titre</div>
                                <div className='font-medium'>{questionnaire.title}</div>
                            </div>
                            <div>
                                <div className='text-muted-foreground'>Équipe</div>
                                <div className='font-medium'>{questionnaire.team?.name ?? '-'}</div>
                            </div>
                            <div>
                                <div className='text-muted-foreground'>Clôture</div>
                                <div className='font-medium'>
                                    {closesAt ? closesAt.toLocaleString('fr-FR') : 'Clôturé manuellement'}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <QuestionnaireForm
                            initialValues={{
                                title: questionnaire.title,
                                description:
                                    typeof questionnaire.description === 'string' ? questionnaire.description : '',
                                teamId: questionnaire.teamId,
                            }}
                            teams={teams}
                            onSubmit={handleUpdateQuestionnaire}
                            submitLabel='Enregistrer les modifications'
                            isSubmitting={updateMutation.isPending}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Questions */}
            <Card>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle>Questions</CardTitle>
                            <CardDescription>
                                {questionnaire.questions.length === 0
                                    ? 'Aucune question pour le moment'
                                    : `${questionnaire.questions.length} question(s)`}
                            </CardDescription>
                        </div>
                        {!isLocked && (
                            <Button onClick={handleAddQuestion}>
                                <Plus className='mr-2 h-4 w-4' />
                                Ajouter une question
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <QuestionsList
                        questions={questionnaire.questions}
                        questionnaireId={questionnaireId}
                        onEdit={handleEditQuestion}
                        disabled={isLocked}
                    />
                </CardContent>
            </Card>

            {shouldShowRespondents && (
                <Card>
                    <CardHeader>
                        <CardTitle>Réponses joueurs</CardTitle>
                        <CardDescription>
                            {isLoadingRespondents
                                ? 'Chargement des réponses...'
                                : `${respondents?.answeredCount ?? 0}/${respondents?.totalPlayers ?? 0} joueur(s) ont répondu`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoadingRespondents ? (
                            <Skeleton className='h-32 w-full' />
                        ) : (
                            <div className='grid gap-2 md:grid-cols-2 xl:grid-cols-3'>
                                {(respondents?.players ?? []).map((player) => (
                                    <div
                                        key={player.id}
                                        className='flex items-center justify-between rounded-md border p-3'
                                    >
                                        <div className='flex items-center gap-3'>
                                            <PlayerAvatar
                                                firstName={player.firstName}
                                                lastName={player.lastName}
                                                nickName={player.nickName}
                                                photoUrl={player.photoUrl}
                                            />
                                            {player.hasAnswered ? (
                                                <CheckCircle2 className='h-5 w-5 text-emerald-600' />
                                            ) : (
                                                <Circle className='h-5 w-5 text-muted-foreground' />
                                            )}
                                            <div>
                                                <div className='font-medium'>
                                                    {player.nickName || `${player.firstName} ${player.lastName}`}
                                                </div>
                                                {player.submittedAt && (
                                                    <div className='text-xs text-muted-foreground'>
                                                        Répondu le{' '}
                                                        {new Date(player.submittedAt).toLocaleString('fr-FR')}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <Badge variant={player.hasAnswered ? 'default' : 'outline'}>
                                            {player.hasAnswered ? 'Répondu' : 'En attente'}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Builder modal */}
            <QuestionBuilder
                open={isBuilderOpen}
                onOpenChange={setIsBuilderOpen}
                questionnaireId={questionnaireId}
                question={editingQuestion}
                onSaved={handleQuestionSaved}
            />
        </div>
    );
}
