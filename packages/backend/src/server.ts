import { createApp } from './app';
import { env, runtimeConfig } from './config';


const { app, shutdown } = createApp({ logger: true }, runtimeConfig);

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

app.listen({
    port: env.PORT,
    host: '0.0.0.0'
// eslint-disable-next-line promise/prefer-await-to-callbacks
}).catch((error: unknown) => {
    app.log.error(error);
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
});
