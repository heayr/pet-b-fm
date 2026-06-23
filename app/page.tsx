import Image from "next/image";
import MainSection from "./components/MainSection";
import LogoSection from "./components/LogoSection";
import Services from "./components/Services";
import Proposal from "./components/Proposal";
import Cases from "./components/Cases";
import { ContactForm } from "./components/sections/ContactForm/ContactForm";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className=" mx-auto ">
      <MainSection />
      <LogoSection />
      <Services />
      <Proposal />
      <Cases />
      <ContactForm />
      <Footer />
    </div>
  );
}
