import { describe, it, expect } from 'vitest';
import { calculateMaurerRosePoints } from '../lib/mandala-math';

describe('Maurer Rose Mathematical Logic', () => {
  it('should generate 361 points for a valid Maurer Rose configuration', () => {
    const n = 6;
    const d = 71;
    const radius = 150;

    const points = calculateMaurerRosePoints(n, d, radius);

    expect(points).toBeDefined();
    expect(points.length).toBe(361);
  });

  it('should calculate correct polar coordinates for theta = 0 (first point)', () => {
    const n = 6;
    const d = 71;
    const radius = 100;

    const points = calculateMaurerRosePoints(n, d, radius);

    // theta0 = 0 * d * PI / 180 = 0
    // r0 = radius * sin(n * 0) = 0
    // x0 = 0 * cos(0) = 0, y0 = 0 * sin(0) = 0
    expect(points[0].x).toBeCloseTo(0, 5);
    expect(points[0].y).toBeCloseTo(0, 5);
  });

  it('should calculate points scaled accurately with radius', () => {
    const n = 2;
    const d = 29;
    const radius1 = 100;
    const radius2 = 200;

    const points1 = calculateMaurerRosePoints(n, d, radius1);
    const points2 = calculateMaurerRosePoints(n, d, radius2);

    expect(points2[10].x).toBeCloseTo(points1[10].x * 2, 4);
    expect(points2[10].y).toBeCloseTo(points1[10].y * 2, 4);
  });

  it('should handle edge cases like radius <= 0 or n = 0 or d = 0', () => {
    const pointsRadius0 = calculateMaurerRosePoints(6, 71, 0);
    expect(pointsRadius0.length).toBe(361);
    pointsRadius0.forEach(p => {
      expect(p.x).toBeCloseTo(0, 5);
      expect(p.y).toBeCloseTo(0, 5);
    });

    const pointsN0 = calculateMaurerRosePoints(0, 71, 100);
    expect(pointsN0.length).toBe(361);
    pointsN0.forEach(p => {
      expect(p.x).toBeCloseTo(0, 5);
      expect(p.y).toBeCloseTo(0, 5);
    });
  });
});
