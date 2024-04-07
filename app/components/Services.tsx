import Image from "next/image";
import Link from "next/link";

export default function Services() {
  return (
    <section className=" mt-[105px]">
      <div className="flex items-center h-20 w-3/4  gap-10 mb-[60px]  ">
        <Link id="services" href="#services">
          <h2 className=" w-44 h-12 text-4xl text-[40px] pb-2 px-2 bg-default-lime rounded-md ">
            Сервисы
          </h2>
        </Link>
        <p className="">
          В нашем маркетинговом агенстве, мы предлагаем несколько областей
          услуг, чтобы помочь бизнесам расти и достигать успеха. Эти услуги
          включают в себя:
        </p>
      </div>
      <div className="container-services flex flex-row flex-wrap justify-center gap-10">
        <div className="card-service  w-[600px] h-[310px] bg-default-grey roun flex rounded-[45px] justify-between">
          <div className="box flex flex-col justify-between">
            <h3 className="text-2xl w-44 mt-[50px] ml-[50px] bg-default-lime rounded-2xl pl-3 pb-2">
              Оптимизация поисковых запросов
            </h3>
            <button className="flex align-bottom ml-[51px] mb-[49px] items-center  ">
              <Image
                className="mr-[20px]"
                src="/images/icon-black.svg"
                alt="Стрелочка"
                width={40}
                height={40}
              />
              Узнать больше
            </button>
          </div>
          <Image
            className="mr-[50px]"
            src="/images/web-search-with-elements 2.svg"
            width={210}
            height={166}
            alt="Поиск"
          />
        </div>
        <div className="card-service  w-[600px] h-[310px]  bg-default-lime  flex rounded-[45px] justify-between">
          <div className="box flex flex-col justify-between">
            <h3 className="text-2xl w-44 mt-[50px] ml-[50px] rounded-2xl pl-3 pb-2  bg-default-grey ">
              Создание Контента
            </h3>
            <button className="flex align-bottom ml-[51px] mb-[49px] items-center  ">
              <Image
                className="mr-[20px]"
                src="/images/icon-white.svg"
                alt="Стрелочка"
                width={40}
                height={40}
              />
              Узнать больше
            </button>
          </div>
          <Image
            className="mr-[50px]"
            src="/images/content.svg"
            width={210}
            height={166}
            alt="Поиск"
          />
        </div>
        <div className="card-service  w-[600px] h-[310px] bg-black roun flex rounded-[45px] justify-between">
          <div className="box flex flex-col justify-between">
            <h3 className="text-2xl w-44 mt-[50px] ml-[50px]  bg-default-grey rounded-2xl pl-3 pb-2">
              Social Media Marketing
            </h3>
            <button className="flex align-bottom ml-[51px] mb-[49px] text-default-grey items-center  ">
              <Image
                className="mr-[20px]"
                src="/images/icon-white.svg"
                alt="Стрелочка"
                width={40}
                height={40}
              />
              Узнать больше
            </button>
          </div>
          <Image
            className="mr-[50px]"
            src="/images/smm.svg"
            width={210}
            height={166}
            alt="Поиск"
          />
        </div>
        <div className="card-service  w-[600px] h-[310px] bg-default-grey roun flex rounded-[45px] justify-between">
          <div className="box flex flex-col justify-between">
            <h3 className="text-2xl w-44 mt-[50px] ml-[50px] bg-default-lime rounded-2xl pl-3 pb-2">
              Оптимизация поисковых запросов
            </h3>
            <button className="flex align-bottom ml-[51px] mb-[49px] items-center  ">
              <Image
                className="mr-[20px]"
                src="/images/icon-black.svg"
                alt="Стрелочка"
                width={40}
                height={40}
              />
              Узнать больше
            </button>
          </div>
          <Image
            className="mr-[50px]"
            src="/images/web-search-with-elements 2.svg"
            width={210}
            height={166}
            alt="Поиск"
          />
        </div>
      </div>
    </section>
  );
}
