#!/usr/bin/env node

import { readdirSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

const packages = readdirSync('./packages', { withFileTypes: true })
    .filter(dir => dir.isDirectory());

const results = await Promise.all(
    packages.map(async (dir) => {
        const packageName = dir.name;
        const packageJsonPath = `./packages/${packageName}/package.json`;
        const contents = await readFile(packageJsonPath, { encoding: 'utf-8' });
        const { name: declaredPackageJsonName } = JSON.parse(contents);

        const isValid = declaredPackageJsonName === packageName;

        if (!isValid) {
            console.error(`Package name mismatch for package "packages/${packageName}": declared name in package.json is "${declaredPackageJsonName}"`);
        }

        return { packageName, declaredPackageJsonName, isValid };
    })
);

if (results.some(result => !result.isValid)) {
    process.exit(1);
}
