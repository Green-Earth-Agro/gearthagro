import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WhatWeDo } from './components/WhatWeDo';
import { OurModel } from './components/OurModel';
import { Biomass } from './components/Biomass';
import { Impact } from './components/Impact';
import { Gallery } from './components/Gallery';
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
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
