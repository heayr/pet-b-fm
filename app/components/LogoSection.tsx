import Image from "next/image";
import { db } from "@/lib/db";

const defaultLogos = [
  { src: "/images/dorozhnoe.svg", alt: "Логотип Дорожное Радио" },
  { src: "/images/nashe.svg", alt: "Логотип Наше Радио" },
] as const;

export default async function LogoSection() {
  const block = await db.contentBlock.findUnique({
    where: { slug: "logo-section" },
  });

  const logos = (block?.content?.logos as typeof defaultLogos) || defaultLogos;

  return (
    <div className="mt-fluid-section">
      <div className="max-w-container mx-auto flex flex-wrap justify-center gap-fluid-section-gap">
        {[0, 1, 2].map((row) =>
          logos.map((logo, i) => (
            <Image
              key={`${row}-${i}`}
              src={logo.src}
              alt={logo.alt}
              width={125}
              height={50}
              priority
              className="flex-shrink-0"
            />
          )),
        )}
      </div>
    </div>
  );
}
