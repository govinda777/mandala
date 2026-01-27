import { getNearestFibonacci, calculateFlowerOfLifeCenters, calculateGoldenSpiral, calculateFractalCircles } from './mandala-math';

export interface MandalaConfig {
  numPetalas: number;
  numCamadas: number;
  corBase: number;
  complexidade: number;
  rotacao: number;
  width: number;
  height: number;
  flowerOfLife?: boolean;
  goldenSpiral?: boolean;
  fractalMode?: boolean;
  pulseScale?: number;
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
    flowerOfLife,
    goldenSpiral,
    fractalMode,
    pulseScale = 1,
  } = config;

  const tamanho = (Math.min(width, height) * 0.9 / 2) * pulseScale;

  // Limpar o canvas
  ctx.clearRect(0, 0, width, height);

  // Mover para o centro do canvas
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate((rotacao * Math.PI) / 180);

  // Desenhar camadas da mandala
  for (let camada = 1; camada <= numCamadas; camada++) {
    // Calcular raio da camada atual
    const raio = (tamanho / numCamadas) * camada;

    // Definir cores para esta camada
    const matiz = (corBase + (camada * 360) / numCamadas) % 360;
    const corInterna = `hsl(${matiz}, 70%, 50%)`;
    const corExterna = `hsl(${(matiz + 30) % 360}, 70%, 50%)`;

    // Aumentar num de pétalas com base na complexidade para camadas mais internas
    const petalasCamada = Math.floor(
      numPetalas * (1 + (complexidade - 1) * (1 - camada / numCamadas) * 0.5)
    );

    // Desenhar pétalas para esta camada
    drawPetals(
      ctx,
      petalasCamada,
      raio,
      raio * 0.8,
      corInterna,
      corExterna,
      complexidade
    );

    // Desenhar círculo interno desta camada
    ctx.beginPath();
    ctx.arc(0, 0, raio * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${(matiz + 60) % 360}, 70%, 50%, 0.5)`;
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Adicionar detalhes extras baseados em complexidade
    if (complexidade > 1.5 && camada % 2 === 0) {
      drawDetailPattern(ctx, petalasCamada * 2, raio * 0.6, matiz);
    }
  }

  // Desenhar círculos concêntricos decorativos
  drawCentralCircles(ctx, numCamadas, tamanho, complexidade, corBase, numPetalas);

  if (flowerOfLife) {
    drawFlowerOfLifeOverlay(ctx, tamanho, complexidade);
  }

  if (goldenSpiral) {
    drawGoldenSpiral(ctx, tamanho);
  }

  if (fractalMode) {
    drawFractalOverlay(ctx, tamanho, complexidade);
  }

  // Restaurar a transformação
  ctx.restore();
};

const drawFractalOverlay = (
  ctx: CanvasRenderingContext2D,
  radius: number,
  complexidade: number
) => {
  // Adjust depth based on complexity?
  // Complexity is 1.0 to 3.0.
  // Depth 2 is good default. 3 might be slow/too detailed.
  const depth = complexidade > 2 ? 3 : 2;
  const branches = 6;

  // Initial radius for the central fractal circle
  // Making it relative to the mandala radius
  const startRadius = radius * 0.25;

  const circles = calculateFractalCircles(0, 0, startRadius, depth, branches);

  ctx.save();
  ctx.strokeStyle = "rgba(100, 200, 255, 0.7)"; // Cyan/Blueish for fractal
  ctx.lineWidth = 1.5;

  circles.forEach(circle => {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(100, 200, 255, 0.1)";
    ctx.fill();
  });

  ctx.restore();
};

const drawPetals = (
  ctx: CanvasRenderingContext2D,
  numPetalas: number,
  raioExterno: number,
  raioInterno: number,
  corInterna: string,
  corExterna: string,
  complexidade: number
) => {
  const anguloIncremento = (Math.PI * 2) / numPetalas;

  for (let i = 0; i < numPetalas; i++) {
    const angulo = i * anguloIncremento;

    // Criar um gradiente para cada pétala
    const gradiente = ctx.createRadialGradient(
      0,
      0,
      raioInterno * 0.2,
      0,
      0,
      raioExterno
    );
    gradiente.addColorStop(0, corInterna);
    gradiente.addColorStop(1, corExterna);

    // Desenhar uma pétala
    ctx.beginPath();
    ctx.moveTo(0, 0);

    // Ajustar forma das pétalas baseado em complexidade
    const ajusteForma = 1 + (complexidade - 1) * 0.4;

    // Calcular pontos de controle para a curva de Bézier
    const x1 = Math.cos(angulo - anguloIncremento / 4) * raioExterno;
    const y1 = Math.sin(angulo - anguloIncremento / 4) * raioExterno;
    const x2 = Math.cos(angulo + anguloIncremento / 4) * raioExterno;
    const y2 = Math.sin(angulo + anguloIncremento / 4) * raioExterno;
    const xm = Math.cos(angulo) * raioExterno * ajusteForma;
    const ym = Math.sin(angulo) * raioExterno * ajusteForma;

    // Desenhar a curva
    ctx.quadraticCurveTo(xm, ym, x1, y1);
    ctx.lineTo(0, 0);
    ctx.quadraticCurveTo(xm, ym, x2, y2);
    ctx.lineTo(0, 0);

    // Preencher e contornar a pétala
    ctx.fillStyle = gradiente;
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Desenhar detalhes adicionais
    if (raioExterno > 50) {
      // Adicionar pontos decorativos
      ctx.beginPath();
      ctx.arc(
        Math.cos(angulo) * raioExterno * 0.7,
        Math.sin(angulo) * raioExterno * 0.7,
        raioExterno * 0.05,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.fill();

      // Adicionar linhas decorativas baseadas na complexidade
      if (complexidade > 1.2) {
        const numLinhas = Math.floor(complexidade);
        for (let j = 1; j <= numLinhas; j++) {
          const raioLinha = raioExterno * (0.3 + j * 0.2);
          if (raioLinha < raioExterno) {
            ctx.beginPath();
            ctx.moveTo(
              Math.cos(angulo) * raioLinha * 0.7,
              Math.sin(angulo) * raioLinha * 0.7
            );
            ctx.lineTo(
              Math.cos(angulo + anguloIncremento * 0.3) * raioLinha * 0.8,
              Math.sin(angulo + anguloIncremento * 0.3) * raioLinha * 0.8
            );
            ctx.strokeStyle = `hsla(${
              parseInt(corInterna.slice(4)) + 30
            }, 80%, 60%, 0.4)`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    }
  }
};

const drawDetailPattern = (
  ctx: CanvasRenderingContext2D,
  numElementos: number,
  raio: number,
  matiz: number
) => {
  const anguloIncremento = (Math.PI * 2) / numElementos;

  for (let i = 0; i < numElementos; i++) {
    const angulo = i * anguloIncremento;
    const x = Math.cos(angulo) * raio;
    const y = Math.sin(angulo) * raio;

    // Desenhar pequenos círculos ou outras formas
    ctx.beginPath();

    // Alternar entre diferentes formas decorativas
    if (i % 3 === 0) {
      // Pequeno círculo
      ctx.arc(x, y, raio * 0.05, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${(matiz + 120) % 360}, 70%, 60%, 0.6)`;
      ctx.fill();
    } else if (i % 3 === 1) {
      // Pequeno losango
      ctx.moveTo(x, y - raio * 0.06);
      ctx.lineTo(x + raio * 0.06, y);
      ctx.lineTo(x, y + raio * 0.06);
      ctx.lineTo(x - raio * 0.06, y);
      ctx.closePath();
      ctx.fillStyle = `hsla(${(matiz + 60) % 360}, 70%, 60%, 0.6)`;
      ctx.fill();
    } else {
      // Linha radiante
      ctx.moveTo(x * 0.8, y * 0.8);
      ctx.lineTo(x * 1.1, y * 1.1);
      ctx.strokeStyle = `hsla(${(matiz + 180) % 360}, 70%, 60%, 0.6)`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
};

const drawCentralCircles = (
  ctx: CanvasRenderingContext2D,
  numCamadas: number,
  tamanho: number,
  complexidade: number,
  corBase: number,
  numPetalas: number
) => {
  // Número de círculos baseado na complexidade
  const numCirculos = Math.floor(numCamadas * complexidade);

  // Desenhar círculos concêntricos no centro
  for (let i = 0; i < numCirculos; i++) {
    const raio = tamanho * (0.1 - (i * 0.015) / Math.sqrt(complexidade));
    if (raio <= 0) break;

    ctx.beginPath();
    ctx.arc(0, 0, raio, 0, Math.PI * 2);

    // Cores mais variadas baseadas na complexidade
    if (complexidade > 2 && i % 3 === 0) {
      ctx.fillStyle = `hsla(${(corBase + i * 30) % 360}, 70%, 50%, 0.4)`;
    } else if (i % 2 === 0) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    } else {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    }

    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Adicionar um ponto central
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();

  // Adicionar padrão radiante no centro quando complexidade alta
  if (complexidade > 1.7) {
    const numRaios = Math.floor(numPetalas * 1.5);
    const anguloRaio = (Math.PI * 2) / numRaios;
    const raioInt = tamanho * 0.15;

    for (let i = 0; i < numRaios; i++) {
      const angulo = i * anguloRaio;
      ctx.beginPath();
      ctx.moveTo(
        Math.cos(angulo) * raioInt * 0.5,
        Math.sin(angulo) * raioInt * 0.5
      );
      ctx.lineTo(Math.cos(angulo) * raioInt, Math.sin(angulo) * raioInt);
      ctx.strokeStyle = `hsla(${(corBase + i * 10) % 360}, 80%, 60%, 0.6)`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
};

const drawFlowerOfLifeOverlay = (
  ctx: CanvasRenderingContext2D,
  radius: number,
  complexidade: number
) => {
  // Determine circle radius and layers based on complexity or fixed?
  // Let's use a fixed relative size for now.
  // The "radius" parameter here is the mandala radius (half screen approx).

  // In Flower of Life, the circles have radius r.
  // If we want to cover the area, we need to choose r.
  // Let's say we want 3 layers.
  const layers = 3;
  // The extent is approximately 2 * layers * r.
  // So if extent = radius (mandala size), then r = radius / (2 * layers).
  const circleRadius = radius / (2 * 1.5); // A bit larger

  const centers = calculateFlowerOfLifeCenters(circleRadius, layers);

  ctx.save();
  // Use a blending mode or thin lines
  ctx.globalCompositeOperation = "source-over"; // Normal blending, but transparency helps
  ctx.strokeStyle = "rgba(255, 215, 0, 0.5)"; // Goldish
  ctx.lineWidth = 2;

  centers.forEach((center) => {
    ctx.beginPath();
    ctx.arc(center.x, center.y, circleRadius, 0, Math.PI * 2);
    ctx.stroke();
  });

  ctx.restore();
};

const drawGoldenSpiral = (
  ctx: CanvasRenderingContext2D,
  maxRadius: number
) => {
  // We want the spiral to cover the mandala area nicely.
  // 3-4 turns should be enough to look "hypnotic".
  const turns = 4;
  const points = calculateGoldenSpiral(0, 0, maxRadius, turns);

  ctx.save();
  ctx.strokeStyle = "rgba(255, 215, 0, 0.8)"; // Gold color, more opaque
  ctx.lineWidth = 3;
  ctx.shadowColor = "rgba(255, 215, 0, 0.5)";
  ctx.shadowBlur = 10;

  ctx.beginPath();
  if (points.length > 0) {
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
  }
  ctx.stroke();

  // Also draw the symmetrical spirals?
  // Often golden spirals are drawn mirrored or rotated.
  // But let's stick to one main spiral for now as per prompt.

  ctx.restore();
};
