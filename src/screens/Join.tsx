import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { decodeGame } from "../utils/encoding";
import type { ScreenProps } from "./screenTypes";
import { Button, RosterChips, ScreenFrame } from "./shared";

export default function Join({
  encodedGame,
  error,
  clearError,
  joinGame,
}: ScreenProps & { encodedGame: string }) {
  const [name, setName] = useState("");
  const [useRandomFallback, setUseRandomFallback] = useState(false);
  const decodedGame = encodedGame ? decodeGame(encodedGame) : null;

  useEffect(() => clearError(), [clearError, encodedGame]);

  return (
    <ScreenFrame title="Join mission" eyebrow="Enter your roster name">
      <form
        style={formStyle}
        onSubmit={(event) => {
          event.preventDefault();
          joinGame(encodedGame, name, useRandomFallback);
        }}
      >
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Name on roster"
          style={inputStyle}
        />
        {decodedGame?.assignments.length ? (
          <div style={chipPanelStyle}>
            <p style={mutedStyle}>Choose your roster name:</p>
            <div style={buttonChipWrapStyle}>
              {decodedGame.assignments.map((assignment) => (
                <button
                  key={assignment.playerSlug}
                  type="button"
                  onClick={() => setName(assignment.playerName)}
                  style={buttonChipStyle}
                >
                  {assignment.playerName}
                </button>
              ))}
            </div>
            <RosterChips names={decodedGame.assignments.map((assignment) => assignment.playerName)} />
          </div>
        ) : null}
        <label style={checkStyle}>
          <input
            type="checkbox"
            checked={useRandomFallback}
            onChange={(event) => setUseRandomFallback(event.target.checked)}
          />
          Use a random mission if my name is not found
        </label>
        {error ? <p style={errorStyle}>{error}</p> : null}
        <Button type="submit">Reveal my mission</Button>
      </form>
    </ScreenFrame>
  );
}

const formStyle: CSSProperties = {
  display: "grid",
  gap: 14,
  maxWidth: 520,
};

const inputStyle: CSSProperties = {
  border: "1px solid #cfc6b5",
  borderRadius: 8,
  padding: 12,
  font: "inherit",
};

const checkStyle: CSSProperties = {
  display: "flex",
  gap: 10,
};

const errorStyle: CSSProperties = {
  color: "#9d2f1f",
  fontWeight: 800,
};

const chipPanelStyle: CSSProperties = {
  display: "grid",
  gap: 10,
};

const mutedStyle: CSSProperties = {
  margin: 0,
  color: "#675f52",
};

const buttonChipWrapStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
};

const buttonChipStyle: CSSProperties = {
  minHeight: 44,
  border: "1px solid #cfc6b5",
  borderRadius: 999,
  padding: "8px 12px",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 800,
};
