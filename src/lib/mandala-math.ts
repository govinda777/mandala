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

/**
 * Calculates a radius based on the Fibonacci sequence for advanced Fibonacci mode.
 * @param baseRadius The initial base radius unit.
 * @param layerIndex The layer index (1-based) to use for calculating the Fibonacci multiplier.
 * @returns The new radius.
 */
/**
 * Calculates a mirrored angle relative to an axis of symmetry.
 * @param angle The original angle in radians.
 * @param axisAngle The angle of the axis of symmetry in radians.
 * @returns The mirrored angle in radians.
 */
export const calculateMirroredAngle = (angle: number, axisAngle: number): number => {
  return 2 * axisAngle - angle;
};

export const calculateFibonacciRadius = (baseRadius: number, layerIndex: number): number => {
  if (layerIndex <= 0) return baseRadius;

  const fib = (n: number): number => {
    if (n === 1) return 1;
    if (n === 2) return 2;
    let n1 = 1, n2 = 2, next = 0;
    for (let i = 3; i <= n; i++) {
      next = n1 + n2;
      n1 = n2;
      n2 = next;
    }
    return n2;
  };

  return baseRadius * fib(layerIndex);
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

  const angle60 = Math.PI / 3;

  for (let l = 1; l <= layers; l++) {
      for (let i = 0; i < 6; i++) {
          const startAngle = i * angle60;

          const vAx = l * radius * Math.cos(startAngle);
          const vAy = l * radius * Math.sin(startAngle);

          const vBx = l * radius * Math.cos(((i + 1) % 6) * angle60);
          const vBy = l * radius * Math.sin(((i + 1) % 6) * angle60);

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
 * Calculates planetary positions (0 to 360 degrees) for a given Date.
 * We use an epoch base (J2000.0: Jan 1, 2000, 12:00 UTC) with synodic/sideral orbital periods in days.
 */
export const calculatePlanetaryPositions = (date: Date): Record<string, number> => {
  let timeDiffDays = 0;

  if (date instanceof Date && !isNaN(date.getTime())) {
    // Epoch reference: Jan 1, 2000, 12:00 UTC
    const epoch = new Date('2000-01-01T12:00:00Z').getTime();
    timeDiffDays = (date.getTime() - epoch) / (1000 * 60 * 60 * 24);
  } else {
    // If invalid date, default to 0 days difference (J2000 epoch itself)
    timeDiffDays = 0;
  }

  // Define period (T) in days and epoch position (theta_0) in degrees for each body
  const planets = [
    { name: 'Sun', period: 365.256, epochAngle: 280.46 },     // Year orbit relative background
    { name: 'Moon', period: 27.321, epochAngle: 218.316 },    // Lunar sidereal month
    { name: 'Mercury', period: 87.969, epochAngle: 252.25 },
    { name: 'Venus', period: 224.701, epochAngle: 181.98 },
    { name: 'Mars', period: 686.980, epochAngle: 355.45 },
    { name: 'Jupiter', period: 4332.589, epochAngle: 34.404 },
    { name: 'Saturn', period: 10759.22, epochAngle: 50.07 }
  ];

  const positions: Record<string, number> = {};

  planets.forEach((p) => {
    let angle = (p.epochAngle + (360 * timeDiffDays) / p.period) % 360;
    if (angle < 0) {
      angle += 360;
    }
    positions[p.name] = angle;
  });

  return positions;
};

export interface AstrologicalAspect {
  p1: string;
  p2: string;
  type: 'conjunction' | 'opposition' | 'trine' | 'square';
  angleDiff: number;
}

/**
 * Calculates astrological aspects between planets based on an orb of 6 degrees.
 */
export const calculateAstrologicalAspects = (
  positions: Record<string, number>
): AstrologicalAspect[] => {
  const aspects: AstrologicalAspect[] = [];
  const planetNames = Object.keys(positions);
  const orb = 6;

  const targetAspects = [
    { type: 'conjunction' as const, angle: 0 },
    { type: 'opposition' as const, angle: 180 },
    { type: 'trine' as const, angle: 120 },
    { type: 'square' as const, angle: 90 }
  ];

  for (let i = 0; i < planetNames.length; i++) {
    for (let j = i + 1; j < planetNames.length; j++) {
      const p1 = planetNames[i];
      const p2 = planetNames[j];
      const a1 = positions[p1];
      const a2 = positions[p2];

      let diff = Math.abs(a1 - a2) % 360;
      if (diff > 180) {
        diff = 360 - diff;
      }

      for (const target of targetAspects) {
        if (Math.abs(diff - target.angle) <= orb) {
          aspects.push({
            p1,
            p2,
            type: target.type,
            angleDiff: diff
          });
          break;
        }
      }
    }
  }

  return aspects;
};

export interface SharedMandalaConfig {
  numPetalas: number;
  numCamadas: number;
  corBase: number;
  complexidade: number;
  rotacao: number;
  modoFibonacci: boolean;
  modoFibonacciAvancado: boolean;
  flowerOfLife: boolean;
  goldenSpiral: boolean;
  fractalMode: boolean;
  tessellation: boolean;
  pulsing: boolean;
  pulseFrequency: number;
  rotating: boolean;
  rotationSpeedRPM: number;
  useMoonPhase: boolean;
  moonPhaseAge: number;
  formaBase: number;
  simetriaPersonalizada: boolean;
  eixosSimetria: number;
  cymaticsMode: boolean;
  cymaticsN: number;
  cymaticsM: number;
  bioluminescenceMode: boolean;
  polarCurveType: 'smooth' | 'sharp' | 'generative';
  astrologicalChart: boolean;
  astrologicalDate: string;
}

export const DEFAULT_MANDALA_CONFIG: SharedMandalaConfig = {
  numPetalas: 12,
  numCamadas: 5,
  corBase: 180,
  complexidade: 1,
  rotacao: 0,
  modoFibonacci: false,
  modoFibonacciAvancado: false,
  flowerOfLife: false,
  goldenSpiral: false,
  fractalMode: false,
  tessellation: false,
  pulsing: false,
  pulseFrequency: 0.2,
  rotating: false,
  rotationSpeedRPM: 1,
  useMoonPhase: false,
  moonPhaseAge: 14.76,
  formaBase: 0,
  simetriaPersonalizada: false,
  eixosSimetria: 2,
  cymaticsMode: false,
  cymaticsN: 3,
  cymaticsM: 5,
  bioluminescenceMode: false,
  polarCurveType: 'generative',
  astrologicalChart: false,
  astrologicalDate: '2000-01-01T12:00'
};

export interface RarityResult {
  score: number;
  tier: 'Comum' | 'Incomum' | 'Raro' | 'Lendário';
}

/**
 * Calculates rarity score and tier for a given mandala configuration.
 */
export const calculateMandalaRarity = (config: SharedMandalaConfig): RarityResult => {
  let score = config.numPetalas + (config.numCamadas * 5) + Math.round(config.complexidade * 10);

  if (config.flowerOfLife) score += 25;
  if (config.goldenSpiral) score += 30;
  if (config.tessellation) score += 20;
  if (config.modoFibonacci || config.modoFibonacciAvancado) score += 35;
  if (config.bioluminescenceMode) score += 40;
  if (config.cymaticsMode) score += 45;
  if (config.astrologicalChart) score += 50;
  if (config.simetriaPersonalizada) score += 20;
  if (config.useMoonPhase) score += 15;
  if (config.polarCurveType && config.polarCurveType !== 'generative') score += 15;

  let tier: 'Comum' | 'Incomum' | 'Raro' | 'Lendário' = 'Comum';
  if (score >= 200) {
    tier = 'Lendário';
  } else if (score >= 140) {
    tier = 'Raro';
  } else if (score >= 80) {
    tier = 'Incomum';
  }

  return { score, tier };
};

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: NFTAttribute[];
}

/**
 * Generates OpenSea / ERC-721 / ERC-1155 compliant metadata for the mandala.
 */
export const generateNFTMetadata = (
  config: SharedMandalaConfig,
  imageUrl: string = ''
): NFTMetadata => {
  const rarity = calculateMandalaRarity(config);

  const attributes: NFTAttribute[] = [
    { trait_type: 'Petals', value: config.numPetalas },
    { trait_type: 'Layers', value: config.numCamadas },
    { trait_type: 'Base Hue', value: `${config.corBase}°` },
    { trait_type: 'Complexity', value: config.complexidade },
    { trait_type: 'Base Form', value: config.formaBase === 0 ? 'Circle' : `${config.formaBase}-sided` },
    { trait_type: 'Petal Style', value: config.polarCurveType || 'generative' },
    { trait_type: 'Flower of Life', value: config.flowerOfLife ? 'Active' : 'Inactive' },
    { trait_type: 'Golden Spiral', value: config.goldenSpiral ? 'Active' : 'Inactive' },
    { trait_type: 'Hexagonal Grid', value: config.tessellation ? 'Active' : 'Inactive' },
    { trait_type: 'Fibonacci Mode', value: config.modoFibonacci || config.modoFibonacciAvancado ? 'Active' : 'Inactive' },
    { trait_type: 'Bioluminescence', value: config.bioluminescenceMode ? 'Active' : 'Inactive' },
    { trait_type: 'Cymatics', value: config.cymaticsMode ? 'Active' : 'Inactive' },
    { trait_type: 'Astrological Chart', value: config.astrologicalChart ? 'Active' : 'Inactive' },
    { trait_type: 'Rarity Score', value: rarity.score },
    { trait_type: 'Rarity Tier', value: rarity.tier }
  ];

  return {
    name: `Mandala #${Math.abs(config.corBase * 100 + config.numPetalas)}`,
    description: 'Generative mathematical artwork synthesized through sacred geometry, planetary frequencies, and harmonic polar equations.',
    image: imageUrl,
    attributes
  };
};

/**
 * Encodes a MandalaConfig into a URL-safe Base64 string.
 */
export const encodeMandalaConfig = (config: Partial<SharedMandalaConfig>): string => {
  try {
    const jsonStr = JSON.stringify(config);
    const base64 = btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));
    return base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch (error) {
    console.error('Failed to encode mandala config', error);
    return '';
  }
};

/**
 * Decodes a URL-safe Base64 string back into a full SharedMandalaConfig.
 */
export const decodeMandalaConfig = (encoded: string): SharedMandalaConfig => {
  try {
    if (!encoded) return { ...DEFAULT_MANDALA_CONFIG };

    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }

    const jsonStr = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const parsed = JSON.parse(jsonStr);

    return {
      numPetalas: typeof parsed.numPetalas === 'number' ? parsed.numPetalas : DEFAULT_MANDALA_CONFIG.numPetalas,
      numCamadas: typeof parsed.numCamadas === 'number' ? parsed.numCamadas : DEFAULT_MANDALA_CONFIG.numCamadas,
      corBase: typeof parsed.corBase === 'number' ? parsed.corBase : DEFAULT_MANDALA_CONFIG.corBase,
      complexidade: typeof parsed.complexidade === 'number' ? parsed.complexidade : DEFAULT_MANDALA_CONFIG.complexidade,
      rotacao: typeof parsed.rotacao === 'number' ? parsed.rotacao : DEFAULT_MANDALA_CONFIG.rotacao,
      modoFibonacci: typeof parsed.modoFibonacci === 'boolean' ? parsed.modoFibonacci : DEFAULT_MANDALA_CONFIG.modoFibonacci,
      modoFibonacciAvancado: typeof parsed.modoFibonacciAvancado === 'boolean' ? parsed.modoFibonacciAvancado : DEFAULT_MANDALA_CONFIG.modoFibonacciAvancado,
      flowerOfLife: typeof parsed.flowerOfLife === 'boolean' ? parsed.flowerOfLife : DEFAULT_MANDALA_CONFIG.flowerOfLife,
      goldenSpiral: typeof parsed.goldenSpiral === 'boolean' ? parsed.goldenSpiral : DEFAULT_MANDALA_CONFIG.goldenSpiral,
      fractalMode: typeof parsed.fractalMode === 'boolean' ? parsed.fractalMode : DEFAULT_MANDALA_CONFIG.fractalMode,
      tessellation: typeof parsed.tessellation === 'boolean' ? parsed.tessellation : DEFAULT_MANDALA_CONFIG.tessellation,
      pulsing: typeof parsed.pulsing === 'boolean' ? parsed.pulsing : DEFAULT_MANDALA_CONFIG.pulsing,
      pulseFrequency: typeof parsed.pulseFrequency === 'number' ? parsed.pulseFrequency : DEFAULT_MANDALA_CONFIG.pulseFrequency,
      rotating: typeof parsed.rotating === 'boolean' ? parsed.rotating : DEFAULT_MANDALA_CONFIG.rotating,
      rotationSpeedRPM: typeof parsed.rotationSpeedRPM === 'number' ? parsed.rotationSpeedRPM : DEFAULT_MANDALA_CONFIG.rotationSpeedRPM,
      useMoonPhase: typeof parsed.useMoonPhase === 'boolean' ? parsed.useMoonPhase : DEFAULT_MANDALA_CONFIG.useMoonPhase,
      moonPhaseAge: typeof parsed.moonPhaseAge === 'number' ? parsed.moonPhaseAge : DEFAULT_MANDALA_CONFIG.moonPhaseAge,
      formaBase: typeof parsed.formaBase === 'number' ? parsed.formaBase : DEFAULT_MANDALA_CONFIG.formaBase,
      simetriaPersonalizada: typeof parsed.simetriaPersonalizada === 'boolean' ? parsed.simetriaPersonalizada : DEFAULT_MANDALA_CONFIG.simetriaPersonalizada,
      eixosSimetria: typeof parsed.eixosSimetria === 'number' ? parsed.eixosSimetria : DEFAULT_MANDALA_CONFIG.eixosSimetria,
      cymaticsMode: typeof parsed.cymaticsMode === 'boolean' ? parsed.cymaticsMode : DEFAULT_MANDALA_CONFIG.cymaticsMode,
      cymaticsN: typeof parsed.cymaticsN === 'number' ? parsed.cymaticsN : DEFAULT_MANDALA_CONFIG.cymaticsN,
      cymaticsM: typeof parsed.cymaticsM === 'number' ? parsed.cymaticsM : DEFAULT_MANDALA_CONFIG.cymaticsM,
      bioluminescenceMode: typeof parsed.bioluminescenceMode === 'boolean' ? parsed.bioluminescenceMode : DEFAULT_MANDALA_CONFIG.bioluminescenceMode,
      polarCurveType: (parsed.polarCurveType === 'smooth' || parsed.polarCurveType === 'sharp' || parsed.polarCurveType === 'generative')
        ? parsed.polarCurveType
        : DEFAULT_MANDALA_CONFIG.polarCurveType,
      astrologicalChart: typeof parsed.astrologicalChart === 'boolean' ? parsed.astrologicalChart : DEFAULT_MANDALA_CONFIG.astrologicalChart,
      astrologicalDate: typeof parsed.astrologicalDate === 'string' ? parsed.astrologicalDate : DEFAULT_MANDALA_CONFIG.astrologicalDate
    };
  } catch (error) {
    console.error('Failed to decode mandala config', error);
    return { ...DEFAULT_MANDALA_CONFIG };
  }
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
  const angle = 2 * Math.PI * frequency * (time / 1000);
  return 1 + amplitude * Math.sin(angle);
};

/**
 * Calculates the current rotation angle in degrees based on elapsed time and speed.
 * @param time Time in milliseconds.
 * @param speedRPM Speed of rotation in Revolutions Per Minute.
 * @returns The current rotation angle in degrees.
 */
export const calculateAutoRotation = (
  time: number,
  speedRPM: number
): number => {
  const degreesPerMs = (6 * speedRPM) / 1000;
  return time * degreesPerMs;
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

  circles.push({ x: centerX, y: centerY, radius });

  if (depth <= 0) return circles;

  const ratio = 0.5;
  const newRadius = radius * ratio;
  const distance = radius + newRadius;
  const angleStep = (Math.PI * 2) / branches;

  for (let i = 0; i < branches; i++) {
    const angle = i * angleStep;
    const cx = centerX + distance * Math.cos(angle);
    const cy = centerY + distance * Math.sin(angle);

    const children = calculateFractalCircles(cx, cy, newRadius, depth - 1, branches);
    circles.push(...children);
  }

  return circles;
};

/**
 * Calculates points for a Golden Spiral (Logarithmic Spiral).
 * Radius grows exponentially by Phi (1.618...) every quarter turn.
 * @param centerX Center X coordinate
 * @param centerY Center Y coordinate
 * @param maxRadius The maximum radius the spiral should reach
 * @param turns Number of full rotations (used here instead of steps to calculate the full spiral)
 * @returns Array of {x, y} coordinates
 */
export function calculateGoldenSpiral(
  centerX: number,
  centerY: number,
  maxRadius: number,
  turns: number
): Point[] {
  const points: Point[] = [];
  const PHI = (1 + Math.sqrt(5)) / 2;
  const b = (2 * Math.log(PHI)) / Math.PI;

  const maxTheta = turns * 2 * Math.PI;
  const a = maxRadius / Math.exp(b * maxTheta);

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
}

/**
 * Calculates a radius multiplier for a regular polygon based on the given angle.
 * This is used to morph a circle into a polygon.
 * @param angle Angle in radians.
 * @param sides Number of sides of the polygon (0, 1, or 2 return 1 for a circle).
 * @returns A multiplier between Math.cos(PI/sides) and 1.0.
 */
export const calculatePolygonRadiusMultiplier = (angle: number, sides: number): number => {
  if (sides < 3) return 1.0;
  const pi = Math.PI;
  const sectorAngle = 2 * pi / sides;

  const a = ((angle % (2 * pi)) + 2 * pi) % (2 * pi);
  const aMod = a % sectorAngle;

  return Math.cos(pi / sides) / Math.cos(aMod - pi / sides);
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

  const dx = Math.sqrt(3) * radius;
  const dy = 1.5 * radius;

  const buffer = radius * 2;
  const startX = -buffer;
  const endX = width + buffer;
  const startY = -buffer;
  const endY = height + buffer;

  const cols = Math.ceil((endX - startX) / dx);
  const rows = Math.ceil((endY - startY) / dy);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
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

/**
 * Calculates the current moon phase.
 * @param date The date to calculate the phase for (defaults to now).
 * @returns The phase of the moon from 0 to 29.530588853 (days in a lunar month).
 */
export const calculateMoonPhase = (date: Date = new Date()): number => {
  const knownNewMoon = new Date('2000-01-06T18:14:00Z').getTime();
  const lunarCycle = 29.530588853 * 24 * 60 * 60 * 1000;
  const currentTimestamp = date.getTime();

  const timeDiff = currentTimestamp - knownNewMoon;
  const phaseIndex = (timeDiff % lunarCycle) / lunarCycle;

  let finalPhase = phaseIndex;
  if (finalPhase < 0) {
    finalPhase += 1;
  }

  return finalPhase * 29.530588853;
};

/**
 * Gets the name of the moon phase based on its age.
 * @param age The age of the moon in days (0 to 29.53).
 * @returns The name of the moon phase in Portuguese.
 */
export const getMoonPhaseName = (age: number): string => {
  if (age < 1.84) return 'Nova';
  if (age < 5.53) return 'Crescente';
  if (age < 9.22) return 'Quarto Crescente';
  if (age < 12.91) return 'Gibosa Crescente';
  if (age < 16.61) return 'Cheia';
  if (age < 20.30) return 'Gibosa Minguante';
  if (age < 23.99) return 'Quarto Minguante';
  if (age < 27.68) return 'Minguante';
  return 'Nova';
};

/**
 * Calculates the percentage of the moon's surface that is illuminated.
 * @param age The age of the moon in days (0 to 29.53).
 * @returns A value between 0.0 (New Moon) and 1.0 (Full Moon).
 */
export const getMoonIllumination = (age: number): number => {
  const lunarCycle = 29.530588853;
  const phaseAngle = (age / lunarCycle) * 2 * Math.PI;
  return 0.5 * (1 - Math.cos(phaseAngle));
};

/**
 * Calcula pontos que compõem o padrão de Chladni (Cimática) numa placa 2D (círculo).
 * Encontra os pontos nodais onde a interferência de onda é destrutiva.
 */
export const calculateChladniPattern = (
  n: number,
  m: number,
  radius: number,
  resolution: number = 100,
  threshold: number = 0.1
): Point[] => {
  const points: Point[] = [];
  const step = (radius * 2) / resolution;

  for (let x = -radius; x <= radius; x += step) {
    for (let y = -radius; y <= radius; y += step) {
      if (x * x + y * y <= radius * radius) {
        const nx = x / radius;
        const ny = y / radius;

        const z = Math.cos(n * Math.PI * nx) * Math.cos(m * Math.PI * ny) -
                  Math.cos(m * Math.PI * nx) * Math.cos(n * Math.PI * ny);

        if (Math.abs(z) < threshold) {
          const seed = x * 12.9898 + y * 78.233;
          const random1 = (Math.sin(seed) * 43758.5453) % 1;
          const random2 = (Math.sin(seed + 1.23) * 43758.5453) % 1;

          points.push({
            x: x + (random1 - 0.5) * step * 1.5,
            y: y + (random2 - 0.5) * step * 1.5
          });
        }
      }
    }
  }

  return points;
};

/**
 * Calcula a intensidade da luz bioluminescente num determinado raio
 * baseando-se na lei do inverso do quadrado, atenuada para renderização.
 */
export const calculateBioluminescenceIntensity = (
  radius: number,
  maxRadius: number
): number => {
  const offset = maxRadius * 0.1;
  const distance = radius + offset;
  const I0 = maxRadius * maxRadius * 0.05;
  const intensity = I0 / (distance * distance);
  return Math.min(Math.max(intensity, 0), 2.0);
};

/**
 * Retorna uma cor hsla apropriada para o espectro bioluminescente.
 */
export const getBioluminescenceColor = (
  intensity: number,
  baseHue: number
): string => {
  let hue = baseHue % 360;
  if (hue < 160) hue = 160 + (hue % 80);
  if (hue > 240) hue = 240 - ((hue - 240) % 80);

  const lightness = Math.min(30 + intensity * 25, 90);
  const alpha = Math.min(0.2 + intensity * 0.6, 1.0);

  return `hsla(${Math.floor(hue)}, 100%, ${Math.floor(lightness)}%, ${alpha.toFixed(3)})`;
};

/**
 * Simple deterministic pseudo-random number generator (PRNG)
 */
export class SeededRandom {
  private state: number;

  constructor(seed: number) {
    this.state = seed ? seed : Math.random();
  }

  next(): number {
    this.state = (this.state * 9301 + 49297) % 233280;
    return this.state / 233280;
  }

  nextRange(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
}

export interface GenerativePetalAnchor {
  x1: number;
  x2: number;
  y2: number;
  x3: number;
  y3: number;
  x4: number;
}

export interface GenerativeLayer {
  scale: number;
  hue: number;
  petals: GenerativePetalAnchor;
}

/**
 * Generates deterministic generative layers scaling from outside in.
 */
export const generateGenerativeLayers = (
  numCamadas: number,
  numPetalas: number,
  baseRadius: number,
  complexidade: number,
  corBase: number,
  fibonacciAdvancedMode?: boolean,
  seed: number = 12345
): GenerativeLayer[] => {
  const layers: GenerativeLayer[] = [];
  const rng = new SeededRandom(seed);

  const angleRad = (Math.PI * 2) / numPetalas;
  const curvatura = 1.0 + (complexidade - 1) * 0.2;
  const limitCurvature = Math.min(curvatura, 1.5);
  const calcMaxY = (x: number) => Math.max(2, x * Math.tan(angleRad / 2) * limitCurvature);

  for (let layer = numCamadas; layer > 0; layer--) {
    const scale = fibonacciAdvancedMode ? calculateFibonacciRadius(layer, numCamadas) : layer / numCamadas;
    const pFact = (complexidade - 1) * 0.1;

    const x4 = baseRadius * scale;

    const x1Min = Math.max(0, baseRadius * (0.6 - pFact));
    const x1Max = Math.min(baseRadius * 0.9, baseRadius * (0.9 + pFact));
    const x1 = rng.nextRange(x1Min, x1Max) * scale;

    const x2Min = Math.max(0, baseRadius * (0.1 - pFact));
    const x2Max = Math.min(baseRadius * 0.8, baseRadius * (0.8 + pFact));
    const x2 = rng.nextRange(x2Min, x2Max) * scale;

    const y2Max = calcMaxY(x2);
    const y2Min = 2;
    const y2 = y2Max > y2Min ? rng.nextRange(y2Min, y2Max) : y2Min;

    const x3Min = Math.max(0, baseRadius * (0.2 - pFact));
    const x3Max = x4;
    const x3 = x3Min < x3Max ? rng.nextRange(x3Min, x3Max) * scale : x3Max * scale;

    const y3Max = calcMaxY(x3);
    const y3Min = 2;
    const y3 = y3Max > y3Min ? rng.nextRange(y3Min, y3Max) : y3Min;

    const hueShift = rng.nextRange(-20 * complexidade, 20 * complexidade);
    const layerHue = (corBase + hueShift + 360) % 360;

    layers.push({
      scale,
      hue: Math.floor(layerHue),
      petals: { x1, x2, y2, x3, y3, x4 }
    });
  }

  return layers;
};

/**
 * Calculates a series of points for a single petal using polar equations.
 */
export const calculatePolarPetalPoints = (
  baseRadius: number,
  numPetals: number,
  curveType: 'smooth' | 'sharp',
  pointsPerPetal: number = 20
): Point[] => {
  const points: Point[] = [];
  const anglePerPetal = (Math.PI * 2) / numPetals;
  const A = baseRadius * 0.8;

  for (let i = 0; i <= pointsPerPetal; i++) {
    const theta = (i / pointsPerPetal) * anglePerPetal;
    const normalizedTheta = (theta / anglePerPetal) * Math.PI;

    let r = baseRadius;

    if (curveType === 'smooth') {
      r += A * Math.sin(normalizedTheta);
    } else if (curveType === 'sharp') {
      r += A * Math.pow(Math.sin(normalizedTheta), 4);
    }

    points.push({
      x: r * Math.cos(theta),
      y: r * Math.sin(theta)
    });
  }

  return points;
};
