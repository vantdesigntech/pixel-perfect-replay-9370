import type { Balance, PerformanceMetrics, Position, Signal, Trade } from "../types";
import { Delta, Panel, fmt, fmtTime } from "./ui";

const SHADES = ["bg-up", "bg-dim", "bg-faint", "bg-border"];

export function BalancePanel({ b }: { b: Balance }) {
  // 10x10 allocation grid like the reference "Portfolio" block
  const cells: number[] = [];
  b.allocation.forEach((a, i) => { for (let k = 0; k < Math.round(a.pct); k++) cells.push(i); });
  while (cells.length < 100) cells.push(3);
  return (
    <Panel title="Balance" right={<span className="label">{b.currency}</span>}>
      <div className="grid grid-cols-3 gap-2 p-3">
        <Stat label="Total" value={fmt(b.total)} />
        <Stat label="Available" value={fmt(b.available)} />
        <Stat label="Today" value={fmt(b.pnlToday)} sub={<Delta value={b.pnlTodayPct} />} />
      </div>
      <div className="grid grid-cols-[repeat(20,1fr)] gap-[3px] px-3">
        {cells.slice(0, 100).map((c, i) => <div key={i} className={`aspect-square rounded-[1px] ${SHADES[c]}`} />)}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 p-3 text-[11px]">
        {b.allocation.map((a, i) => (
          <span key={a.asset} className="flex items-center gap-1.5"><i className={`inline-block h-2 w-2 ${SHADES[i]}`} />{a.asset} <span className="text-dim">{a.pct}%</span></span>
        ))}
      </div>
    </Panel>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="label">{label}</div>
      <div className="truncate text-lg">{value}</div>
      {sub && <div className="text-[11px]">{sub}</div>}
    </div>
  );
}

export function PositionsPanel({ positions }: { positions: Position[] }) {
  return (
    <Panel title="Open positions" right={<span className="label">{positions.length}</span>}>
      <div className="divide-y">
        {positions.length === 0 && <p className="p-3 label">No open positions</p>}
        {positions.map((p) => (
          <div key={p.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-1 px-3 py-2">
            <div className="flex min-w-0 items-center gap-2">
              <span className={`chip ${p.side === "long" ? "text-pos" : "text-neg"}`}>{p.side.toUpperCase()}</span>
              <span className="truncate">{p.symbol}</span>
            </div>
            <div className="text-right"><Delta value={p.pnlPct} /></div>
            <div className="label">{p.size} @ {fmt(p.entryPrice, 4)} → {fmt(p.markPrice, 4)}</div>
            <div className={`text-right ${p.pnl >= 0 ? "text-pos" : "text-neg"}`}>{p.pnl >= 0 ? "+" : ""}{fmt(p.pnl)}</div>
            {(p.stopLoss || p.takeProfit) && (
              <div className="col-span-2 flex gap-3 text-[11px] text-faint">
                {p.stopLoss && <span>SL <span className="text-highlight">{p.stopLoss}</span></span>}
                {p.takeProfit && <span>TP <span className="text-highlight">{p.takeProfit}</span></span>}
              </div>
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function MetricsPanel({ m }: { m: PerformanceMetrics }) {
  const r = 42, circ = 2 * Math.PI * r;
  return (
    <Panel title="Performance" right={<span className="label">{m.tradesCount} trades</span>}>
      <div className="flex items-center gap-4 p-3">
        <div className="relative h-28 w-28 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r={r} fill="none" stroke="var(--border)" strokeWidth="8" strokeDasharray="2 2" />
            <circle cx="50" cy="50" r={r} fill="none" stroke="var(--up)" strokeWidth="8" strokeDasharray={`${(m.winRatePct / 100) * circ} ${circ}`} />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div><div className="text-xl">{m.winRatePct.toFixed(0)}<span className="text-sm">%</span></div><div className="label">Win rate</div></div>
          </div>
        </div>
        <dl className="grid flex-1 gap-1.5 text-[12px]">
          <Row k="Return" v={<Delta value={m.totalReturnPct} />} />
          <Row k="Profit factor" v={m.profitFactor.toFixed(2)} />
          <Row k="Sharpe" v={m.sharpe.toFixed(2)} />
          <Row k="Max DD" v={<span className="text-neg">{m.maxDrawdownPct.toFixed(2)}%</span>} />
        </dl>
      </div>
    </Panel>
  );
}

const Row = ({ k, v }: { k: string; v: React.ReactNode }) => (
  <div className="flex justify-between gap-2"><dt className="text-dim">{k}</dt><dd>{v}</dd></div>
);

export function ActivityPanel({ signals, trades }: { signals: Signal[]; trades: Trade[] }) {
  const items = [
    ...signals.map((s) => ({ id: s.id, time: s.time, tag: s.type.toUpperCase(), cls: s.type === "buy" ? "text-pos" : s.type === "sell" ? "text-neg" : "text-highlight", text: `${s.symbol} ${s.message}${s.price ? ` @ ${s.price}` : ""}` })),
    ...trades.map((t) => ({ id: t.id, time: t.time, tag: t.side === "buy" ? "FILL B" : "FILL S", cls: "text-dim", text: `${t.symbol} ${t.size} @ ${t.price}${t.pnl != null ? ` · PnL ${t.pnl >= 0 ? "+" : ""}${t.pnl}` : ""}` })),
  ].sort((a, b) => b.time - a.time);
  return (
    <Panel title="Activity" right={<span className="label">signals · trades</span>}>
      <ul className="max-h-80 divide-y overflow-auto">
        {items.map((i) => (
          <li key={i.id} className="grid grid-cols-[3rem_4rem_minmax(0,1fr)] gap-2 px-3 py-2 text-[12px]">
            <span className="text-faint">{fmtTime(i.time)}</span>
            <span className={i.cls}>{i.tag}</span>
            <span className="truncate">{i.text}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function TradesTable({ trades }: { trades: Trade[] }) {
  return (
    <Panel title="Trade history">
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead className="text-dim"><tr className="border-b">{["Time", "Pair", "Side", "Price", "Size", "PnL"].map((h) => <th key={h} className="px-3 py-1.5 text-left font-normal">{h}</th>)}</tr></thead>
          <tbody>
            {trades.map((t) => (
              <tr key={t.id} className="border-b last:border-0">
                <td className="px-3 py-1.5 text-faint">{fmtTime(t.time)}</td>
                <td className="px-3">{t.symbol}</td>
                <td className={`px-3 ${t.side === "buy" ? "text-pos" : "text-neg"}`}>{t.side.toUpperCase()}</td>
                <td className="px-3">{t.price}</td>
                <td className="px-3">{t.size}</td>
                <td className={`px-3 ${t.pnl == null ? "text-faint" : t.pnl >= 0 ? "text-pos" : "text-neg"}`}>{t.pnl == null ? "—" : fmt(t.pnl)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
