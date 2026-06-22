"use client";

import Image from "next/image";
import Link from "next/link";

// Интерфейс для пропсов компонента ServiceCard
interface ServiceCardProps {
  title: string;
  imageSrc: string;
  iconSrc: string;
  bgColor: string;
  textColor: string;
  borderColor?: string;
  borderWidth?: string;
}

// Компонент карточки услуги
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
      className={`${bgColor} rounded-3xl p-6 flex flex-col justify-between h-full ${borderColor ? `${borderWidth} ${borderColor}` : ""}`}
    >
      <h3 className={`text-xl font-semibold mb-6 ${textColor}`}>{title}</h3>
      <div className="flex items-center justify-between">
        <Image
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

// Основной компонент раздела "Сервисы"
export default function Services() {
  const servicesData: ServiceCardProps[] = [
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

  return (
    <section className="mt-fluid-section">
      {/* Заголовок и описание */}
      <div className="max-w-container mx-auto mb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Link href="#services" className="flex-shrink-0">
            <h2 className="text-fluid-h2 font-bold bg-default-lime px-4 py-2 rounded-md">
              Сервисы
            </h2>
          </Link>
          <p className="text-fluid-base flex-1">
            В нашем маркетинговом агентстве мы предлагаем несколько областей
            услуг, чтобы помочь бизнесам расти и достигать успеха. Эти услуги
            включают в себя:
          </p>
        </div>
      </div>

      {/* Карточки услуг */}
      <div className="max-w-container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-fluid-cards-gap">
        {servicesData.map(
          ({
            title,
            imageSrc,
            iconSrc,
            bgColor,
            textColor,
            borderColor,
            borderWidth,
          }) => (
            <ServiceCard
              key={title}
              title={title}
              imageSrc={imageSrc}
              iconSrc={iconSrc}
              bgColor={bgColor}
              textColor={textColor}
              borderColor={borderColor}
              borderWidth={borderWidth}
            />
          ),
        )}
      </div>
    </section>
  );
}
