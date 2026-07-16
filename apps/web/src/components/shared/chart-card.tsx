import type { ReactNode } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type ChartCardProps = {
    title: ReactNode;
    description?: ReactNode;
    children: ReactNode;
    className?: string;
    contentClassName?: string;
};

export function ChartCard({ title, description, children, className, contentClassName }: ChartCardProps) {
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className='text-xl'>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent className={cn('h-80', contentClassName)}>{children}</CardContent>
        </Card>
    );
}
