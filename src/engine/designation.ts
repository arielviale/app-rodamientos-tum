import { BearingFamily, Clearance } from "./types";

export interface ParsedDesignation {
  ok: true;
  raw: string;
  family: BearingFamily;
  series: string;
  boreMm: number;
  clearance?: Clearance;
  seal?: "open" | "Z" | "2Z" | "RZ" | "2RZ" | "RSL" | "2RSL" | "RS" | "2RS";
  unparsedSuffixes?: string[];
  axial?: "none" | "one-way" | "two-way" | "flange-limited";
}

export interface FailedDesignation {
  ok: false;
  raw: string;
  reason: string;
}

export type DesignationParseResult = ParsedDesignation | FailedDesignation;

export function parseDesignation(rawInput: string): DesignationParseResult {
  if (!rawInput || typeof rawInput !== "string") {
    return { ok: false, raw: "", reason: "Designación vacía o inválida" };
  }

  const raw = rawInput.trim();
  if (raw.length === 0) {
    return { ok: false, raw, reason: "Designación vacía" };
  }

  // Split into base and suffixes (often separated by '/' or '-' or spaces)
  // E.g.: "6208-2RS1/C3", "NU 2212 ECML", "618/8", "6202/15.875"
  
  // First, check explicit slash bore e.g. "618/8" or "6202/15.875" or "511/530"
  // Note: /C3 is a clearance suffix, not a bore! A slash bore has digits and optional decimal after the slash, followed by end of base or space.
  
  let basePart = raw.toUpperCase();
  let clearance: Clearance | undefined;
  let seal: ParsedDesignation["seal"] = "open";
  const unparsedSuffixes: string[] = [];

  // Check clearance suffix like /C2, /C3, /C4, /C5, /CN or -C3 etc.
  const clearanceMatch = basePart.match(/[/-]?(C[2-5]|CN)\b/);
  if (clearanceMatch) {
    clearance = clearanceMatch[1] as Clearance;
    basePart = basePart.replace(clearanceMatch[0], "").trim();
  }

  // Check seals e.g. 2RS1, 2RS, RS1, 2RSH, 2RSL, 2RZ, RZ, 2Z, Z
  const sealMatch = basePart.match(/[/-]?(2RS1|2RSH|2RS|2RSL|2RZ|RS1|RSH|RSL|RZ|2Z|Z)\b/);
  if (sealMatch) {
    const s = sealMatch[1];
    if (s.includes("2RS") || s.includes("2RSH")) seal = "2RS";
    else if (s.includes("RS") || s.includes("RSH")) seal = "RS";
    else if (s === "2RZ") seal = "2RZ";
    else if (s === "RZ") seal = "RZ";
    else if (s === "2RSL") seal = "2RSL";
    else if (s === "RSL") seal = "RSL";
    else if (s === "2Z") seal = "2Z";
    else if (s === "Z") seal = "Z";

    basePart = basePart.replace(sealMatch[0], "").trim();
  }

  // Remove whitespace
  const cleanBase = basePart.replace(/\s+/g, "");

  // Check slash bore e.g. 618/8 -> base = 618, bore = 8
  const slashBoreMatch = cleanBase.match(/^([A-Z0-9]+)\/(\d+(\.\d+)?)$/);
  let explicitBore: number | undefined;
  let mainCode = cleanBase;

  if (slashBoreMatch) {
    mainCode = slashBoreMatch[1];
    explicitBore = parseFloat(slashBoreMatch[2]);
  }

  // Match cylindrical bearings (NU, NJ, NUP, N, NF)
  const cylMatch = mainCode.match(/^(NU|NJ|NUP|N|NF)(\d+)$/);
  if (cylMatch) {
    const prefix = cylMatch[1];
    const numPart = cylMatch[2];
    const bore = explicitBore ?? decodeBoreFromDigits(numPart);
    if (bore === null) {
      return { ok: false, raw, reason: `No se pudo determinar el diámetro interior para "${raw}"` };
    }
    const series = prefix + (numPart.length >= 3 ? numPart.slice(0, numPart.length - 2) : numPart);
    const axial = prefix === "NU" || prefix === "N" ? "none" : prefix === "NUP" ? "two-way" : "one-way";

    return {
      ok: true,
      raw,
      family: "cylindrical",
      series,
      boreMm: bore,
      clearance,
      seal,
      axial,
      unparsedSuffixes,
    };
  }

  // Match standard ISO numeric designations:
  // First digit:
  // 6 -> deep-groove 1 row
  // 4 -> deep-groove 2 rows
  // 7 -> angular-contact
  // 1 -> self-aligning ball
  // 2 -> spherical-roller
  // 3 -> tapered roller
  // 5 -> thrust ball
  // QJ -> four-point
  // C -> CARB
  const carbMatch = mainCode.match(/^C(\d+)$/);
  if (carbMatch) {
    const bore = explicitBore ?? decodeBoreFromDigits(carbMatch[1]);
    if (bore === null) {
      return { ok: false, raw, reason: `Diámetro inválido en CARB "${raw}"` };
    }
    return {
      ok: true,
      raw,
      family: "carb",
      series: "C" + carbMatch[1].slice(0, -2),
      boreMm: bore,
      clearance,
      seal,
      axial: "none",
    };
  }

  const numericMatch = mainCode.match(/^([0-8])(\d{2,4})$/);
  if (!numericMatch) {
    return { ok: false, raw, reason: `Designación no reconocida o fuera del formato estándar ISO: "${raw}"` };
  }

  const typeDigit = numericMatch[1];
  const restDigits = numericMatch[2];

  let bore: number | null = explicitBore ?? null;
  if (bore === null) {
    bore = decodeBoreFromDigits(restDigits);
  }

  if (bore === null) {
    return { ok: false, raw, reason: `No se pudo descifrar el diámetro del rodamiento "${raw}"` };
  }

  let family: BearingFamily;
  let series = typeDigit;

  switch (typeDigit) {
    case "6":
      family = "deep-groove";
      series = "6" + (restDigits.length >= 3 ? restDigits.slice(0, restDigits.length - 2) : restDigits[0]);
      break;
    case "4":
      family = "deep-groove";
      series = "4" + restDigits.slice(0, restDigits.length - 2);
      break;
    case "7":
      family = "angular-contact";
      series = "7" + restDigits.slice(0, restDigits.length - 2);
      break;
    case "1":
      family = "self-aligning-ball";
      series = "1" + restDigits.slice(0, restDigits.length - 2);
      break;
    case "2":
      family = "spherical-roller";
      series = "2" + restDigits.slice(0, restDigits.length - 2);
      break;
    case "3":
      family = "tapered";
      series = "3" + restDigits.slice(0, restDigits.length - 2);
      break;
    case "5":
      family = "thrust-ball";
      series = "5" + restDigits.slice(0, restDigits.length - 2);
      break;
    default:
      return { ok: false, raw, reason: `Familia de código "${typeDigit}" no implementada en v1` };
  }

  return {
    ok: true,
    raw,
    family,
    series,
    boreMm: bore,
    clearance,
    seal,
    unparsedSuffixes,
  };
}

function decodeBoreFromDigits(digits: string): number | null {
  if (digits.length === 0) return null;

  // Single digit bore (e.g. 629 -> 9mm, 608 -> 8mm)
  if (digits.length === 2 && digits.startsWith("0")) {
    const code = digits;
    if (code === "00") return 10;
    if (code === "01") return 12;
    if (code === "02") return 15;
    if (code === "03") return 17;
  }

  // 2 digits at the end:
  if (digits.length >= 2) {
    const lastTwo = digits.slice(-2);
    if (lastTwo === "00") return 10;
    if (lastTwo === "01") return 12;
    if (lastTwo === "02") return 15;
    if (lastTwo === "03") return 17;

    const num = parseInt(lastTwo, 10);
    if (!isNaN(num) && num >= 4) {
      return num * 5;
    }
  }

  // 1 digit at the end (e.g. 629 -> 9mm)
  if (digits.length === 1 || digits.length === 2) {
    const num = parseInt(digits.slice(-1), 10);
    if (!isNaN(num)) return num;
  }

  return null;
}

