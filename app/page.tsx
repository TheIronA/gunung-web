import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import WhatWeDo from "@/components/WhatWeDo";
import About from "@/components/About";
import Problem from "@/components/Problem";
import Opportunity from "@/components/Opportunity";
import Mission from "@/components/Mission";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <WhatWeDo />
      <About />
      <Problem />
      <Opportunity />
      <Mission />
      <Contact />
      <Footer />
    </main>
  );
}
