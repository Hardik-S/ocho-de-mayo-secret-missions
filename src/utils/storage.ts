import type { EncodedGame, PlayerState } from "../types";
import { decodeGame, encodeGame } from "./encoding";

export const STORAGE_KEYS = {
  game: "ocho.secretMissions.game",
  player: "ocho.secretMissions.player",
  hostDraft: "ocho.secretMissions.hostDraft",
  recentMissionIds: "ocho.secretMissions.recentMissionIds",
} as const;

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function getStorage(storage?: StorageLike): StorageLike | undefined {
  if (storage) {
    return storage;
  }

  if (typeof localStorage !== "undefined") {
    return localStorage;
  }

  return undefined;
}

function readJson<T>(key: string, fallback: T, storage?: StorageLike): T {
  const store = getStorage(storage);
  const rawValue = store?.getItem(key);

  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

export function saveGame(game: EncodedGame, storage?: StorageLike): void {
  getStorage(storage)?.setItem(STORAGE_KEYS.game, encodeGame(game));
}

export function loadGame(storage?: StorageLike): EncodedGame | undefined {
  const rawValue = getStorage(storage)?.getItem(STORAGE_KEYS.game);
  return rawValue ? decodeGame(rawValue) : undefined;
}

export function clearGame(storage?: StorageLike): void {
  getStorage(storage)?.removeItem(STORAGE_KEYS.game);
}

export function savePlayerState(playerState: PlayerState, storage?: StorageLike): void {
  getStorage(storage)?.setItem(STORAGE_KEYS.player, JSON.stringify(playerState));
}

export function loadPlayerState(storage?: StorageLike): PlayerState | undefined {
  return readJson<PlayerState | undefined>(STORAGE_KEYS.player, undefined, storage);
}

export function saveHostDraft(hostDraft: unknown, storage?: StorageLike): void {
  getStorage(storage)?.setItem(STORAGE_KEYS.hostDraft, JSON.stringify(hostDraft));
}

export function loadHostDraft<T = unknown>(storage?: StorageLike): T | undefined {
  return readJson<T | undefined>(STORAGE_KEYS.hostDraft, undefined, storage);
}

export function saveRecentMissionIds(missionIds: readonly string[], storage?: StorageLike): void {
  getStorage(storage)?.setItem(STORAGE_KEYS.recentMissionIds, JSON.stringify([...missionIds]));
}

export function loadRecentMissionIds(storage?: StorageLike): string[] {
  return readJson<string[]>(STORAGE_KEYS.recentMissionIds, [], storage);
}
