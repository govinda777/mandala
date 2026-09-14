import { describe, it, expect } from 'vitest';
import {
  calculateMaurerRosePoints,
  calculateMandalaRarity,
  generateNFTMetadata,
  encodeMandalaConfig,
  decodeMandalaConfig,
  DEFAULT_MANDALA_CONFIG
} from '../lib/mandala-math';

describe('Maurer Rose Mathematics', () => {
  it('should calculate exactly 361 points for a Maurer Rose lattice', () => {
    const n = 6;
    const d = 71;
    const radius = 200;
    const points = calculateMaurerRosePoints(n, d, radius);

    expect(points).toHaveLength(361);
  });

  it('should start at (0,0) when k = 0 because sin(0) = 0', () => {
    const points = calculateMaurerRosePoints(6, 71, 200);
    expect(points[0].x).toBeCloseTo(0);
    expect(points[0].y).toBeCloseTo(0);
  });

  it('should generate points that do not exceed the specified maximum radius', () => {
    const radius = 150;
    const points = calculateMaurerRosePoints(5, 29, radius);

    points.forEach((p) => {
      const dist = Math.sqrt(p.x * p.x + p.y * p.y);
      expect(dist).toBeLessThanOrEqual(radius + 0.0001);
    });
  });

  it('should increase rarity score when Maurer Rose is active', () => {
    const configWithout = { ...DEFAULT_MANDALA_CONFIG, maurerRose: false };
    const configWith = { ...DEFAULT_MANDALA_CONFIG, maurerRose: true };

    const rarityWithout = calculateMandalaRarity(configWithout);
    const rarityWith = calculateMandalaRarity(configWith);

    expect(rarityWith.score).toBeGreaterThan(rarityWithout.score);
  });

  it('should encode and decode Maurer Rose configuration correctly', () => {
    const config = {
      ...DEFAULT_MANDALA_CONFIG,
      maurerRose: true,
      maurerRoseN: 7,
      maurerRoseD: 59
    };

    const encoded = encodeMandalaConfig(config);
    const decoded = decodeMandalaConfig(encoded);

    expect(decoded.maurerRose).toBe(true);
    expect(decoded.maurerRoseN).toBe(7);
    expect(decoded.maurerRoseD).toBe(59);
  });

  it('should include Maurer Rose in NFT metadata attributes', () => {
    const config = {
      ...DEFAULT_MANDALA_CONFIG,
      maurerRose: true
    };

    const metadata = generateNFTMetadata(config);
    const maurerAttr = metadata.attributes.find((attr) => attr.trait_type === 'Maurer Rose');

    expect(maurerAttr).toBeDefined();
    expect(maurerAttr?.value).toBe('Active');
  });
});
