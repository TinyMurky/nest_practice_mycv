/**
 * Info: (20241023 - Murky)
 * Ref: https://dev.to/amirfakour/using-typeorm-migration-in-nestjs-with-postgres-database-3c75
 * https://stackoverflow.com/questions/67166620/how-to-get-values-from-custom-configuration-file-in-nestjs-with-interface
 */

/**
 * Info: (20241023 - Murky)
 * Migrate 指令：
 * 自動生成: npm run migration:generate --name=initDB
 * 空migrate: npm run migration:create --name=initDB
 */

import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: `.env.${process.env.NODE_ENV}.local` });

function switchConfig(): DataSourceOptions {
  console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
  switch (process.env.NODE_ENV) {
    case 'development':
      return {
        type: 'sqlite',
        database: process.env.SQL_URL || './database/db.sqlite',
        entities: ['**/*.entity.js'], // entity 在development環境下是js檔, 因為編譯之後才執行js黨
        // entities: ['dist/**/*.entity{.ts,.js}'],
        migrations: ['dist/migrations/*{.ts,.js}'],
        synchronize: false,
        // cli: {
        //   migrationDir: 'src/migrations',
        // },
      };
    case 'test':
      return {
        type: 'sqlite',
        // https://dev.to/webeleon/unit-testing-nestjs-with-typeorm-in-memory-l6m
        // database: ':memory:',
        database: process.env.SQL_URL || './database/test.db.sqlite',
        entities: ['**/*.entity.ts'], // entity 在test環境下是ts檔, 因為測試時不會編譯, 直接執行ts檔
        migrations: ['src/migrations/*{.ts,.js}'],
        migrationsRun: true,
        synchronize: false,
        // cli: {
        //   migrationDir: 'src/migrations',
        // },
      };
    case 'production':
      // 記得 npm install pg (pg 是postman的driver)
      return {
        type: 'postgres',
        url: process.env.DATABASE_URL, // for heroku
        entities: ['**/*.entity.js'], // entity 在development環境下是js檔, 因為編譯之後才執行js黨
        // entities: ['dist/**/*.entity{.ts,.js}'],
        migrations: ['dist/migrations/*{.ts,.js}'],
        migrationsRun: true, // production環境下要執行migration
        synchronize: false,
        // cli: {
        //   migrationDir: 'src/migrations',
        // },
        // Info: (20241024 - Murky) 下面也是給heroku
        ssl: {
          rejectUnauthorized: false,
        },
      };
    default:
      throw new Error('No database config for this environment');
  }
}

export default registerAs('typeorm', switchConfig);

const typeormConfig = switchConfig();
export const connectionSource = new DataSource(typeormConfig);
