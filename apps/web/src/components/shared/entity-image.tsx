import { getTeamImageUrl } from '@/lib/utils';

type EntityImageProps = {
    imageUrl?: string | null;
    name: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    shape?: 'square' | 'circle';
    className?: string;
    type?: 'team' | 'player' | 'sport' | 'position'; // Type d'entité pour déterminer le préfixe d'URL
};

const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-12 w-12 text-sm',
    lg: 'h-16 w-16 text-xl',
    xl: 'h-24 w-24 text-2xl',
};

export function EntityImage({
    imageUrl,
    name,
    size = 'md',
    shape = 'square',
    className = '',
    type: _type = 'team',
}: EntityImageProps) {
    const sizeClass = sizeClasses[size];
    const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded';

    if (imageUrl) {
        // Pour l'instant, on ne gère que les teams car c'est l'utilisation actuelle
        // Si nécessaire, on pourra étendre avec un switch/case sur type
        return (
            <div className={`${sizeClass} ${shapeClass} overflow-hidden flex-shrink-0 ${className}`}>
                <img src={getTeamImageUrl(imageUrl) || ''} alt={name} className='w-full h-full object-cover' />
            </div>
        );
    }

    return (
        <div
            className={`${sizeClass} ${shapeClass} bg-primary/10 text-primary flex items-center justify-center font-semibold flex-shrink-0 ${className}`}
        >
            {name.substring(0, 2).toUpperCase()}
        </div>
    );
}
