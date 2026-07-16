'use client';

import { Archive, Play } from 'lucide-react';
import { useState } from 'react';

import type { QuestionnaireResponseDto } from '@/lib/generated/models';
import { useQuestionnairesControllerUpdate } from '@/lib/generated/questionnaires/questionnaires';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface QuestionnaireActionsProps {
    questionnaire: QuestionnaireResponseDto;
    onStatusChanged: () => void;
}

export function QuestionnaireActions({ questionnaire, onStatusChanged }: QuestionnaireActionsProps) {
    const { toast } = useToast();
    const [publishDialogOpen, setPublishDialogOpen] = useState(false);
    const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);

    const updateMutation = useQuestionnairesControllerUpdate();

    const handlePublish = async () => {
        try {
            await updateMutation.mutateAsync({
                id: questionnaire.id,
                data: {
                    title: questionnaire.title,
                    status: 'ACTIVE',
                    teamId: questionnaire.teamId,
                },
            });

            toast({
                title: 'Questionnaire publié',
                description: 'Le questionnaire est maintenant actif.',
            });

            setPublishDialogOpen(false);
            onStatusChanged();
        } catch (error: any) {
            toast({
                title: 'Erreur',
                description: error?.response?.data?.message || 'Impossible de publier le questionnaire.',
                variant: 'destructive',
            });
        }
    };

    const handleArchive = async () => {
        try {
            await updateMutation.mutateAsync({
                id: questionnaire.id,
                data: {
                    title: questionnaire.title,
                    status: 'ARCHIVED',
                    teamId: questionnaire.teamId,
                },
            });

            toast({
                title: 'Questionnaire archivé',
                description: 'Le questionnaire a été archivé.',
            });

            setArchiveDialogOpen(false);
            onStatusChanged();
        } catch (error: any) {
            toast({
                title: 'Erreur',
                description: error?.response?.data?.message || "Impossible d'archiver le questionnaire.",
                variant: 'destructive',
            });
        }
    };

    const isDraft = questionnaire.status === 'DRAFT';
    const isArchived = questionnaire.status === 'ARCHIVED';

    return (
        <>
            <div className='flex flex-wrap gap-2'>
                {/* Bouton Publier */}
                {isDraft && (
                    <Button
                        onClick={() => setPublishDialogOpen(true)}
                        disabled={questionnaire.questions.length === 0}
                        size='sm'
                        className='sm:size-default'
                    >
                        <Play className='mr-2 h-4 w-4' />
                        <span className='hidden sm:inline'>Publier</span>
                        <span className='sm:hidden'>Publier</span>
                    </Button>
                )}

                {/* Bouton Archiver */}
                {!isArchived && (
                    <Button
                        variant='outline'
                        size='sm'
                        className='sm:size-default'
                        onClick={() => setArchiveDialogOpen(true)}
                        disabled={updateMutation.isPending}
                    >
                        <Archive className='mr-2 h-4 w-4' />
                        <span className='hidden sm:inline'>Archiver</span>
                        <span className='sm:hidden'>Archiver</span>
                    </Button>
                )}

                {/* Badge statut */}
                {isArchived && <div className='flex items-center text-sm text-muted-foreground'>✓ Archivé</div>}
            </div>

            {/* Dialog Confirmation Publication */}
            <AlertDialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Publier le questionnaire ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Une fois publié, le questionnaire sera envoyé aux joueurs de l'équipe{' '}
                            <strong>{questionnaire.team?.name}</strong>. Cette action est définitive.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handlePublish} disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? 'Publication...' : 'Publier'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Dialog Confirmation Archivage */}
            <AlertDialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Archiver le questionnaire ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Le questionnaire ne sera plus envoyé aux joueurs. Vous pourrez le réactiver plus tard.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleArchive} disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? 'Archivage...' : 'Archiver'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
