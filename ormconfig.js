// don't use this, use datasource in database instead
/* eslint-disable @typescript-eslint/no-var-requires */
/*
 * 這個檔案用來取代app.module.ts中的TypeOrmModule.forRootAsync()
 */
const dotenv = require('dotenv');

const envPath = `.env.${process.env.NODE_ENV || 'development'}.local`;

dotenv.config({ path: envPath });

const dbConfig = {
  synchronize: false,
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: process.env.SQL_URL || './database/db.sqlite',
      entities: ['**/*.entity.js'], // entity 在development環境下是js檔, 因為編譯之後才執行js黨
    });
    break;
  case 'test':
    Object.assign(dbConfig, {
      type: 'sqlite',
      // https://dev.to/webeleon/unit-testing-nestjs-with-typeorm-in-memory-l6m
      // database: ':memory:',
      database: process.env.SQL_URL || './database/test.db.sqlite',
      entities: ['**/*.entity.ts'], // entity 在test環境下是ts檔, 因為測試時不會編譯, 直接執行ts檔
    });
    break;
  case 'production':
    break;
  default:
    throw new Error('No database config for this environment');
}

module.exports = dbConfig;
