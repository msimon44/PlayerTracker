import { formatSportNameForImage } from '@/lib/image-utils';
import { getSportImageUrl } from '@/lib/utils';

type SportBadgeProps = {
    sportName: string;
    size?: 'sm' | 'md';
    showLabel?: boolean;
    className?: string;
};

const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
};

export function SportBadge({ sportName, size = 'md', showLabel = true, className = '' }: SportBadgeProps) {
    const sizeClass = sizeClasses[size];

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className={`${sizeClass} overflow-hidden rounded flex-shrink-0`}>
                <img
                    src={getSportImageUrl(`${formatSportNameForImage(sportName)}.png`) || ''}
                    alt={sportName}
                    className='w-full h-full object-cover'
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                    }}
                />
            </div>
            {showLabel && <span className='text-sm font-medium'>{sportName}</span>}
        </div>
    );
}
