"use client";

import { useState } from "react";
import {
  updateContentBlock,
  createContentBlock,
} from "@/lib/actions/admin-actions";
import { useRouter } from "next/navigation";
import Button from "@/app/components/Button";

interface ContentBlock {
  id: string;
  slug: string;
  title: string;
  content: any;
  status: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const statusLabels: Record<string, string> = {
  draft: "Черновик",
  published: "Опубликован",
  archived: "В архиве",
};

const statusColors: Record<string, string> = {
  draft: "bg-yellow-100 text-yellow-800",
  published: "bg-green-100 text-green-800",
  archived: "bg-gray-100 text-gray-800",
};

export default function ContentList({
  blocks,
  canCreate,
}: {
  blocks: ContentBlock[];
  canCreate: boolean;
}) {
  const router = useRouter();
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const handleEdit = (block: ContentBlock) => {
    setEditingSlug(block.slug);
    setEditingBlock(block);
  };

  const renderEditor = () => {
    if (!editingBlock) return null;
    const block = editingBlock;

    switch (block.slug) {
      case "logo-section":
        return (
          <LogoSectionEditor
            block={block}
            onSave={handleSave}
            onCancel={() => {
              setEditingSlug(null);
              setEditingBlock(null);
            }}
          />
        );
      case "services":
        return (
          <ServicesEditor
            block={block}
            onSave={handleSave}
            onCancel={() => {
              setEditingSlug(null);
              setEditingBlock(null);
            }}
          />
        );
      case "cases":
        return (
          <CasesEditor
            block={block}
            onSave={handleSave}
            onCancel={() => {
              setEditingSlug(null);
              setEditingBlock(null);
            }}
          />
        );
      case "proposal":
        return (
          <ProposalEditor
            block={block}
            onSave={handleSave}
            onCancel={() => {
              setEditingSlug(null);
              setEditingBlock(null);
            }}
          />
        );
      default:
        return (
          <JsonEditor
            block={block}
            onSave={handleSave}
            onCancel={() => {
              setEditingSlug(null);
              setEditingBlock(null);
            }}
          />
        );
    }
  };

  const handleSave = async (updated: any) => {
    if (!editingBlock) return;
    const result = await updateContentBlock(editingBlock.slug, updated);
    if (result.error) {
      alert(result.error);
      return;
    }
    setEditingSlug(null);
    setEditingBlock(null);
    router.refresh();
  };

  if (editingSlug && editingBlock) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-semibold text-lg mb-4">
          Редактирование: {editingBlock.title}
        </h3>
        {renderEditor()}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {canCreate && (
        <div className="mb-6">
          <Button
            onClick={() => setShowCreate(!showCreate)}
            variant="primary"
            size="md"
          >
            {showCreate ? "Отмена" : "Создать блок"}
          </Button>
        </div>
      )}

      {showCreate && (
        <CreateContentBlock
          onCreated={() => {
            setShowCreate(false);
            router.refresh();
          }}
        />
      )}

      <div className="grid gap-4">
        {blocks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500">
            Контентные блоки не найдены
          </div>
        ) : (
          blocks.map((block) => (
            <div
              key={block.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{block.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Slug: {block.slug}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[block.status] || statusColors.draft
                      }`}
                    >
                      {statusLabels[block.status] || block.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      v{block.version}
                    </span>
                    <span className="text-xs text-gray-400">
                      Обновлён:{" "}
                      {new Date(block.updatedAt).toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => handleEdit(block)}
                  variant="outline"
                  size="sm"
                >
                  Редактировать
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function LogoSectionEditor({
  block,
  onSave,
  onCancel,
}: {
  block: ContentBlock;
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(block.content?.title || "Радиоточка");
  const [logos, setLogos] = useState<Array<{ src: string; alt: string }>>(
    block.content?.logos || [],
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
      {logos.map((logo, idx) => (
        <div key={idx} className="border p-4 rounded-xl space-y-2">
          <input
            value={logo.src}
            onChange={(e) => updateLogo(idx, "src", e.target.value)}
            placeholder="Путь к картинке (/images/...)"
            className="w-full px-4 py-2 border rounded-xl"
          />
          <input
            value={logo.alt}
            onChange={(e) => updateLogo(idx, "alt", e.target.value)}
            placeholder="Alt текст"
            className="w-full px-4 py-2 border rounded-xl"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeLogo(idx)}
          >
            Удалить
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addLogo}>
        + Добавить логотип
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

function ServicesEditor({
  block,
  onSave,
  onCancel,
}: {
  block: ContentBlock;
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(block.content?.title || "Наши услуги");
  const [items, setItems] = useState(block.content?.items || []);
  const [isLoading, setIsLoading] = useState(false);

  const updateItem = (idx: number, field: string, value: string) => {
    setItems((prev: any[]) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)),
    );
  };

  const addItem = () =>
    setItems((prev: any[]) => [
      ...prev,
      { title: "", description: "", icon: "" },
    ]);
  const removeItem = (idx: number) =>
    setItems((prev: any[]) => prev.filter((_, i) => i !== idx));

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
      {items.map((item: any, idx: number) => (
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
          <input
            value={item.icon}
            onChange={(e) => updateItem(idx, "icon", e.target.value)}
            placeholder="Иконка (опционально)"
            className="w-full px-4 py-2 border rounded-xl"
          />
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
        + Добавить услугу
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

function CasesEditor({
  block,
  onSave,
  onCancel,
}: {
  block: ContentBlock;
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(block.content?.title || "Наши проекты");
  const [subtitle, setSubtitle] = useState(block.content?.subtitle || "");
  const [items, setItems] = useState(block.content?.items || []);
  const [isLoading, setIsLoading] = useState(false);

  const updateItem = (idx: number, field: string, value: string) => {
    setItems((prev: any[]) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)),
    );
  };

  const addItem = () =>
    setItems((prev: any[]) => [...prev, { text: "", link: "" }]);
  const removeItem = (idx: number) =>
    setItems((prev: any[]) => prev.filter((_, i) => i !== idx));

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
      {items.map((item: any, idx: number) => (
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

function ProposalEditor({
  block,
  onSave,
  onCancel,
}: {
  block: ContentBlock;
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(
    block.content?.title || "Давайте создавать вместе",
  );
  const [description, setDescription] = useState(
    block.content?.description || "",
  );
  const [buttonText, setButtonText] = useState(
    block.content?.buttonText || "Получить предложение",
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

function JsonEditor({
  block,
  onSave,
  onCancel,
}: {
  block: ContentBlock;
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [json, setJson] = useState(JSON.stringify(block.content, null, 2));
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const parsed = JSON.parse(json);
      await onSave(parsed);
    } catch {
      alert("Неверный JSON");
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={json}
        onChange={(e) => setJson(e.target.value)}
        rows={10}
        className="w-full px-4 py-2 border rounded-xl font-mono text-sm"
      />
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

function CreateContentBlock({ onCreated }: { onCreated: () => void }) {
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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

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
        >
          <option value="draft">Черновик</option>
          <option value="published">Опубликован</option>
          <option value="archived">В архиве</option>
        </select>
      </div>

      <Button type="submit" variant="primary" size="fluid" loading={isLoading}>
        Создать
      </Button>
    </form>
  );
}
