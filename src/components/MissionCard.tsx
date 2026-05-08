import type { ReactNode } from "react";
import { Button } from "./Button";
import { Card } from "./Card";
import { StatusBadge } from "./StatusBadge";
import type { StatusBadgeTone } from "./StatusBadge";

type MissionCardProps = {
  title: string;
  description: string;
  status?: ReactNode;
  statusTone?: StatusBadgeTone;
  meta?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  disabled?: boolean;
};

/**
 * A reusable mission display surface. It deliberately accepts plain strings
 * and ReactNode slots so data owners can plug in static content without this
 * component depending on app-level types.
 */
export function MissionCard({
  title,
  description,
  status = "Mission",
  statusTone = "active",
  meta,
  actionLabel,
  onAction,
  disabled = false,
}: MissionCardProps) {
  return (
    <Card className="mission-card">
      <div className="mission-card__topline">
        <StatusBadge tone={statusTone}>{status}</StatusBadge>
        {meta ? <span className="mission-card__meta">{meta}</span> : null}
      </div>
      <div className="mission-card__content">
        <h2 className="mission-card__title">{title}</h2>
        <p className="mission-card__description">{description}</p>
      </div>
      {actionLabel ? (
        <Button fullWidth disabled={disabled} onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </Card>
  );
}

export type { MissionCardProps };
