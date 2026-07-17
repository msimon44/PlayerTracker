'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useAuth } from '@/hooks/use-auth';
import { getPlayersControllerFindAllQueryKey, usePlayersControllerCreate } from '@/lib/generated/players/players';
import { usePositionsControllerFindAll } from '@/lib/generated/positions/positions';
import { useSensitivePlayerDataControllerCreate } from '@/lib/generated/sensitive-player-data/sensitive-player-data';
import { useSportsControllerFindAll } from '@/lib/generated/sports/sports';
import { getTeamsControllerFindOneQueryKey, useTeamsControllerFindAll } from '@/lib/generated/teams/teams';
import { useUsersControllerCreate } from '@/lib/generated/users/users';
import { getPlayerImageUrl } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';

const DEFAULT_PASSWORD = 'playertracker123!';

const createPlayerSchema = z.object({
    firstName: z.string().min(1, 'Le prénom est requis').max(100),
    lastName: z.string().min(1, 'Le nom est requis').max(100),
    nickName: z.string().max(100).optional().or(z.literal('')),
    email: z.string().refine((val) => val === '' || z.string().email().safeParse(val).success, {
        message: 'Email invalide',
    }),
    photoUrl: z
        .string()
        .optional()
        .or(z.literal(''))
        .refine(
            (val) => !val || /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(val),
            'Le nom du fichier doit être un fichier image valide (ex: photo.png)',
        ),
    positionId: z.string().optional().or(z.literal('')),
    teamId: z.string().optional().or(z.literal('')),
    birthDate: z
        .string()
        .optional()
        .or(z.literal(''))
        .refine((val) => !val || !isNaN(Date.parse(val)), 'La date est invalide'),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
    nationality: z
        .string()
        .optional()
        .or(z.literal(''))
        .refine((val) => !val || /^[A-Za-z]{2}$/.test(val), 'La nationalité doit être un code ISO-2 (ex: FR)'),
});

type CreatePlayerForm = z.infer<typeof createPlayerSchema>;

const sanitizeFragment = (value: string) =>
    value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9._-]/g, '.')
        .replace(/\.{2,}/g, '.')
        .replace(/^\.+|\.+$/g, '')
        .toLowerCase();

const buildFallbackEmail = (
    email: string | undefined,
    nickName: string | undefined,
    firstName: string,
    lastName: string,
) => {
    if (email && email.trim()) return email.trim();

    const base = sanitizeFragment(nickName?.trim() || `${firstName}.${lastName}`);
    const safeBase = base || `joueur.${Date.now()}`;
    return `${safeBase}@playertracker.com`;
};

export default function NewPlayerPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [sportFilter, setSportFilter] = useState<string>('ALL');

    const clubId = user?.staff?.clubId || user?.player?.clubId;
    const clubIdParam = clubId ? String(clubId) : '';

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

    const { mutateAsync: createUser, isPending: isCreatingUser } = useUsersControllerCreate();
    const { mutateAsync: createPlayer, isPending: isCreatingPlayer } = usePlayersControllerCreate();
    const { mutateAsync: createSensitivePlayerData } = useSensitivePlayerDataControllerCreate();

    const form = useForm<CreatePlayerForm>({
        resolver: zodResolver(createPlayerSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            nickName: '',
            email: '',
            photoUrl: '',
            positionId: undefined,
            teamId: undefined,
            birthDate: '',
            gender: undefined,
            nationality: '',
        },
    });

    const isSubmitting = isCreatingUser || isCreatingPlayer;

    const sortedPositions = useMemo(() => (positions || []).slice().sort((a, b) => a.id - b.id), [positions]);

    const sortedTeams = useMemo(
        () => (Array.isArray(teams) ? teams : []).slice().sort((a, b) => a.name.localeCompare(b.name)),
        [teams],
    );

    const sortedSports = useMemo(() => (sports || []).slice().sort((a, b) => a.name.localeCompare(b.name)), [sports]);

    const filteredPositions = useMemo(
        () => sortedPositions.filter((position) => sportFilter === 'ALL' || position.sportId === Number(sportFilter)),
        [sortedPositions, sportFilter],
    );

    const filteredTeams = useMemo(
        () => sortedTeams.filter((team) => sportFilter === 'ALL' || team.sportId === Number(sportFilter)),
        [sortedTeams, sportFilter],
    );

    const onSubmit = async (data: CreatePlayerForm) => {
        if (!clubId) {
            toast.error('Vous devez être associé à un club pour créer un joueur.');
            return;
        }

        const emailToUse = buildFallbackEmail(data.email, data.nickName, data.firstName, data.lastName);

        try {
            // Créer l'utilisateur
            const createdUser = await createUser({
                data: {
                    email: emailToUse,
                    password: DEFAULT_PASSWORD,
                    role: 'PLAYER',
                },
            });

            const userId = createdUser?.id;

            // Créer le joueur avec l'ID utilisateur
            const player = await createPlayer({
                data: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    clubId,
                    ...(data.nickName && { nickName: data.nickName }),
                    ...(data.photoUrl && { photoUrl: data.photoUrl }),
                    ...(data.positionId && { positionId: Number(data.positionId) }),
                    ...(data.teamId && { teamId: Number(data.teamId) }),
                    ...(userId ? { userId } : {}),
                },
            });

            // Create sensitive player data if birthDate, gender or nationality is provided
            if (data.birthDate || data.gender || data.nationality) {
                await createSensitivePlayerData({
                    data: {
                        playerId: player.id,
                        ...(data.birthDate && { birthDate: new Date(data.birthDate).toISOString() }),
                        ...(data.gender && { gender: data.gender }),
                        ...(data.nationality && { nationality: data.nationality.toUpperCase() }),
                    } as any,
                });
            }

            await queryClient.invalidateQueries({ queryKey: getPlayersControllerFindAllQueryKey() });

            // Invalider la query de l'équipe si une équipe a été assignée
            if (data.teamId) {
                queryClient.invalidateQueries({ queryKey: getTeamsControllerFindOneQueryKey(Number(data.teamId)) });
            }

            toast.success('Joueur créé avec succès');
            router.push(`/players/${player.id}`);
        } catch (error: unknown) {
            const message = (error as { message?: string; response?: { data?: { message?: string } } })?.response?.data
                ?.message;
            toast.error(message || 'Erreur lors de la création du joueur');
        }
    };

    if (!clubId) {
        return (
            <div className='space-y-6'>
                <div className='flex items-center gap-4'>
                    <Button variant='ghost' size='icon' onClick={() => router.back()} aria-label='Retour'>
                        <ArrowLeft className='h-4 w-4' aria-hidden='true' />
                    </Button>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>Nouveau joueur</h1>
                        <p className='text-muted-foreground'>Associez-vous à un club pour pouvoir créer un joueur.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-4'>
                <Button variant='ghost' size='icon' onClick={() => router.back()} aria-label='Retour'>
                    <ArrowLeft className='h-4 w-4' aria-hidden='true' />
                </Button>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Nouveau joueur</h1>
                    <p className='text-muted-foreground'>Créez un joueur et son compte associé</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informations du joueur</CardTitle>
                    <CardDescription>
                        Renseignez les informations principales. Un compte joueur sera créé automatiquement avec un mot
                        de passe par défaut.
                    </CardDescription>
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
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Genre (optionnel)</FormLabel>
                                            <Select
                                                value={field.value ?? ''}
                                                onValueChange={(value) => field.onChange(value || undefined)}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Sélectionner un genre' />
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
                                    )}
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

                                <FormField
                                    control={form.control}
                                    name='email'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email (optionnel)</FormLabel>
                                            <FormControl>
                                                <Input placeholder='prenom.nom@club.com' {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Si vide, un email sera généré à partir du surnom ou du nom complet.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className='space-y-2'>
                                    <label className='text-sm font-medium leading-none'>Jeu (filtre)</label>
                                    <Select value={sportFilter} onValueChange={(value) => setSportFilter(value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Filtrer par jeu' />
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
                                    <p className='text-sm text-muted-foreground'>
                                        Filtre les rôles et équipes proposés.
                                    </p>
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
                                                        <SelectValue placeholder='Sélectionner un rôle' />
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
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Equipe (optionnel)</FormLabel>
                                            <Select
                                                value={field.value ?? ''}
                                                onValueChange={(value) => field.onChange(value || undefined)}
                                                disabled={isLoadingTeams}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue
                                                            placeholder={
                                                                isLoadingTeams
                                                                    ? 'Chargement...'
                                                                    : 'Sélectionner une équipe'
                                                            }
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {filteredTeams.map((team) => (
                                                        <SelectItem key={team.id} value={String(team.id)}>
                                                            {team.name}
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
                                                    Entrez uniquement le nom du fichier (ex: photo.png)
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

                            <div className='space-y-2'>
                                <p className='text-sm text-muted-foreground'>
                                    Un compte joueur sera créé avec le mot de passe par défaut "{DEFAULT_PASSWORD}".
                                    Pensez à le communiquer ou le faire changer.
                                </p>
                            </div>

                            <div className='flex justify-end gap-4 pt-4'>
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={() => router.push('/players')}
                                    disabled={isSubmitting}
                                >
                                    Annuler
                                </Button>
                                <Button type='submit' disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                                    Créer le joueur
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
