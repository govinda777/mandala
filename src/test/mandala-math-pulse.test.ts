import { describe, it, expect } from 'vitest';
import { calculatePulseScale } from '../lib/mandala-math';

describe('Breathing/Pulse Animation Math', () => {
  it('should calculate scale factor within amplitude range', () => {
    const frequency = 0.001;
    const amplitude = 0.05;

    // Test various time points
    for (let time = 0; time < 10000; time += 100) {
      const scale = calculatePulseScale(time, frequency, amplitude);

      // Scale should be centered at 1.0, +/- amplitude
      expect(scale).toBeGreaterThanOrEqual(1 - amplitude);
      expect(scale).toBeLessThanOrEqual(1 + amplitude);
    }
  });

  it('should have a period dependent on frequency', () => {
    const timeMs = 0;
    const freqHz = 1; // 1 cycle per second
    const amplitude = 0.1;

    // At t=0, sin(0) = 0 -> scale = 1
    const scale0 = calculatePulseScale(timeMs, freqHz, amplitude);
    expect(scale0).toBeCloseTo(1);

    // At t=250ms (1/4 period), sin(PI/2) = 1 -> scale = 1.1
    const scaleQuarter = calculatePulseScale(250, freqHz, amplitude);
    expect(scaleQuarter).toBeCloseTo(1 + amplitude);

    // At t=750ms (3/4 period), sin(3PI/2) = -1 -> scale = 0.9
    const scaleThreeQuarter = calculatePulseScale(750, freqHz, amplitude);
    expect(scaleThreeQuarter).toBeCloseTo(1 - amplitude);
  });
});
