import { Bearing, BearingFamily, LoadInput, LoadModel, LoadResult } from "../types";
import { deepGrooveLoadModel } from "./deepGroove";
import { cylindricalLoadModel } from "./cylindrical";
import { angularContactLoadModel } from "./angularContact";
import { selfAligningBallLoadModel, sphericalRollerLoadModel } from "./spherical";
import { taperedRollerLoadModel } from "./tapered";
import { carbLoadModel } from "./carb";
import { sphericalThrustLoadModel, thrustBallLoadModel } from "./thrust";

const MODELS: Record<BearingFamily, LoadModel> = {
  "deep-groove": deepGrooveLoadModel,
  "deep-groove-filling-slot": deepGrooveLoadModel,
  "cylindrical": cylindricalLoadModel,
  "angular-contact": angularContactLoadModel,
  "spherical-roller": sphericalRollerLoadModel,
  "self-aligning-ball": selfAligningBallLoadModel,
  "tapered": taperedRollerLoadModel,
  "carb": carbLoadModel,
  "thrust-ball": thrustBallLoadModel,
  "spherical-thrust": sphericalThrustLoadModel,
  "four-point": angularContactLoadModel,
  "needle": cylindricalLoadModel,
};

export function getEquivalentLoad(
  family: BearingFamily,
  input: LoadInput,
  bearing?: Partial<Bearing>
): LoadResult {
  const model = MODELS[family];
  if (!model) {
    throw new Error(`Load model for family "${family}" is not implemented`);
  }
  return model.equivalent(input, bearing);
}

export {
  deepGrooveLoadModel,
  cylindricalLoadModel,
  angularContactLoadModel,
  sphericalRollerLoadModel,
  selfAligningBallLoadModel,
  taperedRollerLoadModel,
  carbLoadModel,
  thrustBallLoadModel,
  sphericalThrustLoadModel,
};

