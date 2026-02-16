import { MandalaConfig, drawMandala } from './mandala-renderer';

/**
 * Generates a high-resolution data URL for the current mandala configuration.
 * @param config The mandala configuration.
 * @param width The desired width of the output image.
 * @param height The desired height of the output image.
 * @returns A Promise that resolves to the data URL string (PNG).
 */
export const generateHighResDataURL = async (
  config: MandalaConfig,
  width: number,
  height: number
): Promise<string> => {
  // Create an off-screen canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get 2D context');
  }

  // Draw the mandala with the new dimensions
  // We spread the config but override width and height
  drawMandala(ctx, { ...config, width, height });

  // Return the data URL
  return canvas.toDataURL('image/png');
};

/**
 * Triggers a download of the provided data URL.
 * @param dataUrl The data URL to download.
 * @param filename The filename for the download.
 */
export const triggerDownload = (dataUrl: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
