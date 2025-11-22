"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, FormEvent } from "react";

const key = process.env.NEXT_PUBLIC_ACCESS_KEY_WEB_FORM;

export default function Form() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !message) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: JSON.stringify({
          access_key: key,
          name,
          email,
          message,
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (res.status === 200) {
        setIsSubmitted(true);
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setError("Ошибка отправки. Попробуйте ещё раз.");
      }
    } catch (err) {
      console.error("Err", err);
      setError("Произошла ошибка. Проверьте подключение к интернету.");
    }
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 mt-10" id="consultation">
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Link href="#services" className="flex-shrink-0">
            <h2 className="text-3xl font-bold bg-default-lime px-4 py-2 rounded-md">
              Свяжитесь с нами
            </h2>
          </Link>
          <p className="text-base sm:text-lg leading-relaxed flex-1">
            Оставьте нам сообщение: Давайте обсудим ваши потребности в
            маркетинге
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row bg-default-grey rounded-3xl p-6 sm:p-8 lg:p-12 gap-8">
          {/* Форма */}
          <form onSubmit={onSubmit} className="flex-1">
            {error && (
              <div className="mb-6 text-red-600 font-medium">{error}</div>
            )}
            {isSubmitted && (
              <div className="mb-6 text-green-600 font-medium">
                Сообщение успешно отправлено!
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Имя
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-default-lime focus:ring-1 focus:ring-default-lime"
                  placeholder="Ваше имя"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-default-lime focus:ring-1 focus:ring-default-lime"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Сообщение
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full h-32 px-4 py-3 rounded-xl border border-gray-300 focus:border-default-lime focus:ring-1 focus:ring-default-lime resize-none"
                  placeholder="Напишите нам..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitted}
                className="mt-6 w-full h-14 bg-dark text-default-grey text-xl font-medium rounded-2xl hover:bg-default-lime hover:text-dark transition duration-300 disabled:opacity-50"
              >
                {isSubmitted ? "Отправлено!" : "Отправить"}
              </button>
            </div>
          </form>

          {/* Иллюстрация */}
          <div className="hidden lg:block lg:w-1/3">
            <Image
              src="/images/stars.svg"
              alt="Звёздочки"
              width={691}
              height={648}
              className="max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
