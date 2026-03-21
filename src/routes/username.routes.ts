import type { FastifyPluginAsync } from 'fastify';

import {
  checkUsernameAvailabilityHandler,
  createUsernameHandler,
  listUsernamesHandler,
} from '../handlers/username.handler';
import type {
  CheckUsernameAvailabilityRoute,
  CreateUsernameRoute,
  ListUsernamesRoute,
} from '../interface/username.interface';

const usernameRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get<CheckUsernameAvailabilityRoute>(
    '/usernames/availability',
    checkUsernameAvailabilityHandler,
  );
  fastify.post<CreateUsernameRoute>('/usernames', createUsernameHandler);
  fastify.get<ListUsernamesRoute>('/usernames', listUsernamesHandler);
};

export default usernameRoutes;
