"use client";

import Link from "next/link";
import { forwardRef } from "react";

interface ButtonProps {
  children: React.ReactNode;
  /** если передан — компонент работает как Link (Next.js) */
  href?: string;
  /** если true — всегда button, даже если href передан */
  asButton?: boolean;
  /** тип для form button */
  type?: "button" | "submit" | "reset";
  /** визуальный вариант */
  variant?: "primary" | "secondary" | "outline" | "ghost";
  /** размер: sm | md | lg | fluid (fluid использует clamp-значения) */
  size?: "sm" | "md" | "lg" | "fluid";
  /** disabled-состояние */
  disabled?: boolean;
  /** показать спиннер загрузки */
  loading?: boolean;
  /** обработчик клика */
  onClick?: (e: React.MouseEvent) => void;
  /** дополнительные классы поверх базовых */
  className?: string;
  /** aria-label для доступности */
  ariaLabel?: string;
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-dark text-white border-2 border-dark hover:bg-default-lime hover:text-black hover:border-default-lime",
  secondary:
    "bg-default-lime text-black border-2 border-default-lime hover:bg-black hover:text-white hover:border-black",
  outline:
    "bg-transparent text-black border-2 border-black hover:bg-default-lime hover:border-default-lime hover:text-black",
  ghost:
    "bg-transparent text-black border-2 border-transparent hover:bg-default-lime hover:text-black",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-4 py-2 text-fluid-sm rounded-lg",
  md: "px-6 py-3 text-fluid-base rounded-xl",
  lg: "px-8 py-4 text-fluid-lg rounded-2xl",
  fluid: "px-fluid-btn-x py-fluid-btn-y text-fluid-base rounded-xl",
};

const disabledStyles = "opacity-50 cursor-not-allowed pointer-events-none";
const loadingStyles = "cursor-wait";

/** Простой SVG-спиннер */
function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin h-5 w-5 ${className ?? ""}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      children,
      href,
      asButton = false,
      type = "button",
      variant = "primary",
      size = "md",
      disabled = false,
      loading = false,
      onClick,
      className = "",
      ariaLabel,
    },
    ref,
  ) => {
    const baseClasses = [
      "flex items-center justify-center gap-2",
      "font-medium",
      "transition-all duration-300 ease-in-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-default-lime focus-visible:ring-offset-2",
      "active:scale-[0.97]",
      variantStyles[variant],
      sizeStyles[size],
      disabled || loading ? disabledStyles : "",
      loading ? loadingStyles : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // Режим ссылки (Next.js Link)
    if (href && !asButton) {
      return (
        <Link
          href={disabled ? "#" : href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={baseClasses}
          aria-label={ariaLabel}
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : undefined}
          onClick={(e) => {
            if (disabled || loading) {
              e.preventDefault();
              return;
            }
            onClick?.(e as unknown as React.MouseEvent);
          }}
        >
          {loading && <Spinner />}
          {children}
        </Link>
      );
    }

    // Режим обычной кнопки
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        disabled={disabled || loading}
        className={baseClasses}
        aria-label={ariaLabel}
        aria-busy={loading || undefined}
        onClick={(e) => {
          if (disabled || loading) {
            e.preventDefault();
            return;
          }
          onClick?.(e);
        }}
      >
        {loading && <Spinner />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
