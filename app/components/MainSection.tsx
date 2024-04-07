import Link from "next/link";
import Image from "next/image";

export default function MainSection() {
  return (
    <section className="flex justify-center gap-16 mt-14">
      <div className="flex flex-col  w-[40%]">
        <h1 className="text-6xl font-medium mb-9 ">
          Достижение успеха в технологиях продвижения
        </h1>
        <p className=" text-xl font-normal mb-9">
          Наше digital-агентство помогает бизнесу расти и добиваться успеха в
          интернете с помощью комплексных услуг, включая SEO-оптимизацию,
          PPC-рекламу, маркетинг в социальных сетях и создание контента.
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
