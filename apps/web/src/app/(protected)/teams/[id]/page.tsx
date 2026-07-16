'use client';

import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Loader2, Trophy, UserCircle, UserPlus, Users } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { DeleteConfirmDialog } from '@/components/shared/delete-confirm-dialog';
import { EntityHeader } from '@/components/shared/entity-header';
import { EntityImage } from '@/components/shared/entity-image';
import { StatCard } from '@/components/shared/stat-card';
import { AssignPlayerDialog } from '@/components/teams/assign-player-dialog';
import { PlayerRow } from '@/components/teams/player-row';
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
import { Skeleton } from '@/components/ui/skeleton';

import { useAuth } from '@/hooks/use-auth';

import { TeamResponseDto } from '@/lib/generated/models';
import { getPlayersControllerFindAllQueryKey, usePlayersControllerFindAll } from '@/lib/generated/players/players';
import { usePositionsControllerFindAll } from '@/lib/generated/positions/positions';
import { useSportsControllerFindAll } from '@/lib/generated/sports/sports';
import {
    getTeamsControllerFindAllQueryKey,
    getTeamsControllerFindOneQueryKey,
    useTeamsControllerAssignPlayerToTeam,
    useTeamsControllerFindOne,
    useTeamsControllerRemove,
    useTeamsControllerRemovePlayerFromTeam,
} from '@/lib/generated/teams/teams';
import { formatSportNameForImage } from '@/lib/image-utils';
import { getSportImageUrl } from '@/lib/utils';

export default function TeamDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const teamId = Number(params['id']);

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showAssignDialog, setShowAssignDialog] = useState(false);
    const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');
    const [playerToRemove, setPlayerToRemove] = useState<{ id: number; name: string } | null>(null);

    const clubId = user?.staff?.clubId || user?.player?.clubId;
    const clubIdParam = clubId ? String(clubId) : '';

    const { data: team, isLoading: isLoadingTeam } = useTeamsControllerFindOne<TeamResponseDto>(teamId, {
        query: {
            enabled: !!teamId,
        },
    });

    // Trier les joueurs par position ID
    const displayedPlayers = (team?.players || []).sort((a, b) => {
        const positionA = a.positionId ?? Infinity;
        const positionB = b.positionId ?? Infinity;
        return positionA - positionB;
    });

    const { data: sports } = useSportsControllerFindAll();

    const { data: allPlayers } = usePlayersControllerFindAll(
        { clubId: clubIdParam },
        {
            query: {
                enabled: !!clubId,
            },
        },
    );

    const { data: positions } = usePositionsControllerFindAll();

    const { mutate: deleteTeam, isPending: isDeleting } = useTeamsControllerRemove({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: getTeamsControllerFindAllQueryKey() });
                toast.success('Équipe supprimée avec succès');
                router.push('/teams');
            },
            onError: (error: unknown) => {
                const message = (error as { message?: string })?.message || "Erreur lors de la suppression de l'équipe";
                toast.error(message);
            },
        },
    });

    const { mutate: assignPlayer, isPending: isAssigning } = useTeamsControllerAssignPlayerToTeam({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: getTeamsControllerFindOneQueryKey(teamId) });
                // Invalider aussi la liste des joueurs pour mettre à jour le statut isActive dans le sélecteur
                queryClient.invalidateQueries({ queryKey: getPlayersControllerFindAllQueryKey() });
                toast.success("Joueur ajouté à l'équipe avec succès");
                setShowAssignDialog(false);
                setSelectedPlayerId('');
            },
            onError: (error: unknown) => {
                const message = (error as { message?: string })?.message || "Erreur lors de l'ajout du joueur";
                toast.error(message);
            },
        },
    });

    const { mutate: removePlayer, isPending: isRemovingPlayer } = useTeamsControllerRemovePlayerFromTeam({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: getTeamsControllerFindOneQueryKey(teamId) });
                // Invalider aussi la liste des joueurs pour mettre à jour le statut isActive dans le sélecteur
                queryClient.invalidateQueries({ queryKey: getPlayersControllerFindAllQueryKey() });
                toast.success("Joueur retiré de l'équipe avec succès");
                setPlayerToRemove(null);
            },
            onError: (error: unknown) => {
                const message = (error as { message?: string })?.message || 'Erreur lors du retrait du joueur';
                toast.error(message);
            },
        },
    });

    const getSportName = (sportId: number) => {
        const sport = (sports || []).find((s) => s.id === sportId);
        return sport?.name || 'Sport inconnu';
    };

    const getPositionName = (positionId: number | null | undefined) => {
        if (!positionId) return null;
        const position = (positions || []).find((p) => p.id === positionId);
        return position?.name || null;
    };

    const handleAssignPlayer = () => {
        if (!selectedPlayerId) {
            toast.error('Veuillez sélectionner un joueur');
            return;
        }
        assignPlayer({ teamId, playerId: Number(selectedPlayerId) });
    };

    // Filtrer les joueurs qui ne sont pas déjà dans l'équipe
    const availablePlayers =
        (allPlayers || [])?.filter((player) => !(team?.players || []).some((p) => p.id === player.id)) || [];

    if (isLoadingTeam) {
        return (
            <div className='space-y-6'>
                <Skeleton className='h-10 w-48' />
                <Skeleton className='h-64' />
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
            <Button variant='ghost' onClick={() => router.push('/teams')}>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Retour aux équipes
            </Button>

            <EntityHeader
                title={team.name}
                description={team.description || 'Aucune description'}
                icon={<Trophy className='h-8 w-8 text-primary' />}
                image={<EntityImage imageUrl={team.logoUrl ?? null} name={team.name} size='lg' />}
                onEdit={() => router.push(`/teams/${teamId}/edit`)}
                onDelete={() => setShowDeleteDialog(true)}
            />

            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                <StatCard title='Jeu' value={getSportName(team.sportId)} icon={Trophy}>
                    <div className='flex items-center gap-3'>
                        <div className='h-10 w-10 overflow-hidden rounded flex-shrink-0'>
                            <img
                                src={
                                    getSportImageUrl(`${formatSportNameForImage(getSportName(team.sportId))}.png`) || ''
                                }
                                alt={getSportName(team.sportId)}
                                className='w-full h-full object-cover'
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        </div>
                        <div className='text-2xl font-bold'>{getSportName(team.sportId)}</div>
                    </div>
                </StatCard>

                <StatCard
                    title='Joueurs'
                    value={team.players?.length || 0}
                    description={team.players?.length === 0 ? 'Aucun joueur' : "Joueur(s) dans l'équipe"}
                    icon={Users}
                />

                <StatCard
                    title='Questionnaires'
                    value={team.questionnaires?.length || 0}
                    description={
                        team.questionnaires?.length === 0 ? 'Aucun questionnaire' : 'Questionnaire(s) associé(s)'
                    }
                    icon={UserCircle}
                />
            </div>

            <Card>
                <CardHeader>
                    <div className='flex justify-between items-center'>
                        <div>
                            <CardTitle>Roster de l'équipe</CardTitle>
                            <CardDescription>Liste des joueurs de l'équipe</CardDescription>
                        </div>
                        <Button onClick={() => setShowAssignDialog(true)}>
                            <UserPlus className='mr-2 h-4 w-4' />
                            Ajouter un joueur
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {!team.players || team.players.length === 0 ? (
                        <div className='flex flex-col items-center justify-center py-12 text-center'>
                            <Users className='h-12 w-12 text-muted-foreground mb-4' />
                            <p className='text-lg font-semibold mb-2'>Aucun joueur dans l'équipe</p>
                            <p className='text-sm text-muted-foreground mb-4'>
                                Commencez par ajouter des joueurs à cette équipe
                            </p>
                            <Button onClick={() => setShowAssignDialog(true)}>
                                <UserPlus className='mr-2 h-4 w-4' />
                                Ajouter un joueur
                            </Button>
                        </div>
                    ) : (
                        <div className='space-y-3'>
                            {displayedPlayers.map((player) => (
                                <PlayerRow
                                    key={player.id}
                                    player={player}
                                    positionName={getPositionName(player.positionId)}
                                    sportName={team.sportId ? getSportName(team.sportId) : null}
                                    onRemove={() =>
                                        setPlayerToRemove({
                                            id: player.id,
                                            name: player.nickName || `${player.firstName} ${player.lastName}`,
                                        })
                                    }
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {team.club && (
                <Card>
                    <CardHeader>
                        <CardTitle>Informations du club</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-2'>
                            <div>
                                <p className='text-sm font-medium'>Nom du club</p>
                                <p className='text-sm text-muted-foreground'>{team.club.name}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <AlertDialog open={!!playerToRemove} onOpenChange={() => setPlayerToRemove(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Retirer le joueur</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir retirer {playerToRemove?.name} de l'équipe ?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isRemovingPlayer}>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (playerToRemove) {
                                    removePlayer({ teamId, playerId: playerToRemove.id });
                                }
                            }}
                            disabled={isRemovingPlayer}
                            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                        >
                            {isRemovingPlayer && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                            Retirer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <DeleteConfirmDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                title='Confirmer la suppression'
                description="Êtes-vous sûr de vouloir supprimer cette équipe ? Cette action est irréversible. Tous les joueurs seront retirés de l'équipe."
                onConfirm={() => deleteTeam({ id: teamId })}
                isDeleting={isDeleting}
            />

            <AssignPlayerDialog
                open={showAssignDialog}
                onOpenChange={setShowAssignDialog}
                availablePlayers={availablePlayers}
                selectedPlayerId={selectedPlayerId}
                onPlayerChange={setSelectedPlayerId}
                onAssign={handleAssignPlayer}
                isAssigning={isAssigning}
            />
        </div>
    );
}
