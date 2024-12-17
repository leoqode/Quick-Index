import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Github } from "lucide-react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import BackButton from "./BackButton";

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

    try {
      const response = await axios.post(
        `http://localhost:3001/api/${isLogin ? "login" : "register"}`,
        isLogin
          ? { email, username, password }
          : { fname: firstName, lname: lastName, username, email, password }
      );

      if (response.status === 200) {
        const { token, user } = response.data;
        login(token, user);
        navigate("/main-page");
      }
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message ||
          (isLogin ? "login failed" : "registration failed")
      );
    }
  };

  return (
    <div className='min-h-screen bg-gray-900 text-white p-8 font-mono'>
      <div className='max-w-md mx-auto space-y-8'>
        <div className='flex items-center justify-between'>
          <BackButton />
          <div className='text-xs tracking-[0.2em] uppercase text-gray-500'>
            {isLogin ? "login" : "register"}
          </div>
        </div>

        <div className='space-y-8'>
          <div className='flex gap-4'>
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-xs tracking-[0.2em] uppercase transition-colors ${
                isLogin ? "text-cyan-400" : "text-gray-500"
              }`}
            >
              login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-xs tracking-[0.2em] uppercase transition-colors ${
                !isLogin ? "text-cyan-400" : "text-gray-500"
              }`}
            >
              register
            </button>
          </div>

          {!isLogin && (
            <div className='space-y-4'>
              <button className='w-full bg-transparent border border-gray-800 hover:border-gray-700 px-4 py-3 rounded text-xs tracking-[0.2em] uppercase text-gray-400 hover:text-gray-300 transition-colors flex items-center justify-center gap-2'>
                <Github className='w-4 h-4' />
                github
              </button>

              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-800'></div>
                </div>
                <div className='relative flex justify-center text-xs tracking-[0.2em] uppercase'>
                  <span className='px-4 bg-gray-900 text-gray-500'>or</span>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-6'>
            {!isLogin && (
              <div className='grid grid-cols-2 gap-4'>
                {[
                  {
                    label: "first name",
                    value: firstName,
                    setter: setFirstName,
                  },
                  { label: "last name", value: lastName, setter: setLastName },
                ].map((field) => (
                  <div key={field.label} className='space-y-2'>
                    <div className='text-xs tracking-[0.2em] uppercase text-gray-500'>
                      {field.label}
                    </div>
                    <input
                      title='fname'
                      type='text'
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      className='w-full bg-transparent border border-gray-800 focus:border-gray-700 px-4 py-2 rounded text-gray-200 focus:outline-none transition-colors'
                      required
                    />
                  </div>
                ))}
              </div>
            )}

            {[
              { label: "email", value: email, setter: setEmail, type: "email" },
              {
                label: "username",
                value: username,
                setter: setUsername,
                type: "text",
              },
              {
                label: "password",
                value: password,
                setter: setPassword,
                type: "password",
              },
            ].map((field) => (
              <div key={field.label} className='space-y-2'>
                <div className='text-xs tracking-[0.2em] uppercase text-gray-500'>
                  {field.label}
                </div>
                <input
                  title='lname'
                  type={field.type}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  className='w-full bg-transparent border border-gray-800 focus:border-gray-700 px-4 py-2 rounded text-gray-200 focus:outline-none transition-colors'
                  required
                />
              </div>
            ))}

            {errorMessage && (
              <div className='text-xs tracking-[0.2em] uppercase text-red-400 text-center'>
                {errorMessage}
              </div>
            )}

            <button
              type='submit'
              className='w-full bg-transparent border border-gray-800 hover:border-cyan-400/40 px-4 py-3 rounded text-xs tracking-[0.2em] uppercase text-gray-400 hover:text-cyan-400 transition-colors'
            >
              {isLogin ? "login" : "create account"}
            </button>

            <div className='text-center text-xs tracking-[0.2em] uppercase text-gray-500'>
              {isLogin ? "need an account? " : "have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className='text-gray-400 hover:text-cyan-400 transition-colors'
              >
                {isLogin ? "register" : "login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;
