import type { FastifyPluginCallback } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';

import type { HelloWorldService } from './helloworld.service';


const createMessageSchema = z.object({
    message: z.string().trim().min(1)
        .max(120)
});

export function createHelloWorldController(service: HelloWorldService): FastifyPluginCallback {
    return (instance, options, done) => {
        const f = instance.withTypeProvider<ZodTypeProvider>();

        f.get(
            '/',
            () => service.getGreeting()
        );

        f.get(
            '/messages',
            () => service.listMessages()
        );

        f.post(
            '/messages',
            { schema: { body: createMessageSchema } },
            request => service.createMessage(request.body.message)
        );

        done();
    };
}
