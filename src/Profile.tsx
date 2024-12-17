import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trophy, Clock, Keyboard, X, RotateCcw } from "lucide-react";
import { useAuth } from "./AuthContext";
import KeyboardDiagram from "./KeyboardDiagram";
import ProfileGraph from "./ProfileGraph";
import BackButton from "./BackButton";
import Pagination from "./Pagination";

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

interface GraphRace {
  wpm: number;
  date: string;
}

const ProfilePage: React.FC = () => {
  const { user, token } = useAuth();
  const [raceHistory, setRaceHistory] = useState<RaceRecord[]>([]);
  const [selectedRace, setSelectedRace] = useState<RaceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [graphRaceHistory, setGraphRaceHistory] = useState<GraphRace[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchRaceHistory = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3001/api/race-history?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRaceHistory(response.data.races);
      setTotalPages(Math.ceil(response.data.totalCount / limit));
    } catch (error) {
      console.error("Error fetching race history:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllRaceHistory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/race-history`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGraphRaceHistory(response.data.races.map((race: RaceRecord) => ({
        wpm: race.wpm,
        date: race.date,
      })));
    } catch (error) {
      console.error("Error fetching all race history:", error);
    }
  };

  useEffect(() => {
    fetchAllRaceHistory();
    fetchRaceHistory(currentPage);
  }, [currentPage]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const RaceDetailModal: React.FC<RaceDetailModalProps> = ({ race, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm font-mono" onClick={onClose}>
      <div className="bg-gray-900/90 border border-gray-800/50 rounded-lg p-8 max-w-2xl w-full relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-8">
          <div className="space-y-2">
            <div className="text-xs tracking-[0.2em] uppercase text-gray-500 text-center">
              race details
            </div>
            <div className="text-sm text-gray-400 text-center">
              {formatDate(race.date)}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "wpm", value: race.wpm, icon: Trophy },
              { label: "accuracy", value: `${race.accuracy.toFixed(1)}%`, icon: Keyboard },
              { label: "time", value: `${race.timetocomplete}s`, icon: Clock }
            ].map(({ label, value }) => (
              <div key={label} className="group relative overflow-hidden rounded-lg bg-gray-800/50 p-4">
                <div className="space-y-2">
                  <div className="text-xs tracking-[0.2em] uppercase text-gray-500">
                    {label}
                  </div>
                  <div className="text-2xl font-light text-gray-200">
                    {value}
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="text-xs tracking-[0.2em] uppercase text-gray-500">
              keyboard analysis
            </div>
            <KeyboardDiagram mistypedKeys={new Set(race.charsToImprove)} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-mono">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex items-center justify-between">
          <BackButton />
          <div className="text-xs tracking-[0.2em] uppercase text-gray-500">
            {user?.username}
          </div>
        </div>

        <div className="space-y-12">
          <ProfileGraph races={graphRaceHistory} />

          {loading ? (
            <div className="flex justify-center">
              <div className="h-2 w-20 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse rounded-full" />
            </div>
          ) : raceHistory.length === 0 ? (
            <div className="text-center space-y-4">
              <RotateCcw className="w-6 h-6 text-gray-500 mx-auto" />
              <div className="text-sm text-gray-500">no races completed</div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid gap-4">
                {raceHistory.map((race) => (
                  <button
                    key={race.id}
                    onClick={() => setSelectedRace(race)}
                    className="group relative overflow-hidden bg-gray-900/50 rounded-lg p-6 text-left w-full border border-gray-800/30 hover:bg-gray-800/30 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-4">
                        <div className="text-sm text-gray-400">
                          {formatDate(race.date)}
                        </div>
                        <div className="flex space-x-8">
                          <div>
                            <div className="text-2xl font-light text-gray-200">
                              {race.wpm}
                            </div>
                            <div className="text-xs tracking-[0.2em] uppercase text-gray-500 mt-1">
                              wpm
                            </div>
                          </div>
                          <div>
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
                      <Trophy className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </button>
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
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
