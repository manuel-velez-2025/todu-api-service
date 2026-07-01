import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('robot-service conexion a BD establecida');
    client.release();
  } catch (error) {
    console.error('robot-service error al conectar a BD:', error);
  }
}
