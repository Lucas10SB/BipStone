import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

export async function generatePDF(customer: string, date: string, time: string, items: any[]): Promise<Buffer> {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));

    // Header
    doc.fontSize(25).text('BipStone - Relatório de Reserva', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Cliente: ${customer}`);
    doc.text(`Data: ${date}`);
    doc.text(`Hora: ${time}`);
    doc.moveDown();

    // Table Header
    const tableTop = 200;
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Material', 50, tableTop);
    doc.text('Acabamento', 180, tableTop);
    doc.text('Esp.', 280, tableTop);
    doc.text('Lote', 330, tableTop);
    doc.text('Chapa', 410, tableTop);
    doc.text('Medidas', 460, tableTop);

    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    // Table Rows
    let rowTop = tableTop + 25;
    doc.font('Helvetica');
    items.forEach((item) => {
      doc.text(item.materialName || 'N/A', 50, rowTop);
      doc.text(item.finishName || 'N/A', 180, rowTop);
      doc.text(item.thicknessValue || 'N/A', 280, rowTop);
      doc.text(item.lot, 330, rowTop);
      doc.text(item.slabNumber, 410, rowTop);
      doc.text(item.measurements, 460, rowTop);
      rowTop += 20;
    });

    doc.end();
  });
}

export function generateCSV(customer: string, date: string, time: string, items: any[]): string {
  const header = 'Cliente;Data;Hora;Material;Acabamento;Espessura;Lote;Chapa;Medidas\n';
  const rows = items.map(item => 
    `${customer};${date};${time};${item.materialName};${item.finishName};${item.thicknessValue};${item.lot};${item.slabNumber};${item.measurements}`
  ).join('\n');
  
  return header + rows;
}
