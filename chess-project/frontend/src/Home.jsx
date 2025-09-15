import { Link } from "react-router-dom";
import './App.css'

function Home() {
  const handlePlay = () => {
    console.log("Play vs AI button clicked");
    // TODO: Add navigation/game logic later
  };

  return (
    <div className="h-[100vh] w-[100vw] bg-black flex justify-center items-center">
      <div className="h-[300px] w-[500px] bg-white flex flex-col justify-center items-center gap-[50px]">
        <h1 className="text-4xl font-extrabold">Welcome to Chess Platform</h1>
        <button
          onClick={handlePlay}
          className="default-btn text-7xl"
        >
          Play vs AI
        </button>
      </div>
    </div>
  );
}

export default Home;
