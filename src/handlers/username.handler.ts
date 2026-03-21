import type { FastifyReply, FastifyRequest } from 'fastify';
// import type { DatabaseError } from 'pg';

import {
  createUsername,
  getAllUsernames,
  isUsernameAvailable,
} from '../services/username.service';
import type {
  CheckUsernameAvailabilityRoute,
  CreateUsernameRoute,
  ListUsernamesRoute,
} from '../interface/username.interface';

// function isUniqueViolation(error: unknown): error is DatabaseError {
//   if (error === null || typeof error !== 'object') {
//     return false;
//   }

//   return 'code' in error && (error as { code?: string }).code === '23505';
// }

export async function createUsernameHandler(
  request: FastifyRequest<CreateUsernameRoute>,
  reply: FastifyReply<CreateUsernameRoute>,
): Promise<void> {
  try {
    const { username } = request.body;
    const normalizedUsername = username.trim();

    if (normalizedUsername.length === 0) {
      reply.status(400).send({ message: 'username must not be empty' });
      return;
    }

    const createdUser = await createUsername(normalizedUsername);
    reply.status(201).send(createdUser);
  } catch (error: unknown) {
    reply.status(500).send({ message: 'failed to create username' });
  }
}

export async function listUsernamesHandler(
  _request: FastifyRequest,
  reply: FastifyReply<ListUsernamesRoute>,
): Promise<void> {
  try {
    const usernames = await getAllUsernames();
    reply.status(200).send({
      message: 'usernames retrieved successfully',
      data: usernames,
    });
  } catch (error: unknown) {
    reply.status(500).send({ message: 'failed to retrieve usernames' });
  }
}

export async function checkUsernameAvailabilityHandler(
  request: FastifyRequest<CheckUsernameAvailabilityRoute>,
  reply: FastifyReply<CheckUsernameAvailabilityRoute>,
): Promise<void> {
  try {
    const normalizedUsername = request.query.username.trim().toLowerCase();

    if (normalizedUsername.length === 0) {
      reply.status(400).send({ message: 'username query is required' });
      return;
    }

    const available = await isUsernameAvailable(normalizedUsername);

    reply.status(200).send({
      message: 'username availability checked successfully',
      data: {
        username: normalizedUsername,
        available,
      },
    });
  } catch (error: unknown) {
    reply
      .status(500)
      .send({ message: 'failed to check username availability' });
  }
}
