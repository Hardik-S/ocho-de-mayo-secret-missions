import { describe, expect, it } from "vitest";

import { missions } from "../src/data/missions";
import { assignMissions, rerollMission, slugName } from "../src/utils/assignment";
import { decodeGame, encodeGame } from "../src/utils/encoding";
import { seededShuffle } from "../src/utils/random";
import { filterMissions } from "../src/utils/safety";

describe("seededShuffle", () => {
  it("returns the same order for the same seed without mutating input", () => {
    const input = ["a", "b", "c", "d", "e", "f"];

    const first = seededShuffle(input, "ocho");
    const second = seededShuffle(input, "ocho");

    expect(first).toEqual(second);
    expect(first).not.toEqual(input);
    expect(input).toEqual(["a", "b", "c", "d", "e", "f"]);
  });
});

describe("assignMissions", () => {
  it("assigns unique missions and deterministic player slugs", () => {
    const players = ["Ana Maria", "Ben", "Chloe", "Dev"];

    const assignments = assignMissions(players, missions, {
      allowRerolls: true,
      includeCatMissions: true,
      mildModeOnly: false,
      seed: "party",
    });

    expect(assignments).toHaveLength(players.length);
    expect(new Set(assignments.map((assignment) => assignment.missionId)).size).toBe(players.length);
    expect(assignments.map((assignment) => assignment.playerSlug)).toEqual([
      "ana-maria",
      "ben",
      "chloe",
      "dev",
    ]);
  });

  it("creates one four-player circular target loop with no self-targets", () => {
    const assignments = assignMissions(["Ava", "Bea", "Cal", "Dom"], missions, {
      allowRerolls: true,
      includeCatMissions: true,
      mildModeOnly: true,
      seed: "cycle",
    });

    const byPlayer = new Map(assignments.map((assignment) => [assignment.playerSlug, assignment]));
    const seen = new Set<string>();
    let current = assignments[0];

    for (let step = 0; step < assignments.length; step += 1) {
      expect(current.targetPlayerSlug).not.toBe(current.playerSlug);
      seen.add(current.playerSlug);
      const next = byPlayer.get(current.targetPlayerSlug);
      expect(next).toBeDefined();
      current = next!;
    }

    expect(current.playerSlug).toBe(assignments[0].playerSlug);
    expect(seen.size).toBe(4);
  });

  it("rerolls to a different eligible mission when possible", () => {
    const assignment = assignMissions(["Ava", "Bea", "Cal", "Dom"], missions, {
      allowRerolls: true,
      includeCatMissions: true,
      mildModeOnly: false,
      seed: "before",
    })[0];

    const rerolled = rerollMission(assignment, missions, [assignment.missionId], {
      allowRerolls: true,
      includeCatMissions: true,
      mildModeOnly: false,
      seed: "after",
    });

    expect(rerolled.playerSlug).toBe(assignment.playerSlug);
    expect(rerolled.targetPlayerSlug).toBe(assignment.targetPlayerSlug);
    expect(rerolled.missionId).not.toBe(assignment.missionId);
  });
});

describe("filterMissions", () => {
  it("excludes cat missions and non-mild missions according to safety options", () => {
    const filtered = filterMissions(missions, {
      includeCatMissions: false,
      mildModeOnly: true,
    });

    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((mission) => mission.category !== "cat-cameo")).toBe(true);
    expect(filtered.every((mission) => mission.difficulty !== "hard" && mission.mildMode !== false)).toBe(true);
  });
});

describe("game encoding", () => {
  it("round-trips encoded game state", () => {
    const assignments = assignMissions(["Ava", "Bea", "Cal", "Dom"], missions, {
      allowRerolls: true,
      includeCatMissions: true,
      mildModeOnly: true,
      seed: "encode",
    });

    const encoded = encodeGame({
      version: 1,
      eventTitle: "Secret Missions: Ocho Edition",
      subtitle: "A tiny secret game for dinner.",
      seed: "encode",
      createdAt: "2026-05-08T19:00:00.000Z",
      options: { allowRerolls: true, includeCatMissions: true, mildModeOnly: true },
      assignments,
    });

    expect(encoded).not.toContain("+");
    expect(encoded).not.toContain("/");
    expect(encoded).not.toContain("=");
    expect(decodeGame(encoded).assignments).toEqual(assignments);
  });
});

describe("slugName", () => {
  it("normalizes display names into stable slugs", () => {
    expect(slugName("  Ana   Maria! ")).toBe("ana-maria");
  });
});
