import React, { useState } from 'react';
import axios from 'axios';

const ProofreadTest = () => {
  const [jobList, setJobList] = useState([]);
  const [userName, setUserName] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJobListChange = (e) => {
    setJobList(e.target.value.split(',').map(job => job.trim()));
  };

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await axios.post('http://localhost:8080/api/chatgpt', {
        jobList,
        userName,
      });
      setResponse(result.data);
    } catch (error) {
      console.error('Error occurred while fetching the response:', error);
      setResponse('Error occurred while fetching the response');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Proofread Test</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>Job List (comma separated):</label>
          <input
            type="text"
            value={jobList.join(', ')}
            onChange={handleJobListChange}
            placeholder="e.g., Software Engineer, Data Scientist"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>User Name:</label>
          <input
            type="text"
            value={userName}
            onChange={handleUserNameChange}
            placeholder="Enter your name"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px' }} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
      </form>
      {response && (
        <div>
          <h3>Response from GPT:</h3>
          <pre style={{ background: '#f4f4f4', padding: '10px', borderRadius: '5px' }}>
            {response}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ProofreadTest;
