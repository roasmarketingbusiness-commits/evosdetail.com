import { Booking } from "./_components/Booking";
import { FAQ } from "./_components/FAQ";
import { Footer } from "./_components/Footer";
import { Header } from "./_components/Header";
import { Hero } from "./_components/Hero";
import { Intro } from "./_components/Intro";
import { LaunchOffer } from "./_components/LaunchOffer";
import { HowItWorks } from "./_components/HowItWorks";
import { Packages } from "./_components/Packages";
import { ServiceArea } from "./_components/ServiceArea";

export default function Home() {
  return (
    <>
      <Intro />
      <LaunchOffer />
      <Header />
      <main>
        <Hero />
        <Packages />
        <HowItWorks />
        <ServiceArea />
        <FAQ />
        <Booking />
      </main>
      <Footer />
    </>
  );
}
