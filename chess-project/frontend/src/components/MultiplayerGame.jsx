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
      {playerColor ? (
        <>
          <h2 className="text-white text-2xl mb-4">
            Game ID: {gameId} | You are: {playerColor === 'w' ? 'White' : 'Black'}
          </h2>
          <div className="w-[400px] h-[400px] md:w-[500px] md:h-[500px]">
            <Chessboard
              position={fen}
              onPieceDrop={onDrop}
              boardOrientation={playerColor === 'w' ? 'white' : 'black'}
            />
          </div>
        </>
      ) : (
        <h2 className="text-white text-2xl mb-4">Waiting for opponent to join...</h2>
      )}
    </div>
  );
}

export default MultiplayerGame;