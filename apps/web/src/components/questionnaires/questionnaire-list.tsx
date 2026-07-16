'use client';

import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Copy, Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { QuestionnaireListItemDto } from '@/lib/generated/models';
import {
    getQuestionnairesControllerFindAllQueryKey,
    useQuestionnairesControllerCreate,
    useQuestionnairesControllerRemove,
} from '@/lib/generated/questionnaires/questionnaires';

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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

interface QuestionnaireListProps {
    questionnaires: QuestionnaireListItemDto[];
}

const statusLabels = {
    DRAFT: 'Brouillon',
    ACTIVE: 'Actif',
    ARCHIVED: 'Archivé',
    COMPLETED: 'Complété',
} as const;

const statusVariants = {
    DRAFT: 'secondary',
    ACTIVE: 'default',
    ARCHIVED: 'outline',
    COMPLETED: 'default',
} as const;

export function QuestionnaireList({ questionnaires }: QuestionnaireListProps) {
    const router = useRouter();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [deleteId, setDeleteId] = useState<number | null>(null);

    const deleteMutation = useQuestionnairesControllerRemove();
    const duplicateMutation = useQuestionnairesControllerCreate();

    const handleEdit = (id: number) => {
        router.push(`/questionnaires/${id}`);
    };

    const handleDuplicate = async (questionnaire: QuestionnaireListItemDto) => {
        try {
            const description = typeof questionnaire.description === 'string' ? questionnaire.description : '';

            const data: any = {
                title: `${questionnaire.title} (copie)`,
                teamId: questionnaire.teamId,
                createdBy: questionnaire.createdBy,
                status: 'DRAFT',
            };

            if (description) {
                data.description = description;
            }

            const result = await duplicateMutation.mutateAsync({ data });

            await queryClient.invalidateQueries({
                queryKey: getQuestionnairesControllerFindAllQueryKey(),
            });

            toast({
                title: 'Questionnaire dupliqué',
                description: 'Le questionnaire a été dupliqué avec succès.',
            });

            router.push(`/questionnaires/${result.id}`);
        } catch (error) {
            toast({
                title: 'Erreur',
                description: 'Impossible de dupliquer le questionnaire.',
                variant: 'destructive',
            });
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteId) return;

        try {
            await deleteMutation.mutateAsync({
                id: deleteId,
            });

            await queryClient.invalidateQueries({
                queryKey: getQuestionnairesControllerFindAllQueryKey(),
            });

            toast({
                title: 'Questionnaire supprimé',
                description: 'Le questionnaire a été supprimé avec succès.',
            });
        } catch (error) {
            toast({
                title: 'Erreur',
                description: 'Impossible de supprimer le questionnaire.',
                variant: 'destructive',
            });
        } finally {
            setDeleteId(null);
        }
    };

    if (questionnaires.length === 0) {
        return (
            <div className='flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center'>
                <p className='text-sm text-muted-foreground'>Aucun questionnaire trouvé.</p>
                <p className='mt-2 text-sm text-muted-foreground'>Créez votre premier questionnaire pour commencer.</p>
            </div>
        );
    }

    return (
        <>
            <div className='overflow-x-auto rounded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='min-w-[200px]'>Titre</TableHead>
                            <TableHead className='min-w-[120px]'>Équipe</TableHead>
                            <TableHead className='min-w-[100px]'>Statut</TableHead>
                            <TableHead className='min-w-[100px]'>Questions</TableHead>
                            <TableHead className='hidden min-w-[150px] md:table-cell'>Date de création</TableHead>
                            <TableHead className='w-[70px]'></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {questionnaires.map((questionnaire) => {
                            const isDraft = questionnaire.status === 'DRAFT';

                            return (
                                <TableRow
                                    key={questionnaire.id}
                                    className='cursor-pointer'
                                    onClick={() => handleEdit(questionnaire.id)}
                                >
                                    <TableCell className='font-medium'>{questionnaire.title}</TableCell>
                                    <TableCell>{questionnaire.team.name}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                statusVariants[questionnaire.status] as
                                                    | 'default'
                                                    | 'secondary'
                                                    | 'outline'
                                            }
                                        >
                                            {statusLabels[questionnaire.status]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{questionnaire._count.questions}</TableCell>
                                    <TableCell className='hidden md:table-cell'>
                                        {format(new Date(questionnaire.createdAt), 'PPP', {
                                            locale: fr,
                                        })}
                                    </TableCell>
                                    <TableCell onClick={(event) => event.stopPropagation()}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant='ghost' size='icon'>
                                                    <MoreHorizontal className='h-4 w-4' />
                                                    <span className='sr-only'>Actions</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align='end'>
                                                <DropdownMenuItem onClick={() => handleEdit(questionnaire.id)}>
                                                    <Edit className='mr-2 h-4 w-4' />
                                                    {isDraft ? 'Éditer' : 'Voir'}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDuplicate(questionnaire)}>
                                                    <Copy className='mr-2 h-4 w-4' />
                                                    Dupliquer
                                                </DropdownMenuItem>
                                                {isDraft && (
                                                    <DropdownMenuItem
                                                        onClick={() => setDeleteId(questionnaire.id)}
                                                        className='text-destructive'
                                                    >
                                                        <Trash2 className='mr-2 h-4 w-4' />
                                                        Supprimer
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. Le questionnaire et toutes ses questions seront
                            définitivement supprimés.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}>Supprimer</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
