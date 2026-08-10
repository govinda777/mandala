import { calculateFlowerOfLifeCenters, calculateGoldenSpiral, calculateHexagonGrid, calculatePolygonRadiusMultiplier, calculateMirroredAngle, calculateChladniPattern, generateGenerativeLayers, calculatePolarPetalPoints, calculatePlanetaryPositions, calculateAstrologicalAspects, Point } from './mandala-math';

import { getMoonIllumination, calculateBioluminescenceIntensity, getBioluminescenceColor } from './mandala-math';

export interface MandalaConfig {
  numPetalas: number;
  numCamadas: number;
  corBase: number;
  complexidade: number;
  rotacao: number;
  width: number;
  height: number;
  formaBase?: number; // 0 for circle, 3 for triangle, 4 for square, etc.
  flowerOfLife?: boolean;
  goldenSpiral?: boolean;
  fractalMode?: boolean;
  pulseScale?: number;
  tessellation?: boolean;
  moonPhaseAge?: number;
  fibonacciAdvancedMode?: boolean;
  simetriaPersonalizada?: boolean;
  eixosSimetria?: number;
  cymaticsMode?: boolean;
  cymaticsN?: number;
  cymaticsM?: number;
  bioluminescenceMode?: boolean;
  polarCurveType?: 'smooth' | 'sharp' | 'generative';
  astrologicalChart?: boolean;
  astrologicalDate?: string;
}

export const drawMandala = (
  ctx: CanvasRenderingContext2D,
  config: MandalaConfig
) => {
  const {
    numPetalas,
    numCamadas,
    corBase,
    complexidade,
    rotacao,
    width,
    height,
    formaBase,
    flowerOfLife,
    goldenSpiral,
    fractalMode,
    pulseScale = 1,
    tessellation,
    moonPhaseAge,
    fibonacciAdvancedMode,
    simetriaPersonalizada,
    eixosSimetria,
    cymaticsMode,
    cymaticsN,
    cymaticsM,
    bioluminescenceMode,
    astrologicalChart,
    astrologicalDate
  } = config;

  const tamanho = (Math.min(width, height) * 0.9 / 2) * pulseScale;

  // Calculate luminosity adjustment based on moon phase (if provided)
  let luminosityInner = 50;
  let luminosityOuter = 30;
  let alphaBase = 0.7;

  if (moonPhaseAge !== undefined) {
    const illumination = getMoonIllumination(moonPhaseAge);
    luminosityInner = 20 + illumination * 60;
    luminosityOuter = 10 + illumination * 40;
    alphaBase = 0.4 + illumination * 0.4;
  }

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  ctx.save();
  ctx.translate(width / 2, height / 2);

  // Apply continuous rotation
  ctx.rotate((rotacao * Math.PI) / 180);

  // Determine axes of symmetry
  const axes: number[] = [];
  if (simetriaPersonalizada && eixosSimetria && eixosSimetria > 0) {
    const axisAngleIncrement = Math.PI / eixosSimetria;
    for (let i = 0; i < eixosSimetria; i++) {
      axes.push(i * axisAngleIncrement);
    }
  }

  // Generate deterministic layers based on outside-in logic
  // Use numCamadas * 1000 + numPetalas as a stable seed to prevent flickering
  const seed = numCamadas * 1000 + numPetalas;
  const layers = generateGenerativeLayers(numCamadas, numPetalas, tamanho, complexidade, corBase, fibonacciAdvancedMode, seed);

  const anglePerPetal = 360 / numPetalas;

  // Set composite operation for watercolor blending effect
  ctx.globalCompositeOperation = bioluminescenceMode ? 'screen' : 'source-over';

  // Draw generative layers from outside in
  layers.forEach((layer) => {
    // Generate HSL color for the layer
    // Adjust luminosity based on moon phase settings
    const lum = Math.min(100, luminosityOuter + layer.scale * (luminosityInner - luminosityOuter));
    const alpha = alphaBase * 0.6; // slightly transparent for overlaying

    let fillStyle = `hsla(${layer.hue}, 80%, ${lum}%, ${alpha})`;

    // Bioluminescence Override
    let glowIntensity = 0;
    if (bioluminescenceMode) {
      // Calculate inverse square intensity based on distance from center (using layer.scale)
      const distFromCenter = layer.scale * tamanho;
      const intensity = calculateBioluminescenceIntensity(distFromCenter, tamanho);
      glowIntensity = intensity;
      fillStyle = getBioluminescenceColor(intensity, corBase);
    }

    ctx.fillStyle = fillStyle;

    const { x1, x2, y2, x3, y3, x4 } = layer.petals;

    // Calculate polar points once per layer if polar mode is active
    let polarPoints: Point[] = [];
    if (config.polarCurveType === 'smooth' || config.polarCurveType === 'sharp') {
      // For polar curves, baseRadius is the scale * base petal length
      polarPoints = calculatePolarPetalPoints(layer.scale * tamanho * 0.5, numPetalas, config.polarCurveType, 20);
    }

    // Draw all petals for this layer
    for (let i = 0; i < numPetalas; i++) {
      const currentAngleRad = (anglePerPetal * i * Math.PI) / 180;

      const drawSymmetricPetal = (angle: number) => {
        ctx.save();
        ctx.rotate(angle);

        if (bioluminescenceMode) {
          ctx.shadowBlur = 10 + glowIntensity * 20;
          ctx.shadowColor = fillStyle;
        }

        // Multiplicador Poligonal Base
        const mult = (formaBase && formaBase >= 3) ? calculatePolygonRadiusMultiplier(angle, formaBase) : 1;

        ctx.beginPath();

        if (config.polarCurveType === 'smooth' || config.polarCurveType === 'sharp') {
          // Draw using polar points
          polarPoints.forEach((p, index) => {
            const x = p.x * mult;
            const y = p.y * mult;
            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });

          // Mirror lower half (this works if points map only 0..anglePerPetal and we just flip Y)
          for (let j = polarPoints.length - 1; j >= 0; j--) {
             const x = polarPoints[j].x * mult;
             const y = -polarPoints[j].y * mult;
             ctx.lineTo(x, y);
          }
        } else {
          // Generative (Cartesian Bezier) drawing
          ctx.moveTo(x1 * mult, 0);
          // Upper half of the petal (Bezier Curve)
          ctx.bezierCurveTo(x2 * mult, y2 * mult, x3 * mult, y3 * mult, x4 * mult, 0);
          // Lower half of the petal (Mirrored -Y Bezier Curve)
          ctx.bezierCurveTo(x3 * mult, -y3 * mult, x2 * mult, -y2 * mult, x1 * mult, 0);
        }

        ctx.fill();

        // Option to draw strokes based on fractalMode
        if (fractalMode) {
          ctx.strokeStyle = `hsla(${layer.hue}, 80%, 80%, 0.3)`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.restore();
      };

      drawSymmetricPetal(currentAngleRad);

      // Apply mirrored kaleidoscope symmetry if enabled
      if (simetriaPersonalizada && axes.length > 0) {
        axes.forEach(axis => {
          const mirroredAngle = calculateMirroredAngle(currentAngleRad, axis);
          drawSymmetricPetal(mirroredAngle);
        });
      }
    }
  });

  // Restore context from rotation and translation before drawing overlays
  ctx.restore();

  // OVERLAYS (Drawn over the generative base)

  if (tessellation) {
    ctx.save();
    ctx.translate(width / 2, height / 2);
    // Draw hex grid
    const hexPoints = calculateHexagonGrid(width, height, tamanho * 0.1);
    ctx.strokeStyle = `hsla(${corBase}, 50%, 50%, 0.2)`;
    ctx.lineWidth = 1;
    hexPoints.forEach(p => {
      ctx.beginPath();
      // Draw a small hexagon at p
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const hx = p.x + Math.cos(angle) * (tamanho * 0.1);
        const hy = p.y + Math.sin(angle) * (tamanho * 0.1);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.stroke();
    });
    ctx.restore();
  }

  if (flowerOfLife) {
    ctx.save();
    ctx.translate(width / 2, height / 2);
    drawFlowerOfLifeOverlay(ctx, tamanho, complexidade);
    ctx.restore();
  }

  if (cymaticsMode && cymaticsN && cymaticsM) {
    ctx.save();
    ctx.translate(width / 2, height / 2);
    drawChladniOverlay(ctx, cymaticsN, cymaticsM, tamanho, corBase);
    ctx.restore();
  }

  if (goldenSpiral) {
    ctx.save();
    ctx.translate(width / 2, height / 2);
    // Draw Golden Spiral
    const spiralPoints = calculateGoldenSpiral(0, 0, tamanho, 3);
    drawGoldenSpiral(ctx, spiralPoints, `hsla(${(corBase + 180) % 360}, 80%, 60%, 0.8)`);
    ctx.restore();
  }

  if (astrologicalChart) {
    ctx.save();
    ctx.translate(width / 2, height / 2);
    drawAstrologicalChartOverlay(ctx, tamanho, astrologicalDate || '2000-01-01T12:00', corBase);
    ctx.restore();
  }
};

const drawFlowerOfLifeOverlay = (
  ctx: CanvasRenderingContext2D,
  radius: number,
  _complexidade: number
) => {
  const layers = 3;
  const circleRadius = radius / (2 * 1.5);
  const centers = calculateFlowerOfLifeCenters(circleRadius, layers);

  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.strokeStyle = "rgba(255, 215, 0, 0.5)";
  ctx.lineWidth = 2;

  centers.forEach((center) => {
    ctx.beginPath();
    ctx.arc(center.x, center.y, circleRadius, 0, Math.PI * 2);
    ctx.stroke();
  });

  ctx.restore();
};

const drawChladniOverlay = (
  ctx: CanvasRenderingContext2D,
  n: number,
  m: number,
  radius: number,
  corBase: number
) => {
  const points = calculateChladniPattern(n, m, radius, 250, 0.05);

  ctx.save();
  ctx.fillStyle = `hsla(${corBase}, 70%, 80%, 0.8)`;

  points.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.0, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
};

const drawAstrologicalChartOverlay = (
  ctx: CanvasRenderingContext2D,
  radius: number,
  dateStr: string,
  corBase: number
) => {
  const parsedDate = new Date(dateStr);
  const positions = calculatePlanetaryPositions(isNaN(parsedDate.getTime()) ? new Date() : parsedDate);
  const aspects = calculateAstrologicalAspects(positions);

  // 1. Draw Zodiac ring divisions
  const outerRadius = radius * 1.1;
  const innerRadius = radius * 0.95;

  ctx.save();
  ctx.globalCompositeOperation = "source-over";

  // Zodiac outer border
  ctx.strokeStyle = `hsla(${corBase}, 60%, 40%, 0.4)`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, outerRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Zodiac inner border
  ctx.beginPath();
  ctx.arc(0, 0, innerRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Draw 12 signs divisions and labels
  const signs = [
    'Áries', 'Touro', 'Gêmeos', 'Câncer',
    'Leão', 'Virgem', 'Libra', 'Escorpião',
    'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'
  ];

  ctx.font = '9px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let i = 0; i < 12; i++) {
    const startAngle = (i * 30 * Math.PI) / 180;

    // Draw division line
    ctx.strokeStyle = `hsla(${corBase}, 50%, 50%, 0.2)`;
    ctx.beginPath();
    ctx.moveTo(innerRadius * Math.cos(startAngle), innerRadius * Math.sin(startAngle));
    ctx.lineTo(outerRadius * Math.cos(startAngle), outerRadius * Math.sin(startAngle));
    ctx.stroke();

    // Draw text
    const textAngle = startAngle + (15 * Math.PI) / 180;
    const textRadius = (innerRadius + outerRadius) / 2;
    ctx.fillStyle = `hsla(${(corBase + 120) % 360}, 70%, 80%, 0.7)`;
    ctx.save();
    ctx.translate(textRadius * Math.cos(textAngle), textRadius * Math.sin(textAngle));
    ctx.rotate(textAngle + Math.PI / 2); // Make text stand out nicely
    ctx.fillText(signs[i], 0, 0);
    ctx.restore();
  }

  // 2. Draw planetary orbits and planets
  const planetColors: Record<string, string> = {
    Sun: '#FFD700',      // Yellow/Gold
    Moon: '#E0F7FA',     // Pearlescent / light blue
    Mercury: '#FF7043',   // Orange-red
    Venus: '#F48FB1',     // Soft Pink
    Mars: '#EF5350',      // Vivid Red
    Jupiter: '#CE93D8',   // Lilac/Purple
    Saturn: '#B0BEC5'     // Silver/Slate
  };

  const planetRadii = [
    { name: 'Sun', r: radius * 0.15 },
    { name: 'Moon', r: radius * 0.25 },
    { name: 'Mercury', r: radius * 0.38 },
    { name: 'Venus', r: radius * 0.50 },
    { name: 'Mars', r: radius * 0.62 },
    { name: 'Jupiter', r: radius * 0.75 },
    { name: 'Saturn', r: radius * 0.88 }
  ];

  // Draw orbits
  ctx.strokeStyle = `hsla(${corBase}, 40%, 30%, 0.15)`;
  ctx.lineWidth = 1;
  planetRadii.forEach((orb) => {
    ctx.beginPath();
    ctx.arc(0, 0, orb.r, 0, Math.PI * 2);
    ctx.stroke();
  });

  // 3. Draw aspect lines first so planets sit on top
  aspects.forEach((aspect) => {
    const orb1 = planetRadii.find((o) => o.name === aspect.p1);
    const orb2 = planetRadii.find((o) => o.name === aspect.p2);
    if (!orb1 || !orb2) return;

    const angle1 = (positions[aspect.p1] * Math.PI) / 180;
    const angle2 = (positions[aspect.p2] * Math.PI) / 180;

    const x1 = orb1.r * Math.cos(angle1);
    const y1 = orb1.r * Math.sin(angle1);
    const x2 = orb2.r * Math.cos(angle2);
    const y2 = orb2.r * Math.sin(angle2);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    // Color code aspects: Red for square/opposition, Blue for trine, Gold/White for conjunction
    if (aspect.type === 'conjunction') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1.5;
    } else if (aspect.type === 'opposition') {
      ctx.strokeStyle = 'rgba(239, 83, 80, 0.55)'; // Red
      ctx.lineWidth = 1.2;
    } else if (aspect.type === 'square') {
      ctx.strokeStyle = 'rgba(244, 143, 177, 0.55)'; // Pink/Reddish-pink
      ctx.lineWidth = 1.2;
    } else { // trine
      ctx.strokeStyle = 'rgba(41, 182, 246, 0.55)'; // Blue
      ctx.lineWidth = 1.2;
    }
    ctx.stroke();
  });

  // 4. Draw Planet Spheres
  planetRadii.forEach((planet) => {
    const angleRad = (positions[planet.name] * Math.PI) / 180;
    const px = planet.r * Math.cos(angleRad);
    const py = planet.r * Math.sin(angleRad);

    const pColor = planetColors[planet.name] || '#FFF';

    // Glow effect for the planetary spheres
    ctx.save();
    ctx.shadowBlur = 8;
    ctx.shadowColor = pColor;
    ctx.fillStyle = pColor;
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Planet initials text label
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 7px sans-serif';
    ctx.fillText(planet.name.substring(0, 2), px, py - 10);
  });

  ctx.restore();
};

export function drawGoldenSpiral(
  ctx: CanvasRenderingContext2D,
  spiral: {x: number, y: number}[],
  color: string
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.shadowColor = "rgba(255, 215, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.beginPath();
  spiral.forEach((point, i) => {
    if (i === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();
  ctx.restore();
}
