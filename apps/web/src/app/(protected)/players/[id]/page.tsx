'use client';

import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { PlayerHeaderCard } from '@/components/players/player-header-card';
import { RoleBadge } from '@/components/players/role-badge';
import { DeleteConfirmDialog } from '@/components/shared/delete-confirm-dialog';
import { EntityImage } from '@/components/shared/entity-image';
import { SportBadge } from '@/components/shared/sport-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PlayerResponseDto } from '@/lib/generated/models';
import {
    getPlayersControllerFindAllQueryKey,
    usePlayersControllerFindOne,
    usePlayersControllerRemove,
} from '@/lib/generated/players/players';
import { usePositionsControllerFindAll } from '@/lib/generated/positions/positions';
import { useSportsControllerFindAll } from '@/lib/generated/sports/sports';
import { getTeamsControllerFindOneQueryKey } from '@/lib/generated/teams/teams';
import { useQueryClient } from '@tanstack/react-query';

export default function PlayerDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const playerId = Number(params['id']);

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const { data: player, isLoading: isLoadingPlayer } = usePlayersControllerFindOne<PlayerResponseDto>(playerId, {
        query: {
            enabled: !!playerId,
        },
    });

    const { data: positions } = usePositionsControllerFindAll();

    const { data: sports } = useSportsControllerFindAll();

    const { mutate: deletePlayer, isPending: isDeleting } = usePlayersControllerRemove({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: getPlayersControllerFindAllQueryKey() });
                // Invalider la query de l'équipe du joueur si le joueur en avait une
                if (player?.team?.id) {
                    queryClient.invalidateQueries({ queryKey: getTeamsControllerFindOneQueryKey(player.team.id) });
                }
                toast.success('Joueur supprimé avec succès');
                router.push('/players');
            },
            onError: (error: unknown) => {
                const message = (error as { message?: string })?.message || 'Erreur lors de la suppression du joueur';
                toast.error(message);
            },
        },
    });

    const getPositionName = (positionId: number | null | undefined) => {
        if (!positionId) return null;
        const position = (positions || []).find((p) => p.id === positionId);
        return position?.name || null;
    };

    const getSportName = (sportId: number | null | undefined) => {
        if (!sportId) return null;
        const sport = (sports || []).find((s) => s.id === sportId);
        return sport?.name || null;
    };

    const handleDeletePlayer = () => {
        deletePlayer({ id: playerId });
    };

    const countryCodeToFlag = (countryCode: string) => {
        if (!countryCode || countryCode.length !== 2) return '';
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map((char) => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
    };

    if (isLoadingPlayer) {
        return (
            <div className='space-y-6'>
                <Skeleton className='h-10 w-48' />
                <Skeleton className='h-64' />
                <Skeleton className='h-96' />
            </div>
        );
    }

    if (!player) {
        return (
            <div className='space-y-6'>
                <Button variant='ghost' onClick={() => router.back()}>
                    <ArrowLeft className='mr-2 h-4 w-4' />
                    Retour
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
                Retour
            </Button>

            <Card>
                <PlayerHeaderCard
                    player={player}
                    onEdit={() => router.push(`/players/${playerId}/edit`)}
                    onDelete={() => setShowDeleteDialog(true)}
                >
                    {/* Sport with logo */}
                    {player.position?.sportId && getSportName(player.position.sportId) && (
                        <SportBadge sportName={getSportName(player.position.sportId)!} className='mt-4' />
                    )}

                    {/* Team with logo */}
                    {player.team && (
                        <div className='flex items-center gap-2 mt-2'>
                            <EntityImage imageUrl={player.team.logoUrl ?? null} name={player.team.name} size='sm' />
                            <span className='text-sm font-medium'>{player.team.name}</span>
                        </div>
                    )}

                    {/* Role with image and name */}
                    <div className='flex items-center gap-4 mt-2'>
                        {player.position?.sportId && getPositionName(player.positionId) && (
                            <RoleBadge
                                sportName={getSportName(player.position.sportId)!}
                                roleName={getPositionName(player.positionId)!}
                            />
                        )}
                    </div>
                </PlayerHeaderCard>
            </Card>

            <div className='grid gap-4 md:grid-cols-2'>
                <Card>
                    <CardHeader>
                        <CardTitle className='text-sm font-medium'>Informations personnelles</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div>
                            <p className='text-xs text-muted-foreground mb-1'>Prénom</p>
                            <p className='font-medium'>{player.firstName}</p>
                        </div>

                        <div>
                            <p className='text-xs text-muted-foreground mb-1'>Nom</p>
                            <p className='font-medium'>{player.lastName}</p>
                        </div>

                        {player.nickName && (
                            <div>
                                <p className='text-xs text-muted-foreground mb-1'>Surnom</p>
                                <p className='font-medium'>{player.nickName}</p>
                            </div>
                        )}

                        {player.sensitiveData?.birthDate && (
                            <div>
                                <p className='text-xs text-muted-foreground mb-1'>Date de naissance</p>
                                <p className='font-medium'>
                                    {new Date(player.sensitiveData.birthDate).toLocaleDateString('fr-FR')}
                                </p>
                            </div>
                        )}

                        {player.sensitiveData?.gender && (
                            <div>
                                <p className='text-xs text-muted-foreground mb-1'>Genre</p>
                                <p className='font-medium'>
                                    {player.sensitiveData.gender === 'MALE'
                                        ? 'Homme'
                                        : player.sensitiveData.gender === 'FEMALE'
                                          ? 'Femme'
                                          : 'Autre'}
                                </p>
                            </div>
                        )}

                        {player.sensitiveData?.nationality && (
                            <div>
                                <p className='text-xs text-muted-foreground mb-1'>Nationalité</p>
                                <p className='font-medium'>
                                    {countryCodeToFlag(player.sensitiveData.nationality)}{' '}
                                    {player.sensitiveData.nationality}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className='text-sm font-medium'>Coordonnées</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div>
                            <p className='text-xs text-muted-foreground mb-1'>Email</p>
                            <p className='font-medium'>{player.user?.email || '-'}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <DeleteConfirmDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                title='Supprimer le joueur ?'
                description={`Êtes-vous sûr de vouloir supprimer ${displayName} ? Cette action ne peut pas être annulée.`}
                onConfirm={handleDeletePlayer}
                isDeleting={isDeleting}
            />
        </div>
    );
}
