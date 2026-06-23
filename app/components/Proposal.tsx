import SafeImage from "./SafeImage";
import Link from "next/link";
import { getContentBlock } from "@/lib/services/content.service";

const DEFAULT_PROPOSAL = {
  title: "Давайте создавать вместе",
  description:
    "Напишите нам сегодня, чтобы узнать больше о наших маркетинговых продуктах, которые помогут вашему бизнесу расти",
  buttonText: "Получить предложение",
};

export default async function Proposal() {
  const block = await getContentBlock("proposal");
  const raw = (block?.content ?? {}) as Record<string, unknown>;
  const title = (raw.title as string) || DEFAULT_PROPOSAL.title;
  const description =
    (raw.description as string) || DEFAULT_PROPOSAL.description;
  const buttonText = (raw.buttonText as string) || DEFAULT_PROPOSAL.buttonText;

  return (
    <section className="mt-fluid-section mb-fluid-section">
      <div className="max-w-container mx-auto bg-default-grey rounded-3xl p-fluid-container relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-fluid-section-gap">
          {/* Текстовый блок */}
          <div className="w-full lg:w-1/2">
            <h3 className="text-fluid-h3 font-medium mb-6">{title}</h3>
            <p className="text-fluid-lg mb-8">{description}</p>
            <Link
              href="#consultation"
              className="inline-block text-white bg-black text-lg sm:text-xl px-6 py-4 rounded-xl transition duration-300 hover:bg-default-lime hover:text-black hover:border-default-lime"
            >
              {buttonText}
            </Link>
          </div>

          {/* Иллюстрация */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <SafeImage
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
