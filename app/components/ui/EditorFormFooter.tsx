import Button from "@/app/components/Button";

interface EditorFormFooterProps {
  /** Whether the save operation is in progress */
  isLoading: boolean;
  /** Handler for the cancel button */
  onCancel: () => void;
  /** Custom save button label (default: "Сохранить") */
  saveLabel?: string;
  /** Custom cancel button label (default: "Отмена") */
  cancelLabel?: string;
}

/**
 * Reusable Save/Cancel footer for content editors.
 * Eliminates duplicated button groups across all editors.
 */
export function EditorFormFooter({
  isLoading,
  onCancel,
  saveLabel = "Сохранить",
  cancelLabel = "Отмена",
}: EditorFormFooterProps) {
  return (
    <div className="flex gap-3">
      <Button type="submit" variant="primary" size="md" loading={isLoading}>
        {saveLabel}
      </Button>
      <Button type="button" variant="outline" size="md" onClick={onCancel}>
        {cancelLabel}
      </Button>
    </div>
  );
}