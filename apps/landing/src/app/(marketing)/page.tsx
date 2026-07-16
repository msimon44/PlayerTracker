import TestimonialsSection from '@/components/landing/testimonials-section';
import CallToActionSection from '@/components/landing/cta-section';
import HowItWorksSection from '@/components/landing/howItWork-section';
import HeroSection from '@/components/landing/hero-section';
import Pricing from '@/components/landing/pricing';
import Particles from '@/components/magicui/particles';
import SolutionSection from '@/components/landing/solution-section';
import ProblemSection from '@/components/landing/problem-section';

export default async function Page(): Promise<React.JSX.Element> {
    return (
        <>
            <HeroSection />
            <div className='h-32' />
            <ProblemSection />
            <SolutionSection />
            <HowItWorksSection />
            <div className='h-24' />
            <TestimonialsSection />
            <Pricing />
            <CallToActionSection />
            <Particles
                className='absolute inset-0 -z-10'
                quantity={50}
                ease={70}
                size={0.05}
                staticity={40}
                color={'#ffffff'}
            />
        </>
    );
}
