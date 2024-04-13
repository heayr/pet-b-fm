import Image from "next/image";
import Link from "next/link";

export default function Form() {
  return (
    <section className="mx-auto mt-[40px]" id="consultation">
      <div className="flex items-center h-20 w-3/4  gap-10 mb-[60px]  ">
        <Link className="ml-[100px]" id="services" href="#">
          <h2 className="   text-[40px] leading-9 h-[51px] pt-1 px-2 bg-default-lime rounded-md ">
            Свяжитесь с нами
          </h2>
        </Link>
        <p className="">
          Оставьте нам сообщение: Давайте обсудим ваши потребности в маркетинге
        </p>
      </div>
      <div className="mx-auto w-[1240px]">
        <div className="from-box flex flex-row bg-default-grey justify-between content-evenly py-10 rounded-[45px] ">
          <form
            action="submit"
            className="flex flex-col w-[556px] justify-evenly ml-20 "
          >
            <div>
              <p className="mb-1 ml-1">Имя</p>
              <input
                className="w-full h-[50px] rounded-xl px-8 "
                placeholder="Имя"
                type="text"
                name=""
                id=""
              />
            </div>
            <div>
              <p className="mb-1 ml-1">Email</p>
              <input
                className=" w-full h-[50px] rounded-xl px-8"
                placeholder="email"
                type="email"
                name=""
                id=""
              />
            </div>
            <div>
              <p className="mb-1 ml-1">Сообщение</p>
              <textarea
                className=" w-full h-[190px] rounded-xl px-8 py-2 resize-none "
                placeholder="Напишите нам"
                name=""
                id=""
                rows={6}
              />
            </div>
            <button className=" bg-dark text-default-grey py-3 rounded-2xl hover:bg-default-lime hover:text-dark text-xl  transition duration-700  ">
              Отправить
            </button>
          </form>
          <Image
            src="/images/stars.svg"
            alt="Звездочки"
            width={691}
            height={648}
          />
        </div>
      </div>
    </section>
  );
}
