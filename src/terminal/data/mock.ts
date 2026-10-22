// PREVIEW-ONLY sample data. Not real market data, not connected to any bot.
import type { Candle, TerminalData, Timeframe } from "../types";

const TF_SECONDS: Record<Timeframe, number> = {
  "1m": 60, "5m": 300, "15m": 900, "1h": 3600, "4h": 14400, "1D": 86400,
};

// Deterministic PRNG so server and client render identical values.
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const BASE_TIME = 1792800000; // fixed anchor, avoids hydration drift

export function mockCandles(tf: Timeframe, count = 120): Candle[] {
  const r = rng(tf.length * 97 + TF_SECONDS[tf]);
  const step = TF_SECONDS[tf];
  let price = 7.2;
  const out: Candle[] = [];
  for (let i = 0; i < count; i++) {
    const open = price;
    const drift = Math.sin(i / 14) * 0.03;
    const close = Math.max(5, open + (r() - 0.48) * 0.28 + drift);
    const high = Math.max(open, close) + r() * 0.12;
    const low = Math.min(open, close) - r() * 0.12;
    out.push({
      time: BASE_TIME - (count - i) * step,
      open: +open.toFixed(4), high: +high.toFixed(4),
      low: +low.toFixed(4), close: +close.toFixed(4),
      volume: Math.round(2000 + r() * 9000),
    });
    price = close;
  }
  return out;
}

export function mockTerminalData(tf: Timeframe): TerminalData {
  const candles = mockCandles(tf);
  const last = candles[candles.length - 1]?.close ?? 0;
  const r = rng(42);
  const equity = Array.from({ length: 60 }, (_, i) => ({
    time: BASE_TIME - (60 - i) * 86400,
    value: 10000 + i * 45 + Math.sin(i / 4) * 220 + r() * 120,
  }));
  const daily = Array.from({ length: 30 }, (_, i) => ({
    time: BASE_TIME - (30 - i) * 86400,
    value: Math.round((r() - 0.42) * 300),
  }));
  return {
    isPreview: true,
    status: {
      name: "Bot", state: "unknown", strategy: "—",
      symbol: "SUI/USDT", timeframe: tf, lastUpdate: null,
    },
    ticker: { symbol: "SUI/USDT", last, change24hPct: 2.8, high24h: 8.49, low24h: 6.51 },
    candles,
    balance: {
      currency: "USDT", total: 12005.4, available: 8420.1, inPositions: 3585.3,
      pnlToday: 312.6, pnlTodayPct: 2.67,
      allocation: [
        { asset: "USDT", pct: 35 }, { asset: "ETH", pct: 32.5 },
        { asset: "SUI", pct: 20.5 }, { asset: "UNI", pct: 12 },
      ],
    },
    positions: [
      { id: "p1", symbol: "SUI/USDT", side: "long", size: 420, entryPrice: 7.31, markPrice: last, pnl: (last - 7.31) * 420, pnlPct: ((last - 7.31) / 7.31) * 100, stopLoss: 6.9, takeProfit: 8.4 },
      { id: "p2", symbol: "ETH/USDT", side: "short", size: 0.8, entryPrice: 3420, markPrice: 3388, pnl: 25.6, pnlPct: 0.94, stopLoss: 3510 },
      { id: "p3", symbol: "UNI/USDT", side: "long", size: 150, entryPrice: 9.42, markPrice: 9.19, pnl: -34.5, pnlPct: -2.44 },
    ],
    trades: [
      { id: "t1", time: BASE_TIME - 600, symbol: "SUI/USDT", side: "buy", price: 7.31, size: 420 },
      { id: "t2", time: BASE_TIME - 5400, symbol: "SOL/USDT", side: "sell", price: 182.4, size: 4, pnl: 61.2 },
      { id: "t3", time: BASE_TIME - 9800, symbol: "ETH/USDT", side: "sell", price: 3420, size: 0.8 },
      { id: "t4", time: BASE_TIME - 14200, symbol: "UNI/USDT", side: "buy", price: 9.42, size: 150 },
      { id: "t5", time: BASE_TIME - 22000, symbol: "ARB/USDT", side: "sell", price: 1.12, size: 900, pnl: -18.9 },
    ],
    metrics: {
      totalReturnPct: 24.6, winRatePct: 58.3, profitFactor: 1.72, sharpe: 1.41,
      maxDrawdownPct: -8.2, tradesCount: 214, equityCurve: equity, dailyPnl: daily,
    },
    signals: [
      { id: "s1", time: BASE_TIME - 300, symbol: "SUI/USDT", type: "buy", price: 7.55, message: "EMA20 cross above MA50" },
      { id: "s2", time: BASE_TIME - 2400, symbol: "SUI/USDT", type: "level", price: 8.49, message: "Resistance level tested" },
      { id: "s3", time: BASE_TIME - 7200, symbol: "ETH/USDT", type: "sell", price: 3420, message: "RSI overbought (74)" },
      { id: "s4", time: BASE_TIME - 12000, symbol: "UNI/USDT", type: "info", message: "Volatility above 30d average" },
    ],
  };
}
