'use server';

import db from '@/lib/db';
import { generatePDF, generateCSV } from '@/lib/generate-docs';
import fs from 'fs/promises';
import path from 'path';

interface ReservationItem {
  materialId: string;
  finishId: string;
  thicknessId: string;
  lot: string;
  slabNumber: string;
  measurements: string;
}

export async function saveReservation(customer: string, date: string, time: string, items: ReservationItem[]) {
  try {
    // 1. Salvar no Banco de Dados
    const insertReservation = db.prepare(`
      INSERT INTO reservations (customer_name, date, time)
      VALUES (?, ?, ?)
    `);

    const insertItem = db.prepare(`
      INSERT INTO reservation_items (reservation_id, material_id, finish_id, thickness_id, lot, slab_number, measurements)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction(() => {
      const result = insertReservation.run(customer, date, time);
      const reservationId = result.lastInsertRowid;

      for (const item of items) {
        insertItem.run(
          reservationId,
          parseInt(item.materialId),
          parseInt(item.finishId),
          parseInt(item.thicknessId),
          item.lot,
          item.slabNumber,
          item.measurements
        );
      }
      return reservationId;
    });

    const reservationId = transaction();

    // 2. Preparar dados para exportação
    const itemsWithNames = items.map(item => {
      const material = db.prepare('SELECT name FROM materials WHERE id = ?').get(item.materialId) as any;
      const finish = db.prepare('SELECT name FROM finishes WHERE id = ?').get(item.finishId) as any;
      const thickness = db.prepare('SELECT value FROM thicknesses WHERE id = ?').get(item.thicknessId) as any;

      return {
        ...item,
        materialName: material?.name,
        finishName: finish?.name,
        thicknessValue: thickness?.value
      };
    });

    // 3. Gerar Documentos
    const pdfBuffer = await generatePDF(customer, date, time, itemsWithNames);
    const csvContent = generateCSV(customer, date, time, itemsWithNames);

    // 4. Salvar Localmente na pasta /exports
    const fileNameBase = `reserva_${customer.replace(/\s+/g, '_')}_${Date.now()}`;
    const exportsDir = path.join(process.cwd(), 'exports');
    
    await fs.writeFile(path.join(exportsDir, `${fileNameBase}.pdf`), pdfBuffer);
    await fs.writeFile(path.join(exportsDir, `${fileNameBase}.csv`), csvContent);

    // 5. Retornar dados para Download no Navegador (Base64)
    return { 
      success: true, 
      id: reservationId,
      files: {
        pdf: pdfBuffer.toString('base64'),
        csv: Buffer.from(csvContent).toString('base64'),
        fileName: fileNameBase
      }
    };
  } catch (error) {
    console.error('Erro ao salvar reserva:', error);
    return { success: false, error: 'Erro ao salvar no banco de dados' };
  }
}
