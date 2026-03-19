import type { FastifyReply, FastifyRequest } from 'fastify';
import type { DatabaseError } from 'pg';

import { createUsername, getAllUsernames } from '../services/username.service';
import type {
  CreateUsernameRoute,
  ListUsernamesRoute,
} from '../interface/username';

function isUniqueViolation(error: unknown): error is DatabaseError {
  if (error === null || typeof error !== 'object') {
    return false;
  }

  return 'code' in error && (error as { code?: string }).code === '23505';
}

export async function createUsernameHandler(
  request: FastifyRequest<CreateUsernameRoute>,
  reply: FastifyReply<CreateUsernameRoute>,
): Promise<void> {
  const { username } = request.body;
  const normalizedUsername = username.trim();

  if (normalizedUsername.length === 0) {
    reply.status(400).send({ message: 'username must not be empty' });
    return;
  }

  try {
    const createdUser = await createUsername(normalizedUsername);
    reply.status(201).send(createdUser);
  } catch (error: unknown) {
    if (isUniqueViolation(error)) {
      reply.status(409).send({ message: 'username already exists' });
      return;
    }

    throw error;
  }
}

export async function listUsernamesHandler(
  _request: FastifyRequest,
  reply: FastifyReply<ListUsernamesRoute>,
): Promise<void> {
  const usernames = await getAllUsernames();
  reply.status(200).send(usernames);
}
