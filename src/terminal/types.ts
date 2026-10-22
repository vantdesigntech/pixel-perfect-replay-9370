// Data contracts the UI consumes. The Python bot will eventually provide
// objects matching these shapes; components never import mock data directly.

export type Timeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "1D";

export interface Candle {
  /** UNIX seconds (UTC) */
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PriceTicker {
  symbol: string;
  last: number;
  change24hPct: number;
  high24h: number;
  low24h: number;
}

export interface Balance {
  currency: string;
  total: number;
  available: number;
  inPositions: number;
  pnlToday: number;
  pnlTodayPct: number;
  allocation: { asset: string; pct: number }[];
}

export interface Position {
  id: string;
  symbol: string;
  side: "long" | "short";
  size: number;
  entryPrice: number;
  markPrice: number;
  pnl: number;
  pnlPct: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface Trade {
  id: string;
  time: number;
  symbol: string;
  side: "buy" | "sell";
  price: number;
  size: number;
  pnl?: number;
}

export interface PerformanceMetrics {
  totalReturnPct: number;
  winRatePct: number;
  profitFactor: number;
  sharpe: number;
  maxDrawdownPct: number;
  tradesCount: number;
  equityCurve: { time: number; value: number }[];
  dailyPnl: { time: number; value: number }[];
}

export interface Signal {
  id: string;
  time: number;
  symbol: string;
  type: "buy" | "sell" | "level" | "info";
  price?: number;
  message: string;
}

export type BotStatusState = "unknown" | "stopped" | "running" | "paused" | "error";

export interface BotStatus {
  name: string;
  state: BotStatusState;
  strategy: string;
  symbol: string;
  timeframe: Timeframe;
  lastUpdate: number | null;
}

export interface TerminalData {
  isPreview: boolean;
  status: BotStatus;
  ticker: PriceTicker;
  candles: Candle[];
  balance: Balance;
  positions: Position[];
  trades: Trade[];
  metrics: PerformanceMetrics;
  signals: Signal[];
}
