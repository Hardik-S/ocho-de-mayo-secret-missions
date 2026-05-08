import type { CSSProperties } from "react";
import type { AwardKey, ScreenProps } from "./screenTypes";
import { Button, ScreenFrame } from "./shared";

const awards: Array<[AwardKey, string]> = [
  ["smoothestOperator", "Smoothest Operator"],
  ["mostSuspiciousEnergy", "Most Suspicious Energy"],
  ["bestBitCommitment", "Best Bit Commitment"],
  ["guacWhisperer", "Guac Whisperer"],
  ["catDiplomat", "Cat Diplomat"],
  ["ochoArchivist", "Ocho Archivist"],
  ["mostValuableVibe", "Most Valuable Vibe"],
  ["chaosWithBoundaries", "Chaos With Boundaries"],
];

export default function Awards({ session, progress, manualAwards, setManualAwardWinner, navigate }: ScreenProps) {
  const roster = session?.roster ?? [];

  return (
    <ScreenFrame
      title="Awards"
      eyebrow="Manual winners"
      actions={<Button variant="secondary" onClick={() => navigate("/")}>Home</Button>}
    >
      <div style={gridStyle}>
        {awards.map(([award, label]) => (
          <label key={award} style={labelStyle}>
            {label}
            <select
              value={manualAwards[award] ?? ""}
              onChange={(event) => setManualAwardWinner(award, event.target.value)}
              style={selectStyle}
            >
              <option value="">Choose winner</option>
              {roster.map((player) => (
                <option key={player.id} value={player.name}>
                  {player.name}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      {progress.bestMoment ? (
        <section style={momentStyle}>
          <h2>Saved best moment</h2>
          <p>{progress.bestMoment}</p>
        </section>
      ) : null}
    </ScreenFrame>
  );
}

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 12,
};

const labelStyle: CSSProperties = {
  display: "grid",
  gap: 8,
  padding: 14,
  borderRadius: 8,
  background: "#fff",
  fontWeight: 800,
};

const selectStyle: CSSProperties = {
  border: "1px solid #cfc6b5",
  borderRadius: 8,
  padding: 10,
  font: "inherit",
};

const momentStyle: CSSProperties = {
  marginTop: 16,
  padding: 18,
  borderRadius: 8,
  background: "#fff",
};
