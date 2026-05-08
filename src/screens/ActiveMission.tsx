import type { CSSProperties } from "react";
import type { ScreenProps } from "./screenTypes";
import Status from "./Status";

export default function ActiveMission(props: ScreenProps) {
  const { currentMission, progress, setBestMoment } = props;

  return (
    <section style={panelStyle}>
      <h2>{currentMission?.missionText ?? "Mission status"}</h2>
      <Status {...props} />
      <label style={labelStyle}>
        Best moment
        <textarea
          value={progress.bestMoment}
          onChange={(event) => setBestMoment(event.target.value)}
          rows={4}
          style={textareaStyle}
        />
      </label>
    </section>
  );
}

const panelStyle: CSSProperties = {
  display: "grid",
  gap: 14,
  padding: 18,
  borderRadius: 8,
  background: "#fff",
};

const labelStyle: CSSProperties = {
  display: "grid",
  gap: 8,
  fontWeight: 800,
};

const textareaStyle: CSSProperties = {
  border: "1px solid #cfc6b5",
  borderRadius: 8,
  padding: 12,
  font: "inherit",
};
