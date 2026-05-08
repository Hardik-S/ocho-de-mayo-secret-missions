import type { GameSettings, Mission, PlayerAssignment } from "../types";
import { seededShuffle } from "./random";
import { filterMissions } from "./safety";

export interface AssignmentOptions extends GameSettings {
  seed: string;
}

export function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

export function slugName(name: string): string {
  const normalized = normalizeName(name)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");

  return normalized
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "player";
}

function uniquePlayers(playerNames: readonly string[]): Array<{ name: string; slug: string }> {
  const seen = new Set<string>();

  return playerNames.map((playerName, index) => {
    const name = normalizeName(playerName);
    if (!name) {
      throw new Error(`Player ${index + 1} needs a name.`);
    }

    const baseSlug = slugName(name);
    let slug = baseSlug;
    let suffix = 2;

    while (seen.has(slug)) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    seen.add(slug);
    return { name, slug };
  });
}

function toAssignment(
  player: { name: string; slug: string },
  target: { name: string; slug: string },
  mission: Mission,
  secondaryMissionText: string,
): PlayerAssignment {
  return {
    playerName: player.name,
    playerSlug: player.slug,
    missionId: mission.id,
    missionTitle: mission.title,
    missionText: mission.text,
    missionCategory: mission.category,
    difficulty: mission.difficulty,
    completionCondition: mission.completionCondition,
    hint: mission.hint,
    awardTag: mission.awardTag,
    targetPlayerName: target.name,
    targetPlayerSlug: target.slug,
    secondaryMissionText,
    status: "active",
  };
}

export function assignMissions(
  playerNames: readonly string[],
  missionDeck: readonly Mission[],
  options: AssignmentOptions,
): PlayerAssignment[] {
  const players = uniquePlayers(playerNames);

  if (players.length < 2) {
    throw new Error("At least two players are required to assign secret missions.");
  }

  const eligibleMissions = filterMissions(missionDeck, options);
  if (eligibleMissions.length < players.length) {
    throw new Error(
      `Need at least ${players.length} eligible missions; only ${eligibleMissions.length} available.`,
    );
  }

  const shuffledMissions = seededShuffle(eligibleMissions, options.seed);
  const primaryMissions = shuffledMissions.slice(0, players.length);
  const secondaryMissions = shuffledMissions.slice(players.length);

  return players.map((player, index) => {
    const target = players[(index + 1) % players.length];
    const secondaryMission = secondaryMissions[index % Math.max(secondaryMissions.length, 1)];

    return toAssignment(
      player,
      target,
      primaryMissions[index],
      `Create a tiny moment with ${target.name}: ${
        secondaryMission?.text ?? "ask one thoughtful follow-up question before the reveal."
      }`,
    );
  });
}

export function rerollMission(
  assignment: PlayerAssignment,
  missionDeck: readonly Mission[],
  recentMissionIds: readonly string[],
  options: AssignmentOptions,
): PlayerAssignment {
  const blockedIds = new Set([assignment.missionId, ...recentMissionIds]);
  const eligibleMissions = filterMissions(missionDeck, options).filter(
    (mission) => !blockedIds.has(mission.id),
  );

  if (eligibleMissions.length === 0) {
    throw new Error("No eligible missions are available for reroll.");
  }

  const [mission, secondaryMission] = seededShuffle(eligibleMissions, options.seed);

  return {
    ...assignment,
    missionId: mission.id,
    missionTitle: mission.title,
    missionText: mission.text,
    missionCategory: mission.category,
    difficulty: mission.difficulty,
    completionCondition: mission.completionCondition,
    hint: mission.hint,
    awardTag: mission.awardTag,
    secondaryMissionText:
      `Create a tiny moment with ${assignment.targetPlayerName}: ${
        secondaryMission?.text ?? assignment.secondaryMissionText
      }`,
    status: "active",
  };
}
