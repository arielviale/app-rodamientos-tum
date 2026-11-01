import { Bearing, LoadInput, LoadModel, LoadResult } from "../types";

export const angularContactLoadModel: LoadModel = {
  family: "angular-contact",
  equivalent(input: LoadInput, _bearing?: Partial<Bearing>): LoadResult {
    const { Fr, Fa, directionReversible } = input;
    const warnings: string[] = [];

    if (directionReversible) {
      return {
        P: 0,
        P0: 0,
        warnings,
        rejected: "Un rodamiento de contacto angular simple solo admite carga axial en un sentido. Con sentido reversible se requiere un par apareado (DB o DF).",
      };
    }

    if (Fa < 0) {
      return {
        P: 0,
        P0: 0,
        warnings,
        rejected: "Carga axial de sentido contrario al ángulo de contacto.",
      };
    }

    // Default for single row alpha = 40 deg (series 72, 73)
    let P: number;
    let P0: number;

    if (Fr <= 0) {
      P = 0.57 * Fa;
      P0 = 0.26 * Fa;
    } else {
      const ratio = Fa / Fr;
      if (ratio <= 1.14) {
        P = Fr;
      } else {
        P = 0.35 * Fr + 0.57 * Fa;
      }
      const rawP0 = 0.5 * Fr + 0.26 * Fa;
      P0 = rawP0 < Fr ? Fr : rawP0;
    }

    return { P, P0, warnings };
  },
};

