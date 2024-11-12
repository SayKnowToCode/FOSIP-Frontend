// TextBox.js
import React, { useState } from 'react';

function TextBox({ question, onKeyDelay, threshold }) {
    const [error, setError] = useState('');
    const [lastKeyInfo, setLastKeyInfo] = useState(null);

    const handlePaste = (e) => {
        e.preventDefault();
        setError('Pasting is not allowed.');
    };

    const handleKeyDown = (e) => {
        const currentTime = Date.now();
        const currentKey = e.key;

        if (lastKeyInfo) {
            const { key: lastKey, timestamp: lastTimestamp } = lastKeyInfo;
            const delay = currentTime - lastTimestamp;

            // Only send delay if it's below the threshold
            if (delay < threshold) {
                onKeyDelay({
                    keys: `(${lastKey}, ${currentKey})`,
                    delay: `${delay} ms`
                });
            }
        }

        setLastKeyInfo({ key: currentKey, timestamp: currentTime });
    };

    return (
        <div style={{ marginBottom: '20px' }}>
            <p>{question}</p>
            <input
                type="text"
                onPaste={handlePaste}
                onKeyDown={handleKeyDown}
                placeholder="Write your answer here"
                style={{ padding: '10px', width: '300px' }}
            />
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
    );
}

export default TextBox;
