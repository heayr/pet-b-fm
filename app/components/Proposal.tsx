import Image from "next/image";
import Link from "next/link";

function Proposal() {
  return (
    <section className="proposal mt-[55px] w-[1240px] mx-auto mb-12">
      <div className="bg-default-grey flex flex-row rounded-[45px] justify-between relative h-[345px]">
        <div className="proposal-box flex flex-col w-[500px] ml-[60px] mt-[60px]">
          <h3 className=" text-3xl mb-7 ">Давайте создавать вместе</h3>
          <p className="text-lg mb-3">
            Напишите нам сегодня, чтобы узнать больше о наших маркетинговых
            продуктах, которые помогут вашему бизнесу расти
          </p>
          <button className="text-white bg-black  text-lg  w-[288px] h-[65px] rounded-xl px-[5px] py-[15px] transition duration-700 ease-in-out hover:bg-default-lime hover:text-black hover:border-default-lime">
            Получить предложение
          </button>
        </div>
        <Image
          className="absolute right-32 -top-7"
          src="/images/happen.svg"
          alt="Картинка"
          width={359}
          height={394}
        />
      </div>
    </section>
  );
}

export default Proposal;
