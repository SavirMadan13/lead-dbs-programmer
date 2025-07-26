import { Button } from 'react-bootstrap';
import { useState } from 'react';

const handleRunOptimizer = async () => {
  try {
    const res = await fetch('http://127.0.0.1:8001/api/update-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: data }),
    });
    console.log(res);
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

function RunOptimizer({ data }) {
  const [response, setResponse] = useState(null);

  try {
    const res = fetch('http://127.0.0.1:8001/api/update-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: data }),
    });

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }

    const result = res.json();
    setResponse(result.message);
  } catch (error) {
    console.error('Error:', error);
  }

  return response;
}

export default RunOptimizer;
