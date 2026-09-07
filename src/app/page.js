// ONPAGE-AUTO-FIX-START
// 🟢 ON-PAGE: title, meta description, keywords, Open Graph, Twitter tags
// Suggested internal links for this page: none found
// Heading structure notes: Ensure exactly one H1, then a logical H2 > H3 hierarchy matching content sections.
// Content clarity notes: Break long paragraphs into shorter ones, add subheadings, lead with the answer.
export const onPageMetadata = {
  title: "Holovox-Jade - Professional Website",
  description: "Explore Holovox-Jade for professional services.",
  keywords: [
    "professional",
    "services",
    "website",
    "company",
    "business"
  ],
  openGraph: {
    title: "Holovox-Jade - Professional Website",
    description: "Explore Holovox-Jade for professional services.",
    url: "https://holovox-jade.vercel.app/",
    siteName: "Holovox-Jade",
    images: [{ url: "https://holovox-jade.vercel.app/opengraph-image.jpg", width: 1200, height: 630, alt: "Holovox-Jade - Professional Website" }],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Holovox-Jade - Professional Website",
    description: "Explore Holovox-Jade for professional services.",
    images: ["https://holovox-jade.vercel.app/twitter-image.jpg"]
  }
};
// ONPAGE-AUTO-FIX-END






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
  <>
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{"@context":"https://schema.org","@type":"WebPage","url":"https://holovox-jade.vercel.app/","name":"Holovox-Jade - Professional Website","description":"Explore Holovox-Jade for professional services.","publisher":{"@type":"Organization","name":"Holovox-Jade","url":"https://holovox-jade.vercel.app/"},"speakable":{"@type":"SpeakableSpecification","xpath":["/html/head/title","/html/head/meta[@name='description']/@content"]}}` }} />
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What is Holovox-Jade?","acceptedAnswer":{"@type":"Answer","text":"Holovox-Jade is a platform for professional services."}},{"@type":"Question","name":"How does Holovox-Jade work?","acceptedAnswer":{"@type":"Answer","text":"Holovox-Jade provides solutions through an easy-to-use product."}},{"@type":"Question","name":"Why choose Holovox-Jade?","acceptedAnswer":{"@type":"Answer","text":"Holovox-Jade is reliable, innovative, and secure."}}]}` }} />
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{"@context":"https://schema.org","@type":"HowTo","name":"Holovox-Jade - Professional Website","step":[{"@type":"HowToStep","name":"Get Started","text":"Sign up and explore the platform."}]}` }} />
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
</>
);
};

export default Index;

// TECHNICAL-CANONICAL-START
// 🔵 TECHNICAL: canonical, robots/noindex, hreflang
export const technicalMetadata = {
  alternates: {
    canonical: "https://holovox-jade.vercel.app/",
  },
  robots: "index, follow",
};
// TECHNICAL-CANONICAL-END



