"use client";

import Link from "next/link";

// Интерфейс для пропсов компонента CaseCard
interface CaseCardProps {
  text: string;
  link: string;
}

// Компонент карточки кейса
function CaseCard({ text, link }: CaseCardProps) {
  return (
    <div className="flex flex-col p-6 bg-default-grey rounded-xl h-full">
      <p className="text-black text-base leading-relaxed mb-6 flex-1">{text}</p>
      <Link
        href={link}
        className="text-default-lime font-medium hover:underline self-start"
      >
        Узнать больше
      </Link>
    </div>
  );
}

// Основной компонент раздела "Наши проекты"
export default function Cases() {
  return (
    <section className="mt-fluid-section">
      <div className="max-w-container mx-auto mb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <h2 className="text-fluid-h2 font-bold bg-default-lime px-4 py-2 rounded-md flex-shrink-0">
            Наши проекты
          </h2>
          <p className="text-fluid-base flex-1">
            Изучите реальные кейсы успеха, сделанные нашим рекламным агентством.
          </p>
        </div>
      </div>

      <div className="max-w-container mx-auto">
        <div className="bg-dark rounded-3xl p-fluid-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-fluid-cards-gap">
            {/* Карточка 1 */}
            <CaseCard
              text="Для местного ресторана мы запустили таргетированную PPC‑кампанию, которая привела к росту трафика на сайт на 50 % и увеличению продаж на 25 %."
              link="/cases/restaurant"
            />

            {/* Карточка 2 */}
            <CaseCard
              text="Для интернет‑магазина мы разработали стратегию контент‑маркетинга, что позволило увеличить количество целевых лидов на 70 % за три месяца."
              link="/cases/ecommerce"
            />

            {/* Карточка 3 */}
            <CaseCard
              text="Для стартапа мы создали бренд‑идентичность и запустили SMM‑кампанию, что привело к росту узнаваемости бренда на 40 % за два месяца."
              link="/cases/startup"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
