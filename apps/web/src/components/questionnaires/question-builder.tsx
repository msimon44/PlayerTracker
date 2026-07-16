'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import type { QuestionNestedDto } from '@/lib/generated/models';
import { CreateQuestionDtoType as QuestionType } from '@/lib/generated/models';
import { useQuestionsControllerCreate, useQuestionsControllerUpdate } from '@/lib/generated/questions/questions';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const questionSchema = z.object({
    title: z.string().min(1, 'Le titre est requis').max(500, 'Maximum 500 caractères'),
    type: z.string().min(1, 'Le type est requis'),
    options: z.array(z.string()).optional(),
    isRequired: z.boolean(),
});

type QuestionFormValues = z.infer<typeof questionSchema>;

interface QuestionBuilderProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    questionnaireId: number;
    question?: QuestionNestedDto | null;
    onSaved: () => void;
}

const questionTypes = [
    { value: QuestionType.TEXT, label: 'Texte libre', needsOptions: false },
    { value: QuestionType.NUMBER, label: 'Nombre', needsOptions: false },
    { value: QuestionType.BOOLEAN, label: 'Oui/Non', needsOptions: false },
    { value: QuestionType.SINGLE_CHOICE, label: 'Choix unique', needsOptions: true },
    { value: QuestionType.MULTIPLE_CHOICE, label: 'Choix multiples', needsOptions: true },
    { value: QuestionType.SCALE, label: 'Échelle (1-10)', needsOptions: false },
];

export function QuestionBuilder({ open, onOpenChange, questionnaireId, question, onSaved }: QuestionBuilderProps) {
    const { toast } = useToast();
    const [optionInput, setOptionInput] = useState('');
    const [options, setOptions] = useState<string[]>([]);

    const createMutation = useQuestionsControllerCreate();
    const updateMutation = useQuestionsControllerUpdate();

    const form = useForm<QuestionFormValues>({
        resolver: zodResolver(questionSchema),
        defaultValues: {
            title: '',
            type: QuestionType.TEXT,
            isRequired: true,
            options: [],
        },
    });

    const selectedType = form.watch('type');
    const needsOptions = questionTypes.find((t) => t.value === selectedType)?.needsOptions;

    // Initialiser le formulaire avec les valeurs de la question à éditer
    useEffect(() => {
        if (question) {
            form.reset({
                title: question.title,
                type: question.type,
                isRequired: question.isRequired,
            });
            // TODO: Backend - Les options ne sont pas retournées dans QuestionNestedDto
            // Ajouter le champ options?: string[] dans le DTO backend
            // En attendant, l'édition des options n'est pas possible
            setOptions([]);
        } else {
            form.reset({
                title: '',
                type: QuestionType.TEXT,
                isRequired: true,
            });
            setOptions([]);
        }
    }, [question, form]);

    const handleAddOption = () => {
        if (optionInput.trim()) {
            setOptions([...options, optionInput.trim()]);
            setOptionInput('');
        }
    };

    const handleRemoveOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: QuestionFormValues) => {
        try {
            const payload: any = {
                questionnaireId,
                title: data.title,
                type: data.type as any,
                isRequired: data.isRequired,
            };

            if (needsOptions && options.length > 0) {
                payload.options = options;
            }

            if (question) {
                // Mise à jour
                await updateMutation.mutateAsync({
                    id: question.id,
                    data: payload,
                });

                toast({
                    title: 'Question mise à jour',
                    description: 'La question a été modifiée avec succès.',
                });
            } else {
                // Création
                await createMutation.mutateAsync({
                    data: payload,
                });

                toast({
                    title: 'Question créée',
                    description: 'La question a été ajoutée au questionnaire.',
                });
            }

            onSaved();
            form.reset();
            setOptions([]);
        } catch (error: any) {
            toast({
                title: 'Erreur',
                description: error?.response?.data?.message || 'Une erreur est survenue.',
                variant: 'destructive',
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-2xl'>
                <DialogHeader>
                    <DialogTitle>{question ? 'Modifier la question' : 'Ajouter une question'}</DialogTitle>
                    <DialogDescription>
                        {question
                            ? 'Modifiez les informations de la question.'
                            : 'Créez une nouvelle question pour votre questionnaire.'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                        {/* prettier-ignore */}
                        <FormField
                            control={form.control}
                            name='title'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Question *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Comment vous sentez-vous aujourd'hui ?" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* prettier-ignore */}
                        <FormField
                            control={form.control}
                            name='type'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type de question *</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Sélectionner un type' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {questionTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Options pour choix multiples */}
                        {needsOptions && (
                            <div className='space-y-3'>
                                <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                                    Options de réponse
                                </label>
                                <div className='flex gap-2'>
                                    <Input
                                        placeholder='Ajouter une option...'
                                        value={optionInput}
                                        onChange={(e) => setOptionInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddOption();
                                            }
                                        }}
                                    />
                                    <Button type='button' onClick={handleAddOption} disabled={!optionInput.trim()}>
                                        <Plus className='h-4 w-4' />
                                    </Button>
                                </div>
                                <div className='flex flex-wrap gap-2'>
                                    {options.map((option, index) => (
                                        <Badge key={index} variant='secondary' className='gap-1'>
                                            {option}
                                            <button
                                                type='button'
                                                onClick={() => handleRemoveOption(index)}
                                                className='ml-1'
                                            >
                                                <X className='h-3 w-3' />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                                {options.length === 0 && (
                                    <p className='text-sm text-muted-foreground'>Ajoutez au moins 2 options</p>
                                )}
                            </div>
                        )}

                        {/* prettier-ignore */}
                        <FormField
                            control={form.control}
                            name='isRequired'
                            render={({ field }) => (
                                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                                    <div className='space-y-0.5'>
                                        <FormLabel className='text-base'>Question obligatoire</FormLabel>
                                        <FormDescription>Le joueur devra répondre à cette question</FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
                                Annuler
                            </Button>
                            <Button
                                type='submit'
                                disabled={
                                    createMutation.isPending ||
                                    updateMutation.isPending ||
                                    (needsOptions && options.length < 2)
                                }
                            >
                                {createMutation.isPending || updateMutation.isPending
                                    ? 'Enregistrement...'
                                    : question
                                      ? 'Mettre à jour'
                                      : 'Créer la question'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
