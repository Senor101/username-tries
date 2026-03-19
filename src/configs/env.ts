import 'dotenv/config';

export interface AppConfig {
  host: string;
  port: number;
  databaseUrl: string;
}

const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 3000;
const DEFAULT_DATABASE_URL =
  'postgresql://postgres:postgres@localhost:5432/trie';

function parsePort(rawPort: string | undefined): number {
  const port = Number(rawPort);

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    return DEFAULT_PORT;
  }

  return port;
}

export const appConfig: AppConfig = {
  host: process.env.HOST ?? DEFAULT_HOST,
  port: parsePort(process.env.PORT),
  databaseUrl: process.env.DATABASE_URL ?? DEFAULT_DATABASE_URL,
};
