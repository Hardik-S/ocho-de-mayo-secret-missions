import { useCallback, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { eventConfig } from "./data/eventConfig";
import { missions } from "./data/missions";
import { assignMissions, normalizeName, slugName } from "./utils/assignment";
import { decodeGame, encodeGame } from "./utils/encoding";
import { STORAGE_KEYS } from "./utils/storage";
import type { Mission } from "./types";
import Awards from "./screens/Awards";
import HostSetup from "./screens/HostSetup";
import HowToPlay from "./screens/HowToPlay";
import Join from "./screens/Join";
import Landing from "./screens/Landing";
import MissionReveal from "./screens/MissionReveal";
import MissionReview from "./screens/MissionReview";
import ActiveMission from "./screens/ActiveMission";
import RevealPhase from "./screens/RevealPhase";
import type {
  AppRoute,
  AwardKey,
  GameSession,
  HostSettings,
  ManualAwardWinners,
  MissionProgress,
  MissionStatus,
  Navigate,
  PlayerSession,
  RosterPlayer,
} from "./screens/screenTypes";

const HOST_STORAGE_KEY = STORAGE_KEYS.game;
const PLAYER_STORAGE_KEY = STORAGE_KEYS.player;
const PROGRESS_STORAGE_KEY = "ocho.mission.progress.v1";
const AWARDS_STORAGE_KEY = "ocho.awards.v1";

const defaultSettings: HostSettings = {
  ...eventConfig.defaultSettings,
  allowRandomFallback: true,
  allowPeek: true,
  hostControlsReveal: true,
  hideMissionAfterReveal: true,
};

function safeRead<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function encodeSession(session: GameSession): string {
  return encodeGame(session);
}

function decodeSession(encoded: string): GameSession | null {
  try {
    return decodeGame(encoded) as GameSession;
  } catch {
    return null;
  }
}

function createPlayer(name: string, index: number): RosterPlayer {
  const normalized = normalizeName(name);
  return {
    id: `${slugName(normalized)}-${index + 1}`,
    name: normalized,
    slug: slugName(normalized),
  };
}

function getRouteFromHash(): { route: AppRoute; params: URLSearchParams } {
  const hash = window.location.hash || "#/";
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  const [path = "/", query = ""] = raw.split("?");
  const route = path === "" ? "/" : path;
  const knownRoutes = new Set<AppRoute>([
    "/",
    "/how-to-play",
    "/host",
    "/host/review",
    "/join",
    "/mission",
    "/reveal",
    "/awards",
  ]);

  return {
    route: knownRoutes.has(route as AppRoute) ? (route as AppRoute) : "/",
    params: new URLSearchParams(query),
  };
}

export default function App() {
  const [routeState, setRouteState] = useState(getRouteFromHash);
  const [session, setSession] = useState<GameSession | null>(() => safeRead(HOST_STORAGE_KEY, null));
  const [playerSession, setPlayerSession] = useState<PlayerSession | null>(() =>
    safeRead(PLAYER_STORAGE_KEY, null),
  );
  const [progress, setProgress] = useState<MissionProgress>(() =>
    safeRead(PROGRESS_STORAGE_KEY, {
      status: "hidden",
      bestMoment: "",
      updatedAt: new Date().toISOString(),
    } as MissionProgress),
  );
  const [manualAwards, setManualAwards] = useState<ManualAwardWinners>(() =>
    safeRead(AWARDS_STORAGE_KEY, {}),
  );
  const [error, setError] = useState("");

  useEffect(() => {
    const syncRoute = () => setRouteState(getRouteFromHash());
    window.addEventListener("hashchange", syncRoute);
    syncRoute();
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  useEffect(() => {
    if (session) {
      safeWrite(HOST_STORAGE_KEY, session);
    }
  }, [session]);

  useEffect(() => safeWrite(PLAYER_STORAGE_KEY, playerSession), [playerSession]);
  useEffect(() => safeWrite(PROGRESS_STORAGE_KEY, progress), [progress]);
  useEffect(() => safeWrite(AWARDS_STORAGE_KEY, manualAwards), [manualAwards]);

  const navigate = useCallback<Navigate>((route, query) => {
    const queryText =
      typeof query === "string" ? query : query instanceof URLSearchParams ? query.toString() : "";
    window.location.hash = queryText ? `${route}?${queryText}` : route;
  }, []);

  const createHostSession = useCallback(
    (names: string[], selectedSettings: HostSettings, eventTitle = eventConfig.eventTitle, subtitle = eventConfig.subtitle) => {
      try {
        const roster = names.map(createPlayer).filter((player) => player.name.length > 0);
        const missionDeck = missions as Mission[];
        const settings = { ...defaultSettings, ...selectedSettings };
        const seed = `${eventConfig.defaultSeed}-${Date.now().toString(36)}`;
        const assignments = assignMissions(
          roster.map((player) => player.name),
          missionDeck,
          { ...settings, seed },
        );
        const nextSession: GameSession = {
          version: 1,
          gameId: `ocho-${Date.now().toString(36)}`,
          eventTitle,
          subtitle,
          seed,
          options: {
            allowRerolls: settings.allowRerolls,
            includeCatMissions: settings.includeCatMissions,
            mildModeOnly: settings.mildModeOnly,
          },
          roster,
          missions: missionDeck,
          settings,
          assignments,
          createdAt: new Date().toISOString(),
        };

        setSession(nextSession);
        setError("");
        navigate("/host/review");
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Could not create the host session.");
      }
    },
    [navigate],
  );

  const joinGame = useCallback(
    (encodedGame: string, rawName: string, useRandomFallback: boolean): boolean => {
      const decoded = decodeSession(encodedGame);
      if (!decoded) {
        setError("This join link could not be decoded. Ask the host for a fresh link.");
        return false;
      }

      const normalizedInput = normalizeName(rawName).toLowerCase();
      const matchingIndex = decoded.roster.findIndex(
        (player) => normalizeName(player.name).toLowerCase() === normalizedInput,
      );
      const allowFallback = Boolean(decoded.settings?.allowRandomFallback) && useRandomFallback;
      const playerIndex =
        matchingIndex >= 0
          ? matchingIndex
          : allowFallback
            ? Math.floor(Math.random() * Math.max(decoded.roster.length, 1))
            : -1;

      if (playerIndex < 0 || !decoded.roster[playerIndex]) {
        setSession(decoded);
        setError("That name is not on the roster. Check spelling or ask the host to allow random fallback.");
        return false;
      }

      const player = decoded.roster[playerIndex];
      const assignment = decoded.assignments[playerIndex];
      const nextPlayerSession: PlayerSession = {
        gameId: decoded.gameId,
        playerName: player.name,
        missionId: assignment.missionId,
        joinedAt: new Date().toISOString(),
      };

      setSession(decoded);
      setPlayerSession(nextPlayerSession);
      setProgress({
        status: "hidden",
        bestMoment: "",
        updatedAt: new Date().toISOString(),
      } as MissionProgress);
      setError("");
      navigate("/mission");
      return true;
    },
    [navigate],
  );

  const setMissionStatus = useCallback((status: MissionStatus) => {
    setProgress((current) => ({ ...current, status, updatedAt: new Date().toISOString() }));
  }, []);

  const setBestMoment = useCallback((bestMoment: string) => {
    setProgress((current) => ({ ...current, bestMoment, updatedAt: new Date().toISOString() }));
  }, []);

  const setManualAwardWinner = useCallback((award: AwardKey, winner: string) => {
    setManualAwards((current) => ({ ...current, [award]: winner }));
  }, []);

  const resetPlayer = useCallback(() => {
    setPlayerSession(null);
    setProgress({ status: "hidden", bestMoment: "", updatedAt: new Date().toISOString() } as MissionProgress);
    navigate("/");
  }, [navigate]);

  const clearError = useCallback(() => setError(""), []);

  const currentMission = useMemo(() => {
    if (!session || !playerSession) {
      return null;
    }

    return session.assignments.find((assignment) => assignment.missionId === playerSession.missionId) ?? null;
  }, [playerSession, session]);

  const joinUrl = useMemo(() => {
    if (!session) {
      return "";
    }

    const params = new URLSearchParams({ g: encodeSession(session) });
    return `${window.location.origin}${window.location.pathname}#/join?${params.toString()}`;
  }, [session]);

  const screenProps = {
    session,
    playerSession,
    currentMission,
    progress,
    joinUrl,
    error,
    manualAwards,
    navigate,
    createHostSession,
    joinGame,
    setMissionStatus,
    setBestMoment,
    setManualAwardWinner,
    resetPlayer,
    clearError,
  };

  const encodedGame = routeState.params.get("g") ?? "";

  return (
    <main style={shellStyle}>
      {routeState.route === "/" ? <Landing {...screenProps} /> : null}
      {routeState.route === "/how-to-play" ? <HowToPlay {...screenProps} /> : null}
      {routeState.route === "/host" ? <HostSetup {...screenProps} /> : null}
      {routeState.route === "/host/review" ? <MissionReview {...screenProps} /> : null}
      {routeState.route === "/join" ? <Join {...screenProps} encodedGame={encodedGame} /> : null}
      {routeState.route === "/mission" ? <MissionReveal {...screenProps} /> : null}
      {routeState.route === "/reveal" ? <RevealPhase {...screenProps} /> : null}
      {routeState.route === "/awards" ? <Awards {...screenProps} /> : null}
    </main>
  );
}

const shellStyle = {
  minHeight: "100vh",
  padding: "32px",
  color: "#151515",
  background: "#f7f2e8",
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
} satisfies CSSProperties;
