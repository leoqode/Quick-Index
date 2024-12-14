import { useNavigate } from "react-router-dom";

const SplashPage = () => {
  const navigate = useNavigate();

  const handleGuestAccess = () => {
    navigate('/circuit'); 
  };
  const handleSigninLogin = () => {
    navigate('/auth')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center space-y-12">
        <div className="space-y-6">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Quick Index
          </h1>
          <p className="text-xl text-gray-400">
            Master your typing speed. Track your progress. Become legendary.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="text-cyan-400 text-xl mb-2">Real-time Analysis</div>
            <p className="text-gray-400">Track your WPM and accuracy as you type</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="text-cyan-400 text-xl mb-2">Keyboard Heatmap</div>
            <p className="text-gray-400">Visualize your improvement areas</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="text-cyan-400 text-xl mb-2">Custom Quotes</div>
            <p className="text-gray-400">Practice with fresh content every time</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleGuestAccess}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105 text-lg font-semibold min-w-[200px]"
          >
            Start as Guest
          </button>
          <button
            onClick={handleSigninLogin}
            className="bg-gray-800 text-white px-8 py-4 rounded-lg hover:bg-gray-700 transition-all transform hover:scale-105 text-lg font-semibold min-w-[200px]"
          >
            Login
          </button>
        </div>

        {/* Footer */}
        <div className="text-gray-500 mt-12">
          <p>Ready to improve your typing speed?</p>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;
