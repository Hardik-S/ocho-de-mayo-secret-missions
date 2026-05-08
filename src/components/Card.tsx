import type { HTMLAttributes, ReactNode } from "react";

type CardTone = "default" | "sunny" | "quiet";

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  as?: "article" | "section" | "div";
  tone?: CardTone;
};

/**
 * Rounded paper-surface wrapper used for repeatable content blocks. The
 * component intentionally stays semantic via the `as` prop instead of forcing
 * every card to be an article.
 */
export function Card({
  as: Element = "article",
  children,
  className = "",
  tone = "default",
  ...props
}: CardProps) {
  const classes = ["ui-card", `ui-card--${tone}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <Element className={classes} {...props}>
      {children}
    </Element>
  );
}

export type { CardProps, CardTone };
