export interface UserProgress {
  id?: string;
  userId: string;
  xpActual: number;
  nivel: number;
  rachaActual: number;
  ultimaActividad: Date;
  tareasCompletadas: number;
  fechaCreacion: Date;
}

export interface AddXpDTO {
  userId: string;
  xp: number;
}

export interface ProgressResponse {
  userId: string;
  xpActual: number;
  xpSiguienteNivel: number;
  nivel: number;
  rachaActual: number;
  tareasCompletadas: number;
  progresoPorcentaje: number;
}

export function xpForLevel(level: number): number {
  return 50 * level * (level + 1);
}

export function calcularNivel(xp: number): number {
  let nivel = 1;
  while (xp >= xpForLevel(nivel)) {
    nivel++;
  }
  return nivel;
}

export function xpRestante(xp: number): number {
  const nivelActual = calcularNivel(xp);
  return xpForLevel(nivelActual) - xp;
}

export function progresoPorcentaje(xp: number, nivel: number): number {
  const xpActualNivel = xpForLevel(nivel - 1);
  const xpSiguiente = xpForLevel(nivel);
  const rango = xpSiguiente - xpActualNivel;
  const actual = xp - xpActualNivel;
  return Math.min(100, Math.round((actual / rango) * 100));
}

export const RECOMPENSAS_NIVEL: Record<number, string> = {
  1: 'Semilla - Primer paso',
  2: 'Brote - Estas creciendo',
  3: 'Arbol - Constancia notable',
  4: 'Fuego - Imparable',
  5: 'Diamante - Maestro de la productividad',
};
