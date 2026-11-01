/**
 * Engineering number formatting for CALIBRE UI and reports
 * Follows Spanish (Argentina) conventions: comma as decimal separator, thousands separation.
 */

export function formatHours(hours: number): string {
  if (!isFinite(hours) || hours <= 0) return "—";
  if (hours > 1e6) return "> 1 000 000 h";
  const rounded = Math.round(hours);
  return `${rounded.toLocaleString("es-AR")} h`;
}

export function formatKn(loadKn: number, digits: number = 2): string {
  if (!isFinite(loadKn)) return "—";
  return `${loadKn.toLocaleString("es-AR", { minimumFractionDigits: digits, maximumFractionDigits: digits })} kN`;
}

export function formatRpm(rpm: number): string {
  if (!isFinite(rpm) || rpm <= 0) return "—";
  return `${Math.round(rpm).toLocaleString("es-AR")} r.p.m.`;
}

export function formatDimension(mm: number): string {
  if (!isFinite(mm)) return "—";
  return `${mm.toLocaleString("es-AR", { maximumFractionDigits: 1 })} mm`;
}

export function formatFactor(val: number, decimals: number = 2): string {
  if (!isFinite(val)) return "—";
  return val.toLocaleString("es-AR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function formatPercentage(ratio: number): string {
  if (!isFinite(ratio)) return "—";
  return `${Math.round(ratio * 100)}%`;
}

