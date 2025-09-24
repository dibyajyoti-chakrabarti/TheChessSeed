// frontend/src/components/MultiplayerGame.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useSocket } from '../context/SocketContext';

function MultiplayerGame() {
  const { gameId } = useParams();
  const socket = useSocket();
  
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [playerColor, setPlayerColor] = useState(null);

  useEffect(() => {
    if (!socket) return;

    socket.emit('joinGame', gameId);

    const onGameStart = (data) => {
      const newGame = new Chess(data.fen);
      setGame(newGame);
      setFen(data.fen);
      const color = data.players[0] === socket.id ? 'w' : 'b';
      setPlayerColor(color);
    };

    const onMove = (move) => {
      setGame((g) => {
        const gameCopy = new Chess(g.fen());
        const result = gameCopy.move(move);
        if (result) {
          setFen(gameCopy.fen());
        }
        return gameCopy;
      });
    };
    
    const onError = (message) => {
      alert(message);
    };

    socket.on('gameStart', onGameStart);
    socket.on('move', onMove);
    socket.on('error', onError);

    return () => {
      socket.off('gameStart', onGameStart);
      socket.off('move', onMove);
      socket.off('error', onError);
    };
  }, [gameId, socket]);

  function onDrop(sourceSquare, targetSquare) {
    const gameCopy = new Chess(fen);

    if (gameCopy.turn() !== playerColor) {
      return false; 
    }

    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    });

    if (move === null) {
      return false;
    }

    setFen(gameCopy.fen());
    setGame(gameCopy);
    socket.emit('move', { gameId, move });

    return true;
  }

  return (
    <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)]">
      {/* --- FIX: Moved Game ID outside the conditional block --- */}
      <div className="text-center mb-4">
        <h2 className="text-white text-lg">Game ID</h2>
        <p className="text-green-400 text-2xl font-mono bg-gray-900 px-4 py-2 rounded-md">
          {gameId}
        </p>
      </div>

      {playerColor ? (
        <>
          <h3 className="text-white text-xl mb-2">
            You are playing as {playerColor === 'w' ? 'White' : 'Black'}
          </h3>
          <div className="w-[400px] h-[400px] md:w-[500px] md:h-[500px]">
            <Chessboard
              position={fen}
              onPieceDrop={onDrop}
              boardOrientation={playerColor === 'w' ? 'white' : 'black'}
            />
          </div>
        </>
      ) : (
        <div className="text-center mt-4">
          <h2 className="text-white text-2xl">Waiting for opponent...</h2>
          <p className="text-gray-400 mt-2">Share the Game ID above with a friend.</p>
        </div>
      )}
    </div>
  );
}

export default MultiplayerGame;