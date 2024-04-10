import Link from "next/link";
import Image from "next/image";

export default function MainSection() {
  return (
    <section className="flex justify-center gap-16 mt-14">
      <div className="flex flex-col  w-[40%]">
        <h1 className="text-5xl font-medium mb-9 ">
          Наша аудитория приносит прибыль! Расскажите ей о своих товарах или
          услугах
        </h1>
        <p className=" text-xl font-normal mb-9">
          Мы рекламное агенство полного цикла. Обратившись к нам, вы получите
          продвижение своего товара или услуги по всем направлениям.
        </p>
        <button className="text-white bg-black border-solid border-[1px] text-xl mt-12 w-[265px] h-[65px] rounded-xl px-[5px] py-[15px] transition duration-700 ease-in-out hover:bg-default-lime hover:text-black hover:border-default-lime">
          Запросить консультацию
        </button>
      </div>
      <Image
        alt="Медийный Рупор"
        className=""
        src="/images/main-illustration.svg"
        priority={true}
        width={600}
        height={515}
      />
    </section>
  );
}
