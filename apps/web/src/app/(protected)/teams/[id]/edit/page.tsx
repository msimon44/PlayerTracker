'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { PageHeader } from '@/components/shared/page-header';
import { TeamFormFields } from '@/components/teams/team-form-fields';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { TeamResponseDto, UpdateTeamDto } from '@/lib/generated/models';
import { useSportsControllerFindAll } from '@/lib/generated/sports/sports';
import {
    getTeamsControllerFindAllQueryKey,
    getTeamsControllerFindOneQueryKey,
    useTeamsControllerFindOne,
    useTeamsControllerUpdate,
} from '@/lib/generated/teams/teams';

const formSchema = z.object({
    name: z.string().min(1, 'Le nom est requis').max(100, 'Le nom ne peut pas dépasser 100 caractères'),
    description: z.string().max(500, 'La description ne peut pas dépasser 500 caractères').optional(),
    logoUrl: z
        .string()
        .optional()
        .or(z.literal(''))
        .refine(
            (val) => !val || /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(val),
            'Le nom du fichier doit être un fichier image valide (ex: logo.png)',
        ),
    sportId: z
        .number({
            required_error: 'Le sport est requis',
            invalid_type_error: 'Le sport est requis',
        })
        .min(1, 'Le sport est requis'),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditTeamPage() {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const teamId = Number(params['id']);

    const { data: team, isLoading: isLoadingTeam } = useTeamsControllerFindOne<TeamResponseDto>(teamId, {
        query: {
            enabled: !!teamId,
        },
    });

    const { data: sports, isLoading: isLoadingSports } = useSportsControllerFindAll();

    const { mutate: updateTeam, isPending } = useTeamsControllerUpdate({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: getTeamsControllerFindOneQueryKey(teamId) });
                queryClient.invalidateQueries({ queryKey: getTeamsControllerFindAllQueryKey() });
                toast.success('Équipe mise à jour avec succès');
                router.push(`/teams/${teamId}`);
            },
            onError: (error: unknown) => {
                const message = (error as { message?: string })?.message || "Erreur lors de la mise à jour de l'équipe";
                toast.error(message);
            },
        },
    });

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: team?.name || '',
            description: team?.description || '',
            logoUrl: team?.logoUrl || '',
        } as Partial<FormValues>,
    });

    // Remplir le formulaire avec les données de l'équipe
    useEffect(() => {
        if (team && form) {
            setTimeout(() => {
                form.reset({
                    name: team.name || '',
                    description: team.description || '',
                    logoUrl: team.logoUrl || '',
                    sportId: team.sportId,
                });
            }, 0);
        }
    }, [form, team]);

    const onSubmit: (values: FormValues) => void = (values) => {
        const data: UpdateTeamDto = {
            name: values.name,
            sportId: values.sportId,
        };
        if (values.description) data.description = values.description;
        if (values.logoUrl) data.logoUrl = values.logoUrl;

        updateTeam({ id: teamId, data });
    };

    if (isLoadingTeam) {
        return (
            <div className='space-y-6'>
                <Skeleton className='h-10 w-48' />
                <Skeleton className='h-12' />
                <Skeleton className='h-96' />
            </div>
        );
    }

    if (!team) {
        return (
            <div className='space-y-6'>
                <Button variant='ghost' onClick={() => router.push('/teams')}>
                    <ArrowLeft className='mr-2 h-4 w-4' />
                    Retour aux équipes
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>Équipe introuvable</CardTitle>
                        <CardDescription>
                            L'équipe que vous recherchez n'existe pas ou vous n'y avez pas accès.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            <Button variant='ghost' onClick={() => router.push(`/teams/${teamId}`)}>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Retour aux détails
            </Button>

            <PageHeader title="Modifier l'équipe" description={`Mettez à jour les informations de ${team.name}`} />

            <Card>
                <CardHeader>
                    <CardTitle>Informations de l'équipe</CardTitle>
                    <CardDescription>Modifiez les informations de l'équipe</CardDescription>
                </CardHeader>
                <CardContent>
                    <TeamFormFields
                        form={form}
                        sports={sports}
                        isLoadingSports={isLoadingSports}
                        onSubmit={onSubmit}
                        onCancel={() => router.push(`/teams/${teamId}`)}
                        isPending={isPending}
                        submitLabel='Mettre à jour'
                    />
                </CardContent>
            </Card>
        </div>
    );
}
