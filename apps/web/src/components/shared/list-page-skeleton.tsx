import { Skeleton } from '@/components/ui/skeleton';

type ListPageSkeletonProps = {
    showSearch?: boolean;
    gridCols?: number;
    itemCount?: number;
};

export function ListPageSkeleton({ showSearch = false, gridCols = 3, itemCount = 6 }: ListPageSkeletonProps) {
    const gridClass =
        gridCols === 2 ? 'md:grid-cols-1 lg:grid-cols-2' : gridCols === 3 ? 'md:grid-cols-2 lg:grid-cols-3' : '';

    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <Skeleton className='h-10 w-48' />
                <Skeleton className='h-10 w-32' />
            </div>
            {showSearch && <Skeleton className='h-10 w-full' />}
            <div className={`grid gap-4 ${gridClass}`}>
                {[...Array(itemCount)].map((_, i) => (
                    <Skeleton key={i} className='h-48' />
                ))}
            </div>
        </div>
    );
}
