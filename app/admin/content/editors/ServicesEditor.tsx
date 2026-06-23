"use client";

import { useState } from "react";
import SafeImage from "@/app/components/SafeImage";
import Button from "@/app/components/Button";
import type { EditorProps } from "./editor-types";

interface ServiceItem {
  title: string;
  description?: string;
  imageSrc: string;
  bgColor: string;
  textColor: string;
}

export function ServicesEditor({ block, onSave, onCancel }: EditorProps) {
  const content = block.content as Record<string, unknown>;
  const [title, setTitle] = useState(
    (content.title as string) || "Наши услуги",
  );
  const [items, setItems] = useState<ServiceItem[]>(
    (content.items as ServiceItem[]) || [],
  );
  const [isLoading, setIsLoading] = useState(false);

  const defaultItems: ServiceItem[] = [
    {
      title: "Полиграфия",
      imageSrc: "/images/web-search-with-elements 2.svg",
      bgColor: "bg-default-grey",
      textColor: "text-black",
      description: "",
    },
    {
      title: "Создание Контента",
      imageSrc: "/images/content.svg",
      bgColor: "bg-default-lime",
      textColor: "text-white",
      description: "",
    },
    {
      title: "Наружная Реклама",
      imageSrc: "/images/smm.svg",
      bgColor: "bg-black",
      textColor: "text-default-grey",
      description: "",
    },
    {
      title: "Радио",
      imageSrc: "/images/main-illustration.svg",
      bgColor: "bg-default-grey",
      textColor: "text-black",
      description: "",
    },
  ];

  const updateItem = (idx: number, field: keyof ServiceItem, value: string) => {
    setItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)),
    );
  };

  const addItem = () =>
    setItems((prev) => [
      ...prev,
      { title: "", description: "", imageSrc: "", bgColor: "", textColor: "" },
    ]);
  const removeItem = (idx: number) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));

  const resetItem = (idx: number) => {
    const def = defaultItems[idx];
    if (!def) return;
    setItems((prev) =>
      prev.map((item, i) =>
        i === idx
          ? {
              title: def.title,
              imageSrc: def.imageSrc,
              bgColor: def.bgColor,
              textColor: def.textColor,
              description: item.description,
            }
          : item,
      ),
    );
  };

  const resetAll = () => {
    setItems(
      defaultItems.map((it) => ({
        title: it.title,
        imageSrc: it.imageSrc,
        bgColor: it.bgColor,
        textColor: it.textColor,
      })),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSave({ title, items });
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Заголовок
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded-xl"
        />
      </div>
      <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-xl text-sm">
        <p className="font-medium mb-1">Рекомендации по изображениям услуг:</p>
        <p>
          Размер: 120×94 px. Формат: WebP (приоритет), SVG, PNG. Оптимизируйте
          вес до ~15 КБ.
        </p>
      </div>
      {items.map((item, idx) => (
        <div key={idx} className="border p-4 rounded-xl space-y-2">
          <input
            value={item.title}
            onChange={(e) => updateItem(idx, "title", e.target.value)}
            placeholder="Название"
            className="w-full px-4 py-2 border rounded-xl"
          />
          <textarea
            value={item.description}
            onChange={(e) => updateItem(idx, "description", e.target.value)}
            placeholder="Описание"
            className="w-full px-4 py-2 border rounded-xl"
          />
          <div className="flex items-center gap-4">
            <SafeImage
              src={item.imageSrc}
              alt={item.title}
              width={120}
              height={94}
              className="flex-shrink-0 rounded border bg-gray-50"
            />
            <input
              value={item.imageSrc}
              onChange={(e) => updateItem(idx, "imageSrc", e.target.value)}
              placeholder="/images/... или https://..."
              className="flex-1 px-4 py-2 border rounded-xl"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => resetItem(idx)}
            >
              Сбросить к дефолту
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeItem(idx)}
            >
              Удалить
            </Button>
          </div>
        </div>
      ))}
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          + Добавить услугу
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={resetAll}>
          Сбросить все к дефолту
        </Button>
      </div>
      <div className="flex gap-3">
        <Button type="submit" variant="primary" size="md" loading={isLoading}>
          Сохранить
        </Button>
        <Button type="button" variant="outline" size="md" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </form>
  );
}
