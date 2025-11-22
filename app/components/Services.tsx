import Image from "next/image";
import Link from "next/link";

export default function Services() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 mt-20">
      {/* Заголовок и описание */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Link href="#services" className="flex-shrink-0">
            <h2 className="text-3xl sm:text-4xl font-bold bg-default-lime px-4 py-2 rounded-md">
              Сервисы
            </h2>
          </Link>
          <p className="text-base sm:text-lg leading-relaxed flex-1">
            В нашем маркетинговом агентстве мы предлагаем несколько областей
            услуг, чтобы помочь бизнесам расти и достигать успеха. Эти услуги
            включают в себя:
          </p>
        </div>
      </div>

      {/* Карточки услуг */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 px-4 sm:px-0">
        {/* Карточка 1: Полиграфия */}
        <ServiceCard
          title="Полиграфия"
          imageSrc="/images/web-search-with-elements 2.svg"
          iconSrc="/images/icon-black.svg"
          bgColor="bg-default-grey"
          textColor="text-black"
        />

        {/* Карточка 2: Создание Контента */}
        <ServiceCard
          title="Создание Контента"
          imageSrc="/images/content.svg"
          iconSrc="/images/icon-white.svg"
          bgColor="bg-default-lime"
          textColor="text-white"
        />

        {/* Карточка 3: Наружная Реклама */}
        <ServiceCard
          title="Наружная Реклама"
          imageSrc="/images/smm.svg"
          iconSrc="/images/icon-white.svg"
          bgColor="bg-black"
          textColor="text-default-grey"
        />

        {/* Карточка 4: Радио */}
        <ServiceCard
          title="Радио"
          imageSrc="/images/main-illustration.svg"
          iconSrc="/images/icon-black.svg"
          bgColor="bg-default-grey"
          textColor="text-black"
        />
      </div>
    </section>
  );
}

{
  /* Компонент карточки услуги */
}
function ServiceCard({ title, imageSrc, iconSrc, bgColor, textColor }) {
  return (
    <div
      className={`${bgColor} rounded-3xl p-6 flex flex-col justify-between h-full`}
    >
      <h3 className={`text-xl font-semibold mb-6 ${textColor}`}>{title}</h3>
      <div className="flex items-center justify-between">
        <Link
          href={`/services/${title.toLowerCase()}`}
          className={`inline-flex items-center ${textColor} text-base font-medium transition duration-300 hover:opacity-80`}
        >
          <Image
            src={iconSrc}
            alt="Стрелочка"
            width={24}
            height={24}
            className="mr-3"
          />
          Узнать больше
        </Link>
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
