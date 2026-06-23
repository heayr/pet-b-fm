import { Alert } from "@/app/components/ui/Alert";

interface AuthFormWrapperProps {
  title: string;
  error?: string | null;
  success?: string | null;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthFormWrapper({
  title,
  error,
  success,
  children,
  footer,
}: AuthFormWrapperProps) {
  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      {children}
      {footer && (
        <p className="text-center mt-6 text-sm text-gray-600">{footer}</p>
      )}
    </div>
  );
}
