import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-slate-100 p-10 stick top-0">
      <div className=" mx-auto flex justify-between flex-col pt-10 sm:flex-row h-16 w-[64%]">
        <p className="text-2xl font-bold grid place-content-center">
          <Link
            href="/"
            className="text-black text-4xl px-[20px] py-[10px] border-[2px] border-transparent hover:border-[2px] hover:border-default-lime border-solid rounded-full transition duration-700 ease-in-out hover:bg-default-lime "
          >
            Балаково ФМ
          </Link>
        </p>
        <ul className="flex sm:flex-col lg:flex-row justify-center align-middle items-center gap-4 text-xl sm:justify-evenly  lg:text-sm list-none ">
          <Link
            href={""}
            className="text-black/70 px-[10px] py-[5px] text-xl rounded-full hover:bg-default-lime transition duration-300 ease-in-out"
          >
            О нас
          </Link>
          <Link
            href="#services"
            className="text-black/70 px-[10px] py-[5px] text-xl rounded-full hover:bg-default-lime transition duration-300 ease-in-out"
          >
            Услуги
          </Link>
          <Link
            href=""
            className="text-black/70 px-[10px] py-[5px] text-xl rounded-full hover:bg-default-lime transition duration-300 ease-in-out"
          >
            Портфолио
          </Link>
          <Link
            href={""}
            className="text-black/70 px-[10px] py-[5px] text-xl rounded-full hover:bg-default-lime transition duration-300 ease-in-out"
          >
            Стоимость
          </Link>
          <Link
            href={""}
            className="text-black/70 px-[10px] py-[5px] text-xl rounded-full hover:bg-default-lime transition duration-300 ease-in-out"
          >
            Блог
          </Link>
          <button className="text-black border-solid border-[1px] text-xl border-black rounded-xl px-[10px] py-[20px] transition duration-700 ease-in-out hover:bg-default-lime hover:border-default-lime">
            Запросить консультацию
          </button>
        </ul>
      </div>
    </nav>
  );
}
