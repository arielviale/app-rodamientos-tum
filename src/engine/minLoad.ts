export interface MinLoadCheckResult {
  minLoadKn: number;
  satisfied: boolean;
  ratio: number; // load / minLoadKn
  warning?: string;
}

/**
 * Calculates minimum load for deep groove ball bearing if kr, nu, n, dm are known
 */
export function calculateDeepGrooveMinLoad(kr: number, nu: number, n: number, dm: number): number {
  if (kr <= 0 || nu <= 0 || n <= 0 || dm <= 0) {
    return 0;
  }
  return kr * Math.pow((nu * n) / 1000, 2 / 3) * Math.pow(dm / 100, 2);
}

/**
 * General rule for minimum load (SKF catalog p. 86)
 * - balls: ~0.01 * C
 * - rollers: ~0.02 * C
 */
export function calculateGeneralMinLoad(C: number, rollingElement: "ball" | "roller"): number {
  return rollingElement === "ball" ? 0.01 * C : 0.02 * C;
}

export function checkMinLoad(
  actualLoadKn: number,
  C: number,
  rollingElement: "ball" | "roller",
  specificMinLoad?: number
): MinLoadCheckResult {
  const minLoad = specificMinLoad && specificMinLoad > 0
    ? specificMinLoad
    : calculateGeneralMinLoad(C, rollingElement);

  const ratio = minLoad > 0 ? actualLoadKn / minLoad : 1.0;
  const satisfied = actualLoadKn >= minLoad;

  return {
    minLoadKn: minLoad,
    satisfied,
    ratio,
    warning: satisfied
      ? undefined
      : `Carga aplicada (${actualLoadKn.toFixed(2)} kN) por debajo del mínimo recomendado (${minLoad.toFixed(2)} kN): riesgo de patinaje y daño superficial en los elementos rodantes.`,
  };
}

