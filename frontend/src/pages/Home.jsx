import Hero from '../components/Hero';
import OnlineCoaching from '../components/OnlineCoaching';
import DailyLiveWorkouts from '../components/DailyLiveWorkouts';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import CommunityCarousel from '../components/CommunityCarousel';
import Consultation from '../components/Consultation';
import Reveal from '../components/Reveal';

export default function Home() {
    return (
        <>
            <Hero />

            <Reveal width="100%">
                <OnlineCoaching />
            </Reveal>

            <Reveal width="100%">
                <DailyLiveWorkouts />
            </Reveal>

            <Reveal width="100%">
                <Features />
            </Reveal>

            <Reveal width="100%">
                <Testimonials />
            </Reveal>

            <Reveal width="100%">
                <CommunityCarousel />
            </Reveal>

            <Reveal width="100%">
                <Consultation />
            </Reveal>
        </>
    );
}
