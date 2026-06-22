import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Начало сидинга...");

  // Создаём супер-админа
  const adminEmail = "admin@radiotochka.nologs.site";
  const adminPassword = "Admin123!";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("⚠️  Супер-администратор уже существует, пропускаем...");
  } else {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    await prisma.user.create({
      data: {
        name: "Супер-Администратор",
        email: adminEmail,
        password: hashedPassword,
        role: "super_admin",
        emailVerified: new Date(),
        isActive: true,
      },
    });

    console.log(`✅ Супер-администратор создан:`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
  }

  // Создаём контентные блоки по умолчанию
  const defaultBlocks = [
    {
      slug: "logo-section",
      title: "Логотипы",
      content: {
        logos: [
          { src: "/images/dorozhnoe.svg", alt: "Логотип Дорожное Радио" },
          { src: "/images/nashe.svg", alt: "Логотип Наше Радио" },
        ],
      },
      status: "published" as const,
    },
    {
      slug: "services",
      title: "Сервисы",
      content: {
        title: "Сервисы",
        items: [
          {
            title: "Полиграфия",
            imageSrc: "/images/web-search-with-elements 2.svg",
            iconSrc: "/images/icon-black.svg",
            bgColor: "bg-default-grey",
            textColor: "text-black",
            borderColor: "border-default-lime",
            borderWidth: "border-2",
          },
          {
            title: "Создание Контента",
            imageSrc: "/images/content.svg",
            iconSrc: "/images/icon-white.svg",
            bgColor: "bg-default-lime",
            textColor: "text-white",
          },
          {
            title: "Наружная Реклама",
            imageSrc: "/images/smm.svg",
            iconSrc: "/images/icon-white.svg",
            bgColor: "bg-black",
            textColor: "text-default-grey",
          },
          {
            title: "Радио",
            imageSrc: "/images/main-illustration.svg",
            iconSrc: "/images/icon-black.svg",
            bgColor: "bg-default-grey",
            textColor: "text-black",
            borderColor: "border-default-lime",
            borderWidth: "border-2",
          },
        ],
      },
      status: "published" as const,
    },
    {
      slug: "cases",
      title: "Наши проекты",
      content: {
        title: "Наши проекты",
        subtitle:
          "Изучите реальные кейсы успеха, сделанные нашим рекламным агентством.",
        items: [
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
        ],
      },
      status: "published" as const,
    },
    {
      slug: "proposal",
      title: "Предложение",
      content: {
        title: "Давайте создавать вместе",
        description:
          "Напишите нам сегодня, чтобы узнать больше о наших маркетинговых продуктах, которые помогут вашему бизнесу расти",
        buttonText: "Получить предложение",
      },
      status: "published" as const,
    },
  ];

  for (const block of defaultBlocks) {
    const existingBlock = await prisma.contentBlock.findUnique({
      where: { slug: block.slug },
    });

    if (existingBlock) {
      // Update existing block with correct structure
      await prisma.contentBlock.update({
        where: { slug: block.slug },
        data: { content: block.content, title: block.title },
      });
      console.log(`♻️  Блок "${block.slug}" обновлён`);
    } else {
      await prisma.contentBlock.create({
        data: block,
      });
      console.log(`✅ Блок "${block.slug}" создан`);
    }
  }

  console.log("\n🎉 Сидинг завершён!");
}

main()
  .catch((e) => {
    console.error("❌ Ошибка сидинга:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });