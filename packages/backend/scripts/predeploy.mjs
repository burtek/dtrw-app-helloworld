import { readFileSync, writeFileSync } from 'node:fs';

import projectJson from '../package.json' with { type: 'json' };


const { name } = projectJson;

const currentCommit = process.env.BUILD_SHA;

if (!currentCommit) {
    throw new Error('BUILD_SHA environment variable is not set');
}

const currentContents = readFileSync(`../../docker/${name}/env`, { encoding: 'utf-8' })
    .split('\n')
    .filter(Boolean);

const commitShaLineIndex = currentContents.findIndex(line => line.startsWith('COMMIT_SHA='));

if (commitShaLineIndex === -1) {
    currentContents.push(`COMMIT_SHA=${currentCommit}`);
} else {
    currentContents[commitShaLineIndex] = `COMMIT_SHA=${currentCommit}`;
}

writeFileSync(
    `../../docker/${name}/env`,
    `${currentContents.join('\n')}\n`,
    { encoding: 'utf-8' }
);
