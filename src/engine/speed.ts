export interface SpeedCheckResult {
  valid: boolean;
  speedRatio: number; // n / n_lim
  warnings: string[];
  rejection?: string;
}

export function checkSpeed(n: number, limitingRpm?: number, referenceRpm?: number): SpeedCheckResult {
  const warnings: string[] = [];

  if (n <= 0) {
    return {
      valid: false,
      speedRatio: 0,
      warnings: ["Velocidad nula o negativa"],
      rejection: "La velocidad de rotación debe ser mayor a cero",
    };
  }

  if (limitingRpm !== undefined && limitingRpm > 0) {
    const ratio = n / limitingRpm;
    if (n > limitingRpm) {
      return {
        valid: false,
        speedRatio: ratio,
        warnings: [],
        rejection: `La velocidad de giro (${n} r.p.m.) supera el límite mecánico admisible (${limitingRpm} r.p.m.)`,
      };
    }

    if (ratio > 0.5) {
      warnings.push("La velocidad supera el 50% del límite mecánico: verificar carga mínima para evitar patinaje de elementos rodantes.");
    }

    if (referenceRpm !== undefined && referenceRpm > 0 && n > referenceRpm) {
      warnings.push(`La velocidad (${n} r.p.m.) supera la velocidad de referencia térmica (${referenceRpm} r.p.m.): se requiere refrigeración adicional o verificación de equilibrio térmico.`);
    }

    return {
      valid: true,
      speedRatio: ratio,
      warnings,
    };
  }

  if (referenceRpm !== undefined && referenceRpm > 0 && n > referenceRpm) {
    warnings.push(`La velocidad (${n} r.p.m.) supera la velocidad térmica de referencia (${referenceRpm} r.p.m.).`);
  }

  return {
    valid: true,
    speedRatio: 0,
    warnings,
  };
}

