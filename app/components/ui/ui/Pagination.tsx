import Button from "@/app/components/Button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <Button
        onClick={() => onPageChange(page - 1)}
        variant="outline"
        size="sm"
        disabled={page <= 1}
      >
        Назад
      </Button>
      <span className="text-sm text-gray-600">
        Страница {page} из {totalPages}
      </span>
      <Button
        onClick={() => onPageChange(page + 1)}
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
      >
        Вперёд
      </Button>
    </div>
  );
}
