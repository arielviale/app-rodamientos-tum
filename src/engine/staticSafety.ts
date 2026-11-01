import { BearingFamily } from "./types";

export type ShockSeverity = "smooth" | "normal" | "heavy";
export type OperationalRequirement = "low" | "normal" | "high"; // high = quiet running, vibration free
export type MotionType = "rotating" | "static" | "oscillating";

export interface StaticSafetyCriteria {
  shock: ShockSeverity;
  requirement: OperationalRequirement;
  motion: MotionType;
  rollingElement: "ball" | "roller";
  family?: BearingFamily;
}

/**
 * Calculates static safety factor s0 = C0 / P0
 */
export function calculateStaticSafetyFactor(C0: number, P0: number): number {
  if (P0 <= 0) {
    throw new Error("Equivalent static load P0 must be greater than 0");
  }
  if (C0 <= 0) {
    throw new Error("Basic static load rating C0 must be greater than 0");
  }
  return C0 / P0;
}

/**
 * Calculates required static load rating C0_req = s0_target * P0
 */
export function calculateRequiredC0(P0: number, targetS0: number): number {
  if (P0 <= 0 || targetS0 <= 0) {
    throw new Error("P0 and target s0 must be positive");
  }
  return targetS0 * P0;
}

/**
 * ISO 76 Table 11: Guideline values for static safety factor s0
 */
export function getRecommendedStaticSafety(criteria: StaticSafetyCriteria): number {
  // Spherical roller thrust bearings require s0 >= 4 always
  if (criteria.family === "spherical-thrust") {
    return 4.0;
  }

  const { shock, requirement, motion, rollingElement } = criteria;
  const isBall = rollingElement === "ball";

  if (motion === "static" || motion === "oscillating") {
    switch (shock) {
      case "smooth":
        return isBall ? 0.4 : 0.8;
      case "normal":
        return isBall ? 0.5 : 1.0;
      case "heavy":
        return isBall ? 1.0 : 2.0;
    }
  }

  // Rotating
  if (requirement === "low") {
    switch (shock) {
      case "smooth":
        return isBall ? 0.5 : 1.0;
      case "normal":
        return isBall ? 0.5 : 1.0;
      case "heavy":
        return isBall ? 1.5 : 2.5;
    }
  }

  if (requirement === "normal") {
    switch (shock) {
      case "smooth":
        return isBall ? 1.0 : 1.5;
      case "normal":
        return isBall ? 1.0 : 1.5;
      case "heavy":
        return isBall ? 1.5 : 3.0;
    }
  }

  // requirement === "high" (smooth running, quiet, vibration free)
  switch (shock) {
    case "smooth":
      return isBall ? 2.0 : 3.0;
    case "normal":
      return isBall ? 2.0 : 3.5;
    case "heavy":
      return isBall ? 2.0 : 4.0;
  }
}

