import { useEffect, useState } from 'react';


const useApiResponse = (path: string) => {
    const [response, setResponse] = useState('Idle');

    useEffect(() => {
        const fetchData = async () => {
            setResponse('Loading');
            try {
                const res = await fetch(path);
                if (!res.ok) {
                    setResponse('Error: Network response was not ok');
                    throw new Error('Network response was not ok');
                }
                const data = await res.text();
                setResponse(data);
            } catch (error) {
                setResponse('Error');
                // eslint-disable-next-line no-console
                console.error('Error fetching data:', error);
            }
        };

        void fetchData();
    }, [path]);

    return response;
};

function App() {
    const response1 = useApiResponse('/api1/hello');
    const response2 = useApiResponse('/api2/hello');

    return (
        <>
            <div>Test</div>
            <p>
                {`Response1: ${response1}`}
            </p>
            <p>
                {`Response2: ${response2}`}
            </p>
            <p>
                Commit: {import.meta.env.VITE_COMMIT}
            </p>
        </>
    );
}
App.displayName = 'App';

export default App;
