import Link from "next/link";

interface SectionHeaderProps {
  /** Section title displayed in the lime badge */
  title: string;
  /** Subtitle/description text */
  subtitle?: string;
  /** If provided, wraps the title in a Link to this anchor */
  href?: string;
  /** Additional classes for the section wrapper */
  className?: string;
}

/**
 * Reusable section header with lime-highlighted title and optional subtitle.
 * Eliminates duplicated header markup across Cases, Services, ContactForm.
 */
export function SectionHeader({
  title,
  subtitle,
  href,
  className = "",
}: SectionHeaderProps) {
  const titleElement = (
    <h2 className="text-fluid-h2 font-bold bg-default-lime px-4 py-2 rounded-md">
      {title}
    </h2>
  );

  return (
    <div className={`max-w-container mx-auto mb-12 ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {href ? (
          <Link href={href} className="flex-shrink-0">
            {titleElement}
          </Link>
        ) : (
          <div className="flex-shrink-0">{titleElement}</div>
        )}
        {subtitle && (
          <p className="text-fluid-base flex-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}