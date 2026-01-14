import { describe, it, expect } from 'vitest';
import { getNearestFibonacci, fibonacciNumbers } from './mandala-math';

describe('Mandala Math Logic', () => {
  describe('getNearestFibonacci', () => {
    it('should return the exact Fibonacci number if input matches', () => {
      expect(getNearestFibonacci(3)).toBe(3);
      expect(getNearestFibonacci(21)).toBe(21);
      expect(getNearestFibonacci(89)).toBe(89);
    });

    it('should return the nearest Fibonacci number for non-Fibonacci inputs', () => {
      // 4 is between 3 and 5. It is equidistant (distance 1).
      // The reduce function returns the *first* one it found if strictly less?
      // Math.abs(5 - 4) < Math.abs(3 - 4) => 1 < 1 => False. So it stays with prev (3).
      // Let's verify implementation behavior.
      expect(getNearestFibonacci(4)).toBe(3);

      expect(getNearestFibonacci(6)).toBe(5); // Closer to 5 than 8
      expect(getNearestFibonacci(7)).toBe(8); // Closer to 8 than 5
      expect(getNearestFibonacci(10)).toBe(8); // Closer to 8 than 13
      expect(getNearestFibonacci(12)).toBe(13); // Closer to 13 than 8
    });

    it('should handle large numbers by returning the largest Fibonacci in the list', () => {
      expect(getNearestFibonacci(100)).toBe(89);
    });

    it('should handle small numbers by returning the smallest Fibonacci in the list', () => {
      expect(getNearestFibonacci(1)).toBe(3);
    });
  });

  describe('fibonacciNumbers constant', () => {
    it('should contain the expected sequence', () => {
      expect(fibonacciNumbers).toEqual([3, 5, 8, 13, 21, 34, 55, 89]);
    });
  });
});
