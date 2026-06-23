"use client";

import { useState } from "react";
import SafeImage from "@/app/components/SafeImage";
import Button from "@/app/components/Button";
import { ImageHint } from "./ImageHint";
import type { EditorProps } from "./editor-types";

export function CasesEditor({ block, onSave, onCancel }: EditorProps) {
  const content = block.content as Record<string, unknown>;
  const [title, setTitle] = useState(
    (content.title as string) || "Наши проекты",
  );
  const [subtitle, setSubtitle] = useState((content.subtitle as string) || "");
  const [items, setItems] = useState<Record<string, string>[]>(
    (content.items as Record<string, string>[]) || [],
  );
  const [isLoading, setIsLoading] = useState(false);

  const updateItem = (idx: number, field: string, value: string) => {
    setItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)),
    );
  };

  const addItem = () =>
    setItems((prev) => [...prev, { text: "", link: "", imageSrc: "" }]);
  const removeItem = (idx: number) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));

  const resetItem = (idx: number) => {
    setItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, imageSrc: "" } : item)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSave({ title, subtitle, items });
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Подзаголовок
        </label>
        <input
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="w-full px-4 py-2 border rounded-xl"
        />
      </div>
      <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-xl text-sm">
        <p className="font-medium mb-1">Рекомендации по изображениям кейсов:</p>
        <p>
          Размер: 400×200 px (cover). Формат: WebP (приоритет), JPG, PNG.
          Оптимизируйте вес до ~30 КБ.
        </p>
      </div>
      {items.map((item, idx) => (
        <div key={idx} className="border p-4 rounded-xl space-y-2">
          <textarea
            value={item.text}
            onChange={(e) => updateItem(idx, "text", e.target.value)}
            placeholder="Текст кейса"
            className="w-full px-4 py-2 border rounded-xl"
            rows={3}
          />
          <input
            value={item.link}
            onChange={(e) => updateItem(idx, "link", e.target.value)}
            placeholder="Ссылка"
            className="w-full px-4 py-2 border rounded-xl"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Изображение (опционально)
            </label>
            {item.imageSrc ? (
              <>
                <div className="flex items-center gap-4">
                  <SafeImage
                    src={item.imageSrc}
                    alt=""
                    width={80}
                    height={80}
                    className="flex-shrink-0 rounded border bg-gray-50"
                  />
                  <input
                    value={item.imageSrc}
                    onChange={(e) =>
                      updateItem(idx, "imageSrc", e.target.value)
                    }
                    placeholder="/images/... или https://..."
                    className="flex-1 px-4 py-2 border rounded-xl"
                  />
                </div>
                <ImageHint url={item.imageSrc} />
              </>
            ) : (
              <>
                <input
                  value={item.imageSrc}
                  onChange={(e) => updateItem(idx, "imageSrc", e.target.value)}
                  placeholder="/images/... или https://..."
                  className="w-full px-4 py-2 border rounded-xl"
                />
                <ImageHint url={item.imageSrc} />
              </>
            )}
            {item.imageSrc && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => resetItem(idx)}
                className="mt-2"
              >
                Сбросить изображение
              </Button>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeItem(idx)}
          >
            Удалить
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addItem}>
        + Добавить кейс
      </Button>
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
