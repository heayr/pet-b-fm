import Image from "next/image";
import Link from "next/link";

function Proposal() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 mt-14 mb-12">
      <div className="bg-default-grey rounded-3xl p-6 sm:p-8 lg:p-12 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-16">
          {/* Текстовый блок */}
          <div className="w-full lg:w-1/2">
            <h3 className="text-2xl sm:text-3xl font-medium mb-6">
              Давайте создавать вместе
            </h3>
            <p className="text-base sm:text-lg mb-8 leading-relaxed">
              Напишите нам сегодня, чтобы узнать больше о наших маркетинговых
              продуктах, которые помогут вашему бизнесу расти
            </p>
            <Link
              href="/proposal"
              className="inline-block text-white bg-black text-lg sm:text-xl px-6 py-4 rounded-xl transition duration-300 hover:bg-default-lime hover:text-black hover:border-default-lime"
            >
              Получить предложение
            </Link>
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
