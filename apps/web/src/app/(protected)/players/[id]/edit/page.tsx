'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

import { useAuth } from '@/hooks/use-auth';

import { PlayerResponseDto } from '@/lib/generated/models';
import {
    getPlayersControllerFindAllQueryKey,
    getPlayersControllerFindOneQueryKey,
    usePlayersControllerFindOne,
    usePlayersControllerUpdate,
} from '@/lib/generated/players/players';
import { usePositionsControllerFindAll } from '@/lib/generated/positions/positions';
import {
    useSensitivePlayerDataControllerCreate,
    useSensitivePlayerDataControllerUpdate,
} from '@/lib/generated/sensitive-player-data/sensitive-player-data';
import { useSportsControllerFindAll } from '@/lib/generated/sports/sports';
import {
    getTeamsControllerFindAllQueryKey,
    getTeamsControllerFindOneQueryKey,
    useTeamsControllerFindAll,
} from '@/lib/generated/teams/teams';
import { getPlayerImageUrl } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';

const editPlayerSchema = z.object({
    firstName: z.string().min(1, 'Le prénom est requis').max(100),
    lastName: z.string().min(1, 'Le nom est requis').max(100),
    nickName: z.string().max(100).optional().default(''),
    photoUrl: z.string().optional().default(''),
    positionId: z.string().optional().default(''),
    teamId: z.string().optional().default('NONE'),
    birthDate: z.string().optional().default(''),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
    nationality: z
        .string()
        .optional()
        .default('')
        .refine((val) => !val || /^[A-Za-z]{2}$/.test(val), 'La nationalité doit être un code ISO-2 (ex: FR)'),
});

type EditPlayerForm = z.infer<typeof editPlayerSchema>;

export default function EditPlayerPage() {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const playerId = Number(params['id']);
    const [sportFilter, setSportFilter] = useState<string>('ALL');
    const [showTeamChangeDialog, setShowTeamChangeDialog] = useState(false);
    const [pendingSubmitData, setPendingSubmitData] = useState<EditPlayerForm | null>(null);

    const clubId = user?.staff?.clubId || user?.player?.clubId;
    const clubIdParam = clubId ? String(clubId) : '';

    const { data: player, isLoading: isLoadingPlayer } = usePlayersControllerFindOne<PlayerResponseDto>(playerId, {
        query: {
            enabled: !!playerId,
        },
    });

    const { data: positions } = usePositionsControllerFindAll();
    const { data: sports } = useSportsControllerFindAll();
    const { data: teams, isLoading: isLoadingTeams } = useTeamsControllerFindAll(
        { clubId: clubIdParam },
        {
            query: {
                enabled: !!clubId,
            },
        },
    );

    const currentPlayerTeamId = player?.team?.id ?? player?.teamId ?? null;

    const { mutate: updatePlayer, isPending: isUpdating } = usePlayersControllerUpdate({
        mutation: {
            onSuccess: (_updatedPlayer, variables) => {
                queryClient.invalidateQueries({ queryKey: getPlayersControllerFindOneQueryKey(playerId) });
                queryClient.invalidateQueries({ queryKey: getPlayersControllerFindAllQueryKey() });
                queryClient.invalidateQueries({ queryKey: getTeamsControllerFindAllQueryKey() });
                // Invalider la query de l'équipe du joueur si le joueur en a une
                if (player?.team?.id) {
                    queryClient.invalidateQueries({ queryKey: getTeamsControllerFindOneQueryKey(player.team.id) });
                }
                if (variables.data.teamId) {
                    queryClient.invalidateQueries({
                        queryKey: getTeamsControllerFindOneQueryKey(variables.data.teamId),
                    });
                }
                toast.success('Joueur modifié avec succès');
                router.push(`/players/${playerId}`);
            },
            onError: (error: unknown) => {
                const message = (error as { message?: string })?.message || 'Erreur lors de la modification du joueur';
                toast.error(message);
            },
        },
    });

    const { mutate: updateSensitivePlayerData } = useSensitivePlayerDataControllerUpdate({
        mutation: {
            onError: (error: unknown) => {
                const message =
                    (error as { message?: string })?.message || 'Erreur lors de la mise à jour des données sensibles';
                toast.error(message);
            },
        },
    });

    const { mutate: createSensitivePlayerData } = useSensitivePlayerDataControllerCreate({
        mutation: {
            onError: (error: unknown) => {
                const message =
                    (error as { message?: string })?.message || 'Erreur lors de la création des données sensibles';
                toast.error(message);
            },
        },
    });

    const form = useForm<EditPlayerForm>({
        resolver: zodResolver(editPlayerSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            nickName: '',
            photoUrl: '',
            positionId: '',
            teamId: 'NONE',
            birthDate: '',
            gender: undefined,
            nationality: '',
        },
    });

    useEffect(() => {
        if (player && positions && positions.length > 0) {
            // Prefill sport filter from nested data, or fall back to resolving via positions list
            const sportIdFromPlayer = player.position?.sportId;
            const sportIdFromPositions = player.positionId
                ? positions?.find((p) => p.id === player.positionId)?.sportId
                : undefined;
            const resolvedSportId = sportIdFromPlayer ?? sportIdFromPositions;

            const newSportFilter = resolvedSportId ? String(resolvedSportId) : 'ALL';
            setSportFilter(newSportFilter);

            const birthDate = (
                player.sensitiveData?.birthDate
                    ? new Date(player.sensitiveData.birthDate).toISOString().split('T')[0]
                    : ''
            ) as string;
            form.reset({
                firstName: player.firstName,
                lastName: player.lastName,
                nickName: player.nickName || '',
                photoUrl: player.photoUrl || '',
                positionId: player.positionId ? String(player.positionId) : '',
                birthDate: birthDate,
                gender: player.sensitiveData?.gender || undefined,
                nationality: player.sensitiveData?.nationality || '',
            });
        }
    }, [player, positions, form]);

    useEffect(() => {
        if (!player) return;

        form.setValue('teamId', currentPlayerTeamId ? String(currentPlayerTeamId) : 'NONE', {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
        });
    }, [player, currentPlayerTeamId, form]);

    const sortedPositions = useMemo(() => (positions || []).slice().sort((a, b) => a.id - b.id), [positions]);

    const sortedSports = useMemo(() => (sports || []).slice().sort((a, b) => a.name.localeCompare(b.name)), [sports]);

    const sortedTeams = useMemo(() => (teams || []).slice().sort((a, b) => a.name.localeCompare(b.name)), [teams]);

    const submitPlayerUpdate = (data: EditPlayerForm) => {
        const teamId = data.teamId && data.teamId !== 'NONE' ? Number(data.teamId) : undefined;

        updatePlayer({
            id: playerId,
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                ...(data.nickName && { nickName: data.nickName }),
                ...(data.photoUrl && { photoUrl: data.photoUrl }),
                ...(data.positionId && { positionId: Number(data.positionId) }),
                ...(teamId !== undefined && { teamId }),
            },
        });
    };

    const filteredPositions = useMemo(
        () =>
            sortedPositions.filter(
                (position) =>
                    sportFilter === 'ALL' ||
                    position.sportId === Number(sportFilter) ||
                    (position.sportId === player?.position?.sportId && !sportFilter),
            ),
        [sortedPositions, sportFilter, player?.position?.sportId],
    );

    const onSubmit = (data: EditPlayerForm) => {
        const currentTeamId = currentPlayerTeamId;
        const nextTeamId = data.teamId && data.teamId !== 'NONE' ? Number(data.teamId) : null;

        if (currentTeamId && nextTeamId !== currentTeamId) {
            setPendingSubmitData(data);
            setShowTeamChangeDialog(true);
            return;
        }

        submitPlayerUpdate(data);

        // Update sensitive player data if birthDate, gender or nationality is provided
        if (data.birthDate || data.gender || data.nationality) {
            if (player?.sensitiveData?.id) {
                // Update existing sensitive data
                updateSensitivePlayerData({
                    id: player.sensitiveData.id,
                    data: {
                        ...(data.birthDate && { birthDate: new Date(data.birthDate).toISOString() }),
                        ...(data.gender && { gender: data.gender }),
                        ...(data.nationality && { nationality: data.nationality.toUpperCase() }),
                    } as any,
                });
            } else {
                // Create new sensitive data
                createSensitivePlayerData({
                    data: {
                        playerId,
                        ...(data.birthDate && { birthDate: new Date(data.birthDate).toISOString() }),
                        ...(data.gender && { gender: data.gender }),
                        ...(data.nationality && { nationality: data.nationality.toUpperCase() }),
                    } as any,
                });
            }
        }
    };

    const handleConfirmTeamChange = () => {
        if (pendingSubmitData) {
            submitPlayerUpdate(pendingSubmitData);
        }
        setPendingSubmitData(null);
        setShowTeamChangeDialog(false);
    };

    if (isLoadingPlayer) {
        return (
            <div className='space-y-6'>
                <Skeleton className='h-10 w-48' />
                <Skeleton className='h-96' />
            </div>
        );
    }

    if (!player) {
        return (
            <div className='space-y-6'>
                <Button variant='ghost' onClick={() => router.push('/players')}>
                    <ArrowLeft className='mr-2 h-4 w-4' />
                    Retour aux joueurs
                </Button>
                <Card>
                    <CardHeader>
                        <CardTitle>Joueur introuvable</CardTitle>
                        <CardDescription>
                            Le joueur que vous recherchez n'existe pas ou vous n'y avez pas accès.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    const displayName = player.nickName
        ? `${player.nickName} (${player.firstName} ${player.lastName})`
        : `${player.firstName} ${player.lastName}`;

    return (
        <div className='space-y-6'>
            <Button variant='ghost' onClick={() => router.back()}>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Retour aux détails
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>Modifier {displayName}</CardTitle>
                    <CardDescription>Mettez à jour les informations du joueur</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                            <div className='grid gap-6 md:grid-cols-2'>
                                <FormField
                                    control={form.control}
                                    name='firstName'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Prénom</FormLabel>
                                            <FormControl>
                                                <Input placeholder='Jean' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='lastName'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nom</FormLabel>
                                            <FormControl>
                                                <Input placeholder='Dupont' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='birthDate'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date de naissance (optionnel)</FormLabel>
                                            <FormControl>
                                                <Input type='date' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='gender'
                                    render={({ field }) => {
                                        const getGenderLabel = (value?: string) => {
                                            if (!value) return 'Sélectionner un genre';
                                            switch (value) {
                                                case 'MALE':
                                                    return 'Masculin';
                                                case 'FEMALE':
                                                    return 'Féminin';
                                                case 'OTHER':
                                                    return 'Autre';
                                                default:
                                                    return 'Sélectionner un genre';
                                            }
                                        };

                                        return (
                                            <FormItem>
                                                <FormLabel>Genre (optionnel)</FormLabel>
                                                <Select
                                                    value={field.value ?? ''}
                                                    onValueChange={(value) => field.onChange(value || undefined)}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={getGenderLabel(
                                                                    player?.sensitiveData?.gender,
                                                                )}
                                                            />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value='MALE'>Masculin</SelectItem>
                                                        <SelectItem value='FEMALE'>Féminin</SelectItem>
                                                        <SelectItem value='OTHER'>Autre</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />

                                <FormField
                                    control={form.control}
                                    name='nationality'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nationalité (optionnel)</FormLabel>
                                            <FormControl>
                                                <Input placeholder='FR' maxLength={2} {...field} />
                                            </FormControl>
                                            <FormDescription>Code pays ISO-2 (ex: FR, KR)</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='nickName'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Surnom (optionnel)</FormLabel>
                                            <FormControl>
                                                <Input placeholder='JD' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className='space-y-2'>
                                    <label className='text-sm font-medium leading-none'>Jeu (filtre)</label>
                                    <Select value={sportFilter} onValueChange={(value) => setSportFilter(value)}>
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={
                                                    player?.position?.sportId
                                                        ? sports?.find((s) => s.id === player.position?.sportId)?.name
                                                        : 'Sélectionner un jeu'
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='ALL'>Tous les jeux</SelectItem>
                                            {sortedSports.map((sport) => (
                                                <SelectItem key={sport.id} value={String(sport.id)}>
                                                    {sport.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className='text-sm text-muted-foreground'>Filtre les rôles proposés.</p>
                                </div>

                                <FormField
                                    control={form.control}
                                    name='positionId'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Rôle (optionnel)</FormLabel>
                                            <Select
                                                value={field.value ?? ''}
                                                onValueChange={(value) => field.onChange(value || undefined)}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue
                                                            placeholder={
                                                                player?.positionId
                                                                    ? positions?.find((p) => p.id === player.positionId)
                                                                          ?.name
                                                                    : 'Sélectionner un rôle'
                                                            }
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {filteredPositions.map((position) => (
                                                        <SelectItem key={position.id} value={String(position.id)}>
                                                            {position.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='teamId'
                                    render={({ field }) => {
                                        const currentTeamId = player?.teamId ?? player?.team?.id ?? null;
                                        const selectedTeamId =
                                            field.value && field.value !== 'NONE' ? Number(field.value) : null;
                                        const selectedTeam = sortedTeams.find((team) => team.id === selectedTeamId);
                                        const currentTeam = sortedTeams.find((team) => team.id === currentTeamId);

                                        return (
                                            <FormItem>
                                                <FormLabel>Équipe</FormLabel>
                                                <Select
                                                    value={field.value ?? 'NONE'}
                                                    onValueChange={(value) => field.onChange(value)}
                                                    disabled={isLoadingTeams || !clubId}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={
                                                                    isLoadingTeams
                                                                        ? 'Chargement des équipes...'
                                                                        : currentTeam
                                                                          ? currentTeam.name
                                                                          : 'Sélectionner une équipe'
                                                                }
                                                            />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {sortedTeams.map((team) => (
                                                            <SelectItem key={team.id} value={String(team.id)}>
                                                                {team.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    {currentPlayerTeamId &&
                                                    selectedTeamId &&
                                                    selectedTeamId !== currentPlayerTeamId
                                                        ? `Le joueur sera transféré de ${currentTeam?.name || 'son équipe actuelle'} vers ${selectedTeam?.name || 'la nouvelle équipe'}.`
                                                        : 'Choisissez l’équipe à laquelle rattacher le joueur.'}
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />

                                <FormField
                                    control={form.control}
                                    name='photoUrl'
                                    render={({ field }) => {
                                        const imageUrl = field.value ? getPlayerImageUrl(field.value) : null;
                                        return (
                                            <FormItem>
                                                <FormLabel>Nom de la photo (optionnel)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder='photo.png' {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Entrez juste le nom du fichier (ex: photo.png)
                                                </FormDescription>
                                                {imageUrl && (
                                                    <div className='mt-3 h-32 w-32 border rounded overflow-hidden'>
                                                        <img
                                                            src={imageUrl}
                                                            alt='Aperçu'
                                                            className='w-full h-full object-cover'
                                                        />
                                                    </div>
                                                )}
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />
                            </div>

                            <div className='flex justify-end gap-4 pt-4'>
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={() => router.push(`/players/${playerId}`)}
                                    disabled={isUpdating}
                                >
                                    Annuler
                                </Button>
                                <Button type='submit' disabled={isUpdating}>
                                    {isUpdating && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                                    Enregistrer
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <AlertDialog open={showTeamChangeDialog} onOpenChange={setShowTeamChangeDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer le changement d'équipe</AlertDialogTitle>
                        <AlertDialogDescription>
                            {pendingSubmitData && (
                                <>
                                    Le joueur est actuellement dans l'équipe{' '}
                                    <strong>{player?.team?.name || 'actuelle'}</strong>.
                                    <br />
                                    Voulez-vous le transférer vers{' '}
                                    <strong>
                                        {pendingSubmitData.teamId === 'NONE'
                                            ? 'Aucune équipe'
                                            : sortedTeams.find((team) => team.id === Number(pendingSubmitData.teamId))
                                                  ?.name || 'la nouvelle équipe'}
                                    </strong>{' '}
                                    ?
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setPendingSubmitData(null)}>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmTeamChange}>Confirmer</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
