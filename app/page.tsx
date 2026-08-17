import Header from "../components/Header/Header";
import Hero from "../components/Hero/Hero";
import Stats from "../components/Stats/Stats";
import Privileges from "../components/Privileges/Privileges";
import Testimonials from "../components/Testimonials/Testimonials";
import Faq from "../components/Faq/Faq";
import JoinCta from "../components/JoinCta/JoinCta";
import Footer from "../components/Footer/Footer";
import ScrollTop from "../components/ScrollTop/ScrollTop";
import StickyCta from "../components/StickyCta/StickyCta";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <Privileges />
        <Testimonials />
        <Faq />
        <JoinCta />
      </main>
      <Footer />
      <ScrollTop />
      <StickyCta />
    </>
  );
}
