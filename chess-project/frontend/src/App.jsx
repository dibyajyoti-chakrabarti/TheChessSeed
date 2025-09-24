// frontend/src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import { AuthProvider } from "./context/AuthContext";
import SocketProvider from "./context/SocketContext"; // 👈 Import the provider
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Game from "./components/Game";
import MultiplayerGame from "./components/MultiplayerGame";
import Multiplayer from "./components/Multiplayer";

function App() {
  return (
    <AuthProvider>
      <SocketProvider> { /* 👈 Wrap your BrowserRouter with the SocketProvider */ }
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/play" 
              element={
                <ProtectedRoute>
                  <Game />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/multiplayer"
              element={
                <ProtectedRoute>
                  <Multiplayer />
                </ProtectedRoute>
              }
            />

            <Route 
              path="/game/:gameId"
              element={
                <ProtectedRoute>
                  <MultiplayerGame />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;