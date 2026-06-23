import Link from "next/link";
import SafeImage from "./SafeImage";
import { db } from "@/lib/db";

interface CaseCardProps {
  text: string;
  link: string;
  imageSrc?: string;
}

function CaseCard({ text, link, imageSrc }: CaseCardProps) {
  return (
    <div className="flex flex-col p-6 bg-default-grey rounded-xl h-full">
      {imageSrc && (
        <div className="mb-4">
          <SafeImage
            src={imageSrc}
            alt=""
            width={400}
            height={200}
            className="w-full h-48 object-cover rounded-xl"
          />
        </div>
      )}
      <p className="text-black text-base leading-relaxed mb-6 flex-1">{text}</p>
      <Link
        href={link}
        className="text-links font-medium hover:underline self-start"
      >
        Узнать больше
      </Link>
    </div>
  );
}

export default async function Cases() {
  let block;
  try {
    block = await db.contentBlock.findUnique({
      where: { slug: "cases" },
    });
  } catch (e) {
    console.error("[Cases] DB error:", e);
  }

  const content = block?.content as any;
  const cases: CaseCardProps[] = content?.items || [
    {
      text: "Для местного ресторана мы запустили таргетированную PPC‑кампанию, которая привела к росту трафика на сайт на 50 % и увеличению продаж на 25 %.",
      link: "/cases/restaurant",
    },
    {
      text: "Для интернет‑магазина мы разработали стратегию контент‑маркетинга, что позволило увеличить количество целевых лидов на 70 % за три месяца.",
      link: "/cases/ecommerce",
    },
    {
      text: "Для стартапа мы создали бренд‑идентичность и запустили SMM‑кампанию, что привело к росту узнаваемости бренда на 40 % за два месяца.",
      link: "/cases/startup",
    },
  ];
  const title = content?.title || "Наши проекты";
  const subtitle =
    content?.subtitle ||
    "Изучите реальные кейсы успеха, сделанные нашим рекламным агентством.";

  return (
    <section className="mt-fluid-section">
      <div className="max-w-container mx-auto mb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <h2 className="text-fluid-h2 font-bold bg-default-lime px-4 py-2 rounded-md flex-shrink-0">
            {title}
          </h2>
          <p className="text-fluid-base flex-1">{subtitle}</p>
        </div>
      </div>

      <div className="max-w-container mx-auto">
        <div className="bg-dark rounded-3xl p-fluid-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-fluid-cards-gap">
            {cases.map((caseItem, idx) => (
              <CaseCard key={idx} {...caseItem} />
            ))}
          </div>
          {/* DEBUG */}
          {/* <div className="text-white text-xs mt-4 p-2 bg-gray-800 rounded space-y-1">
            <div>DEBUG block: {block ? "найден" : "НЕ НАЙДЕН"}</div>
            <div>
              DEBUG content keys:{" "}
              {content ? Object.keys(content).join(", ") : "пусто"}
            </div>
            <div>DEBUG items count: {content?.items?.length ?? 0}</div>
            <div>DEBUG item[0]: {JSON.stringify(cases[0])}</div>
          </div> */}
        </div>
      </div>
    </section>
  );
}
