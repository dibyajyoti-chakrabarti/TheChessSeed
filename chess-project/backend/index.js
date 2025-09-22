const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { spawn } = require('child_process');
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// MongoDB connect
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// --- Stockfish Helper ---
function getBestMove(fen, depth = 12) {
  return new Promise((resolve, reject) => {
    console.log("Received FEN:", fen);
    const stockfish = spawn("stockfish");

    let initialized = false;
    let buffer = "";

    stockfish.stdout.on("data", (data) => {
      buffer += data.toString();

      // Print everything for debugging
      console.log("SF RAW:", buffer);

      if (!initialized && buffer.includes("uciok")) {
        initialized = true;
        stockfish.stdin.write(`position fen ${fen}\n`);
        stockfish.stdin.write(`go depth ${depth}\n`);
      }

      // detect bestmove in full buffer
      if (buffer.includes("bestmove")) {
        const match = buffer.match(/bestmove\s+(\w+)/);
        if (match) {
          const bestMove = match[1];
          stockfish.kill();
          resolve(bestMove);
        }
      }
    });

    stockfish.stderr.on("data", (data) => {
      console.error("Stockfish error:", data.toString());
    });

    stockfish.on("close", () => {
      reject(new Error("Stockfish closed before giving a bestmove"));
    });

    // kick off
    stockfish.stdin.write("uci\n");
  });
}


// --- API Route ---
app.post("/api/bestmove", async (req, res) => {
  const { fen } = req.body;
  if (!fen) {
    return res.status(400).json({ error: "FEN string is required" });
  }

  try {
    const bestMove = await getBestMove(fen, 12);
    res.json({ bestMove });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Test route
app.get('/api/hello', (req, res) => {
  res.json({ message: "Hello from backend" });
});

// Auth routes
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
