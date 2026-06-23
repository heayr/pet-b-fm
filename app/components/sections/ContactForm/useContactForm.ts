"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Имя обязательно"),
  email: z.string().email("Введите корректный email"),
  message: z.string().min(1, "Сообщение обязательно"),
});

type ContactInput = z.infer<typeof contactSchema>;

const ACCESS_KEY = process.env.NEXT_PUBLIC_ACCESS_KEY_WEB_FORM;

export function useContactForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async (data: ContactInput) => {
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          ...data,
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (res.status === 200) {
        setSuccess(true);
        form.reset();
      } else {
        setError("Ошибка отправки. Попробуйте ещё раз.");
      }
    } catch (err) {
      console.error("Form submit error:", err);
      setError("Произошла ошибка. Проверьте подключение к интернету.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    error,
    success,
    isLoading,
  };
}