'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { PageHeader } from '@/components/shared/page-header';
import { TeamFormFields } from '@/components/teams/team-form-fields';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { useAuth } from '@/hooks/use-auth';
import { CreateTeamDto } from '@/lib/generated/models';
import { useSportsControllerFindAll } from '@/lib/generated/sports/sports';
import { getTeamsControllerFindAllQueryKey, useTeamsControllerCreate } from '@/lib/generated/teams/teams';

type Sport = {
    id: number;
    name: string;
};

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

export default function NewTeamPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const clubId = user?.staff?.clubId || user?.player?.clubId;
    const clubIdParam = clubId ? String(clubId) : '';

    const { data: sports, isLoading: isLoadingSports } = useSportsControllerFindAll<Sport[]>();

    const { mutate: createTeam, isPending } = useTeamsControllerCreate({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: getTeamsControllerFindAllQueryKey({ clubId: clubIdParam }) });
                toast.success('Équipe créée avec succès');
                router.push('/teams');
            },
            onError: (error: unknown) => {
                const message = (error as { message?: string })?.message || "Erreur lors de la création de l'équipe";
                toast.error(message);
            },
        },
    });

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            logoUrl: '',
        },
    });

    const onSubmit = (values: FormValues) => {
        if (!clubId) {
            toast.error('Vous devez être associé à un club pour créer une équipe');
            return;
        }

        const data: CreateTeamDto = {
            name: values.name,
            sportId: values.sportId,
            clubId,
        };
        if (values.description) data.description = values.description;
        if (values.logoUrl) data.logoUrl = values.logoUrl;

        createTeam({ data });
    };

    if (!clubId) {
        return (
            <div className='space-y-6'>
                <Button variant='ghost' onClick={() => router.push('/teams')}>
                    <ArrowLeft className='mr-2 h-4 w-4' />
                    Retour aux équipes
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>Accès refusé</CardTitle>
                        <CardDescription>Vous devez être associé à un club pour créer une équipe.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            <Button variant='ghost' onClick={() => router.push('/teams')}>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Retour aux équipes
            </Button>

            <PageHeader title='Nouvelle équipe' description='Créer une nouvelle équipe pour votre club' />

            <Card>
                <CardHeader>
                    <CardTitle>Informations de l'équipe</CardTitle>
                    <CardDescription>Remplissez les informations de la nouvelle équipe</CardDescription>
                </CardHeader>
                <CardContent>
                    <TeamFormFields
                        form={form}
                        sports={sports}
                        isLoadingSports={isLoadingSports}
                        onSubmit={onSubmit}
                        onCancel={() => router.push('/teams')}
                        isPending={isPending}
                        submitLabel="Créer l'équipe"
                    />
                </CardContent>
            </Card>
        </div>
    );
}
