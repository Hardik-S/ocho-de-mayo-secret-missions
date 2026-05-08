import type { Mission, Player } from "../types";
import { base64urlDecode, base64urlEncode } from "./encoding";

/**
 * Compatibility helpers for the current app shell. The assignment engine uses
 * `assignment.ts`; these wrappers preserve the earlier component contract while
 * keeping all mission-related logic in owned utility files.
 */

export function normalizePlayerName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

export function encodeJoinPayload<T>(session: T): string {
  return base64urlEncode(JSON.stringify(session));
}

export function decodeJoinPayload<T>(encoded: string): T | null {
  try {
    return JSON.parse(base64urlDecode(encoded)) as T;
  } catch {
    return null;
  }
}

export function chooseMissionForPlayer(
  missionDeck: readonly Mission[],
  _player: Player,
  index: number,
): Mission {
  if (missionDeck.length === 0) {
    throw new Error("Cannot choose a mission from an empty mission deck.");
  }

  return missionDeck[index % missionDeck.length];
}
