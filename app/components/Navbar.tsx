"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Верхняя строка: логотип + кнопка меню */}
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-3 text-2xl font-bold text-black"
          >
            <Image
              src="/images/main-logo.svg"
              alt="Логотип Радиоточка"
              width={40}
              height={40}
            />
            Радиоточка
          </Link>

          {/* Кнопка гамбургера для мобильных */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            aria-label="Открыть меню"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
        </div>

        {/* Основное меню (показывает при открытии или на десктопах) */}
        <div
          className={`
            ${isMenuOpen ? "block" : "hidden"}
            sm:flex sm:items-center sm:justify-between
            mt-4 sm:mt-0
          `}
        >
          <ul className="flex flex-col sm:flex-row gap-4 text-lg sm:text-base">
            <li>
              <Link
                href="/"
                className="block px-4 py-2 text-gray-700 hover:text-black hover:bg-default-lime rounded-full transition"
              >
                О нас
              </Link>
            </li>
            <li>
              <Link
                href="#services"
                className="block px-4 py-2 text-gray-700 hover:text-black hover:bg-default-lime rounded-full transition"
              >
                Услуги
              </Link>
            </li>
            <li>
              <Link
                href="/portfolio"
                className="block px-4 py-2 text-gray-700 hover:text-black hover:bg-default-lime rounded-full transition"
              >
                Портфолио
              </Link>
            </li>
            <li>
              <Link
                href="/pricing"
                className="block px-4 py-2 text-gray-700 hover:text-black hover:bg-default-lime rounded-full transition"
              >
                Стоимость
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                className="block px-4 py-2 text-gray-700 hover:text-black hover:bg-default-lime rounded-full transition"
              >
                Блог
              </Link>
            </li>
          </ul>

          <button className="mt-4 sm:mt-0 px-6 py-3 text-base font-medium text-black border border-black rounded-xl hover:bg-default-lime hover:border-default-lime transition duration-300">
            Запросить консультацию
          </button>
        </div>
      </div>
    </nav>
  );
}
