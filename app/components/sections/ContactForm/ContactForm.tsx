"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/app/components/Button";
import { Alert } from "@/app/components/ui/Alert";
import { useContactForm } from "./useContactForm";

export function ContactForm() {
  const { form, onSubmit, error, success, isLoading, isConsentAccepted, setIsConsentAccepted } = useContactForm();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <section className="mt-fluid-section" id="consultation">
      <div className="max-w-container mx-auto mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Link href="#services" className="flex-shrink-0">
            <h2 className="text-fluid-h2 font-bold bg-default-lime px-4 py-2 rounded-md">
              Свяжитесь с нами
            </h2>
          </Link>
          <p className="text-fluid-base flex-1">
            Оставьте нам сообщение: Давайте обсудим ваши потребности в
            маркетинге
          </p>
        </div>
      </div>

      <div className="max-w-container mx-auto">
        <div className="flex flex-col lg:flex-row bg-default-grey rounded-3xl p-fluid-container gap-fluid-form-gap">
          <form onSubmit={onSubmit} className="flex-1">
            {error && <Alert variant="error">{error}</Alert>}
            {success && (
              <Alert variant="success">Сообщение успешно отправлено!</Alert>
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
                  {...register("name")}
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-default-lime focus:ring-1 focus:ring-default-lime"
                  placeholder="Ваше имя"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
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
                  {...register("email")}
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-default-lime focus:ring-1 focus:ring-default-lime"
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
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
                  {...register("message")}
                  className="w-full h-32 px-4 py-3 rounded-xl border border-gray-300 focus:border-default-lime focus:ring-1 focus:ring-default-lime resize-none"
                  placeholder="Напишите нам..."
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <label className="flex items-start gap-3 mt-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isConsentAccepted}
                  onChange={(e) => setIsConsentAccepted(e.target.checked)}
                  className="mt-0.5 h-5 w-5 shrink-0 appearance-none rounded-md border-2 border-gray-300 bg-white checked:bg-default-lime checked:border-default-lime focus:outline-none focus:ring-2 focus:ring-default-lime focus:ring-offset-2 transition-colors duration-200"
                />
                <span className="text-sm text-gray-600 leading-relaxed">
                  Я даю согласие на обработку моих персональных данных, указанных
                  в настоящей форме, в целях обработки обращения, предоставления
                  обратной связи и исполнения запросов пользователя. Подтверждаю
                  ознакомление с{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-links hover:underline font-medium"
                  >
                    Политикой конфиденциальности
                  </Link>{" "}
                  и  <Link
                    href="/personal-data-consent"
                    className="text-links hover:underline font-medium"
                  >
                    Согласием на обработку персональных данных
                  </Link>.
                </span>
              </label>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="mt-4 w-full h-14"
                loading={isLoading}
                disabled={!isConsentAccepted}
              >
                Отправить
              </Button>
            </div>
          </form>

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
