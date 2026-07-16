import { formatRoleNameForImage, formatSportNameForImage } from '@/lib/image-utils';
import { getPositionImageUrl } from '@/lib/utils';

type RoleBadgeProps = {
    sportName: string;
    roleName: string;
};

export function RoleBadge({ sportName, roleName }: RoleBadgeProps) {
    return (
        <div className='flex items-center gap-2'>
            <div className='h-8 w-8 overflow-hidden rounded flex-shrink-0'>
                <img
                    src={
                        getPositionImageUrl(
                            `${formatSportNameForImage(sportName)}_${formatRoleNameForImage(roleName)}.png`,
                        ) || ''
                    }
                    alt={roleName}
                    className='w-full h-full object-cover'
                    onError={(e) => {
                        e.currentTarget.parentElement!.innerHTML = `<span class='flex items-center justify-center h-full text-xs font-medium'>${roleName}</span>`;
                    }}
                />
            </div>
            <span className='text-sm font-medium'>{roleName}</span>
        </div>
    );
}
