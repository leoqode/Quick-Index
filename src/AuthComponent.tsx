import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Github } from "lucide-react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const AuthComponent: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const endpoint = isLogin
      ? "http://localhost:3001/api/login"
      : "http://localhost:3001/api/register";

    const payload = isLogin
      ? { email, username, password }
      : { fname: firstName, lname: lastName, username, email, password };

    try {
      const response = await axios.post(endpoint, payload);

      if (response.status === 200) {
        const { token, user } = response.data; // Assuming your backend returns a token
        login(token, user); // Set the token in the AuthContext
        setSuccessMessage(isLogin ? "Login successful!" : "Registration successful!");
        navigate("/main-page"); // Redirect to dashboard
      }
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message ||
          (isLogin
            ? "Login failed. Please check your credentials."
            : "Registration failed. Please try again.")
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => navigate("/")}
          className="mb-8 bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105 flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
          <div className="flex rounded-lg bg-gray-900 p-1 mb-8">
            <button
              className={`flex-1 py-2 rounded-md transition-all ${
                isLogin
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 rounded-md transition-all ${
                !isLogin
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          <h2 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>

          {!isLogin && (
            <div className="space-y-4 mb-6">
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-all flex items-center justify-center gap-2">
                Continue with Google
              </button>
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-all flex items-center justify-center gap-2">
                Continue with GitHub
                <Github />
              </button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-800 text-gray-400">
                    Or continue with email
                  </span>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-2">First Name</label>
                  <input
                    name="firstName"
                    title="First Name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Last Name</label>
                  <input
                    name="lastName"
                    title="Last Name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-gray-400 mb-2">
                {"Email"}
              </label>
              <input
                name="email"
                title="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                required
              />
            </div>
            <div>
            <label className="block text-gray-400 mb-2">
                {"Username"}
              </label>
              <input
                name="username"
                title="username"
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Password</label>
              <input
                name="password"
                title="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                required
              />
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-cyan-400 hover:text-cyan-300 text-sm"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105"
            >
              {isLogin ? "Login" : "Create Account"}
            </button>
          </form>

          {errorMessage && (
            <p className="text-red-500 mt-4 text-center">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-500 mt-4 text-center">{successMessage}</p>
          )}

          <p className="text-center mt-6 text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-cyan-400 hover:text-cyan-300"
            >
              {isLogin ? "Sign up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;
