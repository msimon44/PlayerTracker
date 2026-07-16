import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

type Player = {
    id: number;
    firstName: string;
    lastName: string;
    nickName?: string | null;
    isActive: boolean;
};

type AssignPlayerDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    availablePlayers: Player[];
    selectedPlayerId: string;
    onPlayerChange: (playerId: string) => void;
    onAssign: () => void;
    isAssigning: boolean;
};

export function AssignPlayerDialog({
    open,
    onOpenChange,
    availablePlayers,
    selectedPlayerId,
    onPlayerChange,
    onAssign,
    isAssigning,
}: AssignPlayerDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ajouter un joueur à l'équipe</DialogTitle>
                    <DialogDescription>Sélectionnez un joueur de votre club à ajouter à cette équipe</DialogDescription>
                </DialogHeader>
                <div className='space-y-4 py-4'>
                    {availablePlayers.length === 0 ? (
                        <div className='text-center py-4'>
                            <p className='text-sm text-muted-foreground'>
                                Aucun joueur disponible. Tous les joueurs sont déjà dans l'équipe.
                            </p>
                        </div>
                    ) : (
                        <>
                            <Select value={selectedPlayerId} onValueChange={onPlayerChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Sélectionner un joueur' />
                                </SelectTrigger>
                                <SelectContent>
                                    {availablePlayers.map((player) => (
                                        <SelectItem key={player.id} value={String(player.id)}>
                                            {player.nickName || `${player.firstName} ${player.lastName}`}
                                            {player.isActive && ' (Actif)'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div className='flex justify-end gap-2'>
                                <Button variant='outline' onClick={() => onOpenChange(false)} disabled={isAssigning}>
                                    Annuler
                                </Button>
                                <Button onClick={onAssign} disabled={isAssigning || !selectedPlayerId}>
                                    {isAssigning && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                                    Ajouter
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
