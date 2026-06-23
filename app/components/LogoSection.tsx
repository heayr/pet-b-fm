import SafeImage from "./SafeImage";
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
      <div className="max-w-container mx-auto flex flex-wrap justify-center items-center gap-6 md:gap-10">
        {logos.map((logo, i) => (
          <SafeImage
            key={`logo-${i}`}
            src={logo.src}
            alt={logo.alt}
            width={125}
            height={50}
            className="h-auto w-auto max-w-[100px] md:max-w-[125px]"
          />
        ))}
      </div>
    </div>
  );
}

export { defaultLogos };
