import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

function Game() {
  const [game, setGame] = useState(new Chess());

  async function getBestMove(fen) {
  console.log("Sending FEN to backend:", fen); // 👈 log frontend
  const res = await fetch("http://localhost:5000/api/bestmove", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fen }),
  });
  const data = await res.json();
  console.log("Best move from backend:", data); // 👈 log response
  return data.bestMove;
}


  async function onDrop(sourceSquare, targetSquare) {
    const gameCopy = new Chess(game.fen());
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    });

    if (move === null) {
      return false; // illegal move
    }

    setGame(gameCopy);

    // Ask backend for Stockfish move
    if (!gameCopy.isGameOver()) {
      const bestMove = await getBestMove(gameCopy.fen());
      if (bestMove) {
  const aiGame = new Chess(gameCopy.fen());
  const moveObj = {
    from: bestMove.slice(0, 2),
    to: bestMove.slice(2, 4),
    promotion: bestMove.length === 5 ? bestMove[4] : 'q',
  };
  const result = aiGame.move(moveObj);
  if (result) {
    setGame(aiGame);
  } else {
    console.error("Invalid AI move:", moveObj);
  }
}

    }

    return true;
  }

  return (
    <div className="flex justify-center items-center h-[calc(100vh-64px)]">
      <div className="w-[400px] h-[400px] md:w-[500px] md:h-[500px]">
        <Chessboard position={game.fen()} onPieceDrop={onDrop} />
      </div>
    </div>
  );
}

export default Game;
