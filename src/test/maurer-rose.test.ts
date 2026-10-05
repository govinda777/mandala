import { describe, it, expect } from 'vitest';
import { calculateMaurerRosePoints } from '../lib/mandala-math';

describe('Maurer Rose Lattice Points Calculation', () => {
  it('should generate exactly 361 points for k from 0 to 360', () => {
    const n = 6;
    const d = 71;
    const radius = 200;
    const points = calculateMaurerRosePoints(n, d, radius);

    expect(points.length).toBe(361);
  });

  it('should calculate starting point at origin when k=0', () => {
    const n = 6;
    const d = 71;
    const radius = 200;
    const points = calculateMaurerRosePoints(n, d, radius);

    // at k = 0, theta = 0, sin(n * 0) = 0, so x=0, y=0
    expect(points[0].x).toBeCloseTo(0);
    expect(points[0].y).toBeCloseTo(0);
  });

  it('should keep all points within the bounding radius', () => {
    const n = 2;
    const d = 29;
    const radius = 150;
    const points = calculateMaurerRosePoints(n, d, radius);

    points.forEach(p => {
      const dist = Math.sqrt(p.x * p.x + p.y * p.y);
      expect(dist).toBeLessThanOrEqual(radius + 1e-5);
    });
  });

  it('should handle zero or negative radius safely', () => {
    const pointsZero = calculateMaurerRosePoints(6, 71, 0);
    expect(pointsZero.length).toBe(361);
    pointsZero.forEach(p => {
      expect(p.x).toBe(0);
      expect(p.y).toBe(0);
    });

    const pointsNeg = calculateMaurerRosePoints(6, 71, -100);
    expect(pointsNeg.length).toBe(361);
    pointsNeg.forEach(p => {
      expect(p.x).toBe(0);
      expect(p.y).toBe(0);
    });
  });
});
