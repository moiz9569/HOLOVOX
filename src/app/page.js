// SCHEMA-AUTO-FIX-START
// ✅ Schema.org JSON-LD injected
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "url": "https://holovox-jade.vercel.app/",
  "name": "Holovox-Jade"
}` }} />
// SCHEMA-AUTO-FIX-END

// SEO-AUTO-FIX-START
// ✅ SEO Metadata
export const metadata = {
  title: "Holovox-Jade - Professional Website",
  description: "Explore Holovox-Jade for professional services and information.",
  keywords: [
    "professional",
    "services",
    "website",
    "company",
    "business"
  ],
  alternates: {
    canonical: "https://holovox-jade.vercel.app/"
  },
  robots: "index, follow",
  openGraph: {
    title: "Holovox-Jade - Professional Website",
    description: "Explore Holovox-Jade for professional services and information.",
    url: "https://holovox-jade.vercel.app/",
    siteName: "Holovox-Jade",
    images: [
      {
        url: "https://holovox-jade.vercel.app/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Holovox-Jade - Professional Website"
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Holovox-Jade - Professional Website",
    description: "Explore Holovox-Jade for professional services and information.",
    images: ["https://holovox-jade.vercel.app/twitter-image.jpg"]
  }
};
// SEO-AUTO-FIX-END





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
    // <div className="min-h-screen bg-[#EAEAF4] overflow-x-hidden">
    //   <Navbar />
    //   <Hero />
    //   <section id="features">
    //     <Features />
    //   </section>
    //   <UseCases />
    //   <section id="pricing">
    //     <Pricing />
    //   </section>
    //   <section id="hardware">
    //     <Hardware />
    //   </section>
    //   <Footer />
    // </div>

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
