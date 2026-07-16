import { EntityImage } from '@/components/shared/entity-image';
import { SportBadge } from '@/components/shared/sport-badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, UserCircle, Users } from 'lucide-react';

type TeamCardProps = {
    team: {
        id: number;
        name: string;
        logoUrl?: string | null;
        sportId: number;
        _count?: {
            players?: number;
            questionnaires?: number;
        };
    };
    sportName: string;
    onClick: () => void;
};

export function TeamCard({ team, sportName, onClick }: TeamCardProps) {
    return (
        <Card className='hover:shadow-lg hover:bg-secondary/10 transition-all cursor-pointer' onClick={onClick}>
            <CardHeader>
                <div className='flex items-start justify-between'>
                    <div className='flex items-start gap-3 flex-1'>
                        <EntityImage imageUrl={team.logoUrl ?? null} name={team.name} size='md' />
                        <div className='flex-1'>
                            <CardTitle className='flex items-center gap-2'>
                                <Trophy className='h-5 w-5 text-primary' />
                                {team.name}
                            </CardTitle>
                            <CardDescription className='mt-2'>
                                <SportBadge sportName={sportName} size='sm' showLabel={true} />
                            </CardDescription>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className='space-y-3'>
                    <div className='flex items-center justify-between text-sm'>
                        <div className='flex items-center gap-2 text-muted-foreground'>
                            <Users className='h-4 w-4' />
                            <span>Joueurs</span>
                        </div>
                        <span className='font-semibold'>{team._count?.players || 0}</span>
                    </div>

                    <div className='flex items-center justify-between text-sm'>
                        <div className='flex items-center gap-2 text-muted-foreground'>
                            <UserCircle className='h-4 w-4' />
                            <span>Questionnaires</span>
                        </div>
                        <span className='font-semibold'>{team._count?.questionnaires || 0}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
