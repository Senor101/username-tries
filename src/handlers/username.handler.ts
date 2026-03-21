import { type FastifyReply, type FastifyRequest } from 'fastify';

import {
  checkUsernameAvailability,
  createUsername,
  getAllUsernames,
} from '../services/username.service';
import type {
  CheckUsernameAvailabilityRoute,
  CreateUsernameRoute,
  ListUsernamesRoute,
} from '../interface/username.interface';

export async function createUsernameHandler(
  request: FastifyRequest<CreateUsernameRoute>,
  reply: FastifyReply<CreateUsernameRoute>,
): Promise<void> {
  try {
    const { username } = request.body;

    const createdUser = await createUsername(username);

    reply.status(201).send(createdUser);
  } catch (error: unknown) {
    request.log.error(error);
    reply.status(500).send({ message: 'failed to create username' });
  }
}

export async function listUsernamesHandler(
  request: FastifyRequest,
  reply: FastifyReply<ListUsernamesRoute>,
): Promise<void> {
  try {
    const usernames = await getAllUsernames();
    reply.status(200).send({
      message: 'usernames retrieved successfully',
      data: usernames,
    });
  } catch (error: unknown) {
    request.log.error(error);
    reply.status(500).send({ message: 'failed to retrieve usernames' });
  }
}

export async function checkUsernameAvailabilityHandler(
  request: FastifyRequest<CheckUsernameAvailabilityRoute>,
  reply: FastifyReply<CheckUsernameAvailabilityRoute>,
): Promise<void> {
  try {
    const { username } = request.query;

    if (username.trim().length === 0) {
      reply.status(400).send({ message: 'username query is required' });
      return;
    }

    const availabilityResult = await checkUsernameAvailability(username);

    reply.status(200).send({
      message: 'username availability checked successfully',
      data: availabilityResult,
    });
  } catch (error: unknown) {
    request.log.error(error);
    reply
      .status(500)
      .send({ message: 'failed to check username availability' });
  }
}
