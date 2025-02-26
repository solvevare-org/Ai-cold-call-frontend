// filepath: /c:/Users/Ahmer/Downloads/AI cold caller/project 2/react-frontend/src/components/CallComponent.tsx
import React, { useState } from 'react';
import { makeCall } from '../apiService';

const CallComponent: React.FC = () => {
  const [callData, setCallData] = useState('');
  const [response, setResponse] = useState('');

  const handleCall = async () => {
    try {
      const result = await makeCall({ data: callData });
      setResponse(result);
    } catch (error) {
      console.error('Error handling call:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={callData}
        onChange={(e) => setCallData(e.target.value)}
        placeholder="Enter call data"
      />
      <button onClick={handleCall}>Make Call</button>
      {response && <div>Response: {response}</div>}
    </div>
  );
};

export default CallComponent;