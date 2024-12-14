import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Keyboard, ChevronRight, Users, Trophy, Settings, LogOut, Activity } from "lucide-react";
import useHandleLogout from "./useHandleLogout";
import { useAuth } from "./AuthContext";


const MainPage = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const handleSignout = useHandleLogout();
  const {user} = useAuth();
  const username = user?.username;

  const features = [
    {
      icon: (
        <Keyboard className='w-8 h-8 text-cyan-400 transition-transform duration-300 group-hover:rotate-6' />
      ),
      title: "Real-time Analysis",
      description: "Instant feedback on your typing speed and accuracy",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: (
        <Trophy className='w-8 h-8 text-cyan-400 transition-transform duration-300 group-hover:-rotate-6' />
      ),
      title: "Global Leaderboards",
      description: "Compete with typists worldwide and climb the ranks",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: (
        <Users className='w-8 h-8 text-cyan-400 transition-transform duration-300 group-hover:rotate-3' />
      ),
      title: "Multiplayer Races",
      description: "Challenge friends or random opponents in real-time",
      color: "from-green-500 to-teal-500",
    },
  ];

  const startRace = () => {
    navigate("/circuit");
  };

  const viewLeaderboard = () => {
    navigate("/leaderboard");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  const goToSettings = () => {
    navigate("/settings");
  };

  return (
    <div className='relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex flex-col items-center justify-center p-4 overflow-hidden'>
      {/* Animated Gradient Overlays */}
      <div className='absolute inset-0 overflow-hidden'>
        {/* Pulsing gradient layer */}
        <div className='absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-30 animate-[pulse_10s_infinite_alternate]' />

        {/* Floating particles */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className='absolute rounded-full bg-cyan-400/20 w-4 h-4 blur-md animate-[float_20s_infinite_alternate] mix-blend-screen'
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          ></div>
        ))}
      </div>

      <div className='relative z-10 max-w-5xl w-full text-center space-y-12'>
        {/* Header */}
        <div className='space-y-6'>
          <h1
            className='text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 
                       animate-bounce-slow transition-transform duration-500 hover:scale-105 
                       hover:animate-[flicker_1s_infinite_alternate] 
                       hover:shadow-[0_0_20px_rgba(56,189,248,0.7)]'
          >
            Welcome Back, {username}!
          </h1>
          <p
            className="text-xl text-gray-400 tracking-wide inline-block relative overflow-hidden whitespace-nowrap 
                       after:content-[''] after:block after:w-full after:h-full after:bg-gradient-to-r 
                       after:from-cyan-400/20 after:to-blue-500/20 after:absolute after:left-0 after:top-0
                       animate-typing"
            style={{
              animation: "typing 3s steps(40, end), blink 0.75s infinite",
            }}
          >
            Let's push your typing skills to new heights.
          </p>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
          {features.map((feature, index) => (
            <div
              key={index}
              className={`
                group bg-gray-800/50 rounded-xl p-6 shadow-2xl 
                transform transition-all duration-300 perspective-1000
                ${
                  activeFeature === index
                    ? `scale-105 border border-transparent bg-gradient-to-br ${feature.color} shadow-[0_0_40px_rgba(0,0,0,0.6)]`
                    : "hover:scale-105"
                }
              `}
              onMouseEnter={() => setActiveFeature(index)}
              onMouseLeave={() => setActiveFeature(null)}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <div className='flex flex-col items-center space-y-4 transition-transform duration-300 group-hover:rotate-x-6 group-hover:rotate-y-3'>
                {feature.icon}
                <div className='text-xl font-semibold text-cyan-400 transition-all duration-300 group-hover:text-blue-300 group-hover:shadow-cyan-300 group-hover:shadow-lg'>
                  {feature.title}
                </div>
                <p className='text-gray-400 text-center transition-opacity duration-300 group-hover:opacity-90'>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons for Signed-In User */}
        <div className='flex flex-col sm:flex-row justify-center gap-6'>
          <button
            onClick={startRace}
            className='group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-500 
                       text-white px-8 py-4 rounded-lg hover:from-cyan-600 hover:to-blue-600 
                       transition-all transform hover:scale-105 text-lg font-semibold min-w-[200px]
                       flex items-center justify-center shadow-lg hover:shadow-2xl
                       animate-[pulse_3s_infinite]'
          >
            <span className='relative z-10'>Start a Race</span>
            <Activity className='ml-2 w-5 h-5 opacity-0 group-hover:opacity-100 transition-all' />

            {/* Particle trail */}
            <div className='absolute inset-0 flex justify-center items-center pointer-events-none'>
              <div
                className='w-0 h-0 border-t-[10px] border-t-white border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent 
                              opacity-0 group-hover:opacity-50 animate-[sparkle_1s_infinite_alternate]'
              />
            </div>
          </button>

          <button
            onClick={viewLeaderboard}
            className='relative bg-gray-800 text-white px-8 py-4 rounded-lg 
                       hover:bg-gray-700 transition-all transform hover:scale-105 text-lg font-semibold min-w-[200px]
                       flex items-center justify-center shadow-lg hover:shadow-2xl group'
          >
            <span className='z-10'>View Leaderboard</span>
            <Trophy className='ml-2 w-5 h-5 opacity-0 group-hover:opacity-100 transition-all' />
            <span
              className='absolute inset-0 rounded-lg pointer-events-none 
                             bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-20 
                             transition-opacity duration-300'
            />
          </button>
        </div>

        {/* Profile & Settings */}
        <div className='flex flex-col sm:flex-row justify-center gap-6 mt-6'>
          <button
            onClick={goToProfile}
            className='relative bg-gray-800 text-white px-8 py-4 rounded-lg 
                       hover:bg-gray-700 transition-all transform hover:scale-105 text-lg font-semibold min-w-[200px]
                       flex items-center justify-center shadow-lg hover:shadow-2xl group'
          >
            <span className='z-10'>Profile</span>
            <Users className='ml-2 w-5 h-5 opacity-0 group-hover:opacity-100 transition-all' />
            <span
              className='absolute inset-0 rounded-lg pointer-events-none 
                             bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-20 
                             transition-opacity duration-300'
            />
          </button>

          <button
            onClick={goToSettings}
            className='relative bg-gray-800 text-white px-8 py-4 rounded-lg 
                       hover:bg-gray-700 transition-all transform hover:scale-105 text-lg font-semibold min-w-[200px]
                       flex items-center justify-center shadow-lg hover:shadow-2xl group'
          >
            <span className='z-10'>Settings</span>
            <Settings className='ml-2 w-5 h-5 opacity-0 group-hover:opacity-100 transition-all' />
            <span
              className='absolute inset-0 rounded-lg pointer-events-none 
                             bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-20 
                             transition-opacity duration-300'
            />
          </button>
        </div>

        {/* Footer */}
        <div className='text-gray-500 mt-12 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4'>
          <button
            title='sign-out'
            onClick={handleSignout}
            className='hover:text-cyan-400 transition-colors relative group flex items-center space-x-2'
          >
            <LogOut className='w-6 h-6 transition-transform duration-300 group-hover:rotate-90' />
            <span className='transition-opacity duration-1000 hover:opacity-80'>
              Sign Out
            </span>
          </button>
        </div>
      </div>

      {/* Keyframes */}
      <style>
        {`
          @keyframes flicker {
            0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
              opacity: 1;
            }
            20%, 22%, 24%, 55% {
              opacity: 0.3;
            }
          }

          @keyframes pulse {
            0% {
              opacity: 0.8;
            }
            50% {
              opacity: 1;
            }
            100% {
              opacity: 0.8;
            }
          }

          @keyframes float {
            0% {
              transform: translateY(0) translateX(0);
            }
            50% {
              transform: translateY(-20px) translateX(10px);
            }
            100% {
              transform: translateY(0) translateX(0);
            }
          }

          @keyframes typing {
            from { width: 0 }
            to { width: 100% }
          }

          @keyframes blink {
            0% { border-color: transparent }
            50% { border-color: currentColor }
            100% { border-color: transparent }
          }

          @keyframes sparkle {
            0% {
              transform: scale(0);
            }
            100% {
              transform: scale(1);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default MainPage;
