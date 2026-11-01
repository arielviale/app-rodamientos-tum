import { Bearing, LoadInput, LoadModel, LoadResult } from "../types";

export const sphericalRollerLoadModel: LoadModel = {
  family: "spherical-roller",
  equivalent(input: LoadInput, bearing?: Partial<Bearing>): LoadResult {
    const { Fr, Fa } = input;
    const warnings: string[] = [];

    // e, Y1, Y2 from bearing record
    const e = bearing?.e ?? 0.25;
    const Y1 = bearing?.Y1 ?? 2.7;
    const Y2 = bearing?.Y2 ?? 4.0;
    const Y0 = bearing?.Y0 ?? 2.5;

    let P: number;
    let P0: number;

    if (Fr <= 0) {
      P = Y2 * Fa;
      P0 = Y0 * Fa;
    } else {
      const ratio = Fa / Fr;
      if (ratio <= e) {
        P = Fr + Y1 * Fa;
      } else {
        P = 0.67 * Fr + Y2 * Fa;
      }
      P0 = Fr + Y0 * Fa;
    }

    return { P, P0, warnings };
  },
};

export const selfAligningBallLoadModel: LoadModel = {
  family: "self-aligning-ball",
  equivalent(input: LoadInput, bearing?: Partial<Bearing>): LoadResult {
    const { Fr, Fa } = input;
    const warnings: string[] = [];

    const e = bearing?.e ?? 0.22;
    const Y1 = bearing?.Y1 ?? 2.9;
    const Y2 = bearing?.Y2 ?? 4.5;
    const Y0 = bearing?.Y0 ?? 2.8;

    let P: number;
    let P0: number;

    if (Fr <= 0) {
      P = Y2 * Fa;
      P0 = Y0 * Fa;
    } else {
      const ratio = Fa / Fr;
      if (ratio <= e) {
        P = Fr + Y1 * Fa;
      } else {
        P = 0.65 * Fr + Y2 * Fa;
      }
      P0 = Fr + Y0 * Fa;
    }

    return { P, P0, warnings };
  },
};

