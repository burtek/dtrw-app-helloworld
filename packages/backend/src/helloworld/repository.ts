export interface HelloMessage {
    id: number;
    message: string;
    createdAt: string;
}

export interface HelloRepository {
    createMessage: (message: string) => HelloMessage;
    listMessages: () => HelloMessage[];
    close?: () => void;
}
