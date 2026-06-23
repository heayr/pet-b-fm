"use client";

import { useState } from "react";
import Button from "@/app/components/Button";
import type { EditorProps } from "./editor-types";

export function ProposalEditor({ block, onSave, onCancel }: EditorProps) {
  const content = block.content as Record<string, unknown>;
  const [title, setTitle] = useState(
    (content.title as string) || "Давайте создавать вместе",
  );
  const [description, setDescription] = useState(
    (content.description as string) || "",
  );
  const [buttonText, setButtonText] = useState(
    (content.buttonText as string) || "Получить предложение",
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSave({ title, description, buttonText });
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
          Описание
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border rounded-xl"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Текст кнопки
        </label>
        <input
          value={buttonText}
          onChange={(e) => setButtonText(e.target.value)}
          className="w-full px-4 py-2 border rounded-xl"
        />
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
