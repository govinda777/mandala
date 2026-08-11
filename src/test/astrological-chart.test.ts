import { describe, it, expect } from 'vitest';
import { calculatePlanetaryPositions, calculateAstrologicalAspects } from '../lib/mandala-math';

describe('Astrological Chart Overlay', () => {
  describe('calculatePlanetaryPositions', () => {
    it('should calculate positions for 7 celestial bodies', () => {
      const testDate = new Date('2020-01-01T12:00:00Z');
      const positions = calculatePlanetaryPositions(testDate);

      const keys = Object.keys(positions);
      expect(keys).toContain('Sun');
      expect(keys).toContain('Moon');
      expect(keys).toContain('Mercury');
      expect(keys).toContain('Venus');
      expect(keys).toContain('Mars');
      expect(keys).toContain('Jupiter');
      expect(keys).toContain('Saturn');

      // Check that all angles are within 0 to 360 degrees
      keys.forEach((key) => {
        const val = positions[key];
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThan(360);
      });
    });

    it('should handle invalid date gracefully by returning standard positions', () => {
      const invalidDate = new Date('invalid-date-string');
      const positions = calculatePlanetaryPositions(invalidDate);

      const keys = Object.keys(positions);
      expect(keys.length).toBe(7);
      keys.forEach((key) => {
        expect(positions[key]).toBeGreaterThanOrEqual(0);
        expect(positions[key]).toBeLessThan(360);
      });
    });
  });

  describe('calculateAstrologicalAspects', () => {
    it('should detect conjunction within tolerance (orb = 6)', () => {
      const positions = {
        Sun: 10,
        Moon: 12, // 2 degree difference -> Conjunction (0)
        Mercury: 90,
        Venus: 180,
        Mars: 270,
        Jupiter: 45,
        Saturn: 300
      };

      const aspects = calculateAstrologicalAspects(positions);
      const conjunction = aspects.find(
        (a) =>
          (a.p1 === 'Sun' && a.p2 === 'Moon' || a.p1 === 'Moon' && a.p2 === 'Sun') &&
          a.type === 'conjunction'
      );
      expect(conjunction).toBeDefined();
    });

    it('should detect opposition within tolerance (orb = 6)', () => {
      const positions = {
        Sun: 0,
        Moon: 182, // 182 degree difference -> Opposition (180)
        Mercury: 90,
        Venus: 45,
        Mars: 270,
        Jupiter: 120,
        Saturn: 300
      };

      const aspects = calculateAstrologicalAspects(positions);
      const opposition = aspects.find(
        (a) =>
          (a.p1 === 'Sun' && a.p2 === 'Moon' || a.p1 === 'Moon' && a.p2 === 'Sun') &&
          a.type === 'opposition'
      );
      expect(opposition).toBeDefined();
    });

    it('should detect trine within tolerance (orb = 6)', () => {
      const positions = {
        Sun: 0,
        Moon: 124, // 124 degree difference -> Trine (120)
        Mercury: 90,
        Venus: 45,
        Mars: 270,
        Jupiter: 180,
        Saturn: 300
      };

      const aspects = calculateAstrologicalAspects(positions);
      const trine = aspects.find(
        (a) =>
          (a.p1 === 'Sun' && a.p2 === 'Moon' || a.p1 === 'Moon' && a.p2 === 'Sun') &&
          a.type === 'trine'
      );
      expect(trine).toBeDefined();
    });

    it('should detect square within tolerance (orb = 6)', () => {
      const positions = {
        Sun: 0,
        Moon: 87, // 87 degree difference -> Square (90)
        Mercury: 190,
        Venus: 45,
        Mars: 270,
        Jupiter: 180,
        Saturn: 300
      };

      const aspects = calculateAstrologicalAspects(positions);
      const square = aspects.find(
        (a) =>
          (a.p1 === 'Sun' && a.p2 === 'Moon' || a.p1 === 'Moon' && a.p2 === 'Sun') &&
          a.type === 'square'
      );
      expect(square).toBeDefined();
    });

    it('should not detect an aspect if difference is outside tolerance', () => {
      const positions = {
        Sun: 0,
        Moon: 45, // 45 degree difference -> No aspect (45 is not close to 0, 90, 120, 180)
        Mercury: 190,
        Venus: 45,
        Mars: 270,
        Jupiter: 180,
        Saturn: 300
      };

      const aspects = calculateAstrologicalAspects(positions);
      const aspect = aspects.find(
        (a) =>
          (a.p1 === 'Sun' && a.p2 === 'Moon' || a.p1 === 'Moon' && a.p2 === 'Sun')
      );
      expect(aspect).toBeUndefined();
    });
  });
});
