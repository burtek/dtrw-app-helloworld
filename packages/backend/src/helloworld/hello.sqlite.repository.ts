/* eslint-disable import-x/no-named-as-default */
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

import Database from 'better-sqlite3';

import type { HelloMessage, HelloRepository } from './repository';


const MAX_MESSAGES = 20;

interface RawMessage {
    id: number;
    message: string;
    createdAt: string;
}

export class SqliteHelloRepository implements HelloRepository {
    private readonly db: Database.Database;

    constructor(fileName: string) {
        if (fileName !== ':memory:') {
            mkdirSync(dirname(fileName), { recursive: true });
        }

        this.db = new Database(fileName, { readonly: false });
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS hello_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                message TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        `);
    }

    close() {
        this.db.close();
    }

    createMessage(message: string): HelloMessage {
        const createdAt = new Date().toISOString();

        const statement = this.db.prepare(`
            INSERT INTO hello_messages (message, created_at)
            VALUES (?, ?)
        `);
        statement.run(message, createdAt);

        const row = this.db.prepare<unknown[], RawMessage>(`
            SELECT id, message, created_at AS createdAt
            FROM hello_messages
            WHERE id = last_insert_rowid()
        `).get();

        if (!row) {
            throw new Error('Failed to read created message from sqlite');
        }

        return row;
    }

    listMessages(): HelloMessage[] {
        return this.db.prepare<unknown[], RawMessage>(`
            SELECT id, message, created_at AS createdAt
            FROM hello_messages
            ORDER BY id DESC
            LIMIT ${MAX_MESSAGES}
        `).all();
    }
}
