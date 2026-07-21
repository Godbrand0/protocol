import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { Services } from "@/components/marketing/services";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Cta } from "@/components/marketing/cta";
import { Footer } from "@/components/marketing/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Services />
        <HowItWorks />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
