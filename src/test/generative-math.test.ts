import { describe, it, expect } from 'vitest';
import { SeededRandom, generateGenerativeLayers } from '../lib/mandala-math';

describe('Generative Math Foundation', () => {
  describe('SeededRandom', () => {
    it('should generate deterministic sequences', () => {
      const rng1 = new SeededRandom(12345);
      const val1 = rng1.next();
      const val2 = rng1.nextRange(10, 20);

      const rng2 = new SeededRandom(12345);
      const val3 = rng2.next();
      const val4 = rng2.nextRange(10, 20);

      expect(val1).toBe(val3);
      expect(val2).toBe(val4);
    });
  });

  describe('generateGenerativeLayers', () => {
    it('should generate layers correctly', () => {
      const layers = generateGenerativeLayers(5, 10, 100, 123);

      expect(layers.length).toBe(5);
      // Layers should be scaled from 1.0 down to 0.2
      expect(layers[0].scale).toBe(1.0);
      expect(layers[1].scale).toBeCloseTo(0.8);
      expect(layers[4].scale).toBeCloseTo(0.2);

      // Verify the generated hue
      expect(layers[0].hue).toBeGreaterThanOrEqual(0);
      expect(layers[0].hue).toBeLessThanOrEqual(360);
    });

    it('should constrain petal Y anchors based on tangent logic', () => {
      const baseRadius = 200;
      const petals = 6;
      // angle = 2PI/6 = PI/3. Half angle = PI/6 (30 deg). tan(30) = 0.577. Max Y constraint will be 0.9 * 0.577 ~ 0.519 * X.
      const layers = generateGenerativeLayers(1, petals, baseRadius, 456);

      const p = layers[0].petals;

      // Calculate max possible Y values based on X and constraint
      const angleRad = (Math.PI * 2) / petals;
      const calcMaxY = (x: number) => x * Math.tan(angleRad / 2) * 0.9;

      expect(p.y2).toBeLessThanOrEqual(calcMaxY(p.x2) + 0.001);
      expect(p.y3).toBeLessThanOrEqual(calcMaxY(p.x3) + 0.001);
    });
  });
});
