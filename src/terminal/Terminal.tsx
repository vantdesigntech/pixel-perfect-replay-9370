import { useMemo, useState } from "react";
import type { Timeframe } from "./types";
import { getTerminalData } from "./data/provider";
import { useTheme, type ThemeName } from "./theme";
import { CandleChart, SeriesChart } from "./components/charts";
import { Chips, Delta, Panel, fmt } from "./components/ui";
import { ActivityPanel, BalancePanel, MetricsPanel, PositionsPanel, TradesTable } from "./components/panels";

const TFS = ["1m", "5m", "15m", "1h", "4h", "1D"] as const;

export function Terminal() {
  const [theme, setTheme] = useTheme();
  const [tf, setTf] = useState<Timeframe>("1h");
  const [vol, setVol] = useState(true);
  const d = useMemo(() => getTerminalData(tf), [tf]);

  return (
    <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-2 p-2">
      <header className="panel grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 py-2 md:flex md:justify-between">
        <div className="flex min-w-0 items-center gap-6">
          <div className="flex shrink-0 items-center gap-2 text-[15px] font-semibold">
            <span className="text-highlight">✳</span>{d.status.name}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {d.isPreview && <span className="chip text-highlight">PREVIEW DATA</span>}
          <span className="hidden label sm:inline">Status: {d.status.state}</span>
          <Chips<ThemeName> options={["mono", "neon"]} value={theme} onChange={setTheme} />
        </div>
      </header>

      <div className="grid flex-1 gap-2 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-2">
          <Panel
            title={
              <span className="flex items-center gap-3">
                {d.ticker.symbol}
                <span className="text-dim">{fmt(d.ticker.last, 4)}</span>
                <Delta value={d.ticker.change24hPct} />
              </span>
            }
            right={
              <>
                <button className="chip" data-active={vol} onClick={() => setVol(!vol)}>Vol</button>
                <Chips options={TFS} value={tf} onChange={setTf} />
              </>
            }
          >
            <div className="h-[420px] p-1 lg:h-[480px]">
              <CandleChart candles={d.candles} theme={theme} showVolume={vol} />
            </div>
            <div className="flex justify-between border-t px-3 py-1.5 label">
              <span>H {d.ticker.high24h} · L {d.ticker.low24h}</span>
              <span>tf {tf}</span>
            </div>
          </Panel>

          <div className="grid gap-2 md:grid-cols-2">
            <Panel title="Equity curve" right={<Delta value={d.metrics.totalReturnPct} />}>
              <div className="h-52 p-1"><SeriesChart data={d.metrics.equityCurve} theme={theme} kind="area" /></div>
            </Panel>
            <Panel title="Daily PnL" right={<span className="label">30D</span>}>
              <div className="h-52 p-1"><SeriesChart data={d.metrics.dailyPnl} theme={theme} kind="bars" /></div>
            </Panel>
          </div>
          <TradesTable trades={d.trades} />
        </div>

        <aside className="flex min-w-0 flex-col gap-2">
          <BalancePanel b={d.balance} />
          <PositionsPanel positions={d.positions} />
          <MetricsPanel m={d.metrics} />
          <ActivityPanel signals={d.signals} trades={d.trades} />
        </aside>
      </div>
    </div>
  );
}
