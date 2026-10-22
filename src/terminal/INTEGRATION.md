# Trading terminal — integration notes

## Structure
- `types.ts` — TypeScript contracts (Candle, PriceTicker, Balance, Position, Trade, PerformanceMetrics, Signal, BotStatus, TerminalData).
- `data/mock.ts` — PREVIEW-ONLY sample data. Delete when real data is wired.
- `data/provider.ts` — the only place components get data from.
- `theme.ts` + `src/styles.css` — two themes (`mono`, `neon`) as CSS variables on `html[data-theme]`, saved in localStorage.
- `components/` — reusable panels and charts (Lightweight Charts).

## Install / build
```
bun install
bun run dev      # local preview
bun run build    # production build into dist/
```

## Replacing sample data
Option A: the Python app injects a JSON object into the page before the bundle loads:
```html
<script>window.__BOT_DATA__ = { /* TerminalData */ };</script>
```
Option B: edit `getTerminalData` in `data/provider.ts` to read from whatever source the
bot exposes (not defined yet). Keep the return shape `TerminalData` and set `isPreview: false`.
Time values are UNIX seconds (UTC).
