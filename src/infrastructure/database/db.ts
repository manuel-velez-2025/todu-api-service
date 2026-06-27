import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema'; // Aún no lo creamos, pero lo haremos en el paso 2

// Configuramos el pool de conexiones de Postgres
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Inicializamos Drizzle con el esquema
export const db = drizzle(pool, { schema });