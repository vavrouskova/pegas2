export const svgElementToPng = async (svg: SVGSVGElement, pixelRatio = 4): Promise<string> => {
  const xml = new XMLSerializer().serializeToString(svg);
  const bbox = svg.viewBox.baseVal;
  const width = bbox.width || svg.clientWidth;
  const height = bbox.height || svg.clientHeight;

  const encoded = encodeURIComponent(xml).replace(/%([\dA-F]{2})/g, (_, hex) =>
    String.fromCodePoint(Number.parseInt(hex, 16))
  );
  const dataUrl = `data:image/svg+xml;base64,${btoa(encoded)}`;

  const image = new Image();
  image.crossOrigin = 'anonymous';

  await new Promise<void>((resolve, reject) => {
    image.addEventListener('load', () => resolve());
    image.addEventListener('error', () => reject(new Error('Failed to load SVG')));
    image.src = dataUrl;
  });

  const canvas = document.createElement('canvas');
  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas 2D context unavailable');
  context.scale(pixelRatio, pixelRatio);
  context.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL('image/png');
};
