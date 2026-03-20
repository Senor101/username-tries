import type { Username } from '../interface/username.interface';
import { UsernameRepository } from '../repository/username.repository';

export async function getAllUsernames(): Promise<Username[]> {
  const usernames = await UsernameRepository.findAllUsernames();

  return usernames;
}

export async function isUsernameAvailable(username: string): Promise<boolean> {
  const existingUsername = await UsernameRepository.findByUsername(username);

  return !existingUsername;
}

export async function createUsername(username: string): Promise<Username> {
  const isAvailable = await isUsernameAvailable(username);
  if (!isAvailable) {
    throw new Error('username already exists');
  }

  const newUsername = await UsernameRepository.insertUsername(username);

  return newUsername;
}
