import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

  const MAX_LEADERBOARD = 250;
  const ITEMS_PER_PAGE = 10;
  const MAX_PAGES = Math.ceil(MAX_LEADERBOARD / ITEMS_PER_PAGE);

  const fetchLeaderboard = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3001/api/leaderboard?page=${page}&limit=${ITEMS_PER_PAGE}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { races, totalCount } = response.data;
      const effectiveTotalCount = Math.min(totalCount, MAX_LEADERBOARD);
      setLeaderboardRaces(races);
      setTotalPages(Math.min(Math.ceil(effectiveTotalCount / ITEMS_PER_PAGE), MAX_PAGES));
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
      year: "2-digit",
      month: "numeric",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-mono">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <BackButton />
          <div className="text-xs tracking-[0.2em] uppercase text-gray-500">
            leaderboard
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[500px]">
            <div className="h-2 w-20 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse rounded-full" />
          </div>
        ) : leaderboardRaces.length === 0 ? (
          <div className="text-center text-gray-500 font-light tracking-wider">
            no races recorded
          </div>
        ) : (
          <div className="space-y-4">
            {leaderboardRaces.map((race, index) => {
              const globalRank = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
              
              return (
                <div
                  key={race.id}
                  className="group relative bg-gray-900/50 border border-gray-800/30 rounded-lg p-6 backdrop-blur-sm hover:bg-gray-800/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="w-8 text-center">
                        <span className="text-sm font-light text-gray-500 group-hover:text-cyan-400 transition-colors">
                          {globalRank.toString().padStart(2, '0')}
                        </span>
                      </div>
                      
                      <div>
                        <div className="font-light tracking-wide text-gray-200">
                          {race.username}
                        </div>
                        <div className="text-xs text-gray-500 font-light tracking-wider mt-1">
                          {formatDate(race.date)}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-8">
                      <div className="text-right">
                        <div className="text-2xl font-light text-gray-200">
                          {race.wpm}
                        </div>
                        <div className="text-xs tracking-[0.2em] uppercase text-gray-500 mt-1">
                          wpm
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-light text-gray-200">
                          {race.accuracy.toFixed(1)}
                          <span className="text-gray-500 text-sm">%</span>
                        </div>
                        <div className="text-xs tracking-[0.2em] uppercase text-gray-500 mt-1">
                          acc
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>
              );
            })}

            <div className="pt-8">
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
