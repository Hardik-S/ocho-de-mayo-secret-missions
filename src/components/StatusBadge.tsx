import type { HTMLAttributes, ReactNode } from "react";

type StatusBadgeTone = "pending" | "active" | "complete" | "locked" | "neutral";

type StatusBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  tone?: StatusBadgeTone;
};

export function StatusBadge({
  children,
  className = "",
  tone = "neutral",
  ...props
}: StatusBadgeProps) {
  const classes = ["status-badge", `status-badge--${tone}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}

export type { StatusBadgeProps, StatusBadgeTone };
