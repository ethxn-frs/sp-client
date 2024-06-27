import React, { useState } from 'react';
import Chatbot from './Chatbot';
import './ChatButton.css';

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button className="chat-button" onClick={toggleChat}>
      {isOpen ? '✖' : '💬'}
      </button>
      {isOpen && <Chatbot />}
    </div>
  );
};

export default ChatButton;
