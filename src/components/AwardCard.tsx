import type { ReactNode } from "react";
import { Card } from "./Card";
import { StatusBadge } from "./StatusBadge";

type AwardCardProps = {
  title: string;
  recipient?: string;
  description?: string;
  icon?: ReactNode;
  label?: ReactNode;
};

/**
 * Compact award summary for end-of-night reveals. The optional icon slot avoids
 * hardcoding visual symbols that could feel tacky or culturally off-tone.
 */
export function AwardCard({ title, recipient, description, icon, label }: AwardCardProps) {
  return (
    <Card className="award-card" tone="sunny">
      <div className="award-card__header">
        {icon ? <div className="award-card__icon" aria-hidden="true">{icon}</div> : null}
        {label ? <StatusBadge tone="complete">{label}</StatusBadge> : null}
      </div>
      <div className="award-card__body">
        <h2 className="award-card__title">{title}</h2>
        {recipient ? <p className="award-card__recipient">{recipient}</p> : null}
        {description ? <p className="award-card__description">{description}</p> : null}
      </div>
    </Card>
  );
}

export type { AwardCardProps };
