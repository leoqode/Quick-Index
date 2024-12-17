import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Keyboard, Zap, Quote, Activity } from "lucide-react";

const SplashPage = () => {
  const navigate = useNavigate();
  const [demoInput, setDemoInput] = useState("");
  const demoQuote = "welcome to quick index!";

  const renderDemoQuote = () => {
    const stringToType = demoQuote.split("");
    const inputString = demoInput.split("");
    let foundError = false;

    return stringToType.map((char, charIndex) => {
      let className = "font-mono text-2xl transition-colors duration-200";
      
      if (!foundError && inputString[charIndex] === char) {
        className += " text-cyan-400";
      } else if (inputString[charIndex]) {
        foundError = true;
        className += " text-red-500";
      } else {
        className += " text-gray-500";
      }

      if (charIndex === inputString.length) {
        className += " border-b-2 border-cyan-400 animate-pulse";
      }

      return <span key={charIndex} className={className}>{char}</span>;
    });
  };

  const handleDemoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDemoInput(e.target.value);
    if (e.target.value === demoQuote) {
      setTimeout(() => navigate('/circuit'), 500);
    }
  };

  const features = [
    {
      icon: Activity,
      title: "real-time analysis",
      description: "track your wpm and accuracy as you type"
    },
    {
      icon: Keyboard,
      title: "keyboard heatmap",
      description: "visualize your improvement areas"
    },
    {
      icon: Quote,
      title: "custom quotes",
      description: "practice with fresh content every time"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-mono">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <div className="text-xs tracking-[0.2em] uppercase text-gray-500">
            welcome to
          </div>
          <div className="text-4xl font-light text-gray-200 tracking-tight">
            quick index
          </div>
          <div className="text-sm text-gray-500">
            master your typing speed. track your progress. become legendary.
          </div>
        </div>

        <div className="relative bg-gray-800/50 rounded-lg p-8 border border-gray-800/30 backdrop-blur-sm">
          <div className="text-center space-y-6">
            <div className="text-xs tracking-[0.2em] uppercase text-gray-500">
              try it now
            </div>
            <div className="text-center leading-relaxed">
              {renderDemoQuote()}
            </div>
            <input
              type="text"
              value={demoInput}
              onChange={handleDemoInput}
              className="w-full bg-transparent border border-gray-800/30 text-xl p-4 rounded-lg font-mono focus:border-cyan-400/40 focus:outline-none transition-colors"
              placeholder="start typing..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
            onClick={() => navigate('/circuit')}
            className="group relative bg-gray-800/80 hover:bg-gray-800/60 text-gray-200 px-8 py-4 rounded-lg border border-gray-800/30 text-sm tracking-[0.2em] uppercase"
          >
            <span className="relative z-10 flex items-center justify-center">
              start as guest
              <Zap className="ml-2 w-4 h-4" />
            </span>
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </button>

          <button
            onClick={() => navigate('/auth')}
            className="group relative bg-gray-800/50 hover:bg-gray-800/30 text-gray-400 hover:text-gray-200 px-8 py-4 rounded-lg border border-gray-800/30 text-sm tracking-[0.2em] uppercase"
          >
            <span className="relative z-10">login</span>
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;
