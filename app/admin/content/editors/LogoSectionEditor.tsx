"use client";

import { useState } from "react";
import SafeImage from "@/app/components/SafeImage";
import Button from "@/app/components/Button";
import { defaultLogos } from "@/app/components/LogoSection";
import { EditorFormFooter } from "@/app/components/ui/EditorFormFooter";
import type { EditorProps } from "./editor-types";

export function LogoSectionEditor({ block, onSave, onCancel }: EditorProps) {
  const content = block.content as Record<string, unknown>;
  const [title, setTitle] = useState((content.title as string) || "Радиоточка");
  const [logos, setLogos] = useState<Array<{ src: string; alt: string }>>(
    (content.logos as Array<{ src: string; alt: string }>) || [],
  );
  const [isLoading, setIsLoading] = useState(false);

  const updateLogo = (idx: number, field: "src" | "alt", value: string) => {
    setLogos((prev) =>
      prev.map((logo, i) => (i === idx ? { ...logo, [field]: value } : logo)),
    );
  };

  const addLogo = () => setLogos((prev) => [...prev, { src: "", alt: "" }]);
  const removeLogo = (idx: number) =>
    setLogos((prev) => prev.filter((_, i) => i !== idx));

  const resetToDefault = () => {
    setLogos(
      defaultLogos.map((l) => ({
        src: l.src,
        alt: l.alt,
      })),
    );
  };

  const resetLogo = (idx: number) => {
    setLogos((prev) =>
      prev.map((logo, i) =>
        i === idx
          ? { src: defaultLogos[i]?.src || "", alt: defaultLogos[i]?.alt || "" }
          : logo,
      ),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSave({ title, logos });
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Название
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded-xl"
        />
      </div>
      <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-xl text-sm">
        <p className="font-medium mb-1">Рекомендации по изображениям:</p>
        <p>
          Размер: 125×50 px. Формат: WebP (приоритет), SVG, PNG. Оптимизируйте
          вес до ~10 КБ.
        </p>
      </div>
      {logos.map((logo, idx) => (
        <div key={idx} className="border p-4 rounded-xl space-y-2">
          <div className="flex items-center gap-4">
            <SafeImage
              src={logo.src}
              alt={logo.alt}
              width={125}
              height={50}
              className="flex-shrink-0 rounded border bg-gray-50"
            />
            <div className="flex-1 space-y-2">
              <input
                value={logo.src}
                onChange={(e) => updateLogo(idx, "src", e.target.value)}
                placeholder="Путь к картинке (/images/...) или https://..."
                className="w-full px-4 py-2 border rounded-xl"
              />
              <input
                value={logo.alt}
                onChange={(e) => updateLogo(idx, "alt", e.target.value)}
                placeholder="Alt текст"
                className="w-full px-4 py-2 border rounded-xl"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => resetLogo(idx)}
            >
              Сбросить к дефолту
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeLogo(idx)}
            >
              Удалить
            </Button>
          </div>
        </div>
      ))}
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={addLogo}>
          + Добавить логотип
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={resetToDefault}
        >
          Сбросить все к дефолту
        </Button>
      </div>
      <EditorFormFooter isLoading={isLoading} onCancel={onCancel} />
    </form>
  );
}
