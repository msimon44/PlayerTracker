import Features from '@/components/features-vertical';
import Section from '@/components/section';
import { Sparkles, Upload, Zap } from 'lucide-react';

const data = [
    {
        id: 1,
        title: '1. Ajoutez vos données',
        content: 'Créez vos équipes, paramétrez les questionnaires et commencez à collecter les réponses des joueurs.',
        image: '/liste_joueur.png',
        icon: <Upload className='w-6 h-6 text-primary' />,
    },
    {
        id: 2,
        title: '2. Lancez l’analyse',
        content:
            'Grâce à notre système d’analyse intelligent, les données sont traitées en temps réel pour détecter les signaux d’alerte : fatigue, surcharge, risques de blessure… Plus besoin de passer des heures à tout éplucher !',
        image: '/hero-dark.png',
        icon: <Zap className='w-6 h-6 text-primary' />,
    },
    {
        id: 3,
        title: '3. Agissez efficacement',
        content:
            'Recevez des rapports clairs, visualisez les indicateurs clés, et prenez les bonnes décisions pour ajuster les entraînements, prévenir les blessures et booster la performance collective.',
        image: '/hero-dark.png',
        icon: <Sparkles className='w-6 h-6 text-primary' />,
    },
];

export default function Component(): React.ReactElement {
    return (
        <Section subtitle='Suivre et optimiser vos joueurs n’a jamais été aussi simple'>
            <Features data={data} />
        </Section>
    );
}
