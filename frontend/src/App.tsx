import { useEffect, useState } from 'react'

function App() {
  const [response, setResponse] = useState('Idle');

  const fetchData = async () => {
    setResponse('Loading');
    try {
      const res = await fetch('/api/hello');
      if (!res.ok) {
        setResponse('Error: Network response was not ok');
        throw new Error('Network response was not ok');
      }
      const data = await res.text();
      setResponse(data);
    } catch (error) {
      setResponse('Error');
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div>Test</div>
      <p>Response: {response}</p>
    </>
  )
}

export default App
