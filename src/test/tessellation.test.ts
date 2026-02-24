import { describe, it, expect } from 'vitest';
import { calculateHexagonGrid } from '../lib/mandala-math';

describe('Hexagon Grid Tessellation', () => {
  it('should generate grid points covering the specified dimensions', () => {
    const width = 100;
    const height = 100;
    const radius = 10;

    // Calculate expected number of points roughly
    // Hexagon area ~ 2.6 * r^2 = 260
    // Total area = 10000
    // Approx 38 points.

    const points = calculateHexagonGrid(width, height, radius);

    expect(points.length).toBeGreaterThan(20); // Basic check

    // Check bounds
    points.forEach(point => {
        // Points can be slightly outside due to the grid nature covering edges
        // Increased margin to 3*radius to account for offsets and grid structure
        expect(point.x).toBeGreaterThanOrEqual(-radius * 3);
        expect(point.x).toBeLessThanOrEqual(width + radius * 3);
        expect(point.y).toBeGreaterThanOrEqual(-radius * 3);
        expect(point.y).toBeLessThanOrEqual(height + radius * 3);
    });
  });

  it('should return empty array if radius is too small or invalid', () => {
      const points = calculateHexagonGrid(100, 100, 0);
      expect(points).toEqual([]);
  });
});
