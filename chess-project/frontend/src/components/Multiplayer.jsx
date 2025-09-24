// frontend/src/components/Multiplayer.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

function Multiplayer() {
  const [gameId, setGameId] = useState("");
  const navigate = useNavigate();
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    
    // Listen for the 'gameCreated' event from the server
    const onGameCreated = (newGameId) => {
      // Automatically navigate to the new game room
      navigate(`/game/${newGameId}`);
    };

    socket.on("gameCreated", onGameCreated);

    // Clean up the listener when the component unmounts
    return () => {
      socket.off("gameCreated", onGameCreated);
    };
  }, [navigate, socket]);

  // Tell the server to create a new game
  const handleCreateGame = () => {
    socket.emit("createGame");
  };

  // Navigate to the game room using the ID from the input field
  const handleJoinGame = () => {
    if (gameId) {
      navigate(`/game/${gameId}`);
    } else {
      alert("Please enter a Game ID to join.");
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] w-full text-white flex flex-col justify-center items-center gap-5">
      <h1 className="text-4xl font-bold mb-8">Play a Friend</h1>
      
      <button 
        onClick={handleCreateGame} 
        className="default-btn w-40 text-center bg-green-600 hover:bg-green-700"
      >
        Create a New Game
      </button>

      <div className="text-gray-400">OR</div>

      <div className="flex flex-col items-center gap-2">
        <input 
          type="text"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
          placeholder="Enter Game ID"
          className="p-2 rounded-md text-black w-60 text-center bg-white"
        />
        <button 
          onClick={handleJoinGame} 
          className="default-btn w-40 text-center bg-blue-600 hover:bg-blue-700"
        >
          Join Game
        </button>
      </div>
    </div>
  );
}

export default Multiplayer;