import React from 'react';
import { Chessboard } from 'react-chessboard';

function Game() {
  return (
    <div className="flex justify-center items-center h-[89vh]">
      <div>
        <h1 className="text-4xl font-bold text-center text-white my-8">
          Chess Game vs AI
        </h1>
        
        {/*
          This div will act as a container for our board.
          The w-[400px] or similar width class is important to give the board a size.
        */}
        <div className="w-[400px] h-[400px]">
          <Chessboard id="BasicChessboard" />
        </div>
      </div>
    </div>
  );
}

export default Game;