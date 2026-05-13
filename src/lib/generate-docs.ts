import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function generatePDF(customer: string, loadingOrder: string, date: string, time: string, items: any[]): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const { height } = page.getSize();

  // Header
  page.drawText('BipStone - Relatório de Reserva', { x: 150, y: height - 50, size: 20, font: boldFont, color: rgb(0, 0, 0) });
  
  let y = height - 100;
  page.drawText(`Cliente: ${customer}`, { x: 50, y, size: 12, font });
  y -= 20;
  page.drawText(`Ordem de Carregamento: ${loadingOrder}`, { x: 50, y, size: 12, font });
  y -= 20;
  page.drawText(`Data: ${date}`, { x: 50, y, size: 12, font });
  y -= 20;
  page.drawText(`Hora: ${time}`, { x: 50, y, size: 12, font });
  y -= 40;

  // Table Header
  const tableHeaderSize = 10;
  page.drawText('Material', { x: 50, y, size: tableHeaderSize, font: boldFont });
  page.drawText('Acabamento', { x: 160, y, size: tableHeaderSize, font: boldFont });
  page.drawText('Esp.', { x: 260, y, size: tableHeaderSize, font: boldFont });
  page.drawText('Código (Lote-Chapa)', { x: 300, y, size: tableHeaderSize, font: boldFont });
  page.drawText('Comp.', { x: 430, y, size: tableHeaderSize, font: boldFont });
  page.drawText('Alt.', { x: 500, y, size: tableHeaderSize, font: boldFont });

  y -= 10;
  page.drawLine({ start: { x: 50, y }, end: { x: 550, y }, thickness: 1, color: rgb(0, 0, 0) });
  y -= 20;

  // Table Rows
  const rowSize = 9;
  for (const item of items) {
    if (y < 50) { // Nova página se necessário (simples)
      const newPage = pdfDoc.addPage([600, 800]);
      y = 750;
    }
    page.drawText(String(item.materialName || 'N/A'), { x: 50, y, size: rowSize, font });
    page.drawText(String(item.finishName || 'N/A'), { x: 160, y, size: rowSize, font });
    page.drawText(String(item.thicknessValue || 'N/A'), { x: 260, y, size: rowSize, font });
    page.drawText(`${item.lot}-${item.slabNumber}`, { x: 300, y, size: rowSize, font });
    page.drawText(String(item.length || '-'), { x: 430, y, size: rowSize, font });
    page.drawText(String(item.height || '-'), { x: 500, y, size: rowSize, font });
    y -= 20;
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

export function generateCSV(customer: string, loadingOrder: string, date: string, time: string, items: any[]): string {
  const header = 'Cliente;Ordem;Data;Hora;Material;Acabamento;Espessura;Lote;Chapa;Comprimento;Altura\n';
  const rows = items.map(item => 
    `${customer};${loadingOrder};${date};${time};${item.materialName};${item.finishName};${item.thicknessValue};${item.lot};${item.slabNumber};${item.length};${item.height}`
  ).join('\n');
  
  return header + rows;
}
