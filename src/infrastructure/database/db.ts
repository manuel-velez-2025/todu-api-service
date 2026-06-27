import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
    throw new Error("Error: DATABASE_URL no está definido en el .env");
}

const client = postgres(process.env.DATABASE_URL);
export const db = drizzle(client, { schema });

console.log("Conexión a la base de datos establecida.");