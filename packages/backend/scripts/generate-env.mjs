import { writeFileSync } from 'node:fs';


const STAGED_DIR = process.env.STAGED_DIR ?? '.assembled';
const GENERATED_ENV_FLENAME = process.env.GENERATED_ENV_FLENAME ?? 'env';
const currentCommit = process.env.BUILD_SHA;

if (!currentCommit) {
    throw new Error('BUILD_SHA environment variable is not set');
}

writeFileSync(
    `${STAGED_DIR}/${GENERATED_ENV_FLENAME}`,
    `COMMIT_SHA=${currentCommit}\n`,
    { encoding: 'utf-8' }
);
