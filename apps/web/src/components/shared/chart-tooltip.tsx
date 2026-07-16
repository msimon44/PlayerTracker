import type { ReactNode } from 'react';

type ChartTooltipContentProps = {
    active?: boolean;
    payload?: Array<{
        color?: string;
        dataKey?: string | number;
        name?: string | number;
        value?: unknown;
        payload?: Record<string, unknown>;
    }>;
    label?: ReactNode;
    labels?: Record<string, string>;
    units?: Record<string, string>;
};

function formatValue(value: unknown, unit?: string) {
    const numericValue = typeof value === 'number' ? value : Number(value);
    const formatted = Number.isFinite(numericValue)
        ? Number.isInteger(numericValue)
            ? String(numericValue)
            : numericValue.toFixed(1)
        : String(value ?? '-');

    if (!unit) return formatted;
    if (unit.startsWith('/')) return `${formatted}${unit}`;
    return `${formatted} ${unit}`;
}

export function ChartTooltipContent({ active, payload, label, labels = {}, units = {} }: ChartTooltipContentProps) {
    if (!active || !Array.isArray(payload) || payload.length === 0) return null;

    const visiblePayload = payload.filter((entry) => entry.value !== undefined && entry.value !== null);
    if (visiblePayload.length === 0) return null;

    return (
        <div className='min-w-48 rounded-md border bg-background/95 p-3 text-sm shadow-lg backdrop-blur'>
            {label && <div className='mb-2 font-medium text-foreground'>{label}</div>}
            <div className='space-y-1.5'>
                {visiblePayload.map((entry) => {
                    const key = String(entry.dataKey ?? entry.name ?? '');
                    const payloadUnit = entry.payload?.['unit'];
                    const unit = units[key] ?? (typeof payloadUnit === 'string' ? payloadUnit : undefined);

                    return (
                        <div key={key} className='flex items-center justify-between gap-4'>
                            <div className='flex min-w-0 items-center gap-2'>
                                <span
                                    className='h-2.5 w-2.5 shrink-0 rounded-full'
                                    style={{ backgroundColor: entry.color || '#475569' }}
                                />
                                <span className='truncate text-muted-foreground'>
                                    {labels[key] ?? entry.name ?? key}
                                </span>
                            </div>
                            <span className='font-semibold text-foreground'>{formatValue(entry.value, unit)}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
