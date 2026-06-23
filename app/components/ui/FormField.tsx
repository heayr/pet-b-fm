interface FormFieldProps {
  /** Label text */
  label: string;
  /** Unique field ID (used for htmlFor) */
  id?: string;
  /** Error message to display below the field */
  error?: string;
  /** Whether the field is required */
  required?: boolean;
  /** The input element */
  children: React.ReactNode;
  /** Additional wrapper classes */
  className?: string;
}

/**
 * Reusable form field wrapper: label + input + error message.
 * Eliminates duplicated label/input/error markup across all forms.
 */
export function FormField({
  label,
  id,
  error,
  required,
  children,
  className = "",
}: FormFieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}