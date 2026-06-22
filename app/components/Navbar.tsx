"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const navLinks = [
  { label: "О нас", href: "/" },
  { label: "Услуги", href: "#services" },
  { label: "Портфолио", href: "/portfolio" },
  { label: "Стоимость", href: "/pricing" },
  { label: "Блог", href: "/blog" },
] as const;

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto flex max-w-container flex-wrap items-center justify-between py-fluid-nav-y">
        {/* Логотип */}
        <Link href="/" className="flex items-center gap-x-1.5">
          <Image
            src="/images/main-logo.svg"
            alt="Логотип Радиоточка"
            width={28}
            height={28}
            className="h-7 w-7"
            priority
          />
          <span className="text-fluid-nav-logo font-bold text-black leading-none">
            Радиоточка
          </span>
        </Link>

        {/* Гамбургер для мобильных */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-md p-[0.5rem] text-gray-700 hover:bg-gray-100 sm:hidden"
          aria-label="Открыть меню"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-fluid-icon w-fluid-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Навигация */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } w-full sm:flex sm:w-auto sm:items-center sm:gap-fluid-nav-gap-menu`}
        >
          <ul className="flex flex-col gap-y-2 sm:flex-row sm:items-center sm:gap-x-fluid-nav-gap-links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-full px-fluid-nav-link-x py-fluid-nav-link-y text-fluid-base text-gray-700 transition-colors hover:bg-default-lime hover:text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="#consultation"
            className="mt-fluid-nav-mt-btn block rounded-xl border border-black px-fluid-nav-btn-x py-fluid-nav-btn-y text-center text-fluid-base font-medium text-black transition-colors hover:border-default-lime hover:bg-default-lime sm:mt-0 sm:ml-fluid-nav-gap-menu"
          >
            Запросить консультацию
          </Link>
        </div>
      </div>
    </nav>
  );
}
