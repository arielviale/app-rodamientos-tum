import { Bearing, LoadInput, LoadModel, LoadResult } from "../types";

export const carbLoadModel: LoadModel = {
  family: "carb",
  equivalent(input: LoadInput, _bearing?: Partial<Bearing>): LoadResult {
    const { Fr, Fa } = input;
    const warnings: string[] = [];

    if (Fa > 0) {
      return {
        P: 0,
        P0: 0,
        warnings,
        rejected: "El rodamiento CARB es exclusivamente radial y no admite ninguna carga axial (Fa debe ser 0).",
      };
    }

    return { P: Fr, P0: Fr, warnings };
  },
};

