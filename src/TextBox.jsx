import React, { useState, useRef } from 'react';
import { keyMap } from './keyMap';

function TextBox({ question, onKeyDelay, threshold, keyDownTimesRef }) {
    const [error, setError] = useState('');
    const [lastKeyInfo, setLastKeyInfo] = useState(null);

    const handlePaste = (e) => {
        e.preventDefault();
        setError('Pasting is not allowed.');
    };

    const handleKeyDown = (e) => {
        const currentTime = Date.now();
        const currentKey = normalizeKey(e.key);

        // Track keydown start time
        if (keyDownTimesRef.current[currentKey] !== undefined) {
            keyDownTimesRef.current[currentKey][2] = currentTime;
        }

        // Inter-key delay logic
        if (lastKeyInfo) {
            const { key: lastKey, timestamp: lastTimestamp } = lastKeyInfo;
            const interKeyDelay = currentTime - lastTimestamp;

            // Send interkey delay if below threshold
            if (interKeyDelay < threshold) {
                onKeyDelay({
                    keys: `(${lastKey}, ${currentKey})`,
                    delay: `${interKeyDelay} ms`
                });
            }
        }

        setLastKeyInfo({ key: currentKey, timestamp: currentTime });
    };

    const handleKeyUp = (e) => {
        const currentKey = normalizeKey(e.key);

        // Calculate and update keydown delay
        if (keyDownTimesRef.current[currentKey] !== undefined) {
            const startTime = keyDownTimesRef.current[currentKey][2];
            if (startTime) {
                const keydownTime = Date.now() - startTime;
                const [totalDelay, count] = keyDownTimesRef.current[currentKey];

                keyDownTimesRef.current[currentKey] = [
                    totalDelay + keydownTime,
                    count + 1,
                    0 // Reset start time
                ];
            }
        }
    };

    const normalizeKey = (key) => {
        switch (key) {
            case ' ': return 'Space';
            case 'Enter': return 'Enter';
            default: return key;
        }
    };

    return (
        <div style={{ marginBottom: '20px' }}>
            <p>{question}</p>
            <input
                type="text"
                onPaste={handlePaste}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                placeholder="Write your answer here"
                style={{ padding: '10px', width: '300px' }}
            />
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
    );
}

export default TextBox;