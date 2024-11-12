import React, { useState } from 'react';
import TextBox from './TextBox';
import axios from 'axios';

function App() {
  const [keyDelays, setKeyDelays] = useState([]);
  const threshold = 2000; // 2 seconds threshold

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
    console.log(keyDelays);

    setKeyDelays((prevKeyDelays) => [...prevKeyDelays, delayData]);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:3500/getInput', {
        input: keyDelays, // Send the keyDelays array to the backend
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
          threshold={threshold} // Pass the threshold to each TextBox
        />
      ))}

      {/* <div style={{ marginTop: '20px', textAlign: 'left' }}>
        <h4>Key Delays (ignoring pauses longer than {threshold} ms):</h4>
        <ul>
          {keyDelays.map((entry, index) => (
            <li key={index}>
              {entry.keys}: {entry.delay}
            </li>
          ))}
        </ul>
      </div> */}

      {/* Submit Button */}
      <button onClick={handleSubmit} style={{ marginTop: '20px', padding: '10px 20px' }}>
        Submit Answers
      </button>
    </div>
  );
}

export default App;
