import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { join } from 'path';

const entities = [];

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  useFactory: async () => {
    return {
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      schema: process.env.DATABASE_SCHEMA,
      entities,
      synchronize: true,
      migrations: [join(__dirname, '..', 'migrations/*{.ts,.js}')],
      cli: {
        migrationsDir: 'src/migrations',
      },
      extra: {
        min: Number(process.env.DATABASE_EXTRA_MIN),
        max: Number(process.env.DATABASE_EXTRA_MAX),
        idleTimeoutMillis: Number(process.env.DATABASE_EXTRA_MIN_IDLETiIME),
      },
    };
  },
};

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities,
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
});
