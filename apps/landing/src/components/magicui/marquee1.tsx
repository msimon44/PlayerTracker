import type React from 'react';
import { cn } from '@/lib/utils';
import type { ComponentPropsWithoutRef } from 'react';

interface MarqueeProps extends Readonly<ComponentPropsWithoutRef<'div'>> {
    /**
     * Optional CSS class name to apply custom styles
     */
    readonly className?: string;
    /**
     * Whether to reverse the animation direction
     * @default false
     */
    readonly reverse?: boolean;
    /**
     * Whether to pause the animation on hover
     * @default false
     */
    readonly pauseOnHover?: boolean;
    /**
     * Content to be displayed in the marquee
     */
    readonly children: React.ReactNode;
    /**
     * Whether to animate vertically instead of horizontally
     * @default false
     */
    readonly vertical?: boolean;
    /**
     * Number of times to repeat the content
     * @default 4
     */
    readonly repeat?: number;
}

export default function Marquee({
    className,
    reverse = false,
    pauseOnHover = false,
    children,
    vertical = false,
    repeat = 4,
    ...props
}: MarqueeProps): React.ReactElement {
    return (
        <div
            {...props}
            className={cn(
                'group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]',
                {
                    'flex-row': !vertical,
                    'flex-col': vertical,
                },
                className,
            )}
        >
            {Array(repeat)
                .fill(0)
                .map((_, i) => (
                    <div
                        key={i}
                        className={cn('flex shrink-0 justify-around [gap:var(--gap)]', {
                            'animate-marquee flex-row': !vertical,
                            'animate-marquee-vertical flex-col': vertical,
                            'group-hover:[animation-play-state:paused]': pauseOnHover,
                            '[animation-direction:reverse]': reverse,
                        })}
                    >
                        {children}
                    </div>
                ))}
        </div>
    );
}
