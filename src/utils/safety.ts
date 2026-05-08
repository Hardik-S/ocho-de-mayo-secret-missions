import type { GameSettings, Mission } from "../types";

/**
 * Applies host safety switches before assignment. "Mild mode" maps to easy
 * missions only, which keeps the game low-pressure for mixed groups.
 */
export function filterMissions(
  missionDeck: readonly Mission[],
  settings: Pick<GameSettings, "includeCatMissions" | "mildModeOnly">,
): Mission[] {
  return missionDeck.filter((mission) => {
    if (!settings.includeCatMissions && (mission.category === "cat-cameo" || mission.requiresCat)) {
      return false;
    }

    if (settings.mildModeOnly && (mission.difficulty === "hard" || mission.mildMode === false)) {
      return false;
    }

    return true;
  });
}
