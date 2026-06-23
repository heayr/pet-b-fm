"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { updateContentBlock } from "@/lib/actions/admin-actions";
import Button from "@/app/components/Button";
import type { ContentBlock } from "@/types/content";
import { StatusBadge } from "@/app/components/ui/StatusBadge";
import { STATUS_LABELS, STATUS_COLORS } from "@/constants/statuses";
import type { EditorProps } from "./editors/editor-types";
import { LogoSectionEditor } from "./editors/LogoSectionEditor";
import { ServicesEditor } from "./editors/ServicesEditor";
import { CasesEditor } from "./editors/CasesEditor";
import { ProposalEditor } from "./editors/ProposalEditor";
import { JsonEditor } from "./editors/JsonEditor";
import { CreateContentBlock } from "./editors/CreateContentBlock";

interface ContentListProps {
  blocks: ContentBlock[];
  canCreate: boolean;
}

const editorMap: Record<string, React.ComponentType<EditorProps>> = {
  "logo-section": LogoSectionEditor,
  services: ServicesEditor,
  cases: CasesEditor,
  proposal: ProposalEditor,
};

export default function ContentList({ blocks, canCreate }: ContentListProps) {
  const router = useRouter();
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const handleCancel = useCallback(() => setEditingBlock(null), []);

  const handleSave = useCallback(
    async (updated: Record<string, unknown>) => {
      if (!editingBlock) return;
      const result = await updateContentBlock(editingBlock.slug, {
        content: updated,
      });
      if (result.error) {
        alert(result.error);
        return;
      }
      setEditingBlock(null);
      router.refresh();
    },
    [editingBlock, router],
  );

  if (editingBlock) {
    const Editor = editorMap[editingBlock.slug] ?? JsonEditor;
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-semibold text-lg mb-4">
          Редактирование: {editingBlock.title}
        </h3>
        <Editor
          block={editingBlock}
          onSave={handleSave}
          onCancel={handleCancel}
        />
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
                  <StatusBadge
                    label={STATUS_LABELS[block.status] || block.status}
                    colorClass={
                      STATUS_COLORS[block.status] || STATUS_COLORS.draft
                    }
                    extra={`v${block.version} · ${new Date(block.updatedAt).toLocaleDateString("ru-RU")}`}
                  />
                </div>
                <Button
                  onClick={() => setEditingBlock(block)}
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
