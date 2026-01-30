import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import WhatWeDo from "@/components/WhatWeDo";
import About from "@/components/About";
import Problem from "@/components/Problem";
import Opportunity from "@/components/Opportunity";
import Mission from "@/components/Mission";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { generateOrganizationSchema, generateWebsiteSchema } from "@/lib/seo";

export default function Home() {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
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
    </>
  );
}
