import Link from "next/link";
import Image from "next/image";

export default function MainSection() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-start gap-12">
        {/* Текстовый блок */}
        <div className="w-full lg:w-1/2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium mb-6 leading-tight">
            Наша аудитория приносит прибыль! Расскажите ей о своих товарах или
            услугах
          </h1>
          <p className="text-lg sm:text-xl mb-8 leading-relaxed">
            Мы рекламное агентство полного цикла. Обратившись к нам, вы получите
            продвижение своего товара или услуги по всем направлениям.
          </p>
          <Link
            href="/consultation"
            className="inline-block text-white bg-black border-solid border-2 text-lg sm:text-xl px-6 py-4 rounded-xl transition duration-300 hover:bg-default-lime hover:text-black hover:border-default-lime"
          >
            Запросить консультацию
          </Link>
        </div>

        {/* Иллюстрация */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <Image
            alt="Медийный Рупор"
            src="/images/main-illustration.svg"
            priority
            width={600}
            height={515}
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}
