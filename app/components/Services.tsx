import SafeImage from "./SafeImage";
import Link from "next/link";
import { db } from "@/lib/db";

interface ServiceCardProps {
  title: string;
  imageSrc: string;
  iconSrc: string;
  bgColor: string;
  textColor: string;
  borderColor?: string;
  borderWidth?: string;
}

function ServiceCard({
  title,
  imageSrc,
  iconSrc,
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
  const block = await db.contentBlock.findUnique({
    where: { slug: "services" },
  });

  const content = block?.content as any;
  const services: ServiceCardProps[] = content?.items || [
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
  const title = content?.title || "Наши услуги";

  return (
    <section className="mt-fluid-section" id="services">
      <div className="max-w-container mx-auto mb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Link href="#services" className="flex-shrink-0">
            <h2 className="text-fluid-h2 font-bold bg-default-lime px-4 py-2 rounded-md">
              {title}
            </h2>
          </Link>
          <p className="text-fluid-base flex-1">
            В нашем маркетинговом агентстве мы предлагаем несколько областей
            услуг, чтобы помочь бизнесам расти и достигать успеха. Эти услуги
            включают в себя:
          </p>
        </div>
      </div>

      <div className="max-w-container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-fluid-cards-gap">
        {services.map((service) => (
          <ServiceCard key={service.title} {...service} />
        ))}
      </div>
    </section>
  );
}
