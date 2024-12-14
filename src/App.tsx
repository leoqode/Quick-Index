import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SplashPage from "./SplashPage";
import AuthComponent from "./AuthComponent";
import MainPage from "./MainPage";
import ProfilePage from "./Profile";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Circuit from "./Circuit";

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route
            path="/main-page"
            element={
              <ProtectedRoute>
                <MainPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<AuthComponent />} />
          <Route path="/circuit" element={<Circuit />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
