import { describe, it, expect } from 'vitest';
import { encodeMandalaConfig, decodeMandalaConfig } from '../lib/mandala-math';

describe('Share Link Serialization', () => {
  it('should encode and decode mandala configuration correctly', () => {
    const originalConfig = {
      numPetalas: 13,
      numCamadas: 6,
      corBase: 240,
      complexidade: 1.5,
      rotacao: 45,
      modoFibonacci: true,
      modoFibonacciAvancado: false,
      flowerOfLife: true,
      goldenSpiral: false,
      fractalMode: true,
      tessellation: false,
      pulsing: true,
      pulseFrequency: 0.5,
      rotating: true,
      rotationSpeedRPM: 2,
      useMoonPhase: true,
      moonPhaseAge: 15.5,
      formaBase: 4,
      simetriaPersonalizada: true,
      eixosSimetria: 6,
      cymaticsMode: false,
      cymaticsN: 2,
      cymaticsM: 3,
      bioluminescenceMode: true,
      polarCurveType: 'smooth' as 'smooth' | 'sharp' | 'generative'
    };

    const encoded = encodeMandalaConfig(originalConfig);
    expect(encoded).toBeTypeOf('string');
    expect(encoded.length).toBeGreaterThan(0);

    // The string should be URL safe (no '+', '/', or '=')
    expect(encoded).not.toContain('+');
    expect(encoded).not.toContain('/');
    expect(encoded).not.toContain('=');

    const decoded = decodeMandalaConfig(encoded);
    expect(decoded).toEqual(originalConfig);
  });

  it('should handle partial or missing fields gracefully when decoding', () => {
    const partialConfig = {
      numPetalas: 8,
      numCamadas: 3,
      corBase: 120
    };

    const encoded = encodeMandalaConfig(partialConfig as any);
    const decoded = decodeMandalaConfig(encoded);

    // Should have filled defaults for the rest
    expect(decoded.numPetalas).toBe(8);
    expect(decoded.numCamadas).toBe(3);
    expect(decoded.corBase).toBe(120);
    expect(decoded.complexidade).toBe(1); // default
    expect(decoded.rotacao).toBe(0); // default
  });

  it('should return default configuration when decoding invalid string', () => {
    const invalidString = "not-a-valid-base64-json-string!!!";
    const decoded = decodeMandalaConfig(invalidString);

    expect(decoded).toBeTypeOf('object');
    expect(decoded.numPetalas).toBe(12);
    expect(decoded.numCamadas).toBe(5);
    expect(decoded.corBase).toBe(180);
    expect(decoded.complexidade).toBe(1);
    expect(decoded.rotacao).toBe(0);
  });
});
