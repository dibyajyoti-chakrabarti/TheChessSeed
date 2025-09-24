// frontend/src/components/Home.jsx

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSocket } from "./context/SocketContext"; // 👈 Import the hook
import "./App.css";

function Home() {
  const [gameId, setGameId] = useState("");
  const navigate = useNavigate();
  const socket = useSocket(); // 👈 Get socket from context

  useEffect(() => {
    if (!socket) return;
    
    const onGameCreated = (newGameId) => {
      navigate(`/game/${newGameId}`);
    };

    socket.on("gameCreated", onGameCreated);

    return () => {
      socket.off("gameCreated", onGameCreated);
    };
  }, [navigate, socket]);

  const handleCreateGame = () => {
    socket.emit("createGame");
  };

  const handleJoinGame = () => {
    if (gameId) {
      navigate(`/game/${gameId}`);
    } else {
      alert("Please enter a Game ID.");
    }
  };

  return (
    <div className="h-[89vh] w-[100vw] text-white flex flex-col justify-center items-center gap-[20px]">
      <h1 className="text-4xl font-extrabold mb-10">Watch Chess Grow!</h1>
      <Link to="/play" className="default-btn w-60 text-center">
        Play vs AI
      </Link>
      <button onClick={handleCreateGame} className="default-btn w-60 text-center bg-green-600 hover:bg-green-700">
        Create Multiplayer Game
      </button>
      <div className="flex flex-col items-center gap-2 mt-4">
        <input 
          type="text"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
          placeholder="Enter Game ID"
          className="p-2 rounded-md text-black w-60 text-center"
        />
        <button onClick={handleJoinGame} className="default-btn w-60 text-center bg-blue-600 hover:bg-blue-700">
          Join Game
        </button>
      </div>
    </div>
  );
}

export default Home;