import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trophy, Clock, Keyboard, X, RotateCcw } from "lucide-react";
import { useAuth } from "./AuthContext";
import KeyboardDiagram from "./KeyboardDiagram";

// Typing for race record
interface RaceRecord {
  id: string;
  date: string;
  wpm: number;
  accuracy: number;
  timetocomplete: number;
  quote: string;
  charsToImprove: string[];
}

interface RaceDetailModalProps {
  race: RaceRecord;
  onClose: () => void;
}

const ProfilePage: React.FC = () => {
  const { user, token } = useAuth(); // Retrieve token for authorization
  const [raceHistory, setRaceHistory] = useState<RaceRecord[]>([]);
  const [selectedRace, setSelectedRace] = useState<RaceRecord | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch race history from the backend
  useEffect(() => {
    const fetchRaceHistory = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/race-history",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
    
        // Ensure the array order is not reversed here
        const races = response.data.map((race: any) => ({
          ...race,
          id: race._id,
        }));
    
        setRaceHistory(races); // Use the correct order from backend
      } catch (error) {
        console.error("Error fetching race history:", error);
      } finally {
        setLoading(false);
      }
    };
    

    fetchRaceHistory();
  }, [token]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const RaceDetailModal: React.FC<RaceDetailModalProps> = ({
    race,
    onClose,
  }) => (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'
      onClick={onClose}
      role='dialog'
      aria-modal='true'
    >
      <div
        className='bg-gray-800/80 rounded-2xl p-8 max-w-2xl w-full relative'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-400 hover:text-white transition-colors'
          aria-label='Close race details'
        >
          <X className='w-6 h-6' />
        </button>
        {/* Race details */}
        <div className='space-y-6'>
          <div className='text-center'>
            <h2 className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500'>
              Race Details
            </h2>
            <p className='text-gray-400 mt-2'>{formatDate(race.date)}</p>
          </div>

          <div className='grid grid-cols-3 gap-4'>
            <div className='bg-gray-900 rounded-lg p-4 text-center'>
              <Trophy className='w-8 h-8 mx-auto text-cyan-400 mb-2' />
              <div className='text-xl font-semibold'>{race.wpm}</div>
              <div className='text-gray-400 text-sm'>WPM</div>
            </div>
            <div className='bg-gray-900 rounded-lg p-4 text-center'>
              <Keyboard className='w-8 h-8 mx-auto text-cyan-400 mb-2' />
              <div className='text-xl font-semibold'>
                {race.accuracy.toFixed(1)}%
              </div>
              <div className='text-gray-400 text-sm'>Accuracy</div>
            </div>
            <div className='bg-gray-900 rounded-lg p-4 text-center'>
              <Clock className='w-8 h-8 mx-auto text-cyan-400 mb-2' />
              <div className='text-xl font-semibold'>{race.timetocomplete}</div>
              <div className='text-gray-400 text-sm'>Seconds</div>
            </div>
          </div>
          <KeyboardDiagram mistypedKeys={new Set(race.charsToImprove)} />
        </div>
      </div>
    </div>
  );

  return (
    <div className='relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex flex-col items-center p-4 overflow-hidden'>
      <div className='relative z-10 max-w-5xl w-full space-y-12'>
        <div className='text-center space-y-6'>
          <h1 className='text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500'>
            {user?.username}'s Profile
          </h1>
          <p className='text-xl text-gray-400'>
            Your typing journey and performance
          </p>
        </div>
        {loading ? (
          <p className='text-gray-400 text-center'>Loading race history...</p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {raceHistory.map((race) => (
              <button
                key={race.id}
                onClick={() => setSelectedRace(race)}
                className='bg-gray-800/50 rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105 cursor-pointer group text-left w-full'
                aria-label={`View details for race on ${formatDate(race.date)}`}
              >
                <div className='flex justify-between items-center mb-4'>
                  <div className='text-cyan-400 font-semibold'>
                    {formatDate(race.date)}
                  </div>
                  <Trophy className='w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors' />
                </div>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <span className='text-gray-400'>WPM</span>
                    <span className='font-bold text-white'>{race.wpm}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-400'>Accuracy</span>
                    <span className='font-bold text-white'>
                      {race.accuracy.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
        {raceHistory.length === 0 && !loading && (
          <div className='text-center py-12'>
            <RotateCcw className='w-12 h-12 mx-auto text-cyan-400 mb-4' />
            <p className='text-gray-400'>
              No races completed yet. Start typing to build your history!
            </p>
          </div>
        )}
      </div>
      {selectedRace && (
        <RaceDetailModal
          race={selectedRace}
          onClose={() => setSelectedRace(null)}
        />
      )}
    </div>
  );
};

export default ProfilePage;
