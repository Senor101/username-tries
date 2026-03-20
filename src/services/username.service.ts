import type { Username } from '../interface/username.interface';
import { UsernameRepository } from '../repository/username.repository';

export async function createUsername(username: string): Promise<Username> {
  const newUsername = await UsernameRepository.insertUsername(username);

  return newUsername;
}

export async function getAllUsernames(): Promise<Username[]> {
  const usernames = await UsernameRepository.fetchAllUsernames();

  return usernames;
}
