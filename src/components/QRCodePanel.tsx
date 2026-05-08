import type { ReactNode } from "react";
import QRCode from "react-qr-code";
import { Card } from "./Card";

type QRCodePanelProps = {
  value?: string;
  title?: string;
  description?: string;
  emptyMessage?: string;
  footer?: ReactNode;
};

function QRPlaceholder({ message }: { message: string }) {
  return (
    <div className="qr-panel__placeholder" role="status">
      <span>{message}</span>
    </div>
  );
}

export function QRCodePanel({
  value,
  title = "Scan to play",
  description,
  emptyMessage = "QR code will appear when a link is available.",
  footer,
}: QRCodePanelProps) {
  const hasValue = typeof value === "string" && value.trim().length > 0;

  return (
    <Card className="qr-panel" tone="quiet">
      <div className="qr-panel__copy">
        <h2 className="qr-panel__title">{title}</h2>
        {description ? <p className="qr-panel__description">{description}</p> : null}
      </div>
      <div className="qr-panel__code" aria-live="polite">
        {hasValue ? (
          <QRCode
            aria-label="QR code"
            className="qr-panel__svg"
            size={176}
            value={value.trim()}
          />
        ) : (
          <QRPlaceholder message={emptyMessage} />
        )}
      </div>
      {footer ? <div className="qr-panel__footer">{footer}</div> : null}
    </Card>
  );
}

export type { QRCodePanelProps };
