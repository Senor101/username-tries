import type { Username } from '../interface/username.interface';
import { UsernameRepository } from '../repository/username.repository';
import { userNameTrie } from '../trie';

function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

export async function hydrateUsernameTrie(): Promise<void> {
  const usernames = await UsernameRepository.findAllUsernames();

  usernames.forEach((user) => {
    userNameTrie.insert(user.username);
  });
}

export async function getAllUsernames(): Promise<Username[]> {
  const usernames = await UsernameRepository.findAllUsernames();

  return usernames;
}

export async function isUsernameAvailable(username: string): Promise<boolean> {
  const normalizedUsername = normalizeUsername(username);

  const isUsernameInTrie = userNameTrie.search(normalizedUsername);
  if (isUsernameInTrie) {
    return false;
  }

  // If the username is not found in the trie, we check the database to ensure it doesn't exist there either.
  // we are only doing this because the trie data is not persistent for now.
  const existingUsername =
    await UsernameRepository.findByUsername(normalizedUsername);

  return !existingUsername;
}

export async function checkUsernameAvailability(username: string): Promise<{
  username: string;
  available: boolean;
  suggestions: string[];
}> {
  const normalizedUsername = normalizeUsername(username);
  const available = await isUsernameAvailable(normalizedUsername);

  if (available) {
    return {
      username: normalizedUsername,
      available: true,
      suggestions: [],
    };
  }

  const suggestions = await userNameTrie.suggestAvailableUsernames(
    normalizedUsername,
    isUsernameAvailable,
  );

  return {
    username: normalizedUsername,
    available: false,
    suggestions,
  };
}

export async function createUsername(username: string): Promise<Username> {
  const normalizedUsername = normalizeUsername(username);

  const isAvailable = await isUsernameAvailable(normalizedUsername);
  if (!isAvailable) {
    throw new Error('username already exists');
  }

  const newUsername =
    await UsernameRepository.insertUsername(normalizedUsername);
  // Insert the new username into the trie for future availability checks.
  userNameTrie.insert(normalizedUsername);

  return newUsername;
}
