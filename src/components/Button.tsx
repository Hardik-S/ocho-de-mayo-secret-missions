import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

/**
 * Shared touch target for the app. The styling lives in globals.css so other
 * workers can compose the primitive without importing CSS modules or changing
 * package configuration.
 */
export function Button({
  children,
  className = "",
  variant = "primary",
  fullWidth = false,
  type = "button",
  ...props
}: ButtonProps) {
  const classes = [
    "ui-button",
    `ui-button--${variant}`,
    fullWidth ? "ui-button--full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
}

export type { ButtonProps, ButtonVariant };
