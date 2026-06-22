import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Радиоточка",
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
        <main className="mx-auto w-full px-fluid-container">{children}</main>
      </body>
    </html>
  );
}
