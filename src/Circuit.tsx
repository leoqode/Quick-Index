import React, { useState, useEffect, useRef } from "react";
import Keyboard from "./KeyboardDiagram";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";
import BackButton from "./BackButton";
import TrainingCourse from "./TrainingCourse";


const Circuit: React.FC = () => {
  const { isAuthenticated } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();
  const {token} = useAuth();
  const [quoteToType, setQuoteToType] = useState("");
  const [userInput, setUserInput] = useState("");
  const [currentInputWord, setCurrentInputWord] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState<number | null>(null);
  const [isQuoteLoaded, setIsQuoteLoaded] = useState(false);
  const [mistypedKeyLabels, setMistypedKeyLabels] = useState<Set<string>>(
    new Set()
  );
  const [wordImprovementMap, setWordImprovementMap] = useState<{
    [key: string]: number;
  }>({});
  type SpecialChar = "’" | "“" | "”" | "—" | "…";
  const specialCharsMap: Record<SpecialChar, string> = {
    "’": "'",
    "“": '"',
    "”": '"',
    "—": "-",
    "…": "...",
  };
  const resetEntireState = () => {
    setQuoteToType("");
    setUserInput("");
    setCurrentInputWord("");
    setStartTime(null);
    setWpm(null);
    setIsQuoteLoaded(false);
    setMistypedKeyLabels(new Set());
    setWordImprovementMap({});
  };
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (location.state?.trainingQuote) {
      resetEntireState();

      const trainingQuote = location.state.trainingQuote;
      
      const timer = setTimeout(() => {
        setQuoteToType(trainingQuote);
        setIsQuoteLoaded(true);
      }, 50);

      window.history.replaceState({}, document.title);

      return () => clearTimeout(timer);
    } else {
      fetchQuote();
    }
  }, [location.state]);



  useEffect(() => {
    audioRef.current = new Audio("/audiomass-output.mp3");
  }, []);

  function getKeyLabel(char: string): string {
    if (char.match(/[a-zA-Z]/)) {
      return char.toUpperCase();
    } else {
      const symbolMap: { [key: string]: string } = {
        "`": "`",
        "~": "`",
        "1": "1",
        "!": "1",
        "2": "2",
        "@": "2",
        "3": "3",
        "#": "3",
        "4": "4",
        $: "4",
        "5": "5",
        "%": "5",
        "6": "6",
        "^": "6",
        "7": "7",
        "&": "7",
        "8": "8",
        "*": "8",
        "9": "9",
        "(": "9",
        "0": "0",
        ")": "0",
        "-": "-",
        _: "-",
        "=": "=",
        "+": "=",
        "[": "[",
        "{": "[",
        "]": "]",
        "}": "]",
        "\\": "\\",
        "|": "\\",
        ";": ";",
        ":": ";",
        "'": "'",
        '"': "'",
        ",": ",",
        "<": ",",
        ".": ".",
        ">": ".",
        "/": "/",
        "?": "/",
        " ": "Space",
        Enter: "Enter",
        Backspace: "Backspace",
        Tab: "Tab",
        Shift: "Shift",
        Control: "Control",
        Alt: "Alt",
        Meta: "Meta",
        CapsLock: "CapsLock",
      };
      return symbolMap[char] ? symbolMap[char].toUpperCase() : "";
    }
  }

  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate("/main-page"); 
    } else {
      navigate("/"); 
    }
  };

  const fetchQuote = async () => {
    try {
      const response = await fetch("Http://localhost:5000/api/qotd", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok && data?.quote?.body) {
        const quote = data.quote.body.replace(
          /[’“”—…]/g,
          (char: SpecialChar) => specialCharsMap[char]
        );
        setQuoteToType(quote);
        setIsQuoteLoaded(true);
      } else {
        console.error(
          "Failed to fetch the quote or invalid response structure."
        );
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  const updateMistakes = (currentInput: string) => {
    const expectedChars = quoteToType.slice(0, currentInput.length).split("");
    const actualChars = currentInput.split("");
    const newWordImprovementMap = { ...wordImprovementMap };
    const newMistypedKeyLabels = new Set<string>(mistypedKeyLabels);

    expectedChars.forEach((char, index) => {
      if (actualChars[index] !== char) {
        if (newWordImprovementMap[char]) {
          newWordImprovementMap[char] += 1;
        } else {
          newWordImprovementMap[char] = 1;
        }
        const keyLabel = getKeyLabel(char);
        if (keyLabel) {
          newMistypedKeyLabels.add(keyLabel);
        }
      }
    });

    setWordImprovementMap(newWordImprovementMap);
    setMistypedKeyLabels(newMistypedKeyLabels);
  };

  const handleKeyPress = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentInputWord(value);

    if (startTime === null) {
      setStartTime(Date.now());
    }

    const quoteWords = quoteToType.split(/\s+/);
    const userWords = userInput
      .trim()
      .split(/\s+/)
      .filter((word) => word !== "");
    const currentWordIndex = userWords.length;
    const currentTargetWord = quoteWords[currentWordIndex];

    updateMistakes(userInput + value);

    if (value.endsWith(" ")) {
      if (value.trim() === currentTargetWord) {
        const newUserInput = userInput + currentTargetWord + " ";
        setUserInput(newUserInput);
        setCurrentInputWord("");
      }
    }

    if ((userInput + value).trim() === quoteToType.trim()) {
      const timeTaken = (Date.now() - (startTime as number)) / 1000 / 60;
      const wordsTyped = quoteToType.trim().split(/\s+/).length;
      const calculatedWPM = Math.round(wordsTyped / timeTaken);
      const secondsTaken = timeTaken * 60; 
      setWpm(calculatedWPM);

      const accuracy = Math.round(
        (userInput.length / quoteToType.length) * 100
      );
      const charsToImprove = Array.from(mistypedKeyLabels);
      const date = new Date().toISOString();

      const raceData = {
        date,
        wpm : calculatedWPM,
        accuracy,
        timetocomplete: secondsTaken,
        quote: quoteToType,
        charsToImprove: charsToImprove,
      };

      try {
        console.log(date, calculatedWPM, accuracy, secondsTaken, quoteToType, charsToImprove)
        const response = await axios.post("http://localhost:3001/api/race", raceData, {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure token is sent here
          },
        });
        console.log("Race successfully saved to userId", response.data);
      } catch (error) {
        console.error("Something went wrong saving the race", error);
      }
    }
  };

  const resetTest = () => {
    setUserInput("");
    setCurrentInputWord("");
    setStartTime(null);
    setWpm(null);
    setQuoteToType("");
    setWordImprovementMap({});
    setMistypedKeyLabels(new Set());
    fetchQuote();
  };

  const renderQuote = () => {
    const stringToType = quoteToType.split("");
    const inputString = (userInput + currentInputWord).split("");
    let foundError = false;

    return stringToType.map((char, charIndex) => {
      let charClassName = "text-2xl transition-colors";

      if (!foundError && inputString[charIndex] === char) {
        charClassName += " text-green-400";
        handleKeyPress();
      } else if (inputString[charIndex]) {
        foundError = true;
        charClassName += " text-red-500 underline";
      } else {
        charClassName += " text-gray-400";
      }

      if (charIndex === inputString.length) {
        charClassName += " animate-pulse text-cyan-400 underline";
      }

      return (
        <span key={`char-${charIndex}`} className={charClassName}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className='min-h-screen bg-gray-900 text-white p-8'>
      <div className='max-w-4xl mx-auto'>
        <BackButton/>
        <div className='flex flex-col'>
          <button
            onClick={handleLogoClick}
            className='text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500'
          >
            Quick Index
          </button>
        </div>

        <div className='bg-gray-800 rounded-lg p-8 mb-8 shadow-lg min-h-[200px] flex items-center justify-center'>
          <div className='text-center leading-relaxed tracking-wide '>
            {quoteToType ? (
              renderQuote()
            ) : (
              <p className='text-cyan-400 animate-pulse'>Loading quote...</p>
            )}
          </div>
        </div>

        {isQuoteLoaded ? (
          <input
            className='w-full bg-gray-800 text-white text-xl p-4 rounded-lg mb-8 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all'
            value={currentInputWord}
            onChange={handleInputChange}
            placeholder='Start typing the quote...'
            disabled={wpm !== null}
          />
        ) : (
          <p>Loading quote...</p>
        )}

        {wpm !== null && (
          <div className='bg-gray-800 rounded-lg p-8 text-center animate-fade-in'>
            <div className='mb-8'>
              <p className='text-3xl font-bold text-cyan-400 mb-2'>
                WPM: {wpm}
              </p>
              <p className='text-gray-400'>Characters to improve:</p>
            </div>
            <Keyboard mistypedKeys={mistypedKeyLabels} />
            <button
              onClick={resetTest}
              className='bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105 mt-4'
            >
              Try Another Quote
            </button>
            <TrainingCourse charsToImprove={mistypedKeyLabels}/>
          </div>
        )}
      </div>
    </div>
  );
};

export default Circuit;
