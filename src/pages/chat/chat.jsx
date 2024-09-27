import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [client, setClient] = useState(null);

  useEffect(() => {

    const websocketClient = new WebSocket('ws://localhost:8000/ws/chat');
    setClient(websocketClient);

    websocketClient.onopen = () => {
    };

    websocketClient.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    return () => websocketClient.close();
    
  }, []);

  const sendMessage = () => {
    if (client) {
      const message = { text: input, timestamp: new Date() };
      client.send(JSON.stringify(message));
      setInput('');
    }
  };

  return <>
    <div style={{ border: '1px solid', margin: 20, padding: 10 }}>
      <h1>Test Chat</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ borderBottom: '1px solid', marginRight: 5}}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  </>
};

export default Chat;