import 'dotenv/config';
import { z } from 'zod/v4';


const DEFAULT_PORT = 4000;

/* eslint-disable @typescript-eslint/naming-convention */
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).nonoptional(),
    PORT: z.coerce.number().default(DEFAULT_PORT),
    LOGS_FILE: z.string().optional(),
    APP_NAME: z.string().default('helloworld'),
    DB_MODE: z.enum(['none', 'sqlite']).default('none'),
    DB_FILE_NAME: z.string().default('./packages/backend/development/db.db')
});
/* eslint-enable @typescript-eslint/naming-convention */

const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
    throw new Error('Environment validation failed', { cause: parsedEnv.error });
}

export const env = parsedEnv.data;

export interface AppRuntimeConfig {
    appName: string;
    databaseMode: 'none' | 'sqlite';
    databaseFileName: string;
}

export const runtimeConfig: AppRuntimeConfig = {
    appName: env.APP_NAME,
    databaseMode: env.DB_MODE,
    databaseFileName: env.DB_FILE_NAME
};
