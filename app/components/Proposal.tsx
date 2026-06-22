import Image from "next/image";
import Link from "next/link";

function Proposal() {
  return (
    <section className="mt-fluid-section mb-fluid-section">
      <div className="max-w-container mx-auto bg-default-grey rounded-3xl p-fluid-container relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-fluid-section-gap">
          {/* Текстовый блок */}
          <div className="w-full lg:w-1/2">
            <h3 className="text-fluid-h3 font-medium mb-6">
              Давайте создавать вместе
            </h3>
            <p className="text-fluid-lg mb-8">
              Напишите нам сегодня, чтобы узнать больше о наших маркетинговых
              продуктах, которые помогут вашему бизнесу расти
            </p>
            {/* <Link
              href="/proposal"
              className="inline-block text-white bg-black text-lg sm:text-xl px-6 py-4 rounded-xl transition duration-300 hover:bg-default-lime hover:text-black hover:border-default-lime"
            >
              Получить предложение
            </Link> */}
          </div>

          {/* Иллюстрация */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <Image
              src="/images/happen.svg"
              alt="Иллюстрация к предложению"
              width={359}
              height={394}
              className="max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Proposal;
