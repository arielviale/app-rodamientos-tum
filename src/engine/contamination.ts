import { ContaminationLevel } from "./types";

export interface ContaminationCoefficients {
  c1: number;
  c2: number;
}

export function getGreaseContaminationCoefficients(
  level: ContaminationLevel,
  dm: number
): ContaminationCoefficients {
  switch (level) {
    case "extreme-cleanliness":
    case "high-cleanliness":
      return { c1: 0.0864, c2: 0.6796 };
    case "normal-cleanliness":
      return { c1: 0.0432, c2: 1.141 };
    case "slight-contamination":
    case "typical-contamination":
      return { c1: 0.0177, c2: dm >= 500 ? 1.677 : 1.887 };
    case "severe-contamination":
      return { c1: 0.0115, c2: 2.662 };
    case "very-severe-contamination":
      return { c1: 0.00617, c2: 4.06 };
  }
}

/**
 * Calculates contamination factor eta_c (ISO 281 / SKF catalog p. 77)
 * eta_c = min(c1 * kappa^0.68 * dm^0.55, 1) * [1 - c2 / (3 * sqrt(dm))]
 * If bracket < 0, eta_c = 0. Clamped to [0, 1].
 */
export function calculateContaminationFactor(
  c1: number,
  c2: number,
  kappa: number,
  dm: number
): number {
  if (dm <= 0) {
    throw new Error("Mean bearing diameter dm must be positive");
  }
  if (kappa <= 0) {
    throw new Error("Viscosity ratio kappa must be positive");
  }

  const factor1 = Math.min(c1 * Math.pow(kappa, 0.68) * Math.pow(dm, 0.55), 1.0);
  const factor2 = 1.0 - c2 / (3.0 * Math.sqrt(dm));

  if (factor2 <= 0) {
    return 0;
  }

  const etaC = factor1 * factor2;
  return Math.max(0, Math.min(1.0, etaC));
}

