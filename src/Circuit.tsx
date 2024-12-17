import React, { useState, useEffect, useRef } from "react";
import Keyboard from "./KeyboardDiagram";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";
import BackButton from "./BackButton";
import TrainingCourse from "./TrainingCourse";
import { Bar, Line } from "react-chartjs-2";
import CountUp from "react-countup";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Circuit: React.FC = () => {
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [quoteToType, setQuoteToType] = useState("");
  const [userInput, setUserInput] = useState("");
  const [currentInputWord, setCurrentInputWord] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [isQuoteLoaded, setIsQuoteLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const [wpmHistory, setWpmHistory] = useState<{ time: number; wpm: number }[]>(
    []
  );
  const lastWpmUpdate = useRef<number>(Date.now());
  const [mistypedKeyLabels, setMistypedKeyLabels] = useState<Set<string>>(
    new Set()
  );
  const [wordImprovementMap, setWordImprovementMap] = useState<{
    [key: string]: number;
  }>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [realtimeWpm, setRealtimeWpm] = useState<number>(0);

  const specialCharsMap: Record<string, string> = {
    "’": "'",
    "“": '"',
    "”": '"',
    "—": "-",
    "…": "...",
    '“':`"`,
  };
  const calculateCorrectCharacters = (input: string, quote: string): number => {
    let correct = 0;
    const minLength = Math.min(input.length, quote.length);
    for (let i = 0; i < minLength; i++) {
      if (input[i] === quote[i]) correct++;
    }
    return correct;
  };
  const updateWpmHistory = (currentInput: string) => {
    if (startTime === null) return;

    const now = Date.now();
    if (now - lastWpmUpdate.current >= 1000) {
      const timeElapsed = (now - startTime) / 1000;
      const wordsTyped = currentInput.length / 5;
      const currentWpm = Math.round((wordsTyped * 60) / timeElapsed);

      setWpmHistory((prev) => [
        ...prev,
        { time: timeElapsed, wpm: currentWpm },
      ]);
      lastWpmUpdate.current = now;
    }
  };
  const calculateRealtimeStats = (currentInput: string) => {
    if (startTime === null || currentInput.length === 0) {
      setRealtimeWpm(0);
      return;
    }

    const timeElapsed = (Date.now() - startTime) / 1000 / 60;

    const wordsTyped = currentInput.length / 5;
    const currentWpm = Math.round(wordsTyped / timeElapsed);

    setRealtimeWpm(currentWpm);
  };
  const resetEntireState = () => {
    setQuoteToType("");
    setUserInput("");
    setCurrentInputWord("");
    setStartTime(null);
    setWpm(null);
    setAccuracy(100);
    setIsQuoteLoaded(false);
    setMistypedKeyLabels(new Set());
    setWordImprovementMap({});
    setLoading(true);
  };

  const fetchQuote = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/qotd", {
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok && data?.quote?.body) {
        const quote = data.quote.body.replace(
          /['""—…]/g,
          (char: string) => specialCharsMap[char] || char
        );
        setQuoteToType(quote);
        setIsQuoteLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeQuote = async () => {
      resetEntireState();
      if (location.state?.trainingQuote) {
        const trainingQuote = location.state.trainingQuote;
        setTimeout(() => {
          setQuoteToType(trainingQuote);
          setIsQuoteLoaded(true);
          setLoading(false);
        }, 50);
        window.history.replaceState({}, document.title);
      } else {
        await fetchQuote();
      }
    };
    initializeQuote();
  }, [location.state]);

  useEffect(() => {
    audioRef.current = new Audio("/audiomass-output.mp3");
  }, []);
  useEffect(() => {
    if (isQuoteLoaded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isQuoteLoaded]);

  // Add this when page loads
  useEffect(() => {
    const handleKeyDown = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  const updateMistakes = (currentInput: string) => {
    const expectedChars = quoteToType.slice(0, currentInput.length).split("");
    const actualChars = currentInput.split("");
    const newWordImprovementMap = { ...wordImprovementMap };
    const newMistypedKeyLabels = new Set<string>(mistypedKeyLabels);

    expectedChars.forEach((char, index) => {
      if (actualChars[index] !== char) {
        newWordImprovementMap[char] = (newWordImprovementMap[char] || 0) + 1;
        newMistypedKeyLabels.add(char.toUpperCase());
      }
    });

    setWordImprovementMap(newWordImprovementMap);
    setMistypedKeyLabels(newMistypedKeyLabels);
  };
  const prepareWpmGraphData = () => ({
    labels: wpmHistory.map((point) => point.time.toFixed(0)),
    datasets: [
      {
        label: "WPM",
        data: wpmHistory.map((point) => point.wpm),
        borderColor: "rgba(34, 211, 238, 1)",
        backgroundColor: "rgba(34, 211, 238, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  });
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentInputWord(value);
    updateWpmHistory(userInput + value);

    if (startTime === null) setStartTime(Date.now());

    const quoteWords = quoteToType.split(/\s+/);
    const userWords = userInput
      .trim()
      .split(/\s+/)
      .filter((word) => word !== "");
    const currentWordIndex = userWords.length;
    const currentTargetWord = quoteWords[currentWordIndex];
    calculateRealtimeStats(userInput + value);

    updateMistakes(userInput + value);

    if (value.endsWith(" ")) {
      if (value.trim() === currentTargetWord) {
        setUserInput(userInput + currentTargetWord + " ");
        setCurrentInputWord("");
      }
    }

    const fullInput = (userInput + value).trim();
    if (fullInput === quoteToType.trim()) {
      const timeTaken = (Date.now() - (startTime as number)) / 1000 / 60;
      const wordsTyped = quoteToType.trim().split(/\s+/).length;
      const calculatedWPM = Math.round(wordsTyped / timeTaken);
      const correctChars = calculateCorrectCharacters(
        userInput + value,
        quoteToType
      );
      const accuracyPercentage = Math.round(
        (correctChars / quoteToType.length) * 100
      );

      setWpm(calculatedWPM);
      setAccuracy(accuracyPercentage);

      try {
        await axios.post(
          "http://localhost:3001/api/race",
          {
            date: new Date().toISOString(),
            wpm: calculatedWPM,
            accuracy: accuracyPercentage,
            timetocomplete: timeTaken * 60,
            quote: quoteToType,
            charsToImprove: Array.from(mistypedKeyLabels),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (error) {
        console.error("Error saving race:", error);
      }
    }
  };

  const resetTest = () => {
    resetEntireState();
    fetchQuote();
  };

  const retryCurrentQuote = () => {
    setUserInput("");
    setCurrentInputWord("");
    setStartTime(null);
    setWpm(null);
    setAccuracy(100);
    setMistypedKeyLabels(new Set());
    setWordImprovementMap({});
  };

  const renderQuote = () => {
    const stringToType = quoteToType.split("");
    const inputString = (userInput + currentInputWord).split("");
    let foundError = false;

    return stringToType.map((char, charIndex) => {
      let className = "font-mono text-2xl transition-colors duration-200";

      if (!foundError && inputString[charIndex] === char) {
        className += " text-green-400";
      } else if (inputString[charIndex]) {
        foundError = true;
        className += " text-red-500 underline";
      } else {
        className += " text-gray-400";
      }

      if (charIndex === inputString.length) {
        className += " animate-pulse text-cyan-400 border-b-2 border-cyan-400";
      }

      return (
        <span key={charIndex} className={className}>
          {char}
        </span>
      );
    });
  };
  const RealtimeStats = () => (
    <div className='absolute top-0 right-0 p-4 space-y-2'>
      <div className='text-right'>
        <div className='text-xs tracking-[0.2em] uppercase text-gray-500'>
          wpm
        </div>
        <div className='text-2xl font-light text-cyan-400'>{realtimeWpm}</div>
      </div>
      <div className='text-right'></div>
    </div>
  );
  const prepareMistakesData = () => ({
    labels: Object.keys(wordImprovementMap).sort(),
    datasets: [
      {
        label: "Mistakes",
        data: Object.keys(wordImprovementMap)
          .sort()
          .map((char) => wordImprovementMap[char]),
        backgroundColor: Array(Object.keys(wordImprovementMap).length).fill(
          "rgba(34, 211, 238, 0.3)"
        ),
        borderColor: Array(Object.keys(wordImprovementMap).length).fill(
          "rgba(34, 211, 238, 0.6)"
        ),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  });

  return (
    <div className='min-h-screen bg-gray-900 text-white p-8 font-mono'>
      <div className='max-w-4xl mx-auto space-y-8'>
        <div className='flex items-center justify-between'>
          <BackButton />
          <button
            onClick={() =>
              isAuthenticated ? navigate("/main-page") : navigate("/")
            }
            className='text-2xl font-light tracking-tight text-gray-400 hover:text-cyan-400 transition-colors'
          >
            quick index
          </button>
        </div>

        <div className='relative p-8 min-h-[200px] flex items-center justify-center border border-gray-800/30 rounded-lg bg-gray-900/50 backdrop-blur-sm'>
          {!loading && startTime !== null && wpm === null && <RealtimeStats />}
          <div className='text-center leading-relaxed tracking-wide'>
            {loading ? (
              <p className='text-cyan-400 animate-pulse font-light'>
                loading quote...
              </p>
            ) : (
              renderQuote()
            )}
          </div>
        </div>

        {isQuoteLoaded && (
          <div className='space-y-4'>
            <input
              type='text'
              className='w-full bg-transparent text-xl p-4 font-mono caret-cyan-400 focus:outline-none'
              value={currentInputWord}
              onChange={handleInputChange}
              placeholder='start typing...'
              disabled={wpm !== null}
              autoFocus
            />
            <div className='flex justify-end'>
              <button
                onClick={retryCurrentQuote}
                className='text-xs tracking-[0.2em] uppercase text-yellow-500 hover:text-cyan-400 transition-colors'
              >
                retry
              </button>
            </div>
          </div>
        )}
        {wpm !== null && (
          <div className='space-y-12'>
            <div className='bg-gray-900/50 rounded-xl p-12 backdrop-blur-sm border border-gray-800/50'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                <div className='group relative overflow-hidden rounded-lg transition-all duration-300 hover:bg-gray-800/30'>
                  <div className='p-6 space-y-3'>
                    <div className='text-xs tracking-[0.2em] uppercase text-gray-500 group-hover:text-gray-400'>
                      wpm
                    </div>
                    <div className='text-5xl font-light tracking-tighter text-gray-200'>
                      <CountUp end={wpm} duration={2} />
                    </div>
                  </div>
                  <div className='absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500' />
                </div>

                <div className='group relative overflow-hidden rounded-lg transition-all duration-300 hover:bg-gray-800/30'>
                  <div className='p-6 space-y-3'>
                    <div className='text-xs tracking-[0.2em] uppercase text-gray-500 group-hover:text-gray-400'>
                      accuracy
                    </div>
                    <div className='text-5xl font-light tracking-tighter text-gray-200'>
                      <CountUp end={accuracy} duration={2} />
                      <span className='text-gray-500 text-2xl'>%</span>
                    </div>
                  </div>
                  <div className='absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500' />
                </div>

                <div className='group relative overflow-hidden rounded-lg transition-all duration-300 hover:bg-gray-800/30'>
                  <div className='p-6 space-y-3'>
                    <div className='text-xs tracking-[0.2em] uppercase text-gray-500 group-hover:text-gray-400'>
                      time
                    </div>
                    <div className='text-5xl font-light tracking-tighter text-gray-200'>
                      {((Date.now() - (startTime as number)) / 1000).toFixed(1)}
                      <span className='text-gray-500 text-2xl'>s</span>
                    </div>
                  </div>
                  <div className='absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500' />
                </div>
              </div>
            </div>

            {Object.keys(wordImprovementMap).length > 0 && (
              <div className='bg-gray-900/50 rounded-xl p-8 backdrop-blur-sm border border-gray-800/50'>
                <div className='grid grid-cols-1 md:grid-cols-12 gap-8'>
                  {/* WPM Graph - Takes up 8 columns */}
                  <div className='md:col-span-8'>
                    <div className='text-xs tracking-[0.2em] uppercase text-gray-500 mb-6'>
                      wpm progression
                    </div>
                    <div className='h-48'>
                      <Line
                        data={prepareWpmGraphData()}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              enabled: true,
                              mode: "index",
                              intersect: false,
                              backgroundColor: "rgba(0, 0, 0, 0.8)",
                              titleColor: "rgba(34, 211, 238, 1)",
                              bodyColor: "#fff",
                              padding: 12,
                              displayColors: false,
                              callbacks: {
                                title: (items) => `${items[0].parsed.y} WPM`,
                                label: (item) => `at ${item.label}s`,
                              },
                            },
                          },
                          scales: {
                            x: {
                              grid: { display: false },
                              ticks: {
                                color: "#6b7280",
                                font: { family: "monospace", size: 10 },
                                maxTicksLimit: 10,
                              },
                            },
                            y: {
                              grid: {
                                color: "rgba(255, 255, 255, 0.05)",
                                drawBorder: false,
                              },
                              ticks: {
                                color: "#6b7280",
                                font: { family: "monospace", size: 10 },
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>

                  {/* Character Mistakes - Takes up 4 columns */}
                  <div className='md:col-span-4'>
                    <div className='text-xs tracking-[0.2em] uppercase text-gray-500 mb-6'>
                      mistakes
                    </div>
                    <div className='h-48'>
                      <Bar
                        data={{
                          labels: Object.keys(wordImprovementMap).sort(),
                          datasets: [
                            {
                              data: Object.keys(wordImprovementMap)
                                .sort()
                                .map((char) => wordImprovementMap[char]),
                              backgroundColor: "rgba(34, 211, 238, 0.3)",
                              borderColor: "rgba(34, 211, 238, 0.6)",
                              borderWidth: 1,
                              borderRadius: 4,
                            },
                          ],
                        }}
                        options={{
                          indexAxis: "y",
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              enabled: true,
                              backgroundColor: "rgba(0, 0, 0, 0.8)",
                              titleColor: "rgba(34, 211, 238, 1)",
                              bodyColor: "#fff",
                              padding: 8,
                              displayColors: false,
                              callbacks: {
                                title: (items) => `'${items[0].label}'`,
                                label: (item) => `${item.parsed.y} missed`,
                              },
                            },
                          },
                          scales: {
                            x: {
                              grid: { display: false },
                              ticks: {
                                color: "#6b7280",
                                font: { family: "monospace", size: 10 },
                                stepSize: 1,
                              },
                            },
                            y: {
                              grid: { display: false },
                              ticks: {
                                color: "#6b7280",
                                font: {
                                  family: "monospace",
                                  size: 12,
                                  weight: "bold",
                                },
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className='bg-gray-900/50 rounded-xl p-8 backdrop-blur-sm border border-gray-800/50'>
              <div className='text-xs tracking-[0.2em] uppercase text-gray-500 mb-6'>
                keyboard analysis
              </div>
              <Keyboard mistypedKeys={mistypedKeyLabels} />
            </div>

            <div className='flex flex-col space-y-4'>
              <div className='flex justify-center space-x-4'>
                <button
                  onClick={retryCurrentQuote}
                  className='text-xs tracking-[0.2em] uppercase text-yellow-500 hover:text-cyan-400 transition-colors'
                >
                  retry
                </button>

                <button
                  onClick={resetTest}
                  className='text-xs tracking-[0.2em] uppercase text-yellow-500 hover:text-cyan-400 transition-colors'
                >
                  next
                </button>
              </div>

              <div className='mt-8'>
                <TrainingCourse charsToImprove={mistypedKeyLabels} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Circuit;
