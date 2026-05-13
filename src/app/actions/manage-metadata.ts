'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addMetadata(type: 'materials' | 'finishes' | 'thicknesses', value: string) {
  try {
    const column = type === 'thicknesses' ? 'value' : 'name';
    const stmt = db.prepare(`INSERT INTO ${type} (${column}) VALUES (?)`);
    stmt.run(value);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error(`Erro ao adicionar ${type}:`, error);
    return { success: false, error: 'Erro ao adicionar item' };
  }
}

export async function deleteMetadata(type: 'materials' | 'finishes' | 'thicknesses', id: number) {
  try {
    const stmt = db.prepare(`DELETE FROM ${type} WHERE id = ?`);
    stmt.run(id);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error(`Erro ao excluir ${type}:`, error);
    return { success: false, error: 'Não é possível excluir: item em uso' };
  }
}
