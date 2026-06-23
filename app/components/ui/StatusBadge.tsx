interface StatusBadgeProps {
  label: string;
  colorClass: string;
  extra?: string;
}

export function StatusBadge({ label, colorClass, extra }: StatusBadgeProps) {
  return (
    <span className="flex items-center gap-2">
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
      >
        {label}
      </span>
      {extra && <span className="text-xs text-gray-400">{extra}</span>}
    </span>
  );
}
