'use client';

import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import type { QuestionNestedDto } from '@/lib/generated/models';
import { getQuestionnairesControllerFindOneQueryKey } from '@/lib/generated/questionnaires/questionnaires';
import { useQuestionsControllerRemove, useQuestionsControllerUpdate } from '@/lib/generated/questions/questions';

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
import { useToast } from '@/hooks/use-toast';
import { QuestionItem } from './question-item';

interface QuestionsListProps {
    questions: QuestionNestedDto[];
    questionnaireId: number;
    onEdit: (question: QuestionNestedDto) => void;
    disabled?: boolean;
}

export function QuestionsList({ questions, questionnaireId, onEdit, disabled = false }: QuestionsListProps) {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [items, setItems] = useState(questions);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const deleteMutation = useQuestionsControllerRemove();
    const updateMutation = useQuestionsControllerUpdate();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    // Synchroniser items quand questions change
    useEffect(() => {
        setItems(questions);
    }, [questions]);

    const handleDragEnd = async (event: DragEndEvent) => {
        if (disabled) return;

        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        setItems(newItems);

        // Mettre à jour l'ordre dans le backend
        try {
            await Promise.all(
                newItems.map((item, index) =>
                    updateMutation.mutateAsync({
                        id: item.id,
                        data: {
                            title: item.title,
                            type: item.type as any,
                            isRequired: item.isRequired,
                            order: index,
                            questionnaireId,
                        },
                    }),
                ),
            );

            await queryClient.invalidateQueries({
                queryKey: getQuestionnairesControllerFindOneQueryKey(questionnaireId),
            });

            toast({
                title: 'Ordre mis à jour',
                description: 'Les questions ont été réorganisées.',
            });
        } catch (error) {
            toast({
                title: 'Erreur',
                description: "Impossible de mettre à jour l'ordre des questions.",
                variant: 'destructive',
            });
            // Restaurer l'ordre initial en cas d'erreur
            setItems(questions);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            await deleteMutation.mutateAsync({ id: deleteId });

            await queryClient.invalidateQueries({
                queryKey: getQuestionnairesControllerFindOneQueryKey(questionnaireId),
            });

            toast({
                title: 'Question supprimée',
                description: 'La question a été supprimée avec succès.',
            });
        } catch (error) {
            toast({
                title: 'Erreur',
                description: 'Impossible de supprimer la question.',
                variant: 'destructive',
            });
        } finally {
            setDeleteId(null);
        }
    };

    if (items.length === 0) {
        return (
            <div className='flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center'>
                <p className='text-sm text-muted-foreground'>Aucune question pour le moment.</p>
                {!disabled && (
                    <p className='mt-2 text-sm text-muted-foreground'>
                        Cliquez sur "Ajouter une question" pour commencer.
                    </p>
                )}
            </div>
        );
    }

    return (
        <>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items.map((q) => q.id)} strategy={verticalListSortingStrategy}>
                    <div className='space-y-2'>
                        {items.map((question) => (
                            <QuestionItem
                                key={question.id}
                                question={question}
                                onEdit={() => onEdit(question)}
                                onDelete={() => setDeleteId(question.id)}
                                disabled={disabled}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer cette question ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. La question et toutes ses réponses seront définitivement
                            supprimées.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
