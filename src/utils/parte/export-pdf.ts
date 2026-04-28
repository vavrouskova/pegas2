import { PDFDocument } from 'pdf-lib';

const A4_MM = { width: 210, height: 297 };
const MM_TO_POINTS = 72 / 25.4;

const dataUrlToBytes = (dataUrl: string): Uint8Array => {
  const base64 = dataUrl.split(',')[1] ?? '';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.codePointAt(index) ?? 0;
  }
  return bytes;
};

export const exportParteToPdf = async (pngDataUrl: string, filename: string): Promise<void> => {
  const pageWidth = A4_MM.width * MM_TO_POINTS;
  const pageHeight = A4_MM.height * MM_TO_POINTS;

  const pdf = await PDFDocument.create();
  pdf.setTitle('Parte');
  pdf.setCreator('Pegas Parte Generator');

  const page = pdf.addPage([pageWidth, pageHeight]);
  const pngBytes = dataUrlToBytes(pngDataUrl);
  const png = await pdf.embedPng(pngBytes);

  const imageRatio = png.width / png.height;
  const pageRatio = pageWidth / pageHeight;

  let drawWidth = pageWidth;
  let drawHeight = pageHeight;
  if (imageRatio > pageRatio) {
    drawHeight = pageWidth / imageRatio;
  } else {
    drawWidth = pageHeight * imageRatio;
  }
  const x = (pageWidth - drawWidth) / 2;
  const y = (pageHeight - drawHeight) / 2;

  page.drawImage(png, { x, y, width: drawWidth, height: drawHeight });

  const bytes = await pdf.save();

  const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
