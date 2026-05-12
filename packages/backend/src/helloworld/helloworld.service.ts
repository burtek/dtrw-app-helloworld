import type { HelloRepository } from './repository';


export class HelloWorldService {
    constructor(
        private readonly repository: HelloRepository,
        private readonly appName: string,
        private readonly databaseMode: 'none' | 'sqlite'
    ) {
    }

    createMessage(message: string) {
        return {
            appName: this.appName,
            databaseMode: this.databaseMode,
            message: this.repository.createMessage(message)
        };
    }

    getGreeting() {
        return `Hello from ${this.appName}`;
    }

    listMessages() {
        return {
            appName: this.appName,
            databaseMode: this.databaseMode,
            messages: this.repository.listMessages()
        };
    }
}
