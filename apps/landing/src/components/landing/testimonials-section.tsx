import { cn } from '@/lib/utils';
import Marquee from '@/components/magicui/marquee1';
import { Icons } from '@/components/icons';

const reviews = [
    {
        name: 'Jean Dupont',
        username: 'Coach NRC',
        body: "Cette application a complètement changé notre approche de la gestion de l'entraînement.",
    },
    {
        name: 'Pierre Martin',
        username: 'Joueur1 NRC',
        body: 'Un outil indispensable pour suivre mon état de forme au quotidien.',
    },
    {
        name: 'Antoine Leroy',
        username: 'Joueur2 NRC',
        body: "L'interface est fluide et simple, je peux voir mes progrès en un clin d'œil !",
    },
    {
        name: 'Sophie Bernard',
        username: 'Préparatrice Physique',
        body: 'Grâce à cet outil, nous avons pu anticiper les risques de blessures et ajuster les entraînements.',
    },
    {
        name: 'Lucas Fontaine',
        username: 'Entraîneur NRC',
        body: 'Enfin une solution qui permet un suivi précis et personnalisé de chaque joueur.',
    },
    {
        name: 'Mathieu Dubois',
        username: 'Joueur3 NRC',
        body: "Depuis que j'utilise cette application, je ressens une vraie différence dans ma récupération et mes performances.",
    },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({ name, username, body }: { name: string; username: string; body: string }) => {
    return (
        <figure
            className={cn(
                'relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border border-border bg-card p-4',
                'hover:bg-primary/10 transition-colors',
            )}
        >
            <div className='flex flex-row items-center gap-2'>
                <div className='flex items-center justify-center w-8 h-8 rounded-full bg-primary/10'>
                    <Icons.user className='w-5 h-5 text-primary' />
                </div>
                <div className='flex flex-col'>
                    <figcaption className='text-sm font-medium text-foreground'>{name}</figcaption>
                    <p className='text-xs font-medium text-muted-foreground'>{username}</p>
                </div>
            </div>
            <blockquote className='mt-2 text-sm text-muted-foreground'>{body}</blockquote>
        </figure>
    );
};

export default function MarqueeDemo(): React.ReactElement {
    return (
        <div className='relative flex w-full flex-col items-center justify-center overflow-hidden py-14'>
            <h2 className='text-4xl font-bold mb-8 text-center text-foreground'>TÉMOIGNAGES ET AVIS</h2>
            <Marquee pauseOnHover className='[--duration:20s]'>
                {firstRow.map((review) => (
                    <ReviewCard key={review.username} {...review} />
                ))}
            </Marquee>
            <Marquee reverse pauseOnHover className='[--duration:20s]'>
                {secondRow.map((review) => (
                    <ReviewCard key={review.username} {...review} />
                ))}
            </Marquee>
            <div className='pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background'></div>
            <div className='pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background'></div>
        </div>
    );
}
