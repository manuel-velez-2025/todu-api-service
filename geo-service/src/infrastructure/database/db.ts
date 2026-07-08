import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://usuario:todusecret@localhost:5437/todu_geo_db';

const queryClient = postgres(DATABASE_URL, { max: 5 });
export const db = drizzle(queryClient, { schema });
export { schema };
