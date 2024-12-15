import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";

interface TrainingCourseProps {
  charsToImprove: Set<string>;
}

const TrainingCourse: React.FC<TrainingCourseProps> = ({ charsToImprove }) => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateTrainingCircuit = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      if (charsToImprove.size === 0) {
        setError("No characters to generate training circuit.");
        setIsGenerating(false);
        return;
      }

      const missedCharacters = Array.from(charsToImprove);

      const response = await axios.post(
        "http://localhost:3001/api/generate-training-quote",
        { missedCharacters },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PROMPT_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.quote) {
        navigate("/circuit", {
          state: {
            trainingQuote: response.data.quote,
          },
          replace: true, 
        });
      } else {
        setError("No quote generated. Please try again.");
      }
    } catch (err) {
      console.error("Error generating training circuit:", err);
      setError("Failed to generate training circuit. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className='w-full max-w-md mx-auto p-4'>
      <button
        onClick={handleGenerateTrainingCircuit}
        disabled={isGenerating}
        className={`w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
          isGenerating ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isGenerating
          ? "Generating..."
          : "Generate training circuit with missed letters"}
      </button>
      {error && <p className='text-red-500 text-center mt-2'>{error}</p>}
    </div>
  );
};

export default TrainingCourse;
