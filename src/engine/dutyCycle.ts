/**
 * Mean load within an interval varying linearly between Fmin and Fmax
 * Fm = (Fmin + 2 * Fmax) / 3
 */
export function calculateMeanIntervalLoad(Fmin: number, Fmax: number): number {
  if (Fmin < 0 || Fmax < 0) {
    throw new Error("Loads must be non-negative");
  }
  return (Fmin + 2 * Fmax) / 3;
}

export type DutyBlock = {
  fraction: number;  // Ui (0..1), sum should equal 1
  lifeHours: number; // L10h for this block
};

/**
 * Calculates combined life from duty cycle spectrum using Miner's rule (ISO 281 / SKF catalog p. 81)
 * L10m = ( sum( Ui / L10mi ) )^(-1)
 */
export function calculateDutyCycleLife(blocks: DutyBlock[]): number {
  if (blocks.length === 0) {
    throw new Error("At least one duty block is required");
  }

  const totalFraction = blocks.reduce((acc, b) => acc + b.fraction, 0);
  if (Math.abs(totalFraction - 1.0) > 1e-4) {
    throw new Error(`Duty fractions must sum to 1.0 (current sum: ${totalFraction.toFixed(4)})`);
  }

  let reciprocalSum = 0;
  for (const block of blocks) {
    if (block.lifeHours <= 0) {
      throw new Error("Life hours of each duty block must be positive");
    }
    reciprocalSum += block.fraction / block.lifeHours;
  }

  if (reciprocalSum <= 0) {
    throw new Error("Invalid reciprocal sum in Miner rule");
  }

  return 1 / reciprocalSum;
}

