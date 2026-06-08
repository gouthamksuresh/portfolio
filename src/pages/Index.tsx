import { useReveal } from "@/hooks/useReveal";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Credentials } from "@/components/sections/Credentials";
import { Availability } from "@/components/sections/Availability";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { AiChatWidget } from "@/components/AiChatWidget";
import { CommandPalette } from "@/components/CommandPalette";
import { JsonLd } from "@/components/JsonLd";

const Index = () => {
  useReveal();
  return (
    <div className="min-h-screen">
      <JsonLd />
      <ScrollProgress />
      <CommandPalette />
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Credentials />
        <Availability />
        <Contact />
      </main>
      <Footer />
      <AiChatWidget />
    </div>
  );
};

export default Index;
