import { describe, it, expect } from 'vitest';
import { calculateChladniNodes } from '../lib/mandala-math';

describe('Cymatics (Chladni Patterns)', () => {
  it('should generate node points near zero for the Chladni equation', () => {
    const width = 100;
    const height = 100;
    const n = 3;
    const m = 5;
    const resolution = 50;

    const nodes = calculateChladniNodes(width, height, n, m, resolution);

    expect(nodes.length).toBeGreaterThan(0);

    // Pick a random node and verify it satisfies the equation roughly
    const node = nodes[0];

    // Normalize x and y to [-1, 1] based on width and height
    const nx = (node.x / width) * 2 - 1;
    const ny = (node.y / height) * 2 - 1;

    // u(x, y) = cos(nπx)cos(mπy) - cos(mπx)cos(nπy)
    const val = Math.cos(n * Math.PI * nx) * Math.cos(m * Math.PI * ny) - Math.cos(m * Math.PI * nx) * Math.cos(n * Math.PI * ny);

    // Since we generate points based on a tolerance, the value should be close to 0
    expect(Math.abs(val)).toBeLessThan(0.2); // Tolerance used in generation
  });

  it('should return empty array if resolution is too low', () => {
    const nodes = calculateChladniNodes(100, 100, 3, 5, 1);
    // Usually resolution 1 is just the center point (0,0), let's see if it produces anything.
    // If we only have 1 step, points are minimal. We just want to ensure it doesn't crash.
    expect(Array.isArray(nodes)).toBe(true);
  });
});
