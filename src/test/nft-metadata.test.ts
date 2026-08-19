import { describe, it, expect } from 'vitest';
import {
  calculateMandalaRarity,
  generateNFTMetadata,
  DEFAULT_MANDALA_CONFIG,
  SharedMandalaConfig
} from '../lib/mandala-math';

describe('NFT Metadata & Rarity Calculation', () => {
  describe('calculateMandalaRarity', () => {
    it('should calculate base rarity for a default mandala configuration', () => {
      const result = calculateMandalaRarity(DEFAULT_MANDALA_CONFIG);
      expect(result.score).toBeGreaterThan(0);
      expect(result.tier).toBe('Comum');
    });

    it('should calculate higher rarity tier for complex mandalas with multiple active overlays', () => {
      const complexConfig: SharedMandalaConfig = {
        ...DEFAULT_MANDALA_CONFIG,
        numPetalas: 21,
        numCamadas: 8,
        complexidade: 2.5,
        flowerOfLife: true,
        goldenSpiral: true,
        tessellation: true,
        modoFibonacci: true,
        bioluminescenceMode: true,
        cymaticsMode: true,
        astrologicalChart: true
      };

      const result = calculateMandalaRarity(complexConfig);
      expect(result.score).toBeGreaterThanOrEqual(200);
      expect(result.tier).toBe('Lendário');
    });
  });

  describe('generateNFTMetadata', () => {
    it('should generate valid OpenSea compliant NFT metadata structure', () => {
      const config: SharedMandalaConfig = {
        ...DEFAULT_MANDALA_CONFIG,
        numPetalas: 13,
        numCamadas: 6,
        goldenSpiral: true
      };

      const metadata = generateNFTMetadata(config, 'https://example.com/mandala.png');

      expect(metadata).toHaveProperty('name');
      expect(metadata.name).toContain('Mandala');
      expect(metadata).toHaveProperty('description');
      expect(metadata.image).toBe('https://example.com/mandala.png');
      expect(Array.isArray(metadata.attributes)).toBe(true);

      const traitTypes = metadata.attributes.map((attr) => attr.trait_type);
      expect(traitTypes).toContain('Petals');
      expect(traitTypes).toContain('Layers');
      expect(traitTypes).toContain('Rarity Score');
      expect(traitTypes).toContain('Rarity Tier');
      expect(traitTypes).toContain('Golden Spiral');
    });
  });
});
