import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

function Game() {
  const [game, setGame] = useState(new Chess());

  function onDrop(sourceSquare, targetSquare) {
    const gameCopy = new Chess(game.fen());
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    });

    if (move === null) {
      return false; // illegal move
    }
    
    setGame(gameCopy); // update game state
    return true;
  }

  return (
    <div className="flex justify-center items-center h-[calc(100vh-64px)]">
      <div className="w-[400px] h-[400px] md:w-[500px] md:h-[500px]">
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
        />
      </div>
    </div>
  );
}

export default Game;