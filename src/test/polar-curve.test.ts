import { describe, it, expect } from 'vitest';
import { calculatePolarPetalPoints } from '../lib/mandala-math';

describe('Polar Petal Curves', () => {
  it('should generate points for smooth polar curve (Polar Rose)', () => {
    const radius = 100;
    const numPetals = 6; // k value
    const pointsPerPetal = 20;

    const points = calculatePolarPetalPoints(radius, numPetals, 'smooth', pointsPerPetal);

    // It generates points for 1 petal (0 to 2*PI/numPetals) or full circle depending on implementation.
    // Let's assume it generates for 1 petal for efficient repetition in renderer.
    expect(points.length).toBeGreaterThan(0);
    expect(points.length).toBe(pointsPerPetal + 1); // including end point

    // The start point (angle 0) should be at (radius, 0)
    expect(points[0].x).toBeCloseTo(radius, 1);
    expect(points[0].y).toBeCloseTo(0, 1);

    // Mid point of the petal should be at maximum radius (R + A)
    // Wait, typical polar rose is r = R + A * sin(k * theta)
    // If it starts at R and we want petals to stick out, max radius will be R + A
    // Let's verify that the max distance from origin is greater than radius
    const maxDist = Math.max(...points.map(p => Math.sqrt(p.x * p.x + p.y * p.y)));
    expect(maxDist).toBeGreaterThan(radius);
  });

  it('should generate points for sharp polar curve', () => {
    const radius = 100;
    const numPetals = 8;
    const pointsPerPetal = 20;

    const points = calculatePolarPetalPoints(radius, numPetals, 'sharp', pointsPerPetal);

    expect(points.length).toBeGreaterThan(0);
    expect(points.length).toBe(pointsPerPetal + 1);

    // Max distance should also be greater than radius
    const maxDist = Math.max(...points.map(p => Math.sqrt(p.x * p.x + p.y * p.y)));
    expect(maxDist).toBeGreaterThan(radius);
  });
});
