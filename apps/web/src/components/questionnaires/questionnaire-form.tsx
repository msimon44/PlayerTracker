'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';

const questionnaireFormSchema = z.object({
    title: z.string().min(1, 'Le titre est requis').max(200, 'Le titre ne peut pas dépasser 200 caractères'),
    description: z.string().max(1000, 'La description ne peut pas dépasser 1000 caractères'),
    teamId: z.number({ required_error: 'Veuillez sélectionner une équipe' }).min(1, 'Veuillez sélectionner une équipe'),
});

type QuestionnaireFormValues = z.infer<typeof questionnaireFormSchema>;

interface QuestionnaireFormProps {
    initialValues?: Partial<QuestionnaireFormValues>;
    teams?: Array<{ id: number; name: string }>;
    isLoadingTeams?: boolean;
    onSubmit: (data: QuestionnaireFormValues) => void | Promise<void>;
    submitLabel?: string;
    isSubmitting?: boolean;
}

export function QuestionnaireForm({
    initialValues,
    teams = [],
    isLoadingTeams = false,
    onSubmit,
    submitLabel = 'Enregistrer',
    isSubmitting = false,
}: QuestionnaireFormProps) {
    const form = useForm<QuestionnaireFormValues>({
        resolver: zodResolver(questionnaireFormSchema),
        defaultValues: {
            title: initialValues?.title ?? '',
            description: initialValues?.description ?? '',
            teamId: initialValues?.teamId ?? ('' as unknown as number),
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Titre du questionnaire *</FormLabel>
                            <FormControl>
                                <Input placeholder='Ex: Questionnaire de bien-être hebdomadaire' {...field} />
                            </FormControl>
                            <FormDescription>
                                Un titre clair et descriptif pour identifier le questionnaire
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Décrivez brièvement l'objectif de ce questionnaire..."
                                    className='min-h-[120px]'
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Expliquez aux joueurs le contexte et l'objectif du questionnaire
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='teamId'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Équipe cible *</FormLabel>
                            <Select
                                onValueChange={(value) => field.onChange(Number(value))}
                                value={field.value ? String(field.value) : ''}
                                disabled={isLoadingTeams}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        {isLoadingTeams ? (
                                            <Skeleton className='h-4 w-32' />
                                        ) : (
                                            <SelectValue placeholder='Sélectionner une équipe' />
                                        )}
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {teams.map((team) => (
                                        <SelectItem key={team.id} value={String(team.id)}>
                                            {team.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>L'équipe qui recevra ce questionnaire</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className='flex justify-end gap-2'>
                    <Button type='submit' disabled={isSubmitting}>
                        {isSubmitting ? 'Enregistrement...' : submitLabel}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
