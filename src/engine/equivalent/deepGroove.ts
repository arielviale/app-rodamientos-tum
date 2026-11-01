import { Bearing, Clearance, LoadInput, LoadModel, LoadResult } from "../types";

interface Table8Row {
  f0Fa_C0: number;
  e: number;
  X: number;
  Y: number;
}

const TABLE_8_CN: Table8Row[] = [
  { f0Fa_C0: 0.172, e: 0.19, X: 0.56, Y: 2.30 },
  { f0Fa_C0: 0.345, e: 0.22, X: 0.56, Y: 1.99 },
  { f0Fa_C0: 0.689, e: 0.26, X: 0.56, Y: 1.71 },
  { f0Fa_C0: 1.030, e: 0.28, X: 0.56, Y: 1.55 },
  { f0Fa_C0: 1.380, e: 0.30, X: 0.56, Y: 1.45 },
  { f0Fa_C0: 2.070, e: 0.34, X: 0.56, Y: 1.31 },
  { f0Fa_C0: 3.450, e: 0.38, X: 0.56, Y: 1.15 },
  { f0Fa_C0: 5.170, e: 0.42, X: 0.56, Y: 1.04 },
  { f0Fa_C0: 6.890, e: 0.44, X: 0.56, Y: 1.00 },
];

const TABLE_8_C3: Table8Row[] = [
  { f0Fa_C0: 0.172, e: 0.29, X: 0.46, Y: 1.88 },
  { f0Fa_C0: 0.345, e: 0.32, X: 0.46, Y: 1.71 },
  { f0Fa_C0: 0.689, e: 0.36, X: 0.46, Y: 1.52 },
  { f0Fa_C0: 1.030, e: 0.38, X: 0.46, Y: 1.41 },
  { f0Fa_C0: 1.380, e: 0.40, X: 0.46, Y: 1.34 },
  { f0Fa_C0: 2.070, e: 0.44, X: 0.46, Y: 1.23 },
  { f0Fa_C0: 3.450, e: 0.49, X: 0.46, Y: 1.10 },
  { f0Fa_C0: 5.170, e: 0.54, X: 0.46, Y: 1.01 },
  { f0Fa_C0: 6.890, e: 0.54, X: 0.46, Y: 1.00 },
];

const TABLE_8_C4: Table8Row[] = [
  { f0Fa_C0: 0.172, e: 0.38, X: 0.44, Y: 1.47 },
  { f0Fa_C0: 0.345, e: 0.40, X: 0.44, Y: 1.40 },
  { f0Fa_C0: 0.689, e: 0.43, X: 0.44, Y: 1.30 },
  { f0Fa_C0: 1.030, e: 0.46, X: 0.44, Y: 1.23 },
  { f0Fa_C0: 1.380, e: 0.47, X: 0.44, Y: 1.19 },
  { f0Fa_C0: 2.070, e: 0.50, X: 0.44, Y: 1.12 },
  { f0Fa_C0: 3.450, e: 0.55, X: 0.44, Y: 1.02 },
  { f0Fa_C0: 5.170, e: 0.56, X: 0.44, Y: 1.00 },
  { f0Fa_C0: 6.890, e: 0.56, X: 0.44, Y: 1.00 },
];

export function interpolateTable8(
  val: number,
  clearance: Clearance = "CN"
): { e: number; X: number; Y: number } {
  let table: Table8Row[];
  switch (clearance) {
    case "C3":
      table = TABLE_8_C3;
      break;
    case "C4":
    case "C5":
      table = TABLE_8_C4;
      break;
    case "C2":
    case "CN":
    default:
      table = TABLE_8_CN;
      break;
  }

  if (val <= table[0].f0Fa_C0) {
    return { e: table[0].e, X: table[0].X, Y: table[0].Y };
  }
  const last = table[table.length - 1];
  if (val >= last.f0Fa_C0) {
    return { e: last.e, X: last.X, Y: last.Y };
  }

  for (let i = 0; i < table.length - 1; i++) {
    const rowA = table[i];
    const rowB = table[i + 1];
    if (val >= rowA.f0Fa_C0 && val <= rowB.f0Fa_C0) {
      const t = (val - rowA.f0Fa_C0) / (rowB.f0Fa_C0 - rowA.f0Fa_C0);
      return {
        e: rowA.e + t * (rowB.e - rowA.e),
        X: rowA.X + t * (rowB.X - rowA.X),
        Y: rowA.Y + t * (rowB.Y - rowA.Y),
      };
    }
  }

  return { e: last.e, X: last.X, Y: last.Y };
}

export const deepGrooveLoadModel: LoadModel = {
  family: "deep-groove",
  equivalent(input: LoadInput, bearing?: Partial<Bearing>): LoadResult {
    const { Fr, Fa } = input;
    const warnings: string[] = [];

    if (Fr <= 0 && Fa <= 0) {
      return { P: 0, P0: 0, warnings: ["Carga nula"], rejected: "No hay carga aplicada" };
    }

    const C0 = bearing?.C0kN ?? 0;
    const bore = bearing?.boreMm ?? 30;
    const series = bearing?.series ?? "62";

    // Static equivalent load P0 (ISO 76 / SKF p. 317)
    // P0 = 0.6 * Fr + 0.5 * Fa; if P0 < Fr => P0 = Fr
    const rawP0 = 0.6 * Fr + 0.5 * Fa;
    const P0 = rawP0 < Fr ? Fr : rawP0;

    // Check maximum permissible axial load (pure or dominant axial)
    if (C0 > 0 && Fa > 0) {
      const isSmallOrLight =
        bore <= 12 ||
        series.startsWith("618") ||
        series.startsWith("619") ||
        series.startsWith("60") ||
        series.startsWith("61");

      const maxAllowedFa = isSmallOrLight ? 0.25 * C0 : 0.5 * C0;

      if (Fa > maxAllowedFa) {
        return {
          P: 0,
          P0,
          warnings,
          rejected: `Carga axial (${Fa.toFixed(2)} kN) supera el límite admisible para rígido de bolas (${(isSmallOrLight ? "0,25 C0 = " : "0,5 C0 = ") + maxAllowedFa.toFixed(2)} kN).`,
        };
      }
    }

    // Pure radial case
    if (Fa <= 0) {
      return { P: Fr, P0, warnings };
    }

    // If Fr is zero or very small compared to Fa, it's pure axial
    if (Fr <= 0) {
      // In deep groove with pure axial, Fa/Fr -> infinity > e, P = Y * Fa
      // We estimate f0 and C0
      const f0 = bearing?.f0 ?? 14;
      const f0FaC0 = C0 > 0 ? (f0 * Fa) / C0 : 0.172;
      const factors = interpolateTable8(f0FaC0, input.clearance ?? bearing?.clearance ?? "CN");
      const P = factors.Y * Fa;
      return { P, P0, warnings };
    }

    // Dynamic equivalent load P: compare Fa / Fr with e
    const faFr = Fa / Fr;
    const f0 = bearing?.f0 ?? 14;
    const f0FaC0 = C0 > 0 ? (f0 * Fa) / C0 : 0.172;
    const clearance = input.clearance ?? bearing?.clearance ?? "CN";
    const { e, X, Y } = interpolateTable8(f0FaC0, clearance);

    let P = Fr;
    if (faFr > e) {
      P = X * Fr + Y * Fa;
    }

    return { P, P0, warnings };
  },
};

