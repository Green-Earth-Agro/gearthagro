import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { WhatWeDo } from './components/WhatWeDo';
import { OurModel } from './components/OurModel';
import { Biomass } from './components/Biomass';
import { Impact } from './components/Impact';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { useScrollReveal } from './hooks/useScrollReveal';

export default function App() {
  useScrollReveal();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhatWeDo />
        <OurModel />
        <Biomass />
        <Impact />
        <Contact />
      </main>
      <ScrollToTopButton />
      <Footer />
    </>
  );
}
