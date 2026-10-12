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

describe('Metatron\'s Cube Math & Configuration (BDD)', () => {
  describe('Given a radius for Metatron\'s Cube Fruit of Life centers', () => {
    it('should calculate exactly 13 centers (1 central, 6 inner ring, 6 outer ring)', () => {
      const radius = 100;
      const centers = calculateMetatronCenters(radius);

      expect(centers.length).toBe(13);

      // Center point
      expect(centers[0].x).toBeCloseTo(0);
      expect(centers[0].y).toBeCloseTo(0);

      // Inner ring points at distance radius
      for (let i = 1; i <= 6; i++) {
        const dist = Math.sqrt(centers[i].x ** 2 + centers[i].y ** 2);
        expect(dist).toBeCloseTo(radius);
      }

      // Outer ring points at distance 2 * radius
      for (let i = 7; i <= 12; i++) {
        const dist = Math.sqrt(centers[i].x ** 2 + centers[i].y ** 2);
        expect(dist).toBeCloseTo(2 * radius);
      }
    });

    it('should maintain hexagonal rotational symmetry around origin', () => {
      const radius = 50;
      const centers = calculateMetatronCenters(radius);

      // Verify opposite pairs cancel out (sum to 0,0)
      for (let i = 1; i <= 3; i++) {
        const p1 = centers[i];
        const p2 = centers[i + 3];
        expect(p1.x + p2.x).toBeCloseTo(0);
        expect(p1.y + p2.y).toBeCloseTo(0);
      }
    });
  });

  describe('Given 13 centers of Fruit of Life', () => {
    it('should generate exactly 78 unique connecting lines between all distinct center pairs', () => {
      const radius = 80;
      const centers = calculateMetatronCenters(radius);
      const lines = calculateMetatronLines(centers);

      // 13 choose 2 = (13 * 12) / 2 = 78
      expect(lines.length).toBe(78);

      // Check first line connects center 0 and center 1
      expect(lines[0].p1).toEqual(centers[0]);
      expect(lines[0].p2).toEqual(centers[1]);
    });
  });

  describe('Given a Mandala configuration with metatronCube enabled', () => {
    it('should increase rarity score when metatronCube is true', () => {
      const baseConfig = { ...DEFAULT_MANDALA_CONFIG, metatronCube: false };
      const metatronConfig = { ...DEFAULT_MANDALA_CONFIG, metatronCube: true };

      const baseRarity = calculateMandalaRarity(baseConfig);
      const metatronRarity = calculateMandalaRarity(metatronConfig);

      expect(metatronRarity.score).toBeGreaterThan(baseRarity.score);
      expect(metatronRarity.score - baseRarity.score).toBe(30);
    });

    it('should include Metatron\'s Cube trait in NFT metadata', () => {
      const config = { ...DEFAULT_MANDALA_CONFIG, metatronCube: true };
      const metadata = generateNFTMetadata(config);

      const trait = metadata.attributes.find(a => a.trait_type === 'Metatron\'s Cube');
      expect(trait).toBeDefined();
      expect(trait?.value).toBe('Active');
    });

    it('should correctly serialize and deserialize metatronCube state in URL config', () => {
      const config = { ...DEFAULT_MANDALA_CONFIG, metatronCube: true };
      const encoded = encodeMandalaConfig(config);
      const decoded = decodeMandalaConfig(encoded);

      expect(decoded.metatronCube).toBe(true);
    });
  });
});
