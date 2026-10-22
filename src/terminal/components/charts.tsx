import { useEffect, useRef } from "react";
import type { Candle } from "../types";
import { readChartColors, type ThemeName } from "../theme";

type LW = typeof import("lightweight-charts");

function baseOptions(c: ReturnType<typeof readChartColors>) {
  return {
    autoSize: true,
    layout: { background: { color: "transparent" }, textColor: c.text, fontFamily: "IBM Plex Mono, monospace", fontSize: 11, attributionLogo: false },
    grid: { vertLines: { color: c.grid }, horzLines: { color: c.grid } },
    rightPriceScale: { borderColor: c.border },
    timeScale: { borderColor: c.border, timeVisible: true },
    crosshair: { vertLine: { color: c.text, labelBackgroundColor: c.border }, horzLine: { color: c.text, labelBackgroundColor: c.border } },
  };
}

export function CandleChart({ candles, theme, showVolume }: { candles: Candle[]; theme: ThemeName; showVolume: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    import("lightweight-charts").then((lw: LW) => {
      if (disposed || !ref.current) return;
      const c = readChartColors();
      const chart = lw.createChart(ref.current, baseOptions(c));
      const s = chart.addSeries(lw.CandlestickSeries, {
        upColor: c.up, downColor: c.down, borderUpColor: c.up, borderDownColor: c.down,
        wickUpColor: c.up, wickDownColor: c.down,
        priceLineColor: c.highlight, priceLineStyle: lw.LineStyle.Dotted,
      });
      s.setData(candles.map((k) => ({ ...k, time: k.time as never })));
      if (showVolume) {
        const v = chart.addSeries(lw.HistogramSeries, { priceScaleId: "vol", priceFormat: { type: "volume" }, lastValueVisible: false, priceLineVisible: false });
        chart.priceScale("vol").applyOptions({ scaleMargins: { top: 0.82, bottom: 0 } });
        v.setData(candles.map((k) => ({ time: k.time as never, value: k.volume, color: (k.close >= k.open ? c.up : c.down) + "40" })));
      }
      chart.priceScale("right").applyOptions({ scaleMargins: { top: 0.08, bottom: showVolume ? 0.22 : 0.08 } });
      chart.timeScale().fitContent();
      cleanup = () => chart.remove();
    });
    return () => { disposed = true; cleanup(); };
  }, [candles, theme, showVolume]);
  return <div ref={ref} className="h-full w-full" />;
}

export function SeriesChart({ data, theme, kind }: { data: { time: number; value: number }[]; theme: ThemeName; kind: "area" | "bars" }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    import("lightweight-charts").then((lw: LW) => {
      if (disposed || !ref.current) return;
      const c = readChartColors();
      const chart = lw.createChart(ref.current, { ...baseOptions(c), timeScale: { borderColor: c.border, timeVisible: false }, handleScroll: false, handleScale: false });
      if (kind === "area") {
        const s = chart.addSeries(lw.AreaSeries, { lineColor: c.up, topColor: c.up + "33", bottomColor: c.up + "00", lineWidth: 2, priceLineVisible: false });
        s.setData(data.map((d) => ({ time: d.time as never, value: d.value })));
      } else {
        const s = chart.addSeries(lw.HistogramSeries, { priceLineVisible: false });
        s.setData(data.map((d) => ({ time: d.time as never, value: d.value, color: d.value >= 0 ? c.up : c.down })));
      }
      chart.timeScale().fitContent();
      cleanup = () => chart.remove();
    });
    return () => { disposed = true; cleanup(); };
  }, [data, theme, kind]);
  return <div ref={ref} className="h-full w-full" />;
}
