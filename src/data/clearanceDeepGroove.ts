import { Clearance } from "../engine/types";

/**
 * ISO 5753-1 Radial internal clearance for deep groove ball bearings (Table 6 in SKF catalog p. 316)
 * Values in micrometers (µm) [min, max]
 */
export interface ClearanceRange {
  minBoreMm: number; // inclusive
  maxBoreMm: number; // inclusive
  C2: [number, number];
  CN: [number, number];
  C3: [number, number];
  C4: [number, number];
  C5: [number, number];
}

export const DEEP_GROOVE_RADIAL_CLEARANCE: ClearanceRange[] = [
  { minBoreMm: 2.5, maxBoreMm: 10, C2: [0, 7], CN: [2, 13], C3: [8, 23], C4: [14, 29], C5: [20, 37] },
  { minBoreMm: 10, maxBoreMm: 18, C2: [0, 9], CN: [3, 18], C3: [11, 25], C4: [18, 33], C5: [25, 45] },
  { minBoreMm: 18, maxBoreMm: 24, C2: [0, 10], CN: [5, 20], C3: [13, 28], C4: [20, 36], C5: [28, 48] },
  { minBoreMm: 24, maxBoreMm: 30, C2: [1, 11], CN: [5, 20], C3: [13, 28], C4: [23, 41], C5: [30, 53] },
  { minBoreMm: 30, maxBoreMm: 40, C2: [1, 11], CN: [6, 20], C3: [15, 33], C4: [28, 46], C5: [40, 64] },
  { minBoreMm: 40, maxBoreMm: 50, C2: [1, 11], CN: [6, 23], C3: [18, 36], C4: [30, 51], C5: [45, 73] },
  { minBoreMm: 50, maxBoreMm: 65, C2: [1, 15], CN: [8, 28], C3: [23, 43], C4: [38, 61], C5: [55, 90] },
  { minBoreMm: 65, maxBoreMm: 80, C2: [1, 15], CN: [10, 30], C3: [25, 51], C4: [46, 71], C5: [65, 105] },
  { minBoreMm: 80, maxBoreMm: 100, C2: [1, 18], CN: [12, 36], C3: [30, 58], C4: [53, 84], C5: [75, 120] },
];

export function getRadialClearance(boreMm: number, clearance: Clearance): [number, number] | null {
  const match = DEEP_GROOVE_RADIAL_CLEARANCE.find(
    (r) => boreMm > r.minBoreMm && boreMm <= r.maxBoreMm
  );
  if (!match) return null;
  return match[clearance] ?? null;
}

