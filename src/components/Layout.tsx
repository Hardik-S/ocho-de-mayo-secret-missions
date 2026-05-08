import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  title?: string;
  eyebrow?: string;
  footer?: ReactNode;
};

/**
 * Mobile-first app shell for the static dinner-party experience. It keeps the
 * first viewport focused on the current activity and leaves routing/data
 * decisions to the workers who own those files.
 */
export function Layout({ children, title = "Secret Missions", eyebrow, footer }: LayoutProps) {
  return (
    <div className="app-shell">
      <header className="app-header">
        {eyebrow ? <p className="app-header__eyebrow">{eyebrow}</p> : null}
        <h1 className="app-header__title">{title}</h1>
      </header>
      <main className="app-main">{children}</main>
      {footer ? <footer className="app-footer">{footer}</footer> : null}
    </div>
  );
}

export type { LayoutProps };
