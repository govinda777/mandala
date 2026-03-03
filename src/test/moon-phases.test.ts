import { describe, it, expect } from 'vitest';
import { calculateMoonPhase, getMoonPhaseName, getMoonIllumination } from '../lib/mandala-math';

describe('Moon Phases', () => {
  it('should calculate moon phase 0 for a known New Moon date', () => {
    // Known new moon: Jan 21, 2023 (approx)
    const newMoonDate = new Date('2023-01-21T20:53:00Z');
    const phase = calculateMoonPhase(newMoonDate);
    // Phase should be close to 0 or 29.53
    expect(phase).toBeGreaterThanOrEqual(0);
    // It can be ~29.4 or 0.1 depending on exact hours and calculation
    const isNewMoon = phase < 1.5 || phase > 28;
    expect(isNewMoon).toBe(true);
  });

  it('should calculate moon phase ~14.7 for a known Full Moon date', () => {
    // Known full moon: Feb 5, 2023 (approx)
    const fullMoonDate = new Date('2023-02-05T18:29:00Z');
    const phase = calculateMoonPhase(fullMoonDate);
    // 29.53 / 2 is ~14.76
    expect(phase).toBeGreaterThan(13);
    expect(phase).toBeLessThan(16);
  });

  it('should return correct names for moon phases', () => {
    expect(getMoonPhaseName(0)).toBe('Nova');
    expect(getMoonPhaseName(3)).toBe('Crescente');
    expect(getMoonPhaseName(7.4)).toBe('Quarto Crescente');
    expect(getMoonPhaseName(11)).toBe('Gibosa Crescente');
    expect(getMoonPhaseName(14.8)).toBe('Cheia');
    expect(getMoonPhaseName(18)).toBe('Gibosa Minguante');
    expect(getMoonPhaseName(22.1)).toBe('Quarto Minguante');
    expect(getMoonPhaseName(26)).toBe('Minguante');
    expect(getMoonPhaseName(29.5)).toBe('Nova');
  });

  it('should calculate illumination percentage correctly', () => {
    // New moon: 0%
    expect(getMoonIllumination(0)).toBeCloseTo(0, 1);
    expect(getMoonIllumination(29.53)).toBeCloseTo(0, 1);

    // First quarter: 50%
    expect(getMoonIllumination(29.53 / 4)).toBeCloseTo(0.5, 1);

    // Full moon: 100%
    expect(getMoonIllumination(29.53 / 2)).toBeCloseTo(1, 1);

    // Last quarter: 50%
    expect(getMoonIllumination((29.53 * 3) / 4)).toBeCloseTo(0.5, 1);
  });
});
