import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className=" w-[1240px] rounded-t-[45px] bg-dark mx-auto mt-32 pb-24">
      <nav className="p-10 stick top-0">
        <div className=" mx-auto flex justify-between flex-col pt-10 sm:flex-row h-16 w-[90%]">
          <p className="text-2xl font-bold grid place-content-center">
            <Link
              href="/"
              className=" flex gap-3 text-default-grey  text-4xl px-[20px] py-[10px] border-[2px] border-transparent hover:border-[2px] hover:border-default-lime border-solid rounded-full transition duration-700 ease-in-out hover:bg-default-lime "
            >
              <Image
                src="/images/main-logo.svg"
                alt="Лого"
                width={50}
                height={50}
              />
              Радиоточка
            </Link>
          </p>
          <ul className="flex sm:flex-col lg:flex-row justify-center align-middle items-center gap-4 text-xl sm:justify-evenly  lg:text-sm list-none ">
            <Link
              href={""}
              className="text-default-grey /70 px-[10px] py-[5px] text-xl rounded-full hover:bg-default-lime transition duration-300 ease-in-out"
            >
              О нас
            </Link>
            <Link
              href="#services"
              className="text-default-grey /70 px-[10px] py-[5px] text-xl rounded-full hover:bg-default-lime transition duration-300 ease-in-out"
            >
              Услуги
            </Link>
            <Link
              href=""
              className="text-default-grey /70 px-[10px] py-[5px] text-xl rounded-full hover:bg-default-lime transition duration-300 ease-in-out"
            >
              Портфолио
            </Link>
            <Link
              href={""}
              className="text-default-grey /70 px-[10px] py-[5px] text-xl rounded-full hover:bg-default-lime transition duration-300 ease-in-out"
            >
              Стоимость
            </Link>
            <Link
              href={""}
              className="text-default-grey /70 px-[10px] py-[5px] text-xl rounded-full hover:bg-default-lime transition duration-300 ease-in-out"
            >
              Блог
            </Link>
          </ul>
        </div>
      </nav>
      <div className="flex flex-col items-start gap-y-2 ml-32 mt-6 h-[150px]">
        <h3 className=" text-default-dark bg-default-lime px-2 text-center pb-1 inline-block rounded-md text-xl ">
          Контакты
        </h3>
        <p className=" text-default-grey  ">Email: Lorem ipsum </p>
        <p className=" text-default-grey  ">Телефон: 8 927 137 07 50</p>
        <p className=" text-default-grey w-[260px] ">
          Адрес: 413857 г.Балаково ул.Факел социализма, 21 Офис 207
        </p>
      </div>
    </footer>
  );
}
