import Fastify, { FastifyReply, FastifyRequest } from 'fastify';

import { appConfig } from './configs/env';
import { initializeDatabase } from './db/init';
import { dbPool } from './db/pool';
import clientPlugin from './plugins/client.plugin';
import usernameRoutes from './routes/username.routes';
import { hydrateUsernameTrie } from './services/username.service';

const fastifyApp = Fastify({
  logger: true,
});

fastifyApp.get(
  '/health',
  async (request: FastifyRequest, reply: FastifyReply) => {
    reply.status(200).send({ status: 'ok' });
  },
);

fastifyApp.register(clientPlugin);
fastifyApp.register(usernameRoutes, { prefix: '/api/v1' });

async function startServer() {
  await initializeDatabase();

  // Hydrate the in-memory trie with existing usernames from the database before starting the server
  await hydrateUsernameTrie();
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
