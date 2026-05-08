import type { CSSProperties, PropsWithChildren, ReactNode } from "react";

export function ScreenFrame({
  title,
  eyebrow,
  actions,
  children,
}: PropsWithChildren<{ title: string; eyebrow?: string; actions?: ReactNode }>) {
  return (
    <section style={frameStyle}>
      <header style={headerStyle}>
        <div>
          {eyebrow ? <p style={eyebrowStyle}>{eyebrow}</p> : null}
          <h1 style={titleStyle}>{title}</h1>
        </div>
        {actions ? <div style={actionRowStyle}>{actions}</div> : null}
      </header>
      {children}
    </section>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
}: PropsWithChildren<{
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  type?: "button" | "submit";
}>) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        ...buttonStyle,
        ...(variant === "primary" ? primaryButtonStyle : {}),
        ...(variant === "secondary" ? secondaryButtonStyle : {}),
        ...(variant === "danger" ? dangerButtonStyle : {}),
      }}
    >
      {children}
    </button>
  );
}

export function RosterChips({ names }: { names: string[] }) {
  return (
    <div style={chipWrapStyle}>
      {names.map((name) => (
        <span key={name} style={chipStyle}>
          {name}
        </span>
      ))}
    </div>
  );
}

const frameStyle: CSSProperties = {
  width: "min(920px, 100%)",
  margin: "0 auto",
};

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 20,
  marginBottom: 28,
};

const eyebrowStyle: CSSProperties = {
  margin: "0 0 8px",
  textTransform: "uppercase",
  fontSize: 12,
  letterSpacing: 1.6,
  color: "#725c20",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(32px, 7vw, 72px)",
  lineHeight: 0.95,
};

const actionRowStyle: CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  justifyContent: "flex-end",
};

const buttonStyle: CSSProperties = {
  border: 0,
  borderRadius: 8,
  padding: "11px 14px",
  fontWeight: 700,
  cursor: "pointer",
};

const primaryButtonStyle: CSSProperties = {
  background: "#111",
  color: "#fff",
};

const secondaryButtonStyle: CSSProperties = {
  background: "#fff",
  color: "#111",
  boxShadow: "inset 0 0 0 1px #cfc6b5",
};

const dangerButtonStyle: CSSProperties = {
  background: "#9d2f1f",
  color: "#fff",
};

const chipWrapStyle: CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
};

const chipStyle: CSSProperties = {
  borderRadius: 999,
  padding: "8px 10px",
  background: "#fff",
  boxShadow: "inset 0 0 0 1px #d7cbb8",
  fontWeight: 700,
};
