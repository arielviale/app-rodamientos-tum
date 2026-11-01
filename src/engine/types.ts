export const ENGINE_VERSION = "1.0.0";

export type BearingFamily =
  | "deep-groove"
  | "deep-groove-filling-slot"
  | "angular-contact"
  | "four-point"
  | "self-aligning-ball"
  | "cylindrical"
  | "needle"
  | "tapered"
  | "spherical-roller"
  | "carb"
  | "thrust-ball"
  | "spherical-thrust";

export type Clearance = "C2" | "CN" | "C3" | "C4" | "C5";

export type Bearing = {
  id: string;
  designation: string;
  source: "sample" | "user" | "licensed";
  family: BearingFamily;
  series: string;                 // e.g. "62", "NU2", "222"
  rows: 1 | 2 | 4;
  rollingElement: "ball" | "roller"; // defines p = 3 or 10/3
  diagram: "radial-ball" | "radial-roller" | "thrust-ball" | "thrust-roller";
  boreMm: number;
  outsideMm: number;
  widthMm: number;
  CkN: number;
  C0kN: number;
  PuKN?: number;
  referenceRpm?: number;
  limitingRpm?: number;
  massKg?: number;
  f0?: number;
  kr?: number;
  e?: number;
  X?: number;
  Y?: number;
  Y0?: number;
  Y1?: number;
  Y2?: number;
  clearance: Clearance;
  seal: "open" | "Z" | "2Z" | "RZ" | "2RZ" | "RSL" | "2RSL" | "RS" | "2RS";
  boreType: "cylindrical" | "tapered-1-12";
  cage: "steel-stamped" | "brass" | "polymer" | "full-complement";
  performance: "standard" | "explorer" | "e2";
  axial: "none" | "one-way" | "two-way" | "flange-limited";
  separable: boolean;
  misalignmentArcMin: number;     // max working admissible (arcmin)
  maxTempC: number;               // 120 if standard
  grease?: string;
};

export type LoadInput = {
  Fr: number; // kN (radial load)
  Fa: number; // kN (axial load)
  clearance?: Clearance;
  directionReversible?: boolean;
};

export type LoadResult = {
  P: number;          // kN, equivalent dynamic load
  P0: number;         // kN, equivalent static load
  warnings: string[];
  rejected?: string;  // if the bearing/family cannot take the load
};

export interface LoadModel {
  family: BearingFamily;
  equivalent(input: LoadInput, bearing?: Partial<Bearing>): LoadResult;
}

export type Reliability = 90 | 95 | 96 | 97 | 98 | 99;

export type ContaminationLevel =
  | "extreme-cleanliness"
  | "high-cleanliness"
  | "normal-cleanliness"
  | "slight-contamination"
  | "typical-contamination"
  | "severe-contamination"
  | "very-severe-contamination";

export type DutyPoint = {
  Fr: number;          // kN
  Fa: number;          // kN
  n: number;           // rpm
  hours?: number;      // or fraction
  fraction?: number;   // Ui 0..1
  kappa?: number;
  nu?: number;         // mm2/s
  temperatureC?: number;
};

export type ShaftRole = "fixed" | "floating" | "axial-only";

export type ShaftPositionInput = {
  role: ShaftRole;
  boreMinMm: number;
  boreMaxMm?: number;
  outsideMaxMm?: number;
  widthMaxMm?: number;
  allowLooseOuterRing?: boolean; // allows non-separable floating support if outer ring is loose
};

export type SelectionInput = {
  positions: ShaftPositionInput[];
  duty: DutyPoint[];
  reliability: Reliability;
  lifeHoursRequired: number;
  misalignmentArcMin?: number;  // undefined = unknown
  misalignmentLevel?: "none" | "low" | "high";
  shock: "smooth" | "normal" | "heavy";
  quietRunning: "unimportant" | "normal" | "high";
  stiffness: "low" | "normal" | "high";
  contamination: ContaminationLevel;
  lubrication: "unknown" | "grease-for-life" | "grease-relube" | "oil-bath" | "oil-circulation";
  isoVg?: number;
  epAdditive?: boolean;
  temperatureC: number;
  frequentMounting: boolean;
  borePreference: "cylindrical" | "tapered" | "any";
  rotation: "inner" | "outer" | "oscillating" | "static";
};

export type Candidate = {
  bearingId: string;
  bearing: Bearing;
  status: "pass" | "fail" | "incomplete";
  P: number;
  P0: number;
  L10h: number;
  Lnmh?: number;
  lifeMode: "basic-iso" | "modified";
  s0: number;
  s0Required: number;
  speedRatio: number;          // n / n_lim
  minLoadRatio?: number;       // F / Fmin
  kappa?: number;
  etaC?: number;
  a1: number;
  aSkf?: number;
  reasons: string[];
  warnings: string[];
  missingData: string[];
};

export type FamilyRecommendation = {
  family: BearingFamily;
  title: string;
  score: number;
  accepted: boolean;
  reasons: string[];
  rejections: string[];
};

export type SelectionResult = {
  positionIndex: number;
  role: ShaftRole;
  dispositionSummary: string;
  familyRecommendations: FamilyRecommendation[];
  candidates: Candidate[];
  requiredC: number;           // kN required dynamic load rating
  requiredC0: number;          // kN required static load rating
  warnings: string[];
};

