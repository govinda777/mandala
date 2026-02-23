/**
 * Números de Fibonacci utilizados para restringir a contagem de pétalas.
 */
export const fibonacciNumbers = [3, 5, 8, 13, 21, 34, 55, 89];

/**
 * Encontra o número de Fibonacci mais próximo do valor fornecido.
 * @param n O número de entrada.
 * @returns O número de Fibonacci mais próximo.
 */
export const getNearestFibonacci = (n: number): number => {
  return fibonacciNumbers.reduce((prev, curr) =>
    Math.abs(curr - n) < Math.abs(prev - n) ? curr : prev
  );
};

export interface Point {
  x: number;
  y: number;
}

export interface Circle {
  x: number;
  y: number;
  radius: number;
}

/**
 * Calculates center points for a hexagonal packing of circles (Flower of Life pattern).
 * @param radius Radius of the circles (distance between centers).
 * @param layers Number of layers around the center (0 = center only).
 * @returns Array of {x, y} coordinates.
 */
export const calculateFlowerOfLifeCenters = (radius: number, layers: number): Point[] => {
  const points: Point[] = [];
  points.push({ x: 0, y: 0 }); // Center

  if (layers < 1) return points;

  // Hexagonal basis vectors
  // v1 = (1, 0) * radius
  // v2 = (1/2, sqrt(3)/2) * radius
  const angle60 = Math.PI / 3;

  for (let l = 1; l <= layers; l++) {
      // For each layer l, we have 6*l points.
      // We can iterate through the 6 sectors.
      // Start at a vertex of the hexagon: (l * radius, 0)
      // Then move along the edge 'l' times.

      let x = l * radius;
      let y = 0;

      for (let i = 0; i < 6; i++) {
          // Direction of the edge: (i + 2) * 60 degrees.
          // Wait, standard algorithm:
          // Start at direction i*60. Move j steps in direction (i+2)*60.

          // Let's iterate sectors 0 to 5
          // Sector 0: start at (l, 0). Move in direction 120 deg (2*60).
          // But actually, the ring is simple:
          // Walk around the hexagon of radius l.

          const startAngle = i * angle60;
          const endAngle = ((i + 1) % 6) * angle60;

          // Vertices of the layer hexagon
          // But we need points ALONG the edge too.

          // Vector for this side of the hexagon.
          // Side goes from Vertex(i) to Vertex(i+1).
          // Vertex(i) = (l*r * cos(i*60), l*r * sin(i*60))

          const vAx = l * radius * Math.cos(startAngle);
          const vAy = l * radius * Math.sin(startAngle);

          const vBx = l * radius * Math.cos(((i + 1) % 6) * angle60);
          const vBy = l * radius * Math.sin(((i + 1) % 6) * angle60);

          // Steps along the edge
          // There are l steps. The 0th step is Vertex A. The l-th step is Vertex B (which belongs to next sector start).

          const dx = (vBx - vAx) / l;
          const dy = (vBy - vAy) / l;

          for (let step = 0; step < l; step++) {
              points.push({
                  x: vAx + step * dx,
                  y: vAy + step * dy
              });
          }
      }
  }

  return points;
};

/**
 * Calculates a scaling factor for a pulsing animation.
 * @param time Time in milliseconds.
 * @param frequency Frequency of the pulse in Hertz (cycles per second).
 * @param amplitude Amplitude of the pulse (default 0.05 for +/- 5%).
 * @returns A scale factor oscillating around 1.0.
 */
export const calculatePulseScale = (
  time: number,
  frequency: number,
  amplitude: number = 0.05
): number => {
  // Convert frequency (Hz) to angular frequency (radians/ms)
  // omega = 2 * PI * f (where f is in Hz)
  // angle = omega * (time / 1000)
  const angle = 2 * Math.PI * frequency * (time / 1000);
  return 1 + amplitude * Math.sin(angle);
};

/**
 * Calculates circles for a recursive fractal pattern.
 * @param centerX Center X coordinate
 * @param centerY Center Y coordinate
 * @param radius Radius of the central circle
 * @param depth Recursion depth (0 = only center circle)
 * @param branches Number of branches (circles) around each circle
 * @returns Array of Circle objects
 */
export const calculateFractalCircles = (
  centerX: number,
  centerY: number,
  radius: number,
  depth: number,
  branches: number
): Circle[] => {
  const circles: Circle[] = [];

  // Add current circle
  circles.push({ x: centerX, y: centerY, radius });

  if (depth <= 0) return circles;

  // Calculate children
  // Ratio 0.5 implies the next circle is half the size
  const ratio = 0.5;
  const newRadius = radius * ratio;

  // Position children around the current circle
  // We place them so they touch the current circle (distance = radius + newRadius)
  // or maybe overlapping? Let's use touching for now.
  const distance = radius + newRadius;

  const angleStep = (Math.PI * 2) / branches;

  for (let i = 0; i < branches; i++) {
    const angle = i * angleStep;
    const cx = centerX + distance * Math.cos(angle);
    const cy = centerY + distance * Math.sin(angle);

    // Recursive call
    const children = calculateFractalCircles(cx, cy, newRadius, depth - 1, branches);
    circles.push(...children);
  }

  return circles;
};

/**
 * Calculates points for a Golden Spiral (Logarithmic Spiral).
 * Radius grows by Phi (1.618...) every quarter turn.
 * @param centerX Center X coordinate
 * @param centerY Center Y coordinate
 * @param maxRadius The maximum radius the spiral should reach
 * @param turns Number of full rotations
 * @returns Array of {x, y} coordinates
 */
export const calculateGoldenSpiral = (
  centerX: number,
  centerY: number,
  maxRadius: number,
  turns: number
): Point[] => {
  const points: Point[] = [];
  const PHI = (1 + Math.sqrt(5)) / 2;
  // Growth factor b for Golden Spiral: r = a * e^(b * theta)
  // r grows by factor PHI every quarter turn (PI/2)
  // PHI = e^(b * PI/2) => ln(PHI) = b * PI/2 => b = 2 * ln(PHI) / PI
  const b = (2 * Math.log(PHI)) / Math.PI;

  const maxTheta = turns * 2 * Math.PI;

  // Calculate 'a' so that at maxTheta, radius is maxRadius
  // maxRadius = a * e^(b * maxTheta) => a = maxRadius / e^(b * maxTheta)
  const a = maxRadius / Math.exp(b * maxTheta);

  // Resolution: points per turn
  const pointsPerTurn = 100;
  const totalPoints = Math.ceil(turns * pointsPerTurn);

  for (let i = 0; i <= totalPoints; i++) {
    const theta = (i / totalPoints) * maxTheta;
    const radius = a * Math.exp(b * theta);

    points.push({
      x: centerX + radius * Math.cos(theta),
      y: centerY + radius * Math.sin(theta)
    });
  }

  return points;
};

/**
 * Calculates center points for a hexagonal grid filling the specified dimensions.
 * @param width Width of the area to cover.
 * @param height Height of the area to cover.
 * @param radius Radius of the hexagons (side length).
 * @returns Array of {x, y} coordinates for the centers of the hexagons.
 */
export const calculateHexagonGrid = (
  width: number,
  height: number,
  radius: number
): Point[] => {
  const points: Point[] = [];

  if (radius <= 0) return points;

  // Horizontal spacing: sqrt(3) * radius
  const dx = Math.sqrt(3) * radius;
  // Vertical spacing: 1.5 * radius
  const dy = 1.5 * radius;

  // Calculate number of columns and rows needed to cover the area + buffer
  // We center the grid roughly or just start from 0 with buffer.

  const buffer = radius * 2;
  const startX = -buffer;
  const endX = width + buffer;
  const startY = -buffer;
  const endY = height + buffer;

  const cols = Math.ceil((endX - startX) / dx);
  const rows = Math.ceil((endY - startY) / dy);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Offset for odd rows
      const xOffset = (row % 2) !== 0 ? dx / 2 : 0;

      const x = startX + col * dx + xOffset;
      const y = startY + row * dy;

      points.push({ x, y });
    }
  }

  return points;
};

// Planetary Configuration
export interface PlanetConfig {
  name: string;
  baseHue: number;
  frequencyHz: number;
}

export const PLANETARY_DATA: Record<string, PlanetConfig> = {
  Sun: { name: 'Sun', baseHue: 50, frequencyHz: 0.5 },
  Moon: { name: 'Moon', baseHue: 200, frequencyHz: 0.6 },
  Mercury: { name: 'Mercury', baseHue: 30, frequencyHz: 1.8 },
  Venus: { name: 'Venus', baseHue: 300, frequencyHz: 0.8 },
  Earth: { name: 'Earth', baseHue: 220, frequencyHz: 1.0 },
  Mars: { name: 'Mars', baseHue: 0, frequencyHz: 1.2 },
  Jupiter: { name: 'Jupiter', baseHue: 270, frequencyHz: 0.2 },
  Saturn: { name: 'Saturn', baseHue: 40, frequencyHz: 0.15 },
  Uranus: { name: 'Uranus', baseHue: 180, frequencyHz: 0.1 },
  Neptune: { name: 'Neptune', baseHue: 240, frequencyHz: 0.1 },
};

/**
 * Retrieves the configuration for a given planet.
 * @param planetName The name of the planet.
 * @returns The PlanetConfig or undefined if not found.
 */
export const getPlanetaryConfig = (planetName: string): PlanetConfig | undefined => {
  return PLANETARY_DATA[planetName];
};
