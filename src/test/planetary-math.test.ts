import { describe, it, expect } from 'vitest';
import { getPlanetaryConfig, PLANETARY_DATA } from '../lib/mandala-math';

describe('Planetary Frequencies', () => {
  it('should return correct config for Sun', () => {
    const config = getPlanetaryConfig('Sun');
    expect(config).toBeDefined();
    expect(config?.baseHue).toBe(50);
    expect(config?.frequencyHz).toBe(0.5);
  });

  it('should return correct config for Mercury (fast frequency)', () => {
    const config = getPlanetaryConfig('Mercury');
    expect(config).toBeDefined();
    expect(config?.frequencyHz).toBeGreaterThan(1.0);
  });

  it('should return correct config for Neptune (slow frequency)', () => {
    const config = getPlanetaryConfig('Neptune');
    expect(config).toBeDefined();
    expect(config?.frequencyHz).toBeLessThan(0.2);
  });

  it('should return undefined for unknown planet', () => {
     // @ts-ignore
     const config = getPlanetaryConfig('Pluto');
     expect(config).toBeUndefined();
  });

  it('should have all main planets defined in PLANETARY_DATA', () => {
     const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
     planets.forEach(planet => {
         // @ts-ignore
         expect(PLANETARY_DATA[planet]).toBeDefined();
     });
  });
});
