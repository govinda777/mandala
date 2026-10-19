import { describe, it, expect } from 'vitest';
import { calculateMetatronCenters, calculateMetatronLines } from '../lib/mandala-math';

describe('Metatron\'s Cube Sacred Geometry Math', () => {
  it('should generate exactly 13 centers for Fruit of Life', () => {
    const radius = 100;
    const centers = calculateMetatronCenters(radius);

    expect(centers.length).toBe(13);

    // Center point (0, 0)
    expect(centers[0].x).toBeCloseTo(0);
    expect(centers[0].y).toBeCloseTo(0);

    // Inner ring (6 points at distance radius)
    for (let i = 1; i <= 6; i++) {
      const dist = Math.hypot(centers[i].x, centers[i].y);
      expect(dist).toBeCloseTo(radius);
    }

    // Outer ring (6 points at distance 2 * radius)
    for (let i = 7; i <= 12; i++) {
      const dist = Math.hypot(centers[i].x, centers[i].y);
      expect(dist).toBeCloseTo(2 * radius);
    }
  });

  it('should generate exactly 78 interconnecting lines for 13 centers', () => {
    const radius = 100;
    const centers = calculateMetatronCenters(radius);
    const lines = calculateMetatronLines(centers);

    // Combination nCr: 13C2 = (13 * 12) / 2 = 78
    expect(lines.length).toBe(78);

    // Check that first line connects center 0 and center 1
    expect(lines[0].p1).toEqual(centers[0]);
    expect(lines[0].p2).toEqual(centers[1]);
  });
});
