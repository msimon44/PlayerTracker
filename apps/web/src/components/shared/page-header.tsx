import { ReactNode } from 'react';

type PageHeaderProps = {
    title: string;
    description: string;
    action?: ReactNode;
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
    return (
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
            <div>
                <h1 className='text-3xl font-bold tracking-tight'>{title}</h1>
                <p className='text-muted-foreground'>{description}</p>
            </div>
            {action}
        </div>
    );
}
