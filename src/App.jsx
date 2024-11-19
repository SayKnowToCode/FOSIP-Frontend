// App.js
import React, { useState, useRef } from 'react';
import TextBox from './TextBox';
import axios from 'axios';
import { keyMap } from './keyMap';

function App() {
  const [keyDelays, setKeyDelays] = useState([]);
  const threshold = 2000; // 2 seconds threshold
  const keyDownTimesRef = useRef(JSON.parse(JSON.stringify(keyMap))); // Deep clone

  const questions = [
    "What is your favorite color?",
    "What is your favorite food?",
    "Where were you born?",
    "What is your hobby?",
    "What is your dream job?",
    "What is your favorite movie?",
    "What is your favorite book?",
    "What is your favorite season?",
    "What country would you like to visit?",
    "What is your favorite animal?",
  ];

  const handleKeyDelay = (delayData) => {
    setKeyDelays((prevKeyDelays) => [...prevKeyDelays, delayData]);
  };

  const handleSubmit = async () => {
    // Prepare keydown delays to send to backend
    const keydownDelays = {};

    // Maintain the exact order and keys from keyMap
    Object.keys(keyMap).forEach(key => {
      const [totalDelay, count] = keyDownTimesRef.current[key];
      keydownDelays[key] = count > 0 ? Number((totalDelay / count).toFixed(2)) : 0;
    });

    console.log(keydownDelays);
    // console.log(Object.keys(keydownDelays).length);
    try {
      const response = await axios.post('http://localhost:3500/getInput', {
        input: keyDelays,
        keydownDelays: keydownDelays
      });
      console.log('Data sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Answer the Questions</h2>
      {questions.map((question, index) => (
        <TextBox
          key={index}
          question={question}
          onKeyDelay={handleKeyDelay}
          threshold={threshold}
          keyDownTimesRef={keyDownTimesRef}
        />
      ))}

      <button onClick={handleSubmit} style={{ marginTop: '20px', padding: '10px 20px' }}>
        Submit Answers
      </button>
    </div>
  );
}

export default App;