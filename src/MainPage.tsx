import { useNavigate } from "react-router-dom";
import { Keyboard, Users, Trophy, Settings, LogOut, Activity } from "lucide-react";
import useHandleLogout from "./useHandleLogout";
import { useAuth } from "./AuthContext";

const MainPage = () => {
  const navigate = useNavigate();
  const handleSignout = useHandleLogout();
  const { user } = useAuth();
  const username = user?.username;

  const features = [
    {
      icon: Keyboard,
      title: "Real-time Analysis",
      description: "Instant feedback on your typing speed and accuracy"
    },
    {
      icon: Trophy,
      title: "Global Leaderboards",
      description: "Compete with typists worldwide and climb the ranks"
    },
    {
      icon: Users,
      title: "Multiplayer Races",
      description: "Challenge friends or random opponents in real-time"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-mono">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="text-xs tracking-[0.2em] uppercase text-gray-500">
            welcome back
          </div>
          <div className="text-4xl font-light text-gray-200 tracking-tight">
            {username}
          </div>
          <div className="text-sm text-gray-500">
            let's push your typing skills to new heights
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title} 
                 className="group relative bg-gray-800/50 rounded-lg p-8 border border-gray-800/30">
              <div className="space-y-4">
                <feature.icon className="w-6 h-6 text-cyan-400" />
                <div className="text-sm tracking-[0.2em] uppercase text-gray-300">
                  {feature.title}
                </div>
                <div className="text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button
            onClick={() => navigate("/circuit")}
            className="group relative bg-gray-800/80 hover:bg-gray-800/60 text-gray-200 px-8 py-4 rounded-lg border border-gray-800/30 text-sm tracking-[0.2em] uppercase"
          >
            <span className="relative z-10 flex items-center justify-center">
              start a race
              <Activity className="ml-2 w-4 h-4" />
            </span>
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </button>

          <button
            onClick={() => navigate("/leaderboard")}
            className="group relative bg-gray-800/50 hover:bg-gray-800/30 text-gray-400 hover:text-gray-200 px-8 py-4 rounded-lg border border-gray-800/30 text-sm tracking-[0.2em] uppercase"
          >
            <span className="relative z-10 flex items-center justify-center">
              view leaderboard
              <Trophy className="ml-2 w-4 h-4" />
            </span>
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button
            onClick={() => navigate("/profile")}
            className="group relative bg-gray-800/50 hover:bg-gray-800/30 text-gray-400 hover:text-gray-200 px-8 py-4 rounded-lg border border-gray-800/30 text-sm tracking-[0.2em] uppercase"
          >
            <span className="relative z-10 flex items-center justify-center">
              profile
              <Users className="ml-2 w-4 h-4" />
            </span>
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </button>

          <button
            onClick={() => navigate("/settings")}
            className="group relative bg-gray-800/50 hover:bg-gray-800/30 text-gray-400 hover:text-gray-200 px-8 py-4 rounded-lg border border-gray-800/30 text-sm tracking-[0.2em] uppercase"
          >
            <span className="relative z-10 flex items-center justify-center">
              settings
              <Settings className="ml-2 w-4 h-4" />
            </span>
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </button>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSignout}
            className="group flex items-center space-x-2 text-xs tracking-[0.2em] uppercase text-gray-500 hover:text-gray-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
