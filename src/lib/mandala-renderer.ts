import { calculateFlowerOfLifeCenters, calculateGoldenSpiral, calculateHexagonGrid, calculatePolygonRadiusMultiplier, calculateMirroredAngle, calculateChladniPattern, generateGenerativeLayers, calculatePolarPetalPoints } from './mandala-math';

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
    bioluminescenceMode
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
    if (bioluminescenceMode) {
      // Calculate inverse square intensity based on distance from center (using layer.scale)
      const distFromCenter = layer.scale * tamanho;
      const intensity = calculateBioluminescenceIntensity(distFromCenter, tamanho);
      fillStyle = getBioluminescenceColor(intensity, corBase);
    }

    ctx.fillStyle = fillStyle;

    const { x1, x2, y2, x3, y3, x4 } = layer.petals;

    // Calculate polar points once per layer if polar mode is active
    let polarPoints: import('./mandala-math').Point[] = [];
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
