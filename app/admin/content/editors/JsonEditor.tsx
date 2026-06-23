"use client";

import { useState } from "react";
import type { EditorProps } from "./editor-types";
import { EditorFormFooter } from "@/app/components/ui/EditorFormFooter";

export function JsonEditor({ block, onSave, onCancel }: EditorProps) {
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
      <EditorFormFooter isLoading={isLoading} onCancel={onCancel} />
    </form>
  );
}
