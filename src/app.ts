import Fastify from 'fastify';

import { appConfig } from './configs/env';
import { initializeDatabase } from './db/init';
import { dbPool } from './db/pool';
import clientPlugin from './plugins/client.plugin';
import usernameRoutes from './routes/username.routes';

const fastifyApp = Fastify({
  logger: true,
});

fastifyApp.get('/health', async (request, reply) => {
  return { message: 'Hello, Nepal!' };
});

fastifyApp.register(clientPlugin);
fastifyApp.register(usernameRoutes);

async function startServer() {
  await initializeDatabase();
  await fastifyApp.listen({ port: appConfig.port, host: appConfig.host });
}

async function closeServer(): Promise<void> {
  await fastifyApp.close();
  await dbPool.end();
}

startServer().catch(async (error: unknown) => {
  fastifyApp.log.error(error);
  await closeServer();
  process.exit(1);
});

process.on('SIGINT', async (): Promise<void> => {
  await closeServer();
  process.exit(0);
});

process.on('SIGTERM', async (): Promise<void> => {
  await closeServer();
  process.exit(0);
});
