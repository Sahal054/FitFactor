import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import OnlineCoaching from '../components/OnlineCoaching';
import DailyLiveWorkouts from '../components/DailyLiveWorkouts';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import CommunityCarousel from '../components/CommunityCarousel';
import Consultation from '../components/Consultation';
import OfferPopup from '../components/OfferPopup';
import Reveal from '../components/Reveal';
import Seo from '../components/Seo';
import { mockHomePageData } from '../data/mockdata';
import { api, USE_MOCK_API } from '../services/api';
import { scrollToSection } from '../utils/scrollToSection';

export default function Home({ siteSettings, offer }) {
  const location = useLocation();
  const [pageData, setPageData] = useState(USE_MOCK_API ? mockHomePageData : null);
  const [liveSessionData, setLiveSessionData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    api
      .getHomePageData()
      .then((homeData) => {
        if (!isMounted) {
          return;
        }

        setPageData(homeData);
      })
      .catch((error) => {
        console.error('Failed to load home page content.', error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadLiveSession = () => {
      api
        .getDailyLiveSessionData()
        .then((liveSessionResponse) => {
          if (isMounted) {
            setLiveSessionData(liveSessionResponse);
          }
        })
        .catch((error) => {
          console.error('Failed to load live session data.', error);
        });
    };

    loadLiveSession();

    const intervalId = window.setInterval(loadLiveSession, 30000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (location.hash !== '#daily-live-section') {
      return;
    }

    const timer = window.setTimeout(() => {
      scrollToSection('daily-live-section');
    }, 120);

    return () => {
      window.clearTimeout(timer);
    };
  }, [location.hash, liveSessionData]);

  if (!pageData) {
    return (
      <section className="py-24 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">Loading home page...</p>
      </section>
    );
  }

  return (
    <>
      <Seo
        title="Fitness for Every Body"
        description="FitFactor is a results-driven gym in Kollam offering strength training, online coaching, pricing plans, and daily live workout sessions."
        path="/"
      />

      <OfferPopup offer={offer} />

      <Hero content={pageData.hero} whatsappUrl={siteSettings.contact.whatsappUrl} />

      <Reveal width="100%">
        <OnlineCoaching content={pageData.onlineCoaching} />
      </Reveal>

      <Reveal width="100%">
        <DailyLiveWorkouts content={pageData.dailyLiveWorkouts} session={liveSessionData?.session} />
      </Reveal>

      <Reveal width="100%">
        <Features content={pageData.features} />
      </Reveal>

      <Reveal width="100%">
        <Testimonials content={pageData.testimonials} />
      </Reveal>

      <Reveal width="100%">
        <CommunityCarousel content={pageData.communityCarousel} />
      </Reveal>

      <Reveal width="100%">
        <Consultation
          content={pageData.consultationSection}
          consultationGoals={siteSettings.consultationGoals}
        />
      </Reveal>
    </>
  );
}
