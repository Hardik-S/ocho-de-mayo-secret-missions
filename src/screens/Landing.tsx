import type { CSSProperties } from "react";
import type { ScreenProps } from "./screenTypes";
import { Button, ScreenFrame } from "./shared";

export default function Landing({ navigate }: ScreenProps) {
  return (
    <ScreenFrame title="Secret Missions: Ocho Edition" eyebrow="A tiny secret game for dinner.">
      <div style={panelStyle}>
        <p style={leadStyle}>Complete your mission. Don't get caught.</p>
        <div style={rowStyle}>
          <Button onClick={() => navigate("/join")}>Join the Mission</Button>
          <Button variant="secondary" onClick={() => navigate("/host")}>Host Setup</Button>
          <Button variant="secondary" onClick={() => navigate("/how-to-play")}>
            How to Play
          </Button>
        </div>
      </div>
    </ScreenFrame>
  );
}

const panelStyle: CSSProperties = {
  maxWidth: 680,
  padding: 24,
  borderRadius: 8,
  background: "#fff",
  boxShadow: "0 18px 50px rgba(32, 24, 12, 0.12)",
};

const leadStyle: CSSProperties = {
  marginTop: 0,
  fontSize: 20,
  lineHeight: 1.45,
};

const rowStyle: CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};
