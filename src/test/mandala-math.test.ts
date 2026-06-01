import { describe, it, expect } from 'vitest';
import { getNearestFibonacci, fibonacciNumbers, calculateFlowerOfLifeCenters, calculateGoldenSpiral, calculateFibonacciRadius, calculateMirroredAngle, calculateChladniPattern, evaluatePolarEquation, generatePolarLayers } from '../lib/mandala-math';

describe('Mandala Math', () => {
  describe('Cymatics / Chladni Pattern', () => {
    it('should generate an array of points', () => {
      // Testing with a low resolution and simple parameters
      const points = calculateChladniPattern(1, 1, 1, 1, 0.1);
      expect(Array.isArray(points)).toBe(true);
    });

    it('should calculate specific points correctly for n=3, m=5', () => {
      // With low random tests, we should expect some points back
      // Using deterministic or pseudo-dense point checking.
      const points = calculateChladniPattern(3, 5, 1, 1000, 0.1);
      expect(points.length).toBeGreaterThan(0);

      // Select a point from the result and verify it roughly matches the Chladni equation
      const p = points[0];
      const z = Math.cos(3 * Math.PI * p.x) * Math.cos(5 * Math.PI * p.y) -
                Math.cos(5 * Math.PI * p.x) * Math.cos(3 * Math.PI * p.y);

      expect(Math.abs(z)).toBeLessThanOrEqual(0.1);
    });
  });

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

  describe('Polar Math Engine', () => {
    it('evaluates smooth polar curve correctly', () => {
      // r = R + A * sin(k*theta)
      // theta = pi/2, k = 1 => sin(pi/2) = 1 => r = R + A
      expect(evaluatePolarEquation(Math.PI / 2, 100, 50, 1, 'smooth')).toBeCloseTo(150);
      // theta = 3pi/2 => sin(3pi/2) = -1 => r = R - A
      expect(evaluatePolarEquation((3 * Math.PI) / 2, 100, 50, 1, 'smooth')).toBeCloseTo(50);
    });

    it('evaluates sharp polar curve correctly', () => {
      // r = R + A * |sin(k*theta)|
      // theta = 3pi/2 => sin = -1 => |sin| = 1 => r = R + A
      expect(evaluatePolarEquation((3 * Math.PI) / 2, 100, 50, 1, 'sharp')).toBeCloseTo(150);
    });

    it('generates correct number of layers', () => {
      const layers = generatePolarLayers(3, 8, 100, 1, 0);
      expect(layers).toHaveLength(3);
    });

    it('generates points with expected structure and determinism', () => {
      const layers1 = generatePolarLayers(2, 6, 100, 1, 0, 'smooth', false, 123);
      const layers2 = generatePolarLayers(2, 6, 100, 1, 0, 'smooth', false, 123);

      // Should be deterministic
      expect(layers1[0].hue).toBe(layers2[0].hue);
      expect(layers1[0].points.length).toBeGreaterThan(0);

      // Should contain cartesian coordinates x and y
      expect(layers1[0].points[0]).toHaveProperty('x');
      expect(layers1[0].points[0]).toHaveProperty('y');
    });
  });

  describe('calculateMirroredAngle', () => {
    it('should mirror angle around the x-axis (0 rad)', () => {
      // theta = 30 deg (PI/6), axis = 0
      // expected = 2*0 - PI/6 = -PI/6
      expect(calculateMirroredAngle(Math.PI / 6, 0)).toBeCloseTo(-Math.PI / 6);
      expect(calculateMirroredAngle(Math.PI / 4, 0)).toBeCloseTo(-Math.PI / 4);
    });

    it('should mirror angle around the y-axis (PI/2 rad)', () => {
      // theta = 30 deg (PI/6), axis = 90 deg (PI/2)
      // expected = 2*(PI/2) - PI/6 = PI - PI/6 = 5PI/6
      expect(calculateMirroredAngle(Math.PI / 6, Math.PI / 2)).toBeCloseTo((5 * Math.PI) / 6);
    });

    it('should handle negative angles correctly', () => {
      // theta = -30 deg (-PI/6), axis = 45 deg (PI/4)
      // expected = 2*(PI/4) - (-PI/6) = PI/2 + PI/6 = 4PI/6 = 2PI/3
      expect(calculateMirroredAngle(-Math.PI / 6, Math.PI / 4)).toBeCloseTo((2 * Math.PI) / 3);
    });

    it('should handle angles greater than 2*PI', () => {
      // theta = 390 deg (2*PI + PI/6), axis = 0
      // expected = 2*0 - (2*PI + PI/6) = -2*PI - PI/6
      // We can check if it resolves to -PI/6 (modulo 2PI) or exact.
      // The formula 2*axis - angle will give exactly -2*PI - PI/6.
      expect(calculateMirroredAngle(2 * Math.PI + Math.PI / 6, 0)).toBeCloseTo(-2 * Math.PI - Math.PI / 6);
    });
  });

  describe('calculateFibonacciRadius', () => {
    it('should calculate radius based on fibonacci sequence for layers', () => {
      const baseRadius = 10;

      // Layer 1 (index 0) -> fib(1) = 1
      expect(calculateFibonacciRadius(baseRadius, 1)).toBe(10 * 1);

      // Layer 2 (index 1) -> fib(2) = 2
      expect(calculateFibonacciRadius(baseRadius, 2)).toBe(10 * 2);

      // Layer 3 (index 2) -> fib(3) = 3
      expect(calculateFibonacciRadius(baseRadius, 3)).toBe(10 * 3);

      // Layer 4 (index 3) -> fib(4) = 5
      expect(calculateFibonacciRadius(baseRadius, 4)).toBe(10 * 5);

      // Layer 5 (index 4) -> fib(5) = 8
      expect(calculateFibonacciRadius(baseRadius, 5)).toBe(10 * 8);
    });

    it('should return baseRadius if layer <= 0', () => {
      expect(calculateFibonacciRadius(10, 0)).toBe(10);
      expect(calculateFibonacciRadius(10, -1)).toBe(10);
    });
  });
});
