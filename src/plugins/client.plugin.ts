import { readFile } from 'node:fs/promises';
import path from 'node:path';

import type { FastifyPluginAsync } from 'fastify';

const CLIENT_DIR = path.join(process.cwd(), 'client');

const CONTENT_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
};

function resolveClientAsset(fileName: string): string {
  return path.resolve(CLIENT_DIR, fileName);
}

function getContentType(filePath: string): string {
  const extension = path.extname(filePath);
  return CONTENT_TYPES[extension] ?? 'text/plain; charset=utf-8';
}

const clientPlugin: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/', async (_request, reply) => {
    const html = await readFile(resolveClientAsset('index.html'), 'utf8');
    reply.type('text/html; charset=utf-8').send(html);
  });

  fastify.get<{ Params: { '*': string } }>(
    '/client/*',
    async (request, reply) => {
      const requestedPath = request.params['*'];
      const safeAssetPath = resolveClientAsset(requestedPath);
      const clientRootWithSeparator = `${CLIENT_DIR}${path.sep}`;

      if (
        safeAssetPath !== CLIENT_DIR &&
        !safeAssetPath.startsWith(clientRootWithSeparator)
      ) {
        reply.status(400).send('invalid path');
        return;
      }

      try {
        const content = await readFile(safeAssetPath, 'utf8');
        reply.type(getContentType(safeAssetPath)).send(content);
      } catch (_error) {
        reply.status(404).send('asset not found');
      }
    },
  );
};

export default clientPlugin;
