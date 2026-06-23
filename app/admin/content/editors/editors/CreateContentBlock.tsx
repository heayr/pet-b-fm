"use client";

import { useState } from "react";
import Button from "@/app/components/Button";
import { Alert } from "@/app/components/ui/Alert";
import { createContentBlock } from "@/lib/actions/admin-actions";

interface CreateContentBlockProps {
  onCreated: () => void;
}

export function CreateContentBlock({ onCreated }: CreateContentBlockProps) {
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("draft");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await createContentBlock({
      slug,
      title,
      status,
      content: {},
    });

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    onCreated();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 space-y-4"
    >
      <h3 className="font-semibold text-lg">Новый блок контента</h3>

      {error && <Alert variant="error">{error}</Alert>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Slug
        </label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="services, cases, proposal..."
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-default-lime"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Название
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Наши услуги"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-default-lime"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Статус
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-default-lime"
          required
        >
          <option value="" disabled>
            Выберите статус
          </option>
          <option value="draft">Черновик</option>
          <option value="published">Опубликован</option>
          <option value="archived">Архив</option>
        </select>
      </div>

      <Button type="submit" variant="primary" size="fluid" loading={isLoading}>
        Создать
      </Button>
    </form>
  );
}
