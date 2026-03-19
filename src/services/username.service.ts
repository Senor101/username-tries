import { dbPool } from '../db/pool';
import type { UsernameModel } from '../models/username.model';
import type { Username } from '../interface/username';

function toUsername(model: UsernameModel): Username {
  return {
    id: model.id,
    username: model.username,
    createdAt: model.created_at.toISOString(),
  };
}

export async function createUsername(username: string): Promise<Username> {
  const { rows } = await dbPool.query<UsernameModel>(
    'INSERT INTO usernames (username) VALUES ($1) RETURNING id, username, created_at',
    [username],
  );

  return toUsername(rows[0]);
}

export async function getAllUsernames(): Promise<Username[]> {
  const { rows } = await dbPool.query<UsernameModel>(
    'SELECT id, username, created_at FROM usernames ORDER BY id ASC',
  );

  return rows.map(toUsername);
}
