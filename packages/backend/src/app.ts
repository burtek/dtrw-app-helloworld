import type { FastifyServerOptions } from 'fastify';
import { fastify } from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

import type { AppRuntimeConfig } from './config';
import { decorateRequestUser } from './decorators/auth.decorator';
import { decorateErrorHandler } from './decorators/error.decorator';
import { createHealthController } from './health/health.controller';
import { InMemoryHelloRepository } from './helloworld/hello.in-memory.repository';
import { SqliteHelloRepository } from './helloworld/hello.sqlite.repository';
import { createHelloWorldController } from './helloworld/helloworld.controller';
import { HelloWorldService } from './helloworld/helloworld.service';
import type { HelloRepository } from './helloworld/repository';


const EXIT_SUCCESS = 0;

function createRepository(config: AppRuntimeConfig): HelloRepository {
    if (config.databaseMode === 'sqlite') {
        return new SqliteHelloRepository(config.databaseFileName);
    }

    return new InMemoryHelloRepository();
}

export function createApp(
    opts: FastifyServerOptions = {},
    appConfig: AppRuntimeConfig = {
        appName: 'helloworld',
        databaseMode: 'none',
        databaseFileName: ':memory:'
    }
) {
    const app = fastify(opts);

    decorateErrorHandler(app);

    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    const repository = createRepository(appConfig);
    const helloService = new HelloWorldService(repository, appConfig.appName, appConfig.databaseMode);

    app.register(createHealthController(appConfig), { prefix: '/health' });

    decorateRequestUser(app);

    app.register(createHelloWorldController(helloService), { prefix: '/hello' });

    app.addHook('onClose', () => {
        if (typeof repository.close === 'function') {
            repository.close();
        }
    });

    return {
        app,
        async shutdown(signal: string) {
            app.log.info(`Received ${signal}, shutting down gracefully...`);
            try {
                await app.close();
                app.log.info('Fastify closed. Bye!');
                // eslint-disable-next-line n/no-process-exit
                process.exit(EXIT_SUCCESS);
            } catch (err) {
                app.log.error(err, 'Error during shutdown');
                throw err;
            }
        }
    };
}
