import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import SessionProvider from "./components/SessionProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Радиоточка — рекламное агентство полного цикла",
    template: "%s | Радиоточка",
  },
  description:
    "Рекламное агентство полного цикла: наружная реклама, радио, полиграфия, контент-маркетинг и SMM. Повышаем продажи и узнаваемость бренда.",
  keywords: [
    "рекламное агентство",
    "наружная реклама",
    "радио",
    "smm",
    "контент-маркетинг",
    "полиграфия",
    "Балаково",
  ],
  authors: [{ name: "Радиоточка" }],
  alternates: {
    canonical: "https://pet-b-fm.ru",
  },
  openGraph: {
    title: "Радиоточка — рекламное агентство полного цикла",
    description:
      "Продвижение по всем направлениям: радио, наружная реклама, полиграфия, SMM и контент-маркетинг.",
    url: "https://pet-b-fm.ru",
    siteName: "Радиоточка",
    type: "website",
    locale: "ru_RU",
    images: [
      {
        url: "https://pet-b-fm.ru/images/main-logo.svg",
        width: 600,
        height: 515,
        alt: "Радиоточка",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Радиоточка — рекламное агентство полного цикла",
    description:
      "Продвижение по всем направлениям: радио, наружная реклама, полиграфия, SMM и контент-маркетинг.",
    images: ["https://pet-b-fm.ru/images/main-logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)}; m[i].l=1*new Date(); k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a) })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js?id=12345678", "ym"); ym(12345678, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Радиоточка",
              url: "https://pet-b-fm.ru",
              logo: "https://pet-b-fm.ru/images/main-logo.svg",
              email: "mailto:info@example.com",
              telephone: "+79271370750",
              address: {
                "@type": "PostalAddress",
                addressCountry: "RU",
                addressLocality: "Балаково",
                streetAddress: "ул. Факел социализма, 21, офис 207",
                postalCode: "413857",
              },
              sameAs: ["https://t.me/example", "https://vk.com/example"],
            }),
          }}
        />
      </head>
      <body className="">
        <SessionProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-black focus:text-white focus:px-4 focus:py-2 focus:rounded"
          >
            Перейти к основному содержимому
          </a>
          <Navbar />
          <main id="main-content" className="mx-auto w-full px-fluid-container">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
