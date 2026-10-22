import type { ReactNode } from "react";

export function Panel({ title, right, children, className = "" }: { title: ReactNode; right?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`panel flex min-w-0 flex-col ${className}`}>
      <header className="flex items-center justify-between gap-2 border-b px-3 py-2">
        <h2 className="truncate text-[13px] font-medium">{title}</h2>
        {right && <div className="flex shrink-0 items-center gap-1">{right}</div>}
      </header>
      <div className="min-h-0 flex-1">{children}</div>
    </section>
  );
}

export function Chips<T extends string>({ options, value, onChange }: { options: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex gap-1">
      {options.map((o) => (
        <button key={o} className="chip" data-active={o === value} onClick={() => onChange(o)}>{o}</button>
      ))}
    </div>
  );
}

export function Delta({ value, suffix = "%" }: { value: number; suffix?: string }) {
  const pos = value >= 0;
  return <span className={pos ? "text-pos" : "text-neg"}>{pos ? "▲" : "▼"} {Math.abs(value).toFixed(2)}{suffix}</span>;
}

export const fmt = (n: number, d = 2) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
export const fmtTime = (t: number) => new Date(t * 1000).toISOString().slice(11, 16);
