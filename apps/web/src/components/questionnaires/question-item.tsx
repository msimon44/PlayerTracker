'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit, GripVertical, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { QuestionNestedDto } from '@/lib/generated/models';

interface QuestionItemProps {
    question: QuestionNestedDto;
    onEdit: () => void;
    onDelete: () => void;
    disabled?: boolean;
}

const questionTypeLabels: Record<string, string> = {
    TEXT: 'Texte libre',
    NUMBER: 'Nombre',
    BOOLEAN: 'Oui/Non',
    SINGLE_CHOICE: 'Choix unique',
    MULTIPLE_CHOICE: 'Choix multiples',
    SCALE: 'Échelle',
};

const questionTypeVariants: Record<string, 'default' | 'secondary' | 'outline'> = {
    TEXT: 'default',
    NUMBER: 'secondary',
    BOOLEAN: 'outline',
    SINGLE_CHOICE: 'default',
    MULTIPLE_CHOICE: 'default',
    SCALE: 'secondary',
};

export function QuestionItem({ question, onEdit, onDelete, disabled = false }: QuestionItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: question.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <Card ref={setNodeRef} style={style} className='flex items-center gap-4 p-4 transition-shadow hover:shadow-md'>
            {/* Drag handle */}
            <button
                {...(!disabled ? attributes : {})}
                {...(!disabled ? listeners : {})}
                className='touch-none text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 enabled:cursor-grab enabled:active:cursor-grabbing'
                disabled={disabled}
            >
                <GripVertical className='h-5 w-5' />
            </button>

            {/* Question content */}
            <div className='flex-1'>
                <div className='flex items-center gap-2'>
                    <span className='font-medium'>{question.title}</span>
                    {question.isRequired && (
                        <Badge variant='destructive' className='text-xs'>
                            Requis
                        </Badge>
                    )}
                </div>
                <div className='mt-1 flex items-center gap-2 text-sm text-muted-foreground'>
                    <Badge variant={questionTypeVariants[question.type] || 'default'}>
                        {questionTypeLabels[question.type] || question.type}
                    </Badge>
                    <span>Question #{question.order + 1}</span>
                </div>
            </div>

            {/* Actions */}
            {!disabled && (
                <div className='flex gap-1'>
                    <Button variant='ghost' size='icon' onClick={onEdit}>
                        <Edit className='h-4 w-4' />
                        <span className='sr-only'>Éditer</span>
                    </Button>
                    <Button variant='ghost' size='icon' onClick={onDelete}>
                        <Trash2 className='h-4 w-4 text-destructive' />
                        <span className='sr-only'>Supprimer</span>
                    </Button>
                </div>
            )}
        </Card>
    );
}
