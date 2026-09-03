import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { UseCases } from "@/components/UseCases";
import { Pricing } from "@/components/Pricing";
import { Hardware } from "@/components/Hardware";
import { Footer } from "@/components/Footer";
import Step from "@/components/Step";

const Index = () => {
  return (
    <main
      id="main-scroll"
      className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-[#EAEAF4]"
    >
      {/* <Navbar /> */}
      <section className="min-h-screen w-full snap-start">
        <Hero />
      </section>

      <section id="step" className="min-h-screen w-full snap-start">
        <Step />
      </section>

      <section id="features" className="min-h-screen w-full snap-start">
        <Features />
      </section>

      <section className="min-h-screen w-full snap-start">
        <UseCases />
      </section>

      <section id="pricing" className="min-h-screen w-full snap-start">
        <Pricing />
      </section>

      <section id="hardware" className="min-h-screen w-full snap-start">
        <Hardware />
      </section>

      <section className="min-h-screen w-full snap-start">
        <Footer />
      </section>
    </main>
  );
};

export default Index;
