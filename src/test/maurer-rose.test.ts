import { describe, it, expect } from 'vitest';
import { calculateMaurerRosePoints } from '../lib/mandala-math';

describe('Maurer Rose Math', () => {
  it('should calculate exactly 361 points for k from 0 to 360', () => {
    const points = calculateMaurerRosePoints(6, 71, 100);
    expect(points).toHaveLength(361);
  });

  it('should have initial point at origin (0, 0) when k = 0', () => {
    const points = calculateMaurerRosePoints(6, 71, 100);
    expect(points[0].x).toBeCloseTo(0, 5);
    expect(points[0].y).toBeCloseTo(0, 5);
  });

  it('should scale radius correctly', () => {
    const radius = 200;
    const points = calculateMaurerRosePoints(2, 29, radius);
    points.forEach((p) => {
      const dist = Math.sqrt(p.x * p.x + p.y * p.y);
      expect(dist).toBeLessThanOrEqual(radius + 1e-5);
    });
  });

  it('should return points with zero coordinates when radius is 0', () => {
    const points = calculateMaurerRosePoints(6, 71, 0);
    expect(points).toHaveLength(361);
    points.forEach((p) => {
      expect(p.x).toBeCloseTo(0, 5);
      expect(p.y).toBeCloseTo(0, 5);
    });
  });

  it('should handle n = 0 returning all points at origin', () => {
    const points = calculateMaurerRosePoints(0, 71, 100);
    expect(points).toHaveLength(361);
    points.forEach((p) => {
      expect(p.x).toBeCloseTo(0, 5);
      expect(p.y).toBeCloseTo(0, 5);
    });
  });
});
