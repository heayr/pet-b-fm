import Image from "next/image";

export default function LogoSection() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-10">
      <div className="flex flex-wrap justify-center gap-8 sm:gap-12 lg:gap-16">
        {/* Повторяющиеся логотипы — можно вынести в массив, но для теста оставим как есть */}
        <Image
          src="/images/dorozhnoe.svg"
          alt="Логотип Дорожное Радио"
          width={125}
          height={50}
          priority
          className="flex-shrink-0"
        />
        <Image
          src="/images/nashe.svg"
          alt="Логотип Наше Радио"
          width={125}
          height={50}
          priority
          className="flex-shrink-0"
        />
        <Image
          src="/images/dorozhnoe.svg"
          alt="Логотип Дорожное Радио"
          width={125}
          height={50}
          priority
          className="flex-shrink-0"
        />
        <Image
          src="/images/nashe.svg"
          alt="Логотип Наше Радио"
          width={125}
          height={50}
          priority
          className="flex-shrink-0"
        />
        <Image
          src="/images/dorozhnoe.svg"
          alt="Логотип Дорожное Радио"
          width={125}
          height={50}
          priority
          className="flex-shrink-0"
        />
        <Image
          src="/images/nashe.svg"
          alt="Логотип Наше Радио"
          width={125}
          height={50}
          priority
          className="flex-shrink-0"
        />
      </div>
    </div>
  );
}
