import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { createApp } from '../app';


describe('HelloWorldController', () => {
    it('should work in no-db mode', async () => {
        const { app } = createApp({}, {
            appName: 'helloworld',
            databaseMode: 'none',
            databaseFileName: ':memory:'
        });

        const greetingResponse = await app.inject({
            method: 'GET',
            url: '/hello'
        });

        expect(greetingResponse.body).toBe('Hello from helloworld');

        await app.inject({
            method: 'POST',
            url: '/hello/messages',
            payload: { message: 'First message' }
        });

        const listResponse = await app.inject({
            method: 'GET',
            url: '/hello/messages'
        });

        expect(listResponse.json()).toStrictEqual({
            appName: 'helloworld',
            databaseMode: 'none',
            messages: [
                {
                    id: 1,
                    message: 'First message',
                    createdAt: expect.any(String)
                }
            ]
        });

        await app.close();
    });

    it('should work in sqlite mode', async () => {
        const tempDir = mkdtempSync(join(tmpdir(), 'dtrw-template-'));
        const dbPath = join(tempDir, 'test.db');

        const { app } = createApp({}, {
            appName: 'helloworld',
            databaseMode: 'sqlite',
            databaseFileName: dbPath
        });

        await app.inject({
            method: 'POST',
            url: '/hello/messages',
            payload: { message: 'Persist me' }
        });

        const listResponse = await app.inject({
            method: 'GET',
            url: '/hello/messages'
        });

        expect(listResponse.json()).toStrictEqual({
            appName: 'helloworld',
            databaseMode: 'sqlite',
            messages: [
                {
                    id: 1,
                    message: 'Persist me',
                    createdAt: expect.any(String)
                }
            ]
        });

        await app.close();
    });
});
