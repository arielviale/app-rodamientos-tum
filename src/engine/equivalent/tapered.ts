import { Bearing, LoadInput, LoadModel, LoadResult } from "../types";

export const taperedRollerLoadModel: LoadModel = {
  family: "tapered",
  equivalent(input: LoadInput, bearing?: Partial<Bearing>): LoadResult {
    const { Fr, Fa, directionReversible } = input;
    const warnings: string[] = [];

    if (directionReversible) {
      return {
        P: 0,
        P0: 0,
        warnings,
        rejected: "Un rodamiento de rodillos cónicos simple solo admite empuje axial en un sentido. Con inversión se requiere un par de cónicos.",
      };
    }

    const e = bearing?.e ?? 0.35;
    const Y = bearing?.Y ?? 1.7;
    const Y0 = bearing?.Y0 ?? 0.9;

    let P: number;
    let P0: number;

    if (Fr <= 0) {
      P = Y * Fa;
      P0 = Y0 * Fa;
    } else {
      const ratio = Fa / Fr;
      if (ratio <= e) {
        P = Fr;
      } else {
        P = 0.4 * Fr + Y * Fa;
      }
      const rawP0 = 0.5 * Fr + Y0 * Fa;
      P0 = rawP0 < Fr ? Fr : rawP0;
    }

    warnings.push("La carga radial sobre un rodamiento cónico induce una fuerza axial adicional: un rodamiento cónico aislado requiere un segundo apoyo para equilibrarse.");

    return { P, P0, warnings };
  },
};

