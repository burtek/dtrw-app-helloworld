import type { HelloMessage, HelloRepository } from './repository';


const INITIAL_ID = 1;

export class InMemoryHelloRepository implements HelloRepository {
    private readonly messages: HelloMessage[] = [];

    private nextId = INITIAL_ID;

    createMessage(message: string): HelloMessage {
        const item: HelloMessage = {
            id: this.nextId,
            message,
            createdAt: new Date().toISOString()
        };

        this.nextId += 1;
        this.messages.push(item);

        return item;
    }

    listMessages(): HelloMessage[] {
        return [...this.messages].sort((a, b) => b.id - a.id);
    }
}
