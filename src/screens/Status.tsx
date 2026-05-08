import type { CSSProperties } from "react";
import type { MissionStatus, ScreenProps } from "./screenTypes";
import { Button } from "./shared";

const statuses: Array<[MissionStatus, string]> = [
  ["completed", "Completed"],
  ["caught", "Caught"],
  ["failed", "Failed"],
];

export default function Status({ progress, setMissionStatus }: ScreenProps) {
  return (
    <div style={wrapStyle}>
      {statuses.map(([status, label]) => (
        <Button
          key={status}
          variant={progress.status === status ? "primary" : "secondary"}
          onClick={() => setMissionStatus(status)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}

const wrapStyle: CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
};
