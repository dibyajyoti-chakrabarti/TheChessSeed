import { Link } from "react-router-dom";
import "./App.css";

function Home() {
  const handlePlay = () => {
    console.log("Play vs AI button clicked");
    // TODO: Add navigation/game logic later
  };

  return (
    <div className="h-[89vh] w-[100vw] text-white flex flex-col justify-center items-center gap-[50px]">
      <h1 className="text-4xl font-extrabold">Welcome to Chess Platform</h1>
      <button onClick={handlePlay} className="default-btn text-7xl">
        Play vs AI
      </button>
    </div>
  );
}

export default Home;
