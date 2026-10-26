import { describe, it, expect } from 'vitest';
import {
  calculateMetatronCenters,
  calculateMetatronLines,
  calculateMandalaRarity,
  generateNFTMetadata,
  encodeMandalaConfig,
  decodeMandalaConfig,
  DEFAULT_MANDALA_CONFIG,
  SharedMandalaConfig
} from '../lib/mandala-math';

describe("Metatron's Cube Math & Configuration", () => {
  describe('calculateMetatronCenters', () => {
    it('should return 13 centers for Metatron Cube (Fruit of Life structure)', () => {
      const circleRadius = 30;
      const centers = calculateMetatronCenters(circleRadius);

      // Metatron's cube contains 13 circles (1 center + 6 inner + 6 outer)
      expect(centers).toHaveLength(13);

      // First point is center (0,0)
      expect(centers[0]).toEqual({ x: 0, y: 0 });

      // Inner 6 centers are at distance 2 * circleRadius
      const innerCenters = centers.slice(1, 7);
      innerCenters.forEach(p => {
        const dist = Math.sqrt(p.x * p.x + p.y * p.y);
        expect(dist).toBeCloseTo(2 * circleRadius, 4);
      });

      // Outer 6 centers are at distance 4 * circleRadius
      const outerCenters = centers.slice(7, 13);
      outerCenters.forEach(p => {
        const dist = Math.sqrt(p.x * p.x + p.y * p.y);
        expect(dist).toBeCloseTo(4 * circleRadius, 4);
      });
    });

    it('should handle zero or negative radius gracefully', () => {
      const centersZero = calculateMetatronCenters(0);
      expect(centersZero).toHaveLength(13);
      centersZero.forEach(p => {
        expect(p.x).toBeCloseTo(0);
        expect(p.y).toBeCloseTo(0);
      });
    });
  });

  describe('calculateMetatronLines', () => {
    it('should return exactly 78 interconnecting lines for 13 centers', () => {
      const circleRadius = 20;
      const centers = calculateMetatronCenters(circleRadius);
      const lines = calculateMetatronLines(centers);

      // n*(n-1)/2 = 13*12/2 = 78 lines
      expect(lines).toHaveLength(78);

      // Verify line structure
      expect(lines[0]).toHaveProperty('p1');
      expect(lines[0]).toHaveProperty('p2');
    });

    it('should return empty array when centers list is empty or single point', () => {
      expect(calculateMetatronLines([])).toHaveLength(0);
      expect(calculateMetatronLines([{ x: 0, y: 0 }])).toHaveLength(0);
    });
  });

  describe('Metatron Cube Integration with Rarity & Metadata', () => {
    it('should increase rarity score when metatronCube is active', () => {
      const baseConfig: SharedMandalaConfig = { ...DEFAULT_MANDALA_CONFIG, metatronCube: false };
      const activeConfig: SharedMandalaConfig = { ...DEFAULT_MANDALA_CONFIG, metatronCube: true };

      const baseRarity = calculateMandalaRarity(baseConfig);
      const activeRarity = calculateMandalaRarity(activeConfig);

      expect(activeRarity.score).toBe(baseRarity.score + 30);
    });

    it('should include Metatron Cube trait in NFT metadata', () => {
      const config: SharedMandalaConfig = { ...DEFAULT_MANDALA_CONFIG, metatronCube: true };
      const metadata = generateNFTMetadata(config);

      const metatronTrait = metadata.attributes.find(a => a.trait_type === "Metatron's Cube");
      expect(metatronTrait).toBeDefined();
      expect(metatronTrait?.value).toBe('Active');
    });

    it('should encode and decode metatronCube in URL config', () => {
      const config: SharedMandalaConfig = { ...DEFAULT_MANDALA_CONFIG, metatronCube: true };
      const encoded = encodeMandalaConfig(config);
      const decoded = decodeMandalaConfig(encoded);

      expect(decoded.metatronCube).toBe(true);
    });
  });
});
