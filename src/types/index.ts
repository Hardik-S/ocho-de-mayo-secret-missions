/**
 * Shared domain model for Secret Missions: Ocho Edition.
 *
 * The model mirrors the URL-encoded game contract so the app can stay static:
 * all host-generated assignments travel inside the hash link, while each
 * guest's personal progress remains on that device in localStorage.
 */

export type Difficulty = "easy" | "medium" | "hard";

export type MissionCategory =
  | "conversation"
  | "food-drink"
  | "compliment"
  | "misdirection"
  | "observation"
  | "harmless-chaos"
  | "cat-cameo"
  | "host-appreciation";

export type Mission = {
  id: string;
  title: string;
  text: string;
  category: MissionCategory;
  difficulty: Difficulty;
  completionCondition: string;
  hint?: string;
  awardTag: string;
  requiresCat?: boolean;
  mildMode?: boolean;
};

export type PlayerAssignment = {
  playerName: string;
  playerSlug: string;
  missionId: string;
  missionTitle: string;
  missionText: string;
  missionCategory: MissionCategory;
  difficulty: Difficulty;
  completionCondition: string;
  hint?: string;
  awardTag: string;
  targetPlayerName: string;
  targetPlayerSlug: string;
  secondaryMissionText: string;
  status: PlayerStatus;
};

export type EncodedGame = {
  version: 1;
  eventTitle: string;
  subtitle: string;
  seed: string;
  createdAt: string;
  options: {
    allowRerolls: boolean;
    includeCatMissions: boolean;
    mildModeOnly: boolean;
  };
  assignments: PlayerAssignment[];
};

export type PlayerStatus = "active" | "completed" | "caught" | "failed";

export type PlayerState = {
  playerName: string;
  playerSlug: string;
  missionId: string;
  status: PlayerStatus;
  revealedAt?: string;
  bestMoment?: string;
};

export type GameSettings = EncodedGame["options"];

export interface HostSettings extends GameSettings {
  allowRandomFallback: boolean;
  allowPeek: boolean;
  hostControlsReveal: boolean;
  hideMissionAfterReveal: boolean;
}

export interface Player {
  id: string;
  name: string;
}
