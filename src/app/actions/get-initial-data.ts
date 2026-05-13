'use server';

import db from '@/lib/db';

export async function getInitialData() {
  const materials = db.prepare('SELECT id, name FROM materials ORDER BY name ASC').all();
  const finishes = db.prepare('SELECT id, name FROM finishes ORDER BY name ASC').all();
  const thicknesses = db.prepare('SELECT id, value FROM thicknesses ORDER BY value ASC').all();

  return {
    materials: materials as { id: number; name: string }[],
    finishes: finishes as { id: number; name: string }[],
    thicknesses: thicknesses as { id: number; value: string }[],
  };
}

export async function getNextLoadingOrder() {
  const currentYear = new Date().getFullYear();
  const pattern = `OC-${currentYear}-%`;
  
  const lastOrder = db.prepare(`
    SELECT loading_order FROM reservations 
    WHERE loading_order LIKE ? 
    ORDER BY id DESC LIMIT 1
  `).get(pattern) as { loading_order: string } | undefined;

  let nextNumber = 1;
  if (lastOrder) {
    const parts = lastOrder.loading_order.split('-');
    if (parts.length === 3) {
      nextNumber = parseInt(parts[2]) + 1;
    }
  }

  return `OC-${currentYear}-${nextNumber.toString().padStart(4, '0')}`;
}
