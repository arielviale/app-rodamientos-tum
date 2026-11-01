import {
  Bearing,
  BearingFamily,
  Candidate,
  FamilyRecommendation,
  SelectionInput,
  SelectionResult,
} from "./types";
import { getEquivalentLoad } from "./equivalent";
import { calculateL10, calculateL10h, calculateRequiredC, getA1Factor } from "./life";
import {
  calculateRequiredC0,
  calculateStaticSafetyFactor,
  getRecommendedStaticSafety,
} from "./staticSafety";
import { checkSpeed } from "./speed";
import { checkMinLoad } from "./minLoad";

export function evaluateFamilies(
  input: SelectionInput,
  positionIndex: number = 0
): FamilyRecommendation[] {
  const pos = input.positions[positionIndex] ?? input.positions[0];
  const duty0 = input.duty[0];
  const Fr = duty0?.Fr ?? 0;
  const Fa = duty0?.Fa ?? 0;
  const isFloating = pos.role === "floating";
  const isHighMisalignment = input.misalignmentLevel === "high" || (input.misalignmentArcMin !== undefined && input.misalignmentArcMin > 10);
  const isLowMisalignment = input.misalignmentLevel === "low" || (input.misalignmentArcMin !== undefined && input.misalignmentArcMin > 2 && input.misalignmentArcMin <= 10);
  const quietHigh = input.quietRunning === "high";
  const stiffnessHigh = input.stiffness === "high";

  const allFamilies: BearingFamily[] = [
    "deep-groove",
    "cylindrical",
    "spherical-roller",
    "self-aligning-ball",
    "angular-contact",
    "tapered",
    "carb",
    "thrust-ball",
    "spherical-thrust",
  ];

  const recommendations: FamilyRecommendation[] = [];

  for (const family of allFamilies) {
    let score = 10;
    let accepted = true;
    const reasons: string[] = [];
    const rejections: string[] = [];
    let title = "";

    switch (family) {
      case "deep-groove":
        title = "Rígido de bolas (1 hilera)";
        if (Fr <= 0 && Fa > 0) {
          reasons.push("Admite carga axial pura moderada (Fa ≤ 0,5 C0).");
        } else if (Fa > 0) {
          reasons.push("Toma carga combinada (radial y axial en ambos sentidos).");
        } else {
          reasons.push("Excelente para carga puramente radial a alta velocidad.");
        }

        if (isHighMisalignment) {
          accepted = false;
          rejections.push("Se descarta el rígido de bolas: indicaste desalineación o flexión angular mayor a 10 min de arco y este tipo solo admite entre 2 y 10 min.");
        } else if (isLowMisalignment) {
          score -= 2;
          reasons.push("Desalineación en el límite admisible para rígidos (hasta 10 min de arco).");
        }

        if (isFloating) {
          if (pos.allowLooseOuterRing) {
            reasons.push("Puede funcionar como apoyo libre únicamente si el aro exterior se monta con ajuste holgado en el alojamiento.");
          } else {
            score -= 3;
            reasons.push("Como apoyo libre no separable, requiere que uno de los aros deslice axialmente en su asiento para permitir la dilatación térmica.");
          }
        }

        if (quietHigh) {
          score += 3;
          reasons.push("Excelente comportamiento acústico y baja fricción para funcionamiento silencioso.");
        }
        if (stiffnessHigh) {
          score -= 2;
          reasons.push("Menor rigidez que un rodamiento con elementos rodantes lineales (rodillos).");
        }
        break;

      case "cylindrical":
        title = "Rodillos cilíndricos (NU / NJ / NUP)";
        if (Fa > 0 && Fr <= 0) {
          accepted = false;
          rejections.push("Los rodillos cilíndricos radiales no admiten empuje axial puro.");
        } else if (Fa > 0) {
          reasons.push("Solo ejecuciones con pestañas (NJ, NUP) admiten carga axial reducida (Fa/Fr ≤ 0,2).");
        } else {
          reasons.push("Excelente capacidad de carga radial pura y alta rigidez.");
        }

        if (isHighMisalignment) {
          accepted = false;
          rejections.push("Se descartan rodillos cilíndricos: no toleran desalineaciones angulares apreciables (límite típico 3 a 4 min de arco).");
        }

        if (isFloating) {
          score += 4;
          reasons.push("Apoyo libre ideal: el diseño NU o N desplaza axialmente por dentro de los aros sin inducir tensiones térmicas.");
        }

        if (stiffnessHigh) {
          score += 3;
          reasons.push("Contacto de línea: rigidez muy elevada.");
        }
        break;

      case "spherical-roller":
        title = "Rodillos a rótula (2 hileras)";
        reasons.push("Capacidad de carga extremadamente alta para combinada radial/axial en ambos sentidos.");
        if (isHighMisalignment) {
          score += 5;
          reasons.push("Autoalineable: compensa desalineaciones angulares y flexiones del eje de hasta 1,5° a 2°.");
        }
        if (quietHigh) {
          score -= 2;
          reasons.push("Nivel sonoro y fricción superiores a un rígido de bolas.");
        }
        if (stiffnessHigh) {
          score += 2;
        }
        break;

      case "self-aligning-ball":
        title = "Bolas a rótula";
        if (Fa > 0.5 * Fr) {
          score -= 3;
          reasons.push("Capacidad axial limitada frente a rígidos o contacto angular.");
        }
        if (isHighMisalignment) {
          score += 5;
          reasons.push("Autoalineable por excelencia: tolera flexión angular de eje de 2° a 3° sin sobrecargas.");
        }
        break;

      case "angular-contact":
        title = "Bolas de contacto angular (1 hilera)";
        if (Fa <= 0) {
          score -= 2;
          reasons.push("Sobredimensionado para radial puro sin empuje axial.");
        } else {
          reasons.push("Diseñado para carga combinada con componente axial dominante en un sentido.");
        }
        if (isHighMisalignment) {
          accepted = false;
          rejections.push("No tolera desalineación angular (máximo admisible ~2 min de arco).");
        }
        if (isFloating) {
          score -= 3;
          reasons.push("No apto para apoyo libre deslizante simple; suele requerir montaje en par.");
        }
        break;

      case "tapered":
        title = "Rodillos cónicos (1 hilera)";
        if (Fa <= 0) {
          score -= 2;
          reasons.push("La carga radial induce axial: siempre requiere apoyo opuesto de compensación.");
        } else {
          reasons.push("Capacidad muy alta para cargas combinadas y choques severos.");
        }
        if (isHighMisalignment) {
          accepted = false;
          rejections.push("Muy sensible a desalineaciones angulares (máximo ~2 min de arco).");
        }
        if (stiffnessHigh) {
          score += 4;
          reasons.push("Rigidez mecánica máxima mediante precarga en pares de apoyo.");
        }
        break;

      case "carb":
        title = "Rodamiento toroidal de rodillos CARB";
        if (Fa > 0) {
          accepted = false;
          rejections.push("El rodamiento CARB es exclusivamente radial y no admite ninguna componente axial.");
        } else {
          reasons.push("Combina autoalineación angular y libre desplazamiento axial interno de rodillos.");
        }
        if (isFloating) {
          score += 5;
          reasons.push("El apoyo libre superior: permite flexión angular y dilatación térmica simultánea dentro del rodamiento.");
        }
        break;

      case "thrust-ball":
        title = "Axial de bolas";
        if (Fr > 0) {
          accepted = false;
          rejections.push("Los axiales de bolas no admiten componente radial de carga (Fr debe ser cero).");
        } else if (Fa > 0) {
          reasons.push("Apto para carga puramente axial y centrada a velocidad moderada.");
        } else {
          accepted = false;
          rejections.push("No hay carga axial definida.");
        }
        break;

      case "spherical-thrust":
        title = "Axial de rodillos a rótula";
        if (Fa <= 0) {
          accepted = false;
          rejections.push("Requiere carga axial dominante obligatoria.");
        } else if (Fr > 0.55 * Fa) {
          accepted = false;
          rejections.push("La carga radial no puede superar 0,55 Fa.");
        } else {
          reasons.push("Cargas axiales muy pesadas con autoalineación.");
        }
        break;
    }

    recommendations.push({
      family,
      title,
      score: accepted ? score : -100,
      accepted,
      reasons,
      rejections,
    });
  }

  // Sort by score descending
  recommendations.sort((a, b) => b.score - a.score);
  return recommendations;
}

export function selectBearings(
  input: SelectionInput,
  catalog: Bearing[],
  positionIndex: number = 0
): SelectionResult {
  const pos = input.positions[positionIndex] ?? input.positions[0];
  const duty0 = input.duty[0];
  const Fr = duty0?.Fr ?? 0;
  const Fa = duty0?.Fa ?? 0;
  const n = duty0?.n ?? 0;
  const lifeReq = input.lifeHoursRequired;
  const a1 = getA1Factor(input.reliability);

  // Evaluate families
  const familyRecommendations = evaluateFamilies(input, positionIndex);
  const acceptedFamilies = new Set(
    familyRecommendations.filter((f) => f.accepted).map((f) => f.family)
  );

  // Required capacities calculation using generic ball/roller models
  const initialLoadRes = getEquivalentLoad("deep-groove", { Fr, Fa });
  const P_est = initialLoadRes.P > 0 ? initialLoadRes.P : Fr > 0 ? Fr : Fa > 0 ? Fa : 1.0;
  const P0_est = initialLoadRes.P0 > 0 ? initialLoadRes.P0 : P_est;

  const requiredC = calculateRequiredC(P_est, lifeReq, n, "ball", a1);
  const s0Req = getRecommendedStaticSafety({
    shock: input.shock,
    requirement: input.quietRunning === "high" ? "high" : "normal",
    motion: "rotating",
    rollingElement: "ball",
  });
  const requiredC0 = calculateRequiredC0(P0_est, s0Req);

  const candidates: Candidate[] = [];
  const warnings: string[] = [];

  // Filter catalog by bore range and space
  const eligibleBearings = catalog.filter((b) => {
    if (pos.boreMinMm !== undefined && b.boreMm < pos.boreMinMm) return false;
    if (pos.boreMaxMm !== undefined && b.boreMm > pos.boreMaxMm) return false;
    if (pos.outsideMaxMm !== undefined && b.outsideMm > pos.outsideMaxMm) return false;
    if (pos.widthMaxMm !== undefined && b.widthMm > pos.widthMaxMm) return false;
    return true;
  });

  for (const b of eligibleBearings) {
    const isFamilyAccepted = acceptedFamilies.has(b.family);
    const reasons: string[] = [];
    const bWarnings: string[] = [];
    const missingData: string[] = [];

    // Equivalent load
    let loadRes;
    try {
      loadRes = getEquivalentLoad(b.family, { Fr, Fa, clearance: b.clearance }, b);
    } catch {
      loadRes = { P: Fr, P0: Fr, warnings: [], rejected: "Familia sin modelo disponible" };
    }

    if (loadRes.rejected) {
      candidates.push({
        bearingId: b.id,
        bearing: b,
        status: "fail",
        P: 0,
        P0: 0,
        L10h: 0,
        lifeMode: "basic-iso",
        s0: 0,
        s0Required: s0Req,
        speedRatio: 0,
        a1,
        reasons: [],
        warnings: [loadRes.rejected],
        missingData,
      });
      continue;
    }

    const P = loadRes.P;
    const P0 = loadRes.P0;
    bWarnings.push(...loadRes.warnings);

    // Life calculation
    let L10 = 0;
    let L10h = 0;
    let Lnmh = 0;
    try {
      L10 = calculateL10(b.CkN, P, b.rollingElement);
      L10h = calculateL10h(L10, n);
      Lnmh = L10h * a1; // basic-iso: aSKF = 1
    } catch (err: unknown) {
      bWarnings.push(`Error al calcular vida: ${err instanceof Error ? err.message : String(err)}`);
    }

    // Static safety
    const s0 = calculateStaticSafetyFactor(b.C0kN, P0);
    const specificS0Req = getRecommendedStaticSafety({
      shock: input.shock,
      requirement: input.quietRunning === "high" ? "high" : "normal",
      motion: "rotating",
      rollingElement: b.rollingElement,
      family: b.family,
    });

    // Speed check
    const speedCheck = checkSpeed(n, b.limitingRpm, b.referenceRpm);
    bWarnings.push(...speedCheck.warnings);

    // Min load check
    const minLoadCheck = checkMinLoad(Fr > 0 ? Fr : Fa, b.CkN, b.rollingElement);
    if (minLoadCheck.warning) {
      bWarnings.push(minLoadCheck.warning);
    }

    // Pass / Fail assessment
    const meetsLife = Lnmh >= lifeReq;
    const meetsS0 = s0 >= specificS0Req;
    const meetsSpeed = speedCheck.valid;

    let status: Candidate["status"] = "pass";
    if (!isFamilyAccepted || !meetsLife || !meetsS0 || !meetsSpeed) {
      status = "fail";
    }

    // Reasons for engineering explanation
    if (meetsLife) {
      const lifeMargin = (Lnmh / lifeReq).toFixed(1);
      reasons.push(`Cumple la vida requerida de ${lifeReq.toLocaleString("es-AR")} h con un margen de ${lifeMargin}x (${Math.round(Lnmh).toLocaleString("es-AR")} h calculadas).`);
    } else {
      reasons.push(`La vida nominal (${Math.round(Lnmh).toLocaleString("es-AR")} h) no alcanza las ${lifeReq.toLocaleString("es-AR")} h requeridas.`);
    }

    if (meetsS0) {
      reasons.push(`Seguridad estática suficiente s0 = ${s0.toFixed(1)} (mínimo recomendado: ${specificS0Req.toFixed(1)}).`);
    } else {
      reasons.push(`Seguridad estática insuficiente s0 = ${s0.toFixed(1)} frente al mínimo recomendado de ${specificS0Req.toFixed(1)}.`);
    }

    if (!isFamilyAccepted) {
      const famRec = familyRecommendations.find((f) => f.family === b.family);
      if (famRec?.rejections.length) {
        reasons.unshift(...famRec.rejections);
      }
    }

    candidates.push({
      bearingId: b.id,
      bearing: b,
      status,
      P,
      P0,
      L10h,
      Lnmh,
      lifeMode: "basic-iso",
      s0,
      s0Required: specificS0Req,
      speedRatio: speedCheck.speedRatio,
      minLoadRatio: minLoadCheck.ratio,
      a1,
      aSkf: 1.0,
      reasons,
      warnings: bWarnings,
      missingData,
    });
  }

  // Ranking order (Section 6.5)
  // 1. Pass status first
  // 2. Life margin up to 3x
  // 3. Smaller outside diameter D, then smaller width B
  // 4. Standard series preference (62 over 63 if both pass)
  candidates.sort((a, b) => {
    if (a.status === "pass" && b.status !== "pass") return -1;
    if (a.status !== "pass" && b.status === "pass") return 1;

    // Both pass:
    if (a.status === "pass" && b.status === "pass") {
      // Series 62 preference over 63
      const aIs62 = a.bearing.series === "62";
      const bIs62 = b.bearing.series === "62";
      if (aIs62 && !bIs62) return -1;
      if (!aIs62 && bIs62) return 1;

      // Small outside diameter
      if (a.bearing.outsideMm !== b.bearing.outsideMm) {
        return a.bearing.outsideMm - b.bearing.outsideMm;
      }
      return a.bearing.widthMm - b.bearing.widthMm;
    }

    // Both fail: rank the one closer to meeting life
    return (b.Lnmh ?? 0) - (a.Lnmh ?? 0);
  });

  const topFam = familyRecommendations[0]?.title ?? "Rígido de bolas";
  const dispositionSummary = pos.role === "fixed"
    ? `Apoyo fijo: fija axialmente el eje en ambos sentidos. Familia recomendada: ${topFam}.`
    : pos.role === "floating"
    ? `Apoyo libre: permite la dilatación axial del eje. Familia recomendada: ${topFam}.`
    : `Apoyo solo axial: toma empuje axial puro. Familia recomendada: ${topFam}.`;

  return {
    positionIndex,
    role: pos.role,
    dispositionSummary,
    familyRecommendations,
    candidates,
    requiredC,
    requiredC0,
    warnings,
  };
}

