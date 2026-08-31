import { describe, it, expect } from 'vitest';
import {
  calculateMaurerRosePoints,
  calculateMandalaRarity,
  encodeMandalaConfig,
  decodeMandalaConfig,
  generateNFTMetadata,
  DEFAULT_MANDALA_CONFIG
} from '../lib/mandala-math';

describe('Maurer Rose Overlay Math', () => {
  it('should calculate exactly 361 points for a Maurer Rose pattern', () => {
    const points = calculateMaurerRosePoints(6, 29, 100);
    expect(points).toHaveLength(361);
  });

  it('should calculate origin for theta = 0 when using sine formula', () => {
    const points = calculateMaurerRosePoints(6, 29, 100);
    // At i = 0: k = 0 deg -> r = 100 * sin(0) = 0 -> x = 0, y = 0
    expect(points[0].x).toBeCloseTo(0);
    expect(points[0].y).toBeCloseTo(0);
  });

  it('should calculate correct radius and coordinates for non-zero theta', () => {
    // n = 2, d = 45 deg, radius = 100
    // At i = 1: k = 45 deg = PI/4 rad -> r = 100 * sin(2 * 45 deg) = 100 * sin(90 deg) = 100
    // x = 100 * cos(45 deg) = 70.71, y = 100 * sin(45 deg) = 70.71
    const points = calculateMaurerRosePoints(2, 45, 100);
    expect(points[1].x).toBeCloseTo(100 * Math.cos(Math.PI / 4));
    expect(points[1].y).toBeCloseTo(100 * Math.sin(Math.PI / 4));
  });

  it('should increase rarity score when Maurer Rose overlay is active', () => {
    const baseRarity = calculateMandalaRarity(DEFAULT_MANDALA_CONFIG);
    const maurerConfig = {
      ...DEFAULT_MANDALA_CONFIG,
      maurerRose: true,
      maurerN: 6,
      maurerD: 29
    };
    const maurerRarity = calculateMandalaRarity(maurerConfig);

    expect(maurerRarity.score).toBe(baseRarity.score + 35);
  });

  it('should correctly encode and decode Maurer Rose settings', () => {
    const config = {
      ...DEFAULT_MANDALA_CONFIG,
      maurerRose: true,
      maurerN: 5,
      maurerD: 47
    };
    const encoded = encodeMandalaConfig(config);
    const decoded = decodeMandalaConfig(encoded);

    expect(decoded.maurerRose).toBe(true);
    expect(decoded.maurerN).toBe(5);
    expect(decoded.maurerD).toBe(47);
  });

  it('should include Maurer Rose attribute in NFT metadata', () => {
    const config = {
      ...DEFAULT_MANDALA_CONFIG,
      maurerRose: true,
      maurerN: 6,
      maurerD: 29
    };
    const metadata = generateNFTMetadata(config);
    const maurerAttr = metadata.attributes.find(a => a.trait_type === 'Maurer Rose');

    expect(maurerAttr).toBeDefined();
    expect(maurerAttr?.value).toBe('Active (n=6, d=29°)');
  });
});
