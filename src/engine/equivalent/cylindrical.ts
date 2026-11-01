import { Bearing, LoadInput, LoadModel, LoadResult } from "../types";

export const cylindricalLoadModel: LoadModel = {
  family: "cylindrical",
  equivalent(input: LoadInput, bearing?: Partial<Bearing>): LoadResult {
    const { Fr, Fa } = input;
    const warnings: string[] = [];

    const isFlanged =
      bearing?.series?.startsWith("NJ") ||
      bearing?.series?.startsWith("NUP") ||
      bearing?.axial === "flange-limited" ||
      bearing?.axial === "one-way" ||
      bearing?.axial === "two-way";

    if (!isFlanged && Fa > 0) {
      return {
        P: 0,
        P0: 0,
        warnings,
        rejected: "Los rodamientos de rodillos cilíndricos tipo NU o N solo admiten carga puramente radial.",
      };
    }

    if (isFlanged && Fa > 0) {
      if (Fr > 0 && Fa / Fr > 0.2) {
        warnings.push(
          "Carga axial sostenida en pestaña de rodillos cilíndricos (Fa/Fr > 0,2): verificar límite de carga axial de pestaña y lubricación en catálogo."
        );
      }
    }

    const P = Fr;
    const P0 = Fr;

    return { P, P0, warnings };
  },
};

