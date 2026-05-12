import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';


interface HelloMessage {
    id: number;
    message: string;
    createdAt: string;
}

interface MessagesResponse {
    appName: string;
    databaseMode: 'none' | 'sqlite';
    messages: HelloMessage[];
}

function isHelloMessage(value: unknown): value is HelloMessage {
    return Boolean(
        value
        && typeof value === 'object'
        && 'id' in value
        && 'message' in value
        && 'createdAt' in value
    );
}

function isMessagesResponse(value: unknown): value is MessagesResponse {
    if (!value || typeof value !== 'object') {
        return false;
    }

    if (!('appName' in value) || typeof value.appName !== 'string') {
        return false;
    }

    if (!('databaseMode' in value) || (value.databaseMode !== 'none' && value.databaseMode !== 'sqlite')) {
        return false;
    }

    if (!('messages' in value) || !Array.isArray(value.messages)) {
        return false;
    }

    return value.messages.every(isHelloMessage);
}

function App() {
    const [greeting, setGreeting] = useState('Loading...');
    const [messageText, setMessageText] = useState('');
    const [messagesData, setMessagesData] = useState<MessagesResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const loadMessages = async () => {
        const res = await fetch('/api/hello/messages');
        if (!res.ok) {
            throw new Error('Could not load messages');
        }

        const data: unknown = await res.json();

        if (!isMessagesResponse(data)) {
            throw new Error('Invalid messages response');
        }

        setMessagesData(data);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setError(null);

                const greetingResponse = await fetch('/api/hello');
                if (!greetingResponse.ok) {
                    throw new Error('Could not load greeting');
                }

                setGreeting(await greetingResponse.text());
                await loadMessages();
            } catch (fetchError) {
                setError('Failed to load data from backend');
                // eslint-disable-next-line no-console
                console.error(fetchError);
            }
        };

        void fetchData();
    }, []);

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setError(null);
            const trimmedMessage = messageText.trim();
            if (!trimmedMessage) {
                return;
            }

            const response = await fetch('/api/hello/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: trimmedMessage })
            });

            if (!response.ok) {
                throw new Error('Could not save message');
            }

            setMessageText('');
            await loadMessages();
        } catch (submitError) {
            setError('Failed to save message');
            // eslint-disable-next-line no-console
            console.error(submitError);
        }
    };

    return (
        <main>
            <h1>dtrw app template</h1>
            <p>{greeting}</p>
            <p>{`Database mode: ${messagesData?.databaseMode ?? 'unknown'}`}</p>

            <form onSubmit={onSubmit}>
                <label htmlFor="message">Add sample message</label>
                <input
                    id="message"
                    value={messageText}
                    onChange={event => {
                        setMessageText(event.target.value);
                    }}
                />
                <button type="submit">Save</button>
            </form>

            {error ? <p role="alert">{error}</p> : null}

            <h2>Stored messages</h2>
            <ul>
                {messagesData?.messages.map(item => <li key={item.id}>{item.message}</li>)}
            </ul>
        </main>
    );
}

App.displayName = 'App';

export default App;
