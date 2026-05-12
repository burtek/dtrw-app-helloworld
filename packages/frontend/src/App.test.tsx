import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import App from './App';


const jsonResponse = (body: unknown) => new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
});

test('App renders and supports message save flow', async () => {
    const fetchMock = vitest.fn()
        .mockResolvedValueOnce(new Response('Hello from helloworld', { status: 200 }))
        .mockResolvedValueOnce(jsonResponse({
            appName: 'helloworld',
            databaseMode: 'none',
            messages: []
        }))
        .mockResolvedValueOnce(jsonResponse({
            appName: 'helloworld',
            databaseMode: 'none',
            message: {
                id: 1,
                message: 'Stored from UI',
                createdAt: new Date().toISOString()
            }
        }))
        .mockResolvedValueOnce(jsonResponse({
            appName: 'helloworld',
            databaseMode: 'none',
            messages: [
                {
                    id: 1,
                    message: 'Stored from UI',
                    createdAt: new Date().toISOString()
                }
            ]
        }));

    vitest.stubGlobal('fetch', fetchMock);

    render(<App />);

    await waitFor(() => {
        expect(screen.getByText('Hello from helloworld')).toBeInTheDocument();
    });

    expect(screen.getByText('Database mode: none')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Add sample message'), { target: { value: 'Stored from UI' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
        expect(screen.getByText('Stored from UI')).toBeInTheDocument();
    });
});
