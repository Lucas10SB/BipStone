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
