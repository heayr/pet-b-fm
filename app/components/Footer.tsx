import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-dark pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Верхняя часть: логотип и меню */}
        <div className="flex flex-col sm:flex-row justify-between gap-8 sm:gap-12 mb-12">
          {/* Логотип */}
          <div className="flex justify-center sm:justify-start">
            <Link
              href="/"
              className="flex items-center gap-4 px-4 py-3 border-2 border-transparent rounded-full hover:border-default-lime hover:bg-default-lime transition duration-300"
            >
              <Image
                src="/images/main-logo.svg"
                alt="Логотип Радиоточка"
                width={40}
                height={40}
              />
              <span className="text-2xl font-bold text-default-grey">
                Радиоточка
              </span>
            </Link>
          </div>

          {/* Меню */}
          <nav aria-label="Основное меню">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-4">
              {["О нас", "Услуги", "Портфолио", "Стоимость", "Блог"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href={item === "Услуги" ? "#services" : "/"}
                      className="text-default-grey px-4 py-2 text-lg rounded-full hover:bg-default-lime hover:text-dark transition duration-300"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>
        </div>

        {/* Контакты */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          <div>
            <h3 className="text-xl font-medium bg-default-lime px-3 py-1 rounded-md inline-block mb-6">
              Контакты
            </h3>
            <div className="space-y-3">
              <p className="text-default-grey text-base">
                Email:{" "}
                <a href="mailto:info@example.com" className="hover:underline">
                  info@example.com
                </a>
              </p>
              <p className="text-default-grey text-base">
                Телефон:{" "}
                <a href="tel:+79271370750" className="hover:underline">
                  8 927 137-07-50
                </a>
              </p>
              <p className="text-default-grey text-base max-w-xs">
                Адрес: 413857, г. Балаково, ул. Факел социализма, 21, офис 207
              </p>
            </div>
          </div>

          {/* Соцсети (пример) */}
          <div>
            <h3 className="text-xl font-medium bg-default-lime px-3 py-1 rounded-md inline-block mb-6">
              Мы в соцсетях
            </h3>
            <div className="flex gap-6">
              <Link href="#" aria-label="Telegram">
                <Image
                  src="/images/telegram.svg"
                  alt="Telegram"
                  width={24}
                  height={24}
                />
              </Link>
              <Link href="#" aria-label="VK">
                <Image src="/images/vk.svg" alt="VK" width={24} height={24} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
