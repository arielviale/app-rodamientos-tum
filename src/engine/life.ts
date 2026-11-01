import { Reliability } from "./types";

/**
 * ISO 281 Table 1: a1 reliability factor
 */
export const RELIABILITY_FACTORS: Record<Reliability, number> = {
  90: 1.0,
  95: 0.64,
  96: 0.55,
  97: 0.47,
  98: 0.37,
  99: 0.25,
};

export function getA1Factor(reliability: Reliability): number {
  const a1 = RELIABILITY_FACTORS[reliability];
  if (a1 === undefined) {
    throw new Error(`Reliability ${reliability}% not supported by ISO 281 table (must be 90, 95, 96, 97, 98, or 99)`);
  }
  return a1;
}

/**
 * Returns the exponent p: 3 for ball bearings, 10/3 for roller bearings
 */
export function getLifeExponent(rollingElement: "ball" | "roller"): number {
  return rollingElement === "ball" ? 3 : 10 / 3;
}

/**
 * Basic rating life L10 in millions of revolutions (ISO 281)
 * L10 = (C / P)^p
 */
export function calculateL10(C: number, P: number, rollingElement: "ball" | "roller"): number {
  if (P <= 0) {
    throw new Error("Equivalent dynamic load P must be greater than 0");
  }
  if (C <= 0) {
    throw new Error("Dynamic load rating C must be greater than 0");
  }
  const p = getLifeExponent(rollingElement);
  return Math.pow(C / P, p);
}

/**
 * Basic rating life L10h in operating hours
 * L10h = (10^6 / (60 * n)) * L10
 */
export function calculateL10h(L10: number, n: number): number {
  if (n <= 0) {
    throw new Error("Rotational speed n must be greater than 0 rpm for life calculation");
  }
  return (1e6 / (60 * n)) * L10;
}

/**
 * Required revolutions in millions for a given required hours and speed
 * L10_req = (60 * n * Lh_req) / 10^6
 */
export function calculateRequiredL10(hoursReq: number, n: number): number {
  if (hoursReq <= 0 || n <= 0) {
    throw new Error("Target hours and speed must be positive");
  }
  return (60 * n * hoursReq) / 1e6;
}

/**
 * Required dynamic load capacity C_req (kN) for target hours and load (with a1 = 1, aSKF = 1)
 * C_req = P * (L10_req)^(1 / p)
 */
export function calculateRequiredC(
  P: number,
  hoursReq: number,
  n: number,
  rollingElement: "ball" | "roller",
  a1: number = 1
): number {
  if (P <= 0) {
    throw new Error("Equivalent load P must be positive");
  }
  const p = getLifeExponent(rollingElement);
  const L10_req = calculateRequiredL10(hoursReq, n);
  // If a1 < 1, effective L10 required is L10_req / a1
  const effectiveL10Req = L10_req / a1;
  return P * Math.pow(effectiveL10Req, 1 / p);
}

/**
 * Modified rating life Lnm in millions of revolutions (ISO 281)
 * Lnm = a1 * aSKF * L10
 */
export function calculateLnm(L10: number, a1: number = 1, aSkf: number = 1): number {
  return a1 * aSkf * L10;
}

/**
 * Modified rating life in operating hours
 */
export function calculateLnmh(Lnm: number, n: number): number {
  return calculateL10h(Lnm, n);
}

