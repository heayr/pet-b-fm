import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Балаково ФМ",
  description: "В процессе постройки ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="">
        <Navbar />
        <main className="mx-auto w-[1440px]">{children}</main>
      </body>
    </html>
  );
}
