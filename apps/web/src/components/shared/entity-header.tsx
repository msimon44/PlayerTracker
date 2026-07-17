import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { ReactNode } from 'react';

type EntityHeaderProps = {
    title: string;
    description?: string | null;
    icon?: ReactNode;
    image?: ReactNode;
    onEdit?: () => void;
    onDelete?: () => void;
    children?: ReactNode;
};

export function EntityHeader({ title, description, icon, image, onEdit, onDelete, children }: EntityHeaderProps) {
    return (
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
            <div className='flex items-start gap-4'>
                {image}
                <div>
                    <h1 className='text-3xl font-bold tracking-tight flex items-center gap-2'>
                        {icon}
                        {title}
                    </h1>
                    {description && <p className='text-muted-foreground mt-1'>{description}</p>}
                    {children}
                </div>
            </div>
            {(onEdit || onDelete) && (
                <div className='flex gap-2'>
                    {onEdit && (
                        <Button variant='outline' size='icon' onClick={onEdit} aria-label='Modifier'>
                            <Edit className='h-4 w-4' aria-hidden='true' />
                        </Button>
                    )}
                    {onDelete && (
                        <Button variant='destructive' size='icon' onClick={onDelete} aria-label='Supprimer'>
                            <Trash2 className='h-4 w-4' aria-hidden='true' />
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
