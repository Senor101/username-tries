import { Pool } from 'pg';

import { appConfig } from '../configs/env';

export const dbPool = new Pool({
  connectionString: appConfig.databaseUrl,
});
