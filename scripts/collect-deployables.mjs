#!/usr/bin/env node

import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { copy } from 'cpx2';

console.log('📦 Collecting deployable artifacts...');

const packages = readdirSync('./packages', { withFileTypes: true })
    .filter(dir => dir.isDirectory());

let collected = 0;
await Promise.all(packages.map(dir => {
    const packageName = dir.name;
    const sourcePath = resolve('./packages', packageName, '.dist-deployable');
    const destinationPath = resolve(`./dist-${packageName}`);

    if (!existsSync(sourcePath)) {
        console.log(`⏭️  ${packageName} (not deployable)`);
        return;
    }

    collected++;
    console.log(`📁 ${packageName} → dist-${packageName}`);
    return copy(`${sourcePath}/**/*`, destinationPath, { clean: true });
}));

console.log(`✅ Collected ${collected} deployable artifact${collected === 1 ? '' : 's'}.`);
