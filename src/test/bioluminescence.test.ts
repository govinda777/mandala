import { describe, it, expect } from 'vitest';
import { calculateBioluminescenceIntensity, getBioluminescenceColor } from '../lib/mandala-math';

describe('Bioluminescence Math Logic', () => {
  describe('calculateBioluminescenceIntensity', () => {
    it('should return higher intensity at smaller radius (close to center)', () => {
      const high = calculateBioluminescenceIntensity(10, 100);
      const low = calculateBioluminescenceIntensity(90, 100);
      expect(high).toBeGreaterThan(low);
    });

    it('should clamp intensity so it does not go to infinity at r=0', () => {
      const maxIntensity = calculateBioluminescenceIntensity(0, 100);
      expect(maxIntensity).toBeLessThanOrEqual(2.0); // Based on our planned clamping
    });

    it('should drop off following an inverse square-like curve', () => {
      const i1 = calculateBioluminescenceIntensity(20, 100);
      const i2 = calculateBioluminescenceIntensity(40, 100); // Distance doubled
      // In a strict inverse square, distance doubled = intensity quartered.
      // We are adding an offset so it won't be exactly quartered but should drop significantly.
      expect(i1).toBeGreaterThan(i2);
    });
  });

  describe('getBioluminescenceColor', () => {
    it('should return a hsla color string', () => {
      const color = getBioluminescenceColor(1, 100);
      expect(color).toMatch(/hsla\(\d+,\s*\d+%,\s*\d+%,\s*[\d.]+\)/);
    });

    it('should cap the base hue to bioluminescent spectrum (160 to 240)', () => {
      const color1 = getBioluminescenceColor(0.5, 0); // 0 -> 160
      const color2 = getBioluminescenceColor(0.5, 300); // 300 -> 240

      const match1 = color1.match(/hsla\((\d+),/);
      const hue1 = match1 ? parseInt(match1[1], 10) : 0;
      expect(hue1).toBeGreaterThanOrEqual(160);
      expect(hue1).toBeLessThanOrEqual(240);

      const match2 = color2.match(/hsla\((\d+),/);
      const hue2 = match2 ? parseInt(match2[1], 10) : 0;
      expect(hue2).toBeGreaterThanOrEqual(160);
      expect(hue2).toBeLessThanOrEqual(240);
    });

    it('should vary alpha and lightness based on intensity', () => {
      const highColor = getBioluminescenceColor(1.5, 180);
      const lowColor = getBioluminescenceColor(0.1, 180);

      // We expect higher intensity to have higher lightness and alpha
      const getLightnessAlpha = (str: string) => {
        const match = str.match(/hsla\(\d+,\s*\d+%,\s*(\d+)%,\s*([\d.]+)\)/);
        return match ? { l: parseInt(match[1], 10), a: parseFloat(match[2]) } : { l: 0, a: 0 };
      };

      const high = getLightnessAlpha(highColor);
      const low = getLightnessAlpha(lowColor);

      expect(high.l).toBeGreaterThan(low.l);
      expect(high.a).toBeGreaterThan(low.a);
    });
  });
});
