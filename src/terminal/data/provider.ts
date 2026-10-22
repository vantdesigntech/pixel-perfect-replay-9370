// Single entry point for terminal data. Replace the body of `getTerminalData`
// (or `window.__BOT_DATA__`) with data from the Python bot; components stay unchanged.
import type { TerminalData, Timeframe } from "../types";
import { mockTerminalData } from "./mock";

declare global {
  interface Window {
    /** Optional: the Python app can inject a full TerminalData object here. */
    __BOT_DATA__?: TerminalData;
  }
}

export function getTerminalData(tf: Timeframe): TerminalData {
  if (typeof window !== "undefined" && window.__BOT_DATA__) return window.__BOT_DATA__;
  return mockTerminalData(tf);
}
