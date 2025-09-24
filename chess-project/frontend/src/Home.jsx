// frontend/src/components/Home.jsx

import { Link } from "react-router-dom";
import "./App.css";

function Home() {
  return (
    <div className="h-[89vh] w-[100vw] text-white flex flex-col justify-center items-center gap-[20px]">
      <h1 className="text-4xl font-extrabold mb-10">Watch Chess Grow!</h1>
      
      <Link
        to="/play"
        className="default-btn w-60 text-center"
      >
        Play vs AI
      </Link>

      <Link
        to="/multiplayer" // 👈 This now links to your new page
        className="default-btn w-60 text-center bg-green-600 hover:bg-green-700"
      >
        Play a Friend
      </Link>
    </div>
  );
}

export default Home;