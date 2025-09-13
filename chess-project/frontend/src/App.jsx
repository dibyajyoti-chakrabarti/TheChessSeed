import { useState, useEffect } from 'react';

function App() {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/hello')
      .then(res => res.json())
      .then(data => setMsg(data.message))
      .catch(() => setMsg('Error fetching backend'));
  }, []);

  return (
    <div className="p-4">
      <h1 className="font-bold text-xl">Backend says:</h1>
      <p>{msg || 'Loading...'}</p>
    </div>
  );
}

export default App;
