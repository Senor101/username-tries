import { dbPool } from './pool';

export async function initializeDatabase(): Promise<void> {
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS usernames (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}
