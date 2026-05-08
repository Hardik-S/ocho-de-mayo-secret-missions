import { Suspense, lazy, type ComponentType, type ReactNode } from "react";
import { Card } from "./Card";

type QRCodePanelProps = {
  value?: string;
  title?: string;
  description?: string;
  emptyMessage?: string;
  footer?: ReactNode;
};

type OptionalQRCodeProps = {
  value: string;
  size: number;
  className?: string;
  "aria-label"?: string;
};

function QRPlaceholder({ message }: { message: string }) {
  return (
    <div className="qr-panel__placeholder" role="status">
      <span>{message}</span>
    </div>
  );
}

/**
 * react-qr-code is treated as an optional peer for this slice because the
 * package manifest is outside this worker's ownership. If it is unavailable in
 * a consuming app, the panel still renders copy and a calm fallback surface.
 */
const qrCodePackage = "react-qr-code";

const OptionalQRCode = lazy(async () => {
  try {
    const module = await import(/* @vite-ignore */ qrCodePackage);
    return { default: module.default as ComponentType<OptionalQRCodeProps> };
  } catch {
    return {
      default: () => <QRPlaceholder message="QR code renderer unavailable" />,
    };
  }
});

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
          <Suspense fallback={<QRPlaceholder message="Preparing QR code" />}>
            <OptionalQRCode
              aria-label="QR code"
              className="qr-panel__svg"
              size={176}
              value={value.trim()}
            />
          </Suspense>
        ) : (
          <QRPlaceholder message={emptyMessage} />
        )}
      </div>
      {footer ? <div className="qr-panel__footer">{footer}</div> : null}
    </Card>
  );
}

export type { QRCodePanelProps };
