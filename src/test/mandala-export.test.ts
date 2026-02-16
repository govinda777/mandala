import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as renderer from '../lib/mandala-renderer';

// Mock the drawMandala function
const drawMandalaSpy = vi.spyOn(renderer, 'drawMandala');

// We will implement this function in the next step
import { generateHighResDataURL } from '../lib/mandala-export';

describe('Mandala Export', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate a high resolution data URL', async () => {
    const config = {
      numPetalas: 12,
      numCamadas: 5,
      corBase: 180,
      complexidade: 1,
      rotacao: 0,
      width: 400,
      height: 400
    };

    const targetWidth = 2048;
    const targetHeight = 2048;

    // Mock Canvas and Context
    const mockContext = {
      clearRect: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
      quadraticCurveTo: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => mockContext),
      toDataURL: vi.fn(() => 'data:image/png;base64,mockeddata'),
    } as unknown as HTMLCanvasElement;

    // Mock document.createElement to return our mock canvas
    const createElementSpy = vi.spyOn(document, 'createElement');
    createElementSpy.mockImplementation((tagName) => {
      if (tagName === 'canvas') {
        return mockCanvas;
      }
      return document.createElement(tagName);
    });

    const dataUrl = await generateHighResDataURL(config, targetWidth, targetHeight);

    // Verify canvas dimensions were set
    expect(mockCanvas.width).toBe(targetWidth);
    expect(mockCanvas.height).toBe(targetHeight);

    // Verify drawMandala was called with correct context and updated dimensions
    expect(drawMandalaSpy).toHaveBeenCalledTimes(1);
    const [ctx, calledConfig] = drawMandalaSpy.mock.calls[0];
    expect(ctx).toBe(mockContext);
    expect(calledConfig).toEqual({
      ...config,
      width: targetWidth,
      height: targetHeight
    });

    // Verify output
    expect(dataUrl).toBe('data:image/png;base64,mockeddata');
  });
});
