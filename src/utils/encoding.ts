import type { EncodedGame } from "../types";

function utf8ToBase64(value: string): string {
  if (typeof btoa === "function") {
    const bytes = new TextEncoder().encode(value);
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }

  return Buffer.from(value, "utf8").toString("base64");
}

function base64ToUtf8(value: string): string {
  if (typeof atob === "function") {
    const binary = atob(value);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  return Buffer.from(value, "base64").toString("utf8");
}

export function base64urlEncode(value: string): string {
  return utf8ToBase64(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function base64urlDecode(value: string): string {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return base64ToUtf8(padded);
}

export function encodeGame(game: EncodedGame): string {
  return base64urlEncode(JSON.stringify(game));
}

export function decodeGame(encodedGame: string): EncodedGame {
  return JSON.parse(base64urlDecode(encodedGame)) as EncodedGame;
}
