import { useState, type CSSProperties } from "react";
import { QRCodePanel } from "../components/QRCodePanel";
import type { ScreenProps } from "./screenTypes";
import { Button, RosterChips, ScreenFrame } from "./shared";

export default function MissionReview({ session, joinUrl, navigate }: ScreenProps) {
  const [showSpoilers, setShowSpoilers] = useState(false);

  if (!session) {
    return (
      <ScreenFrame title="No host session" actions={<Button onClick={() => navigate("/host")}>Set up host</Button>}>
        <p>Create a roster first to generate a review screen.</p>
      </ScreenFrame>
    );
  }

  return (
    <ScreenFrame
      title="Mission review"
      eyebrow={`${session.roster.length} players, ${session.missions.length} missions`}
      actions={<Button onClick={() => navigate("/awards")}>Awards</Button>}
    >
      <div style={gridStyle}>
        <section style={panelStyle}>
          <h2>Roster</h2>
          <RosterChips names={session.roster.map((player) => player.name)} />
        </section>
        <section style={panelStyle}>
          <h2>Join link</h2>
          <QRCodePanel value={joinUrl} description="Scan this. Enter your name. Keep your mission secret." />
          <input readOnly value={joinUrl} style={inputStyle} onFocus={(event) => event.currentTarget.select()} />
          <p style={mutedStyle}>The encoded game lives after `#/join?g=`, so Vercel static hosting can serve it.</p>
        </section>
        <section style={panelStyle}>
          <h2>Spoiler controls</h2>
          {!showSpoilers ? (
            <div style={warningStyle}>
              <strong>Warning: this reveals private player missions.</strong>
              <p>
                Keep this closed during setup unless the host needs to audit or troubleshoot
                assignments. Guests should not see this section.
              </p>
              <Button variant="danger" onClick={() => setShowSpoilers(true)}>
                Show mission spoilers
              </Button>
            </div>
          ) : (
            <div style={missionGridStyle}>
              <Button variant="secondary" onClick={() => setShowSpoilers(false)}>
                Hide mission spoilers
              </Button>
              {session.assignments.map((assignment) => (
                <details key={assignment.playerSlug} style={detailStyle}>
                  <summary>
                    <strong>{assignment.playerName}</strong>: {assignment.missionTitle}
                  </summary>
                  <p>{assignment.missionText}</p>
                  <p style={mutedStyle}>
                    Secondary with {assignment.targetPlayerName}: {assignment.secondaryMissionText}
                  </p>
                </details>
              ))}
            </div>
          )}
        </section>
      </div>
    </ScreenFrame>
  );
}

const gridStyle: CSSProperties = {
  display: "grid",
  gap: 16,
};

const panelStyle: CSSProperties = {
  padding: 18,
  borderRadius: 8,
  background: "#fff",
};

const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #cfc6b5",
  borderRadius: 8,
  padding: 12,
};

const mutedStyle: CSSProperties = {
  color: "#675f52",
};

const missionGridStyle: CSSProperties = {
  display: "grid",
  gap: 10,
};

const detailStyle: CSSProperties = {
  padding: 12,
  borderRadius: 8,
  background: "#fff7ea",
};

const warningStyle: CSSProperties = {
  display: "grid",
  gap: 10,
  padding: 14,
  borderRadius: 8,
  background: "#fff7ea",
  border: "1px solid #e8b13f",
};
