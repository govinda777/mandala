import { describe, it, expect } from 'vitest';
import { calculateMaurerRosePoints } from '../lib/mandala-math';

describe('Maurer Rose Lattice Math', () => {
  it('should calculate 361 points for valid n, d, and radius parameters', () => {
    const n = 6;
    const d = 71;
    const radius = 200;

    const points = calculateMaurerRosePoints(n, d, radius);

    expect(points.length).toBe(361);
  });

  it('should return point (0,0) for k=0 since r = radius * sin(0) = 0', () => {
    const points = calculateMaurerRosePoints(5, 29, 100);

    expect(points[0].x).toBeCloseTo(0, 5);
    expect(points[0].y).toBeCloseTo(0, 5);
  });

  it('should correctly calculate coordinates for k=1 based on polar formula', () => {
    const n = 2;
    const d = 45;
    const radius = 100;

    // k=1: thetaDeg = 45 deg = PI/4 rad
    // r = 100 * sin(2 * PI/4) = 100 * sin(PI/2) = 100
    // x = 100 * cos(PI/4) = 100 * (sqrt(2)/2) ~ 70.710678
    // y = 100 * sin(PI/4) = 100 * (sqrt(2)/2) ~ 70.710678
    const points = calculateMaurerRosePoints(n, d, radius);

    const expectedVal = 100 * Math.SQRT1_2;
    expect(points[1].x).toBeCloseTo(expectedVal, 4);
    expect(points[1].y).toBeCloseTo(expectedVal, 4);
  });

  it('should return empty array if radius is zero or negative', () => {
    expect(calculateMaurerRosePoints(6, 71, 0)).toEqual([]);
    expect(calculateMaurerRosePoints(6, 71, -50)).toEqual([]);
  });
});
