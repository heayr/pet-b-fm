interface AlertProps {
  variant: "error" | "success" | "info";
  children: React.ReactNode;
}

const styles: Record<AlertProps["variant"], string> = {
  error: "bg-red-50 border-red-200 text-red-700",
  success: "bg-green-50 border-green-200 text-green-700",
  info: "bg-blue-50 border-blue-200 text-blue-800",
};

export function Alert({ variant, children }: AlertProps) {
  return (
    <div className={`border px-4 py-3 rounded-xl mb-4 ${styles[variant]}`}>
      {children}
    </div>
  );
}
