import Link from "next/link";
import SafeImage from "./SafeImage";
import { getContentBlock } from "@/lib/services/content.service";
import { SectionHeader } from "./sections/SectionHeader";
interface CaseCardProps {
  text: string;
  link: string;
  imageSrc?: string;
}

const DEFAULT_CASES: CaseCardProps[] = [
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
  let block: { content: unknown } | null = null;
  try {
    block = await getContentBlock("cases");
  } catch (e) {
    console.error("[Cases] DB error:", e);
  }

  const content = (block?.content ?? {}) as Record<string, unknown>;
  const cases: CaseCardProps[] =
    (content.items as CaseCardProps[]) || DEFAULT_CASES;
  const title = (content.title as string) || "Наши проекты";
  const subtitle =
    (content.subtitle as string) ||
    "Изучите реальные кейсы успеха, сделанные нашим рекламным агентством.";

  return (
    <section className="mt-fluid-section">
      <SectionHeader title={title} subtitle={subtitle} />

      <div className="max-w-container mx-auto">
        <div className="bg-dark rounded-3xl p-fluid-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-fluid-cards-gap">
            {cases.map((caseItem, idx) => (
              <CaseCard key={idx} {...caseItem} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
