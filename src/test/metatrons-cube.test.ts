import { describe, it, expect } from 'vitest';
import {
  calculateMetatronCenters,
  calculateMetatronLines,
  calculateMandalaRarity,
  generateNFTMetadata,
  encodeMandalaConfig,
  decodeMandalaConfig,
  DEFAULT_MANDALA_CONFIG
} from '../lib/mandala-math';

describe('Metatron\'s Cube Math', () => {
  describe('calculateMetatronCenters', () => {
    it('should return exactly 13 centers for the Fruit of Life geometry', () => {
      const radius = 100;
      const centers = calculateMetatronCenters(radius);

      expect(centers).toHaveLength(13);
    });

    it('should include the center circle at (0, 0)', () => {
      const radius = 100;
      const centers = calculateMetatronCenters(radius);

      expect(centers[0].x).toBeCloseTo(0, 5);
      expect(centers[0].y).toBeCloseTo(0, 5);
    });

    it('should place 6 inner circles at distance 2 * circleRadius and 6 outer circles at 4 * circleRadius', () => {
      const radius = 100; // total outer radius
      const circleRadius = radius / 4;
      const centers = calculateMetatronCenters(radius);

      // Inner ring: indices 1 to 6
      for (let i = 1; i <= 6; i++) {
        const dist = Math.hypot(centers[i].x, centers[i].y);
        expect(dist).toBeCloseTo(2 * circleRadius, 2);
      }

      // Outer ring: indices 7 to 12
      for (let i = 7; i <= 12; i++) {
        const dist = Math.hypot(centers[i].x, centers[i].y);
        expect(dist).toBeCloseTo(4 * circleRadius, 2);
      }
    });

    it('should return empty or single center if radius is <= 0', () => {
      expect(calculateMetatronCenters(0)).toHaveLength(0);
      expect(calculateMetatronCenters(-50)).toHaveLength(0);
    });
  });

  describe('calculateMetatronLines', () => {
    it('should calculate exactly 78 lines connecting all unique pairs of the 13 centers (13 * 12 / 2 = 78)', () => {
      const centers = calculateMetatronCenters(100);
      const lines = calculateMetatronLines(centers);

      expect(lines).toHaveLength(78);
    });

    it('should connect unique pairs with p1 !== p2', () => {
      const centers = calculateMetatronCenters(100);
      const lines = calculateMetatronLines(centers);

      lines.forEach(({ p1, p2 }) => {
        expect(p1).not.toBe(p2);
      });
    });

    it('should return empty array if less than 2 centers are provided', () => {
      expect(calculateMetatronLines([])).toHaveLength(0);
      expect(calculateMetatronLines([{ x: 0, y: 0 }])).toHaveLength(0);
    });
  });

  describe('NFT & Config integration for Metatron\'s Cube', () => {
    it('should increase rarity score when metatronCube is enabled', () => {
      const baseRarity = calculateMandalaRarity(DEFAULT_MANDALA_CONFIG);
      const metatronConfig = { ...DEFAULT_MANDALA_CONFIG, metatronCube: true };
      const metatronRarity = calculateMandalaRarity(metatronConfig);

      expect(metatronRarity.score).toBeGreaterThan(baseRarity.score);
      expect(metatronRarity.score - baseRarity.score).toBe(35);
    });

    it('should include Metatron\'s Cube attribute in NFT metadata', () => {
      const config = { ...DEFAULT_MANDALA_CONFIG, metatronCube: true };
      const metadata = generateNFTMetadata(config);

      const attr = metadata.attributes.find(a => a.trait_type === "Metatron's Cube");
      expect(attr).toBeDefined();
      expect(attr?.value).toBe('Active');
    });

    it('should serialize and deserialize metatronCube in share URL config', () => {
      const config = { ...DEFAULT_MANDALA_CONFIG, metatronCube: true };
      const encoded = encodeMandalaConfig(config);
      const decoded = decodeMandalaConfig(encoded);

      expect(decoded.metatronCube).toBe(true);
    });
  });
});
