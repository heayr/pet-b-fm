import Image from "next/image";
import Button from "./Button";

export default function MainSection() {
  return (
    <section className="py-fluid-section">
      <div className="max-w-container mx-auto flex flex-col lg:flex-row items-center lg:items-start gap-fluid-section-gap">
        {/* Текстовый блок */}
        <div className="w-full lg:w-1/2">
          <h1 className="text-fluid-h1 font-medium mb-6">
            Наша аудитория приносит прибыль! Расскажите ей о своих товарах или
            услугах
          </h1>
          <p className="text-fluid-lg mb-8">
            Мы рекламное агентство полного цикла. Обратившись к нам, вы получите
            продвижение своего товара или услуги по всем направлениям.
          </p>
          <Button href="#consultation" variant="primary" size="lg">
            Запросить консультацию
          </Button>
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
