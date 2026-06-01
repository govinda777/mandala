import { calculateFlowerOfLifeCenters, calculateGoldenSpiral, calculateHexagonGrid, calculateChladniPattern, generatePolarLayers, PolarCurveType } from './mandala-math';

import { getMoonIllumination, calculateBioluminescenceIntensity, getBioluminescenceColor } from './mandala-math';

export interface MandalaConfig {
  numPetalas: number;
  numCamadas: number;
  corBase: number;
  complexidade: number;
  rotacao: number;
  width: number;
  height: number;
  polarCurveType?: PolarCurveType; // 'smooth' or 'sharp'
  flowerOfLife?: boolean;
  goldenSpiral?: boolean;
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
    polarCurveType = 'smooth',
    flowerOfLife,
    goldenSpiral,
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

  // Generate deterministic layers based on polar math
  // Use numCamadas * 1000 + numPetalas as a stable seed to prevent flickering
  const seed = numCamadas * 1000 + numPetalas;
  const layers = generatePolarLayers(
    numCamadas,
    numPetalas,
    tamanho,
    complexidade,
    corBase,
    polarCurveType,
    fibonacciAdvancedMode,
    seed
  );

  // Set composite operation for blending effect
  ctx.globalCompositeOperation = bioluminescenceMode ? 'screen' : 'source-over';

  // Draw layers from outside in
  layers.forEach((layer) => {
    // Generate HSL color for the layer
    // Adjust luminosity based on moon phase settings
    const lum = Math.min(100, luminosityOuter + layer.scale * (luminosityInner - luminosityOuter));
    const alpha = alphaBase * 0.6; // slightly transparent for overlaying

    let fillStyle = `hsla(${layer.hue}, 80%, ${lum}%, ${alpha})`;
    let strokeStyle = `hsla(${layer.hue}, 80%, 80%, 0.4)`; // Deterministic stroke color

    // Bioluminescence Override
    if (bioluminescenceMode) {
      // Calculate inverse square intensity based on distance from center (using layer.scale)
      const distFromCenter = layer.scale * tamanho;
      const intensity = calculateBioluminescenceIntensity(distFromCenter, tamanho);
      fillStyle = getBioluminescenceColor(intensity, corBase);
      strokeStyle = getBioluminescenceColor(intensity, corBase); // matching stroke
    }

    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = 1;

    // We can draw the main layer shape as a single continuous path
    // If symmetry is enabled, we draw it rotated/mirrored

    const drawLayerPath = (angleOffset: number, mirrorAxis?: number) => {
      ctx.save();
      ctx.rotate(angleOffset);

      ctx.beginPath();
      layer.points.forEach((point, i) => {
        let { x, y } = point;

        // If mirroring across an axis, we reflect the point.
        // Wait, calculateMirroredAngle is for mirroring a whole shape's rotation angle.
        // If we want to mirror the shape itself, we can flip Y.
        if (mirrorAxis !== undefined) {
          // Reflecting about the X-axis locally if mirrorAxis is just a toggle,
          // but the true mirror formula: rotate by axis, flip Y, rotate back.
          // But actually `simetriaPersonalizada` currently mirrors *petals* by `calculateMirroredAngle`.
          // Since our polar math draws the *entire layer at once*, the layer itself is 360 degrees.
          // Rotating the whole 360-degree layer just shifts it.
          // To keep the kaleidoscope effect, we rotate the *entire layer* by the mirrored angles!
        }

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      if(ctx.closePath) ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    };

    // Draw base layer (no rotation offset)
    drawLayerPath(0);

    // Apply mirrored kaleidoscope symmetry if enabled
    if (simetriaPersonalizada && axes.length > 0) {
      axes.forEach(axis => {
        // Since the whole layer is 360 deg, reflecting it means we can just flip it or rotate it.
        // Actually, to reflect a path, we can apply a scale transform.
        ctx.save();
        ctx.rotate(axis);
        ctx.scale(1, -1); // mirror across the axis
        ctx.rotate(-axis);

        ctx.beginPath();
        layer.points.forEach((point, i) => {
          if (i === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        });
        if(ctx.closePath) ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      });
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
      if(ctx.closePath) ctx.closePath();
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
