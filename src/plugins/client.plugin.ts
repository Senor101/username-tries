import { readFile } from 'node:fs/promises';
import path from 'node:path';

import type { FastifyPluginAsync } from 'fastify';

const CLIENT_DIR = path.join(process.cwd(), 'client');

function resolveClientAsset(fileName: string): string {
  return path.join(CLIENT_DIR, fileName);
}

const clientPlugin: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/', async (_request, reply) => {
    const html = await readFile(resolveClientAsset('index.html'), 'utf8');
    reply.type('text/html; charset=utf-8').send(html);
  });

  fastify.get('/client.css', async (_request, reply) => {
    const css = await readFile(resolveClientAsset('client.css'), 'utf8');
    reply.type('text/css; charset=utf-8').send(css);
  });

  fastify.get('/client.js', async (_request, reply) => {
    const js = await readFile(resolveClientAsset('client.js'), 'utf8');
    reply.type('application/javascript; charset=utf-8').send(js);
  });
};

export default clientPlugin;
