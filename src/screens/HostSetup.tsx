import { useState } from "react";
import type { CSSProperties } from "react";
import { eventConfig } from "../data/eventConfig";
import type { HostSettings, ScreenProps } from "./screenTypes";
import { Button, ScreenFrame } from "./shared";

export default function HostSetup({ createHostSession, error, navigate }: ScreenProps) {
  const [eventTitle, setEventTitle] = useState(eventConfig.eventTitle);
  const [subtitle, setSubtitle] = useState(eventConfig.subtitle);
  const [namesText, setNamesText] = useState(eventConfig.defaultGuestNames.join("\n"));
  const [settings, setSettings] = useState<HostSettings>({
    allowRerolls: true,
    includeCatMissions: true,
    mildModeOnly: false,
    allowRandomFallback: true,
    allowPeek: true,
    hostControlsReveal: true,
    hideMissionAfterReveal: true,
  } as HostSettings);

  const updateSetting = (key: keyof HostSettings) => {
    setSettings((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <ScreenFrame
      title="Host setup"
      eyebrow="Roster and admin settings"
      actions={<Button variant="secondary" onClick={() => navigate("/")}>Home</Button>}
    >
      <form
        style={formStyle}
        onSubmit={(event) => {
          event.preventDefault();
          createHostSession(
            namesText
              .split(/\r?\n|,/)
              .map((name) => name.trim())
              .filter(Boolean),
            settings,
            eventTitle,
            subtitle,
          );
        }}
      >
        <label style={labelStyle}>
          Event title
          <input value={eventTitle} onChange={(event) => setEventTitle(event.target.value)} style={inputStyle} />
        </label>
        <label style={labelStyle}>
          Subtitle
          <input value={subtitle} onChange={(event) => setSubtitle(event.target.value)} style={inputStyle} />
        </label>
        <label style={labelStyle}>
          Roster
          <textarea
            value={namesText}
            onChange={(event) => setNamesText(event.target.value)}
            rows={8}
            style={textareaStyle}
          />
        </label>
        <div style={settingsStyle}>
          {[
            ["allowRandomFallback", "Allow random fallback for unknown names"],
            ["allowRerolls", "Allow mission rerolls"],
            ["allowPeek", "Players can peek after hiding"],
            ["hostControlsReveal", "Host controls final reveal phase"],
            ["hideMissionAfterReveal", "Hide mission after first reveal"],
            ["includeCatMissions", "Include cat missions"],
            ["mildModeOnly", "Use mild mode only"],
          ].map(([key, label]) => (
            <label key={key} style={checkStyle}>
              <input
                type="checkbox"
                checked={Boolean(settings[key as keyof HostSettings])}
                onChange={() => updateSetting(key as keyof HostSettings)}
              />
              {label}
            </label>
          ))}
        </div>
        {error ? <p style={errorStyle}>{error}</p> : null}
        <Button type="submit">Generate join link</Button>
      </form>
    </ScreenFrame>
  );
}

const formStyle: CSSProperties = {
  display: "grid",
  gap: 18,
  maxWidth: 720,
};

const labelStyle: CSSProperties = {
  display: "grid",
  gap: 8,
  fontWeight: 800,
};

const textareaStyle: CSSProperties = {
  minHeight: 190,
  border: "1px solid #cfc6b5",
  borderRadius: 8,
  padding: 12,
  font: "inherit",
};

const inputStyle: CSSProperties = {
  border: "1px solid #cfc6b5",
  borderRadius: 8,
  padding: 12,
  font: "inherit",
};

const settingsStyle: CSSProperties = {
  display: "grid",
  gap: 10,
};

const checkStyle: CSSProperties = {
  display: "flex",
  gap: 10,
  alignItems: "center",
};

const errorStyle: CSSProperties = {
  color: "#9d2f1f",
  fontWeight: 800,
};
