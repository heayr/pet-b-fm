import Image from "next/image";

const logos = [
  { src: "/images/dorozhnoe.svg", alt: "Логотип Дорожное Радио" },
  { src: "/images/nashe.svg", alt: "Логотип Наше Радио" },
] as const;

export default function LogoSection() {
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
