import type { EncodedGame, GameSettings, Mission, PlayerAssignment } from "../types";

export type AppRoute =
  | "/"
  | "/how-to-play"
  | "/host"
  | "/host/review"
  | "/join"
  | "/mission"
  | "/reveal"
  | "/awards";

export type AwardKey =
  | "smoothestOperator"
  | "mostSuspiciousEnergy"
  | "bestBitCommitment"
  | "guacWhisperer"
  | "catDiplomat"
  | "ochoArchivist"
  | "mostValuableVibe"
  | "chaosWithBoundaries";

export type ManualAwardWinners = Partial<Record<AwardKey, string>>;

export type MissionStatus = "hidden" | "viewed" | "completed" | "caught" | "failed";

export type HostAdminSettings = {
  allowRandomFallback: boolean;
  allowPeek: boolean;
  hostControlsReveal: boolean;
  hideMissionAfterReveal: boolean;
};

export type HostSettings = GameSettings & HostAdminSettings;

export type RosterPlayer = {
  id: string;
  name: string;
  slug: string;
};

export type GameSession = EncodedGame & {
  gameId: string;
  roster: RosterPlayer[];
  missions: Mission[];
  settings: HostSettings;
};

export type PlayerSession = {
  gameId: string;
  playerName: string;
  missionId: string;
  joinedAt: string;
};

export type MissionProgress = {
  status: MissionStatus;
  bestMoment: string;
  updatedAt: string;
};

export type Navigate = (route: AppRoute, query?: URLSearchParams | string) => void;

export type ScreenProps = {
  session: GameSession | null;
  playerSession: PlayerSession | null;
  currentMission: PlayerAssignment | null;
  progress: MissionProgress;
  joinUrl: string;
  error: string;
  manualAwards: ManualAwardWinners;
  navigate: Navigate;
  createHostSession: (names: string[], settings: HostSettings, eventTitle?: string, subtitle?: string) => void;
  joinGame: (encodedGame: string, rawName: string, useRandomFallback: boolean) => boolean;
  setMissionStatus: (status: MissionStatus) => void;
  setBestMoment: (bestMoment: string) => void;
  setManualAwardWinner: (award: AwardKey, winner: string) => void;
  resetPlayer: () => void;
  clearError: () => void;
};
