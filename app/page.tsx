import ChatWidget from "@/components/ChatWidget";
import ContactForm from "@/components/ContactForm";
import CompanyIntro from "@/components/CompanyIntro";
import DemoVideo from "@/components/DemoVideo";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import ProcessSection from "@/components/ProcessSection";
import ServicesShowroom from "@/components/ServicesShowroom";

export default function Home() {
  return (
    <main className="flex-1 bg-abyss">
      <Navbar />
      <div id="inicio">
        <Hero />
      </div>
      <CompanyIntro />
      <ServicesShowroom />
      <ProcessSection />
      <DemoVideo />
      <ContactForm />
      <Footer />
      <ChatWidget />
    </main>
  );
}
