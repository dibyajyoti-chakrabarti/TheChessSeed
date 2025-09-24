// backend/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { spawn } = require('child_process');
const http = require('http');
const { Server } = require("socket.io");
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});


// --- FIX #1: Replaced with a robust Stockfish helper function ---
function getBestMove(fen, depth = 12) {
  return new Promise((resolve, reject) => {
    const stockfishPath = process.env.STOCKFISH_PATH || 'stockfish';
    console.log(`[INFO] Spawning Stockfish at: ${stockfishPath}`);
    const stockfish = spawn(stockfishPath);

    let buffer = "";
    let bestMove = null;

    stockfish.on('error', (err) => {
      console.error('[ERROR] Failed to start Stockfish process.', err);
      reject(new Error('Failed to start Stockfish. Check STOCKFISH_PATH in .env and ensure the file is executable.'));
    });

    stockfish.stdout.on('data', (data) => {
      buffer += data.toString();
      console.log("[SF_RAW]", data.toString());

      if (buffer.includes("uciok")) {
        stockfish.stdin.write(`position fen ${fen}\n`);
        stockfish.stdin.write(`go depth ${depth}\n`);
      }

      if (buffer.includes("bestmove")) {
        const match = buffer.match(/bestmove\s+(\w+)/);
        if (match && match[1]) {
          bestMove = match[1];
          console.log(`[INFO] Best move found: ${bestMove}`);
          stockfish.kill(); // End the process once the move is found
        }
      }
    });

    stockfish.stderr.on('data', (data) => {
      console.error("[SF_STDERR]", data.toString());
    });

    stockfish.on('close', (code) => {
      if (bestMove) {
        resolve(bestMove);
      } else {
        console.error(`[ERROR] Stockfish process exited with code ${code} before finding a move.`);
        reject(new Error("Stockfish closed unexpectedly. Check logs for errors."));
      }
    });

    stockfish.stdin.write("uci\n");
  });
}

// --- API Routes ---
app.post("/api/bestmove", async (req, res) => {
  // --- FIX #2: Added a log to confirm the route is being hit ---
  console.log("--- Received request on /api/bestmove ---");
  const { fen } = req.body;
  if (!fen) {
    return res.status(400).json({ error: "FEN string is required" });
  }

  try {
    const bestMove = await getBestMove(fen, 12);
    res.json({ bestMove });
  } catch (err) {
    console.error("Error finding best move:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/hello', (req, res) => {
  res.json({ message: "Hello from backend" });
});
app.use('/api/auth', require('./routes/auth'));

// --- FIX #3: Corrected Multiplayer Logic ---
const games = {};

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('createGame', () => {
    const gameId = Math.random().toString(36).substr(2, 9);
    games[gameId] = {
      players: [], // Start with an empty players array
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    };
    socket.emit('gameCreated', gameId);
    console.log(`Game created with ID: ${gameId}`);
  });

  socket.on('joinGame', (gameId) => {
    const game = games[gameId];
    if (!game) {
      return socket.emit('error', 'Game not found.');
    }
    if (game.players.length >= 2 && !game.players.includes(socket.id)) {
      return socket.emit('error', 'Game is full.');
    }
    if (!game.players.includes(socket.id)) {
      game.players.push(socket.id);
      socket.join(gameId);
      console.log(`${socket.id} joined game ${gameId}`);
    }
    if (game.players.length === 2) {
      io.to(gameId).emit('gameStart', {
        gameId: gameId,
        fen: game.fen,
        players: game.players,
      });
      console.log(`Game ${gameId} is starting.`);
    }
  });

  socket.on('move', (data) => {
    const { gameId, move } = data;
    socket.to(gameId).emit('move', move);
    console.log(`Move in game ${gameId}:`, move);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));