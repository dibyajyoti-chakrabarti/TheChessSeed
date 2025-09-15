import { Link } from "react-router-dom";
import "./App.css";

function Home() {

  return (
    <div className="h-[89vh] w-[100vw] text-white flex flex-col justify-center items-center gap-[50px]">
      <h1 className="text-4xl font-extrabold">Welcome to Chess Platform</h1>
      <Link
          to="/play"
          className="default-btn w-40 text-center"
        >
          Play vs AI
        </Link>
    </div>
  );
}

export default Home;
