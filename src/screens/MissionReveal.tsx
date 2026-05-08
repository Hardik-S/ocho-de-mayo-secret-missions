import { useState } from "react";
import type { CSSProperties } from "react";
import type { ScreenProps } from "./screenTypes";
import { Button, ScreenFrame } from "./shared";

export default function MissionReveal(props: ScreenProps) {
  const { currentMission, playerSession, progress, session, navigate, resetPlayer, setMissionStatus } = props;
  const [visible, setVisible] = useState(progress.status !== "hidden");
  const revealMission = () => {
    setVisible(true);
    if (progress.status === "hidden") {
      setMissionStatus("viewed");
    }
  };

  if (!currentMission || !playerSession) {
    return (
      <ScreenFrame title="Mission missing" actions={<Button onClick={() => navigate("/")}>Home</Button>}>
        <p>Join from a host link to receive your mission.</p>
      </ScreenFrame>
    );
  }

  return (
    <ScreenFrame
      title={`Ready, ${playerSession.playerName}`}
      eyebrow="Your mission is private"
      actions={<Button variant="secondary" onClick={resetPlayer}>Leave game</Button>}
    >
      {visible ? (
        <section style={missionStyle}>
          <h2>{currentMission.missionTitle}</h2>
          <p>{currentMission.missionText}</p>
          <p style={secondaryStyle}>Completion: {currentMission.completionCondition}</p>
          {currentMission.hint ? <p style={secondaryStyle}>Hint: {currentMission.hint}</p> : null}
          <p style={secondaryStyle}>
            Secondary with {currentMission.targetPlayerName}: {currentMission.secondaryMissionText}
          </p>
        </section>
      ) : (
        <section style={missionStyle}>
          <h2>Mission hidden</h2>
          <p>Reveal when nobody is looking.</p>
        </section>
      )}
      <div style={rowStyle}>
        <Button onClick={revealMission}>Reveal</Button>
        <Button variant="secondary" onClick={() => setVisible(false)}>
          Hide
        </Button>
        {session?.settings?.allowPeek ? (
          <Button variant="secondary" onClick={() => setVisible((current) => !current)}>
            Peek
          </Button>
        ) : null}
        <Button variant="secondary" onClick={() => navigate("/reveal")}>
          Finish status
        </Button>
      </div>
    </ScreenFrame>
  );
}

const missionStyle: CSSProperties = {
  padding: 22,
  borderRadius: 8,
  background: "#fff",
  fontSize: 20,
  lineHeight: 1.45,
};

const rowStyle: CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  marginTop: 16,
};

const secondaryStyle: CSSProperties = {
  color: "#675f52",
  fontSize: 15,
};
