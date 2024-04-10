import Link from "next/link";

export default function Cases() {
  return (
    <section className="mx-auto ">
      <div className="flex items-center h-20 w-3/4  gap-10 mb-[60px]  ">
        <Link className="ml-[100px]" id="services" href="#">
          <h2 className=" w- h-13  text-[40px] leading-9 pb-2 pt-1 px-2 bg-default-lime rounded-md ">
            Наши проекты
          </h2>
        </Link>
        <p className="">
          Изучите реальные кейсы успеха сделнного, нашим рекламным агенством
        </p>
      </div>
      <div className="box bg-dark rounded-[45px] flex justify-around h-[326px] items-center w-[1234px] mx-auto ">
        <div className="card-case flex flex-col h-[163px] justify-between  ">
          <p className="text-default-grey w-[286px]">
            For a local restaurant, we implemented a targeted PPC campaign that
            resulted in a 50% increase in website traffic and a 25% increase in
            sales.
          </p>
          <Link href="" className="text-default-lime">
            Узнать больше
          </Link>
        </div>
        <div className="h-[180px] border-default-grey border-solid border-[1px] "></div>
        <div className="card-case flex flex-col h-[163px] justify-between ">
          <p className="text-default-grey w-[286px]">
            For a local restaurant, we implemented a targeted PPC campaign that
            resulted in a 50% increase in website traffic and a 25% increase in
            sales.
          </p>
          <Link href="" className="text-default-lime">
            Узнать больше
          </Link>
        </div>
        <div className="h-[180px] border-default-grey border-solid border-[1px] "></div>

        <div className="card-case flex flex-col h-[163px] justify-between ">
          <p className="text-default-grey w-[286px]">
            For a local restaurant, we implemented a targeted PPC campaign that
            resulted in a 50% increase in website traffic and a 25% increase in
            sales.
          </p>
          <Link href="" className="text-default-lime">
            Узнать больше
          </Link>
        </div>
      </div>
    </section>
  );
}
