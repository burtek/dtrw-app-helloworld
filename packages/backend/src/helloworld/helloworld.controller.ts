import type { FastifyPluginCallback } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { Asset, getAssetText } from '../assets/index.js';
import { routeFp } from '../helpers/route-plugin.js';


const helloWorldController: FastifyPluginCallback = (instance, options, done) => {
    const f = instance.withTypeProvider<ZodTypeProvider>();

    f.get(
        '/',
        async () => (await getAssetText(Asset.HELLO)).trim()
    );

    done();
};

export default routeFp(helloWorldController);
