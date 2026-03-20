import { dbPool } from '../db/pool';
import { UsernameModel } from '../interface/username.interface';

export class UsernameRepository {
  private static toUsername(model: UsernameModel) {
    return {
      id: model.id,
      username: model.username,
      createdAt: model.created_at.toISOString(),
    };
  }

  static async insertUsername(username: string) {
    const { rows } = await dbPool.query<UsernameModel>(
      'INSERT INTO usernames (username) VALUES ($1) RETURNING id, username, created_at',
      [username],
    );

    return this.toUsername(rows[0]);
  }

  static async fetchAllUsernames() {
    const { rows } = await dbPool.query<UsernameModel>(
      'SELECT id, username, created_at FROM usernames ORDER BY created_at ASC',
    );

    return rows.map(this.toUsername);
  }
}
