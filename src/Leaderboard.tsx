import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Users } from 'lucide-react';
import { useAuth } from './AuthContext';
import Pagination from './Pagination';
import BackButton from './BackButton';

interface LeaderboardRace {
  id: string;
  username: string;
  wpm: number;
  accuracy: number;
  date: string;
}

const LeaderboardPage: React.FC = () => {
  const { token } = useAuth();
  const [leaderboardRaces, setLeaderboardRaces] = useState<LeaderboardRace[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchLeaderboard = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3001/api/leaderboard?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { races, totalCount } = response.data;
      setLeaderboardRaces(races);
      setTotalPages(Math.ceil(totalCount / limit));
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(currentPage);
  }, [currentPage]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getMedalColor = (index: number) => {
    switch (index) {
      case 0: return "border-l-4 border-yellow-500 bg-yellow-500/10";
      case 1: return "border-l-4 border-gray-400 bg-gray-400/10";
      case 2: return "border-l-4 border-amber-700 bg-amber-700/10";
      default: return "border-l-4 border-transparent bg-gray-800/50";
    }
  };

  return (
    <div className='relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex flex-col items-center justify-center p-4 overflow-hidden'>
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-30 animate-[pulse_10s_infinite_alternate]' />
      </div>

      <div className='relative z-10 w-full max-w-4xl space-y-8'>
        <BackButton/>
        <div className="flex items-center justify-center space-x-4 mb-6">
          <Trophy className="w-10 h-10 text-cyan-400" />
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Global Leaderboard
          </h2>
          <Users className="w-10 h-10 text-cyan-400" />
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[500px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-400"></div>
          </div>
        ) : leaderboardRaces.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            No races recorded yet
          </div>
        ) : (
          <div className="space-y-4 bg-gray-800/50 rounded-xl p-6 shadow-2xl">
            {leaderboardRaces.map((race, index) => (
              <div
                key={race.id}
                className={`
                  flex items-center justify-between 
                  p-4 rounded-lg 
                  ${getMedalColor(index)}
                  transition-all 
                  hover:bg-gray-700/50
                `}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 flex items-center justify-center">
                    {index < 3 ? (
                      <Trophy 
                        className={`
                          w-8 h-8 
                          ${index === 0 ? 'text-yellow-500' : 
                            index === 1 ? 'text-gray-400' : 
                            'text-amber-700'}
                        `} 
                      />
                    ) : (
                      <span className="text-xl font-bold text-gray-500">
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {race.username}
                    </div>
                    <div className="text-sm text-gray-400">
                      {formatDate(race.date)}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-400">WPM</div>
                    <div className="font-bold text-cyan-400">
                      {race.wpm}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Accuracy</div>
                    <div className="font-bold text-cyan-400">
                      {race.accuracy.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-6">
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
