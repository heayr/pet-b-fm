import SafeImage from "./SafeImage";
import { getContentBlock } from "@/lib/services/content.service";
import { SectionHeader } from "./sections/SectionHeader";

interface ServiceCardProps {
  title: string;
  imageSrc: string;
  iconSrc: string;
  bgColor: string;
  textColor: string;
  borderColor?: string;
  borderWidth?: string;
}

const DEFAULT_SERVICES: ServiceCardProps[] = [
  {
    title: "Полиграфия",
    imageSrc: "/images/web-search-with-elements 2.svg",
    iconSrc: "/images/icon-black.svg",
    bgColor: "bg-default-grey",
    textColor: "text-black",
    borderColor: "border-default-lime",
    borderWidth: "border-2",
  },
  {
    title: "Создание Контента",
    imageSrc: "/images/content.svg",
    iconSrc: "/images/icon-white.svg",
    bgColor: "bg-default-lime",
    textColor: "text-white",
  },
  {
    title: "Наружная Реклама",
    imageSrc: "/images/smm.svg",
    iconSrc: "/images/icon-white.svg",
    bgColor: "bg-black",
    textColor: "text-default-grey",
  },
  {
    title: "Радио",
    imageSrc: "/images/main-illustration.svg",
    iconSrc: "/images/icon-black.svg",
    bgColor: "bg-default-grey",
    textColor: "text-black",
    borderColor: "border-default-lime",
    borderWidth: "border-2",
  },
];

function ServiceCard({
  title,
  imageSrc,
  bgColor,
  textColor,
  borderColor,
  borderWidth,
}: ServiceCardProps) {
  return (
    <div
      className={`${bgColor} rounded-3xl p-6 flex flex-col justify-between h-full ${
        borderColor ? `${borderWidth} ${borderColor}` : ""
      }`}
    >
      <h3 className={`${textColor} text-xl font-semibold mb-6`}>{title}</h3>
      <div className="flex items-center justify-between">
        <SafeImage
          src={imageSrc}
          alt={title}
          width={120}
          height={94}
          className="rounded-xl"
        />
      </div>
    </div>
  );
}

export default async function Services() {
  const block = await getContentBlock("services");
  const content = (block?.content ?? {}) as Record<string, unknown>;
  const services: ServiceCardProps[] =
    (content.items as ServiceCardProps[]) || DEFAULT_SERVICES;
  const title = (content.title as string) || "Наши услуги";

  return (
    <section className="mt-fluid-section" id="services">
      <SectionHeader
        title={title}
        subtitle="В нашем маркетинговом агентстве мы предлагаем несколько областей услуг, чтобы помогать бизнесам расти и достигать успеха. Эти услуги включают в себя:"
        href="#services"
      />

      <div className="max-w-container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-fluid-cards-gap">
        {services.map((service) => (
          <ServiceCard key={service.title} {...service} />
        ))}
      </div>
    </section>
  );
}
