import React, { useState, useEffect } from 'react';
import './Circuit.css';

const Circuit: React.FC = () => {
  const [quoteToType, setQuoteToType] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState<number | null>(null);
  const incorrectChar = /’/i;


  const wordImprovementMap : {[key : string]: number} = {};

  const fetchQuote = async () => {
    try {
      const response = await fetch('https://recite.onrender.com/api/v1/random');
      const data = await response.json();
      if (response.ok) {
        const quote = data.quote;
        setQuoteToType(quote.replace(incorrectChar, '\''));
      } else {
        console.error('Failed to fetch the quote.');
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (startTime === null) {
      setStartTime(Date.now());
    }


    setUserInput(value);

    if (value === quoteToType) {
      const timeTaken = (Date.now() - startTime!) / 1000 / 60;
      const wordsTyped = value.trim().split(/\s+/).length;
      const calculatedWPM = Math.round(wordsTyped / timeTaken);
      setWpm(calculatedWPM);
    }
    
  };

  const resetTest = () => {
    setUserInput('');
    setStartTime(null);
    setWpm(null);
    setQuoteToType('');
    fetchQuote();
  };

  const renderQuote = () => {
    const words = quoteToType.split(' ');
    const inputWords = userInput.split(' ');
    
    return words.map((word, wordIndex) => {
      let wordClassName = '';
      if (wordIndex === inputWords.length - 1) {
        wordClassName = 'current-word';
      } else if (wordIndex < inputWords.length) {
        wordClassName = 'completed-word';
      }

      return (
        <span key={`word-${wordIndex}`} className={`word ${wordClassName}`}>
          {word.split('').map((char, charIndex) => {
            const overallIndex = words.slice(0, wordIndex).join(' ').length + (wordIndex > 0 ? 1 : 0) + charIndex;
            let charClassName = '';

            if (overallIndex < userInput.length) {
              charClassName = userInput[overallIndex] === char ? 'correct' : 'incorrect';
              if (charClassName === 'incorrect') {
                wordImprovementMap[char] = (wordImprovementMap[char] || 0) + 1;
              }
            } else if (overallIndex === userInput.length) {
              charClassName = 'current';
            }

            return (
              <span key={`char-${wordIndex}-${charIndex}`} className={charClassName}>
                {char}
              </span>
            );
          })}
          {wordIndex < words.length - 1 && ' '}
        </span>
      );
    });
  };

  return (
    <div className="circuit">
      <div className="display">
        {quoteToType ? renderQuote() : <p>Loading quote...</p>}
      </div>

      <input
        className="text-input"
        value={userInput}
        onChange={handleInputChange}
        placeholder="Start typing the quote..."
        disabled={wpm !== null}
      />

      {wpm !== null && (
        <div className="wpm-display">
          <p>Characters in which you can improve on:</p>
          <ul className ='incorrect-counts'>
            {Object.entries(wordImprovementMap).map(([char, improvement]) => (
              <li key={char}>
                {char}: {improvement}
              </li>
            ))}
          </ul>
          <p>Your WPM: {wpm}</p>
          <button onClick={resetTest}>Try Another Quote</button>
        </div>
      )}
    </div>
  );
};

export default Circuit;
