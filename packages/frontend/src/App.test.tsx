import { act, render, waitFor } from '@testing-library/react';
import App from './App';


test('App renders', async () => {
    let resolve: (value: Response) => void;
    global.fetch = vitest.fn(() => {
        return new Promise<Response>(res => {
            resolve = res;
        })
    });

    const { container, getByText } = render(<App />);

    expect(container).not.toBeEmptyDOMElement();

    expect(getByText(/Loading/)).toBeInTheDocument();

    act(() => {
        resolve!({
            ok: true,
            text: () => Promise.resolve('Hello, world!'),
        } as unknown as Response);
    });

    await waitFor(() => {
        expect(getByText(/Hello, world!/)).toBeInTheDocument();
    });
})
