import React, { useState } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  const sendMessage = async () => {
    if (userInput.trim() === "") return;

    const newMessages = [...messages, { text: userInput, sender: 'user' }];
    setMessages(newMessages);

    try {
      const response = await fetch("http://localhost:5005/webhooks/rest/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sender: "user", message: userInput }),
      });

      console.log("response",response)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const botMessages = data.map(message => ({ text: message.text, sender: 'bot' }));
      setMessages([...newMessages, ...botMessages]);

    } catch (error) {
      console.error("Error:", error);
    }

    setUserInput('');
  };

  return (
    <div id="chat-container">
      <div id="chatbox">
        <div id="messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}-message`}>
              {message.text}
            </div>
          ))}
        </div>
        <input 
          type="text" 
          value={userInput} 
          onChange={e => setUserInput(e.target.value)} 
          placeholder="Type your message..." 
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
