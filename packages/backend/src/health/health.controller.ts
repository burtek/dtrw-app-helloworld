import type { FastifyPluginCallback } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { HealthService } from './health.service';


export function createHealthController(config: { appName: string; databaseMode: 'none' | 'sqlite' }): FastifyPluginCallback {
    return (instance, options, done) => {
        const healthService = new HealthService();

        const f = instance.withTypeProvider<ZodTypeProvider>();

        f.get(
            '/',
            { logLevel: 'silent' },
            () => ({
                status: 'ok',
                errors: [],
                timestamp: new Date().toISOString(),
                uptime: process.uptime(), // seconds
                commit: process.env.COMMIT_SHA ?? 'dev',
                version: healthService.getVersion(),
                appName: config.appName,
                databaseMode: config.databaseMode,
                nodeVersion: process.version,
                memoryUsage: process.memoryUsage(),
                cpuUsage: process.cpuUsage(),
                platform: process.platform,
                arch: process.arch,
                freeMemory: process.memoryUsage().heapTotal - process.memoryUsage().heapUsed
            })
        );

        done();
    };
}
