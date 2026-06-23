import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import SessionProvider from "./components/SessionProvider";
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
        <SessionProvider>
          <Navbar />
          <main className="mx-auto w-full px-fluid-container">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
