import { describe, it, expect } from 'vitest';
import { getNearestFibonacci, fibonacciNumbers, calculateFlowerOfLifeCenters, calculateGoldenSpiral, calculateFractalCircles, calculatePolygonRadiusMultiplier } from '../lib/mandala-math';

describe('Mandala Math', () => {
  describe('fibonacciNumbers', () => {
    it('should be an array of numbers', () => {
      expect(Array.isArray(fibonacciNumbers)).toBe(true);
      fibonacciNumbers.forEach(num => {
        expect(typeof num).toBe('number');
      });
    });

    it('should contain the correct Fibonacci sequence up to 89', () => {
        // 3, 5, 8, 13, 21, 34, 55, 89
      expect(fibonacciNumbers).toEqual([3, 5, 8, 13, 21, 34, 55, 89]);
    });
  });

  describe('getNearestFibonacci', () => {
    it('should return the exact number if it is in the sequence', () => {
      expect(getNearestFibonacci(3)).toBe(3);
      expect(getNearestFibonacci(5)).toBe(5);
      expect(getNearestFibonacci(13)).toBe(13);
    });

    it('should return the nearest number from the sequence', () => {
      expect(getNearestFibonacci(4)).toBe(3); // Closer to 3 than 5? 4-3=1, 5-4=1. Implementation might pick either depending on reduce logic, but let's check.
      // 4 is equidistant. reduce((prev, curr) => Math.abs(curr - n) < Math.abs(prev - n) ? curr : prev)
      // Iteration:
      // prev=3, curr=5. |5-4|=1, |3-4|=1. 1 < 1 is false. returns prev (3).

      expect(getNearestFibonacci(6)).toBe(5); // Closer to 5 (dist 1) than 8 (dist 2)
      expect(getNearestFibonacci(7)).toBe(8); // Closer to 8 (dist 1) than 5 (dist 2)
      expect(getNearestFibonacci(10)).toBe(8); // 8 (dist 2), 13 (dist 3)
      expect(getNearestFibonacci(11)).toBe(13); // 8 (dist 3), 13 (dist 2)
    });

    it('should handle numbers larger than the max in sequence', () => {
        expect(getNearestFibonacci(100)).toBe(89);
    });

    it('should handle numbers smaller than the min in sequence', () => {
        expect(getNearestFibonacci(1)).toBe(3);
    });
  });

  describe('calculateFlowerOfLifeCenters', () => {
    it('should return center point for 0 layers', () => {
      const points = calculateFlowerOfLifeCenters(50, 0);
      expect(points).toHaveLength(1);
      expect(points[0]).toEqual({ x: 0, y: 0 });
    });

    it('should return 7 points for 1 layer', () => {
      const points = calculateFlowerOfLifeCenters(50, 1);
      expect(points).toHaveLength(7); // 1 center + 6 surrounding
      // Check if one of the points is at (radius, 0)
      const hasRightPoint = points.some(p => Math.abs(p.x - 50) < 0.001 && Math.abs(p.y) < 0.001);
      expect(hasRightPoint).toBe(true);
    });

    it('should return 19 points for 2 layers', () => {
        // Layer 0: 1
        // Layer 1: 6
        // Layer 2: 12
        // Total: 19
        const points = calculateFlowerOfLifeCenters(50, 2);
        expect(points).toHaveLength(19);
    });
  });

  describe('Golden Ratio Spiral', () => {
    it('should generate spiral points using phi ratio', () => {
      const spiral = calculateGoldenSpiral(0, 0, 100, 4);
      expect(spiral.length).toBeGreaterThan(10);

      let prevRadius = -1;
      spiral.forEach((point) => {
        const radius = Math.sqrt(point.x ** 2 + point.y ** 2);
        expect(radius).toBeGreaterThanOrEqual(prevRadius);
        prevRadius = radius;
      });
    });
  });

  describe('calculatePolygonRadiusMultiplier', () => {
    it('should return 1 for a circle (sides < 3)', () => {
      expect(calculatePolygonRadiusMultiplier(0, 0)).toBe(1);
      expect(calculatePolygonRadiusMultiplier(Math.PI, 2)).toBe(1);
    });

    it('should return 1 at the vertices of a square', () => {
      const sides = 4;
      // Vertices for a square are at 0, PI/2, PI, 3PI/2
      expect(calculatePolygonRadiusMultiplier(0, sides)).toBeCloseTo(1, 5);
      expect(calculatePolygonRadiusMultiplier(Math.PI / 2, sides)).toBeCloseTo(1, 5);
      expect(calculatePolygonRadiusMultiplier(Math.PI, sides)).toBeCloseTo(1, 5);
      expect(calculatePolygonRadiusMultiplier((3 * Math.PI) / 2, sides)).toBeCloseTo(1, 5);
    });

    it('should return Math.cos(PI/4) at the midpoints of a square edges', () => {
      const sides = 4;
      // Midpoints are at PI/4, 3PI/4, 5PI/4, 7PI/4
      const expected = Math.cos(Math.PI / 4);
      expect(calculatePolygonRadiusMultiplier(Math.PI / 4, sides)).toBeCloseTo(expected, 5);
      expect(calculatePolygonRadiusMultiplier((3 * Math.PI) / 4, sides)).toBeCloseTo(expected, 5);
    });
  });

  describe('calculateFractalCircles', () => {
    it('should return 1 circle (center) for depth 0', () => {
      const circles = calculateFractalCircles(0, 0, 100, 0, 6);
      expect(circles).toHaveLength(1);
      expect(circles[0]).toEqual({ x: 0, y: 0, radius: 100 });
    });

    it('should return 1 + branches circles for depth 1', () => {
      const branches = 6;
      const circles = calculateFractalCircles(0, 0, 100, 1, branches);
      expect(circles).toHaveLength(1 + branches);
      // Verify radius of children is smaller (assuming 0.5 ratio)
      expect(circles[1].radius).toBe(50);
    });

    it('should handle depth 2 recursively', () => {
      const branches = 4;
      // Depth 0: 1
      // Depth 1: 4
      // Depth 2: 4 * 4 = 16
      // Total: 21
      const circles = calculateFractalCircles(0, 0, 100, 2, branches);
      expect(circles).toHaveLength(1 + 4 + 16);
    });
  });
});
