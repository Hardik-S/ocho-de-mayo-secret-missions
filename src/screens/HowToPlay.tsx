import type { CSSProperties } from "react";
import { eventConfig } from "../data/eventConfig";
import type { ScreenProps } from "./screenTypes";
import { Button, ScreenFrame } from "./shared";

export default function HowToPlay({ navigate }: ScreenProps) {
  return (
    <ScreenFrame
      title="How to play"
      eyebrow="Four small rules"
      actions={<Button onClick={() => navigate("/")}>Home</Button>}
    >
      <ol style={listStyle}>
        <li>Get your mission.</li>
        <li>Complete it during dinner.</li>
        <li>Do not get caught.</li>
        <li>Reveal at the end.</li>
      </ol>
      <section style={calloutStyle}>
        <h2>Safety note</h2>
        <p>{eventConfig.safetyCopy}</p>
      </section>
      <section style={calloutStyle}>
        <h2>Callout rule</h2>
        <p>{eventConfig.calloutRule}</p>
      </section>
    </ScreenFrame>
  );
}

const listStyle: CSSProperties = {
  display: "grid",
  gap: 14,
  maxWidth: 740,
  padding: "22px 28px",
  borderRadius: 8,
  background: "#fff",
  lineHeight: 1.5,
};

const calloutStyle: CSSProperties = {
  maxWidth: 740,
  marginTop: 16,
  padding: "18px 22px",
  borderRadius: 8,
  background: "#fff",
  lineHeight: 1.5,
};
