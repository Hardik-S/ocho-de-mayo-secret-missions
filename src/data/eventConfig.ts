import type { GameSettings } from "../types";

/**
 * Host-editable event defaults and copy. Keep future dinner variants here so
 * the game logic and screens remain reusable.
 */
export const eventConfig = {
  eventName: "Secret Missions: Ocho Edition",
  eventTitle: "Secret Missions: Ocho Edition",
  subtitle: "A tiny secret game for dinner.",
  hostName: "Ocho host",
  eventSlug: "ocho-de-mayo",
  defaultSeed: "ocho-de-mayo-2026",
  minimumPlayers: 4,
  defaultGuestNames: ["Alex", "Bailey", "Casey", "Devon"],
  defaultSettings: {
    allowRerolls: true,
    includeCatMissions: true,
    mildModeOnly: false,
  } satisfies GameSettings,
  revealCopy: {
    sealed: "Your secret mission is sealed.",
    privateReminder: "Do not show your screen.",
    finale: "When the host calls your name, reveal your mission and tell the story.",
  },
  safetyCopy:
    "Keep it kind. Keep it subtle. Do not make anyone uncomfortable, pressure anyone, interrupt important conversations, or mess with food, drinks, belongings, pets, or bodies.",
  calloutRule:
    "If someone guesses your exact mission before you complete it, you are caught. Vague suspicion does not count.",
  awardLabels: [
    "Smoothest Operator",
    "Most Suspicious Energy",
    "Best Bit Commitment",
    "Guac Whisperer",
    "Cat Diplomat",
    "Ocho Archivist",
    "Most Valuable Vibe",
    "Chaos With Boundaries",
  ],
  themeTokens: {
    bg: "#fff7ea",
    surface: "#fffdf7",
    surfaceAlt: "#f6ead7",
    ink: "#26211d",
    muted: "#6f6258",
    terracotta: "#b85c38",
    agave: "#4f7f6a",
    marigold: "#e8b13f",
    chili: "#a9342f",
    dusk: "#2d3356",
    success: "#3f7f58",
    warning: "#c8842b",
    danger: "#9f3a38",
  },
};
