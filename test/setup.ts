import { rm } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
global.beforeEach(async () => {
  const dbPath = join(__dirname, '..', 'database', 'test.db.sqlite');

  if (existsSync(dbPath)) {
    await rm(dbPath);
  }
});
