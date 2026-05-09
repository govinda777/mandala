import { describe, it, expect } from 'vitest';
import { calculateAutoRotation } from '../lib/mandala-math';

describe('Auto Rotation Animation', () => {
  it('should calculate 0 rotation when time is 0', () => {
    const rotation = calculateAutoRotation(0, 10);
    expect(rotation).toBe(0);
  });

  it('should calculate 180 degrees (PI radians) for half a minute at 1 RPM', () => {
    // 1 RPM = 1 full rotation (360 degrees) per 60000 ms.
    // At 30000 ms, rotation should be 180 degrees.
    const rotation = calculateAutoRotation(30000, 1);
    expect(rotation).toBe(180);
  });

  it('should calculate 360 degrees for a full minute at 1 RPM', () => {
    const rotation = calculateAutoRotation(60000, 1);
    expect(rotation).toBe(360);
  });

  it('should calculate 360 degrees for half a minute at 2 RPM', () => {
    // 2 RPM = 2 full rotations per minute = 1 full rotation per 30000 ms.
    const rotation = calculateAutoRotation(30000, 2);
    expect(rotation).toBe(360);
  });

  it('should calculate negative rotation for negative speed', () => {
    const rotation = calculateAutoRotation(15000, -1);
    // At 1 RPM, 15s is 1/4 of a turn (90 degrees). With -1 RPM, it should be -90 degrees.
    expect(rotation).toBe(-90);
  });
});
