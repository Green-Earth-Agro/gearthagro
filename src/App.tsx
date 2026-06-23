import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { WhatWeDo } from './components/WhatWeDo';
import { OurModel } from './components/OurModel';
import { LandLeasing } from './components/LandLeasing';
import { Biomass } from './components/Biomass';
import { Impact } from './components/Impact';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { useScrollReveal } from './hooks/useScrollReveal';

function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return hash;
}

export default function App() {
  useScrollReveal();
  const hash = useHashRoute();
  const isPrivacy = hash === '#/privacy';
  const isTerms = hash === '#/terms';

  useEffect(() => {
    if (isPrivacy || isTerms) window.scrollTo(0, 0);
  }, [isPrivacy, isTerms]);

  if (isPrivacy) {
    return (
      <>
        <PrivacyPolicy />
        <Footer />
      </>
    );
  }

  if (isTerms) {
    return (
      <>
        <TermsOfService />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhatWeDo />
        <OurModel />
        <LandLeasing />
        <Biomass />
        <Impact />
        <Contact />
      </main>
      <ScrollToTopButton />
      <Footer />
    </>
  );
}
