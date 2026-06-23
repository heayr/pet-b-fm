import type { ContentBlock } from "@/types/content";

export interface EditorProps {
  block: ContentBlock;
  onSave: (data: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
}