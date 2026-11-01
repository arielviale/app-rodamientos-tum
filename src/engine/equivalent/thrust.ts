import { Bearing, LoadInput, LoadModel, LoadResult } from "../types";

export const thrustBallLoadModel: LoadModel = {
  family: "thrust-ball",
  equivalent(input: LoadInput, _bearing?: Partial<Bearing>): LoadResult {
    const { Fr, Fa, directionReversible } = input;
    const warnings: string[] = [];

    if (Fr > 0) {
      return {
        P: 0,
        P0: 0,
        warnings,
        rejected: "Los rodamientos axiales de bolas de simple efecto no admiten carga radial (Fr debe ser 0).",
      };
    }

    if (directionReversible) {
      return {
        P: 0,
        P0: 0,
        warnings,
        rejected: "El axial de bolas de simple efecto solo toma empuje en un sentido.",
      };
    }

    return { P: Fa, P0: Fa, warnings };
  },
};

export const sphericalThrustLoadModel: LoadModel = {
  family: "spherical-thrust",
  equivalent(input: LoadInput, _bearing?: Partial<Bearing>): LoadResult {
    const { Fr, Fa, directionReversible } = input;
    const warnings: string[] = [];

    if (directionReversible) {
      return {
        P: 0,
        P0: 0,
        warnings,
        rejected: "El axial de rodillos a rótula solo admite empuje en un sentido.",
      };
    }

    if (Fr > 0.55 * Fa) {
      return {
        P: 0,
        P0: 0,
        warnings,
        rejected: "En axiales de rodillos a rótula, la carga radial no puede superar 0,55 Fa (Fr <= 0,55 Fa).",
      };
    }

    const P = Fa + 1.2 * Fr;
    const P0 = Fa + 2.7 * Fr;

    return { P, P0, warnings };
  },
};

