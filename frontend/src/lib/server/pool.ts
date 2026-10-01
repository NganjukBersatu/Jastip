   import pg from 'pg';
   import { env } from '$env/dynamic/private';

   export const pool = new pg.Pool(
   	env.DATABASE_URL
   		? { connectionString: env.DATABASE_URL }
   		: {
   				host: env.DB_HOST ?? 'localhost',
   				port: Number(env.DB_PORT ?? 5432),
   				user: env.DB_USER ?? 'postgres',
   				password: env.DB_PASSWORD,
   				database: env.DB_NAME
   			}
   );