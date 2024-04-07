import Image from "next/image";
import MainSection from "./components/MainSection";
import LogoSection from "./components/LogoSection";
import Services from "./components/Services";
import Proposal from "./components/Proposal";

export default function Home() {
  return (
    <div className=" mx-auto ">
      <MainSection />
      <LogoSection />
      <Services />
      <Proposal />
    </div>
  );
}
