import type { LucideIcon } from 'lucide-react';
import { Activity, Dumbbell, Flame, Gamepad2, HeartPulse, Moon, Smile, Utensils } from 'lucide-react';

type RadarCategoryTickProps = {
    x?: number;
    y?: number;
    cx?: number;
    cy?: number;
    payload?: {
        value?: string | number;
    };
};

const categoryIcons: Array<{ patterns: string[]; icon: LucideIcon }> = [
    { patterns: ['sommeil', 'sleep'], icon: Moon },
    { patterns: ['repas', 'nutrition', 'meal'], icon: Utensils },
    { patterns: ['sport', 'physique', 'physical'], icon: Dumbbell },
    { patterns: ['motivation'], icon: Flame },
    { patterns: ['parties', 'game', 'jeu'], icon: Gamepad2 },
    { patterns: ['ressenti', 'sent', 'wellness', 'feeling'], icon: Smile },
    { patterns: ['apres match', 'après match', 'post match', 'match'], icon: HeartPulse },
    { patterns: ['forme', 'activity'], icon: Activity },
];

function normalizeLabel(label: string) {
    return label
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

function getCategoryIcon(label: string) {
    const normalizedLabel = normalizeLabel(label);
    return categoryIcons.find(({ patterns }) => patterns.some((pattern) => normalizedLabel.includes(pattern)))?.icon;
}

function getTickPosition(x: number, y: number, cx: number | undefined, cy: number | undefined, distance: number) {
    if (cx === undefined || cy === undefined) return { x, y };

    const dx = x - cx;
    const dy = y - cy;
    const length = Math.hypot(dx, dy);

    if (length === 0) return { x, y };

    return {
        x: x + (dx / length) * distance,
        y: y + (dy / length) * distance,
    };
}

export function RadarCategoryTick({ x = 0, y = 0, cx, cy, payload }: RadarCategoryTickProps) {
    const label = String(payload?.value ?? '');
    const Icon = getCategoryIcon(label);
    const tick = getTickPosition(x, y, cx, cy, 18);
    const iconSize = 22;
    const hitBoxSize = 30;

    if (!Icon) {
        return (
            <text x={tick.x} y={tick.y} dy={4} textAnchor='middle' className='fill-muted-foreground text-[11px]'>
                {label}
            </text>
        );
    }

    return (
        <g transform={`translate(${tick.x}, ${tick.y})`}>
            <title>{label}</title>
            <svg
                x={-hitBoxSize / 2}
                y={-hitBoxSize / 2}
                width={hitBoxSize}
                height={hitBoxSize}
                viewBox={`0 0 ${hitBoxSize} ${hitBoxSize}`}
                overflow='visible'
            >
                <Icon
                    x={(hitBoxSize - iconSize) / 2}
                    y={(hitBoxSize - iconSize) / 2}
                    size={iconSize}
                    strokeWidth={2.15}
                    className='stroke-muted-foreground'
                />
            </svg>
        </g>
    );
}
