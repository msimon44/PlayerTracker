'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { usePlayersControllerFindAll } from '@/lib/generated/players/players';
import { useQuestionnairesControllerFindAll } from '@/lib/generated/questionnaires/questionnaires';
import { useTeamsControllerFindAll } from '@/lib/generated/teams/teams';
import { ChevronRight, ClipboardList, TrendingUp, UserCircle, Users } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const { user, isLoading } = useAuth();

    // Récupérer les statistiques
    const clubId = user?.staff?.clubId || user?.player?.clubId;

    const { data: players, isLoading: isLoadingPlayers } = usePlayersControllerFindAll(
        { clubId },
        {
            query: {
                enabled: !!clubId,
            },
        },
    );

    const { data: teams, isLoading: isLoadingTeams } = useTeamsControllerFindAll(
        { clubId },
        {
            query: {
                enabled: !!clubId,
            },
        },
    );

    const { data: questionnaires, isLoading: isLoadingQuestionnaires } = useQuestionnairesControllerFindAll(
        { clubId },
        {
            query: {
                enabled: !!clubId,
            },
        },
    );

    // Calculer les statistiques
    const playersCount = Array.isArray(players) ? players.length : 0;
    const teamsCount = Array.isArray(teams) ? teams.length : 0;
    const questionnairesCount = Array.isArray(questionnaires) ? questionnaires.length : 0;
    const metricsCount = 0;

    // Obtenir le nom complet de l'utilisateur
    const getUserName = () => {
        if (user?.staff) {
            const firstName = user.staff.firstName || '';
            const lastName = user.staff.lastName || '';
            return `${firstName} ${lastName}`.trim() || user.email;
        }
        if (user?.player) {
            const firstName = user.player.firstName || '';
            const lastName = user.player.lastName || '';
            return `${firstName} ${lastName}`.trim() || user.email;
        }
        return user?.email || '';
    };

    if (isLoading) {
        return (
            <div className='flex items-center justify-center'>
                <p>Chargement...</p>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            <div>
                <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
                <p className='text-muted-foreground'>Bienvenue {getUserName()}</p>
            </div>

            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                <Link href='/players' className='block'>
                    <Card className='cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md'>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>Total Joueurs</CardTitle>
                            <div className='flex items-center gap-2'>
                                <Users className='h-4 w-4 text-muted-foreground' />
                                <ChevronRight className='h-4 w-4 text-muted-foreground' />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>{isLoadingPlayers ? '...' : playersCount}</div>
                            <p className='text-xs text-muted-foreground'>
                                {playersCount === 0
                                    ? 'Aucun joueur pour le moment'
                                    : `${playersCount} joueur${playersCount > 1 ? 's' : ''} enregistré${playersCount > 1 ? 's' : ''}`}
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href='/teams' className='block'>
                    <Card className='cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md'>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>Total Équipes</CardTitle>
                            <div className='flex items-center gap-2'>
                                <UserCircle className='h-4 w-4 text-muted-foreground' />
                                <ChevronRight className='h-4 w-4 text-muted-foreground' />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>{isLoadingTeams ? '...' : teamsCount}</div>
                            <p className='text-xs text-muted-foreground'>
                                {teamsCount === 0
                                    ? 'Aucune équipe pour le moment'
                                    : `${teamsCount} équipe${teamsCount > 1 ? 's' : ''} active${teamsCount > 1 ? 's' : ''}`}
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href='/questionnaires' className='block'>
                    <Card className='cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md'>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>Questionnaires</CardTitle>
                            <div className='flex items-center gap-2'>
                                <ClipboardList className='h-4 w-4 text-muted-foreground' />
                                <ChevronRight className='h-4 w-4 text-muted-foreground' />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>
                                {isLoadingQuestionnaires ? '...' : questionnairesCount}
                            </div>
                            <p className='text-xs text-muted-foreground'>
                                {questionnairesCount === 0
                                    ? 'Aucun questionnaire actif'
                                    : `${questionnairesCount} questionnaire${questionnairesCount > 1 ? 's' : ''} disponible${questionnairesCount > 1 ? 's' : ''}`}
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href='/metrics' className='block'>
                    <Card className='cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md'>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>Métriques</CardTitle>
                            <div className='flex items-center gap-2'>
                                <TrendingUp className='h-4 w-4 text-muted-foreground' />
                                <ChevronRight className='h-4 w-4 text-muted-foreground' />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className='text-xs text-muted-foreground'>
                                {metricsCount === 0
                                    ? 'Aucune métrique enregistrée'
                                    : `${metricsCount} métrique${metricsCount > 1 ? 's' : ''} suivie${metricsCount > 1 ? 's' : ''}`}
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
                <Card className='col-span-4'>
                    <CardHeader>
                        <CardTitle>Vue d&apos;ensemble</CardTitle>
                        <CardDescription>Statistiques et activités récentes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className='text-sm text-muted-foreground'>Fonctionnalité à venir...</p>
                    </CardContent>
                </Card>

                <Card className='col-span-3'>
                    <CardHeader>
                        <CardTitle>Informations de compte</CardTitle>
                        <CardDescription>Détails de votre profil</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='space-y-1'>
                            <p className='text-sm font-medium'>Email</p>
                            <p className='text-sm text-muted-foreground'>{user?.email}</p>
                        </div>
                        <div className='space-y-1'>
                            <p className='text-sm font-medium'>Rôle</p>
                            <p className='text-sm text-muted-foreground'>{user?.role}</p>
                        </div>
                        <div className='space-y-1'>
                            <p className='text-sm font-medium'>Email vérifié</p>
                            <p className='text-sm text-muted-foreground'>{user?.isEmailVerified ? 'Oui' : 'Non'}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
