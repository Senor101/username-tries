import type { FastifyPluginAsync } from 'fastify';

import {
  createUsernameHandler,
  listUsernamesHandler,
} from '../handlers/username.handler';
import type {
  CreateUsernameRoute,
  ListUsernamesRoute,
} from '../interface/username';

const usernameRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post<CreateUsernameRoute>('/usernames', createUsernameHandler);
  fastify.get<ListUsernamesRoute>('/usernames', listUsernamesHandler);
};

export default usernameRoutes;
