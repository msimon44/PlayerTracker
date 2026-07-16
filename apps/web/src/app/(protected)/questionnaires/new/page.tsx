'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { QuestionnaireForm } from '@/components/questionnaires/questionnaire-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useQuestionnairesControllerCreate } from '@/lib/generated/questionnaires/questionnaires';
import { useTeamsControllerFindAll } from '@/lib/generated/teams/teams';

export default function NewQuestionnairePage() {
    const router = useRouter();
    const { toast } = useToast();
    const { user } = useAuth();

    const clubId = user?.staff?.clubId || user?.player?.clubId;
    const { data: teams, isLoading: isLoadingTeams } = useTeamsControllerFindAll(
        { clubId },
        {
            query: {
                enabled: !!clubId,
            },
        },
    ) as any;
    const createMutation = useQuestionnairesControllerCreate();

    const handleSubmit = async (data: { title: string; teamId: number; description: string }) => {
        if (!user?.staff?.id) {
            toast({
                title: 'Erreur',
                description: 'Vous devez être connecté en tant que staff pour créer un questionnaire.',
                variant: 'destructive',
            });
            return;
        }

        try {
            const payload: any = {
                title: data.title,
                teamId: data.teamId,
                createdBy: user.staff.id,
                status: 'DRAFT',
            };

            if (data.description && data.description.trim()) {
                payload.description = data.description;
            }

            const result = await createMutation.mutateAsync({ data: payload });

            toast({
                title: 'Questionnaire créé',
                description: 'Le questionnaire a été créé avec succès en mode brouillon.',
            });

            // Redirection vers la page d'édition
            router.push(`/questionnaires/${result.id}`);
        } catch (error: any) {
            toast({
                title: 'Erreur',
                description:
                    error?.response?.data?.message || 'Une erreur est survenue lors de la création du questionnaire.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-4'>
                <Button variant='ghost' size='icon' onClick={() => router.back()}>
                    <ArrowLeft className='h-4 w-4' />
                </Button>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Nouveau questionnaire</h1>
                    <p className='text-muted-foreground'>Créez un nouveau questionnaire pour votre équipe</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informations générales</CardTitle>
                    <CardDescription>
                        Commencez par définir le titre, la description et l'équipe cible. Vous pourrez ajouter des
                        questions à l'étape suivante.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <QuestionnaireForm
                        teams={Array.isArray(teams) ? teams : []}
                        isLoadingTeams={isLoadingTeams}
                        onSubmit={handleSubmit}
                        submitLabel='Créer le questionnaire'
                        isSubmitting={createMutation.isPending}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
