import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log('Signup successful:', data.msg);
        navigate('/login'); // Redirect to login page on success
      } else {
        console.error('Signup failed:', data.msg);
        // TODO: Show an error message to the user
      }
    } catch (err) {
      console.error('An error occurred:', err);
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] bg-black flex justify-center items-center">
      <div className="h-[400px] w-[500px] bg-white flex flex-col justify-center items-center gap-[50px]">
        <h2 className="text-4xl font-extrabold">Sign Up</h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-2"
        >
          <label className="text-2xl font-bold">
            Username:
            <input
              className="border-solid border-2"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>

          <label className="text-2xl font-bold">
            Email:
            <input
              className="border-solid border-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="text-2xl font-bold">
            Password:
            <input
              className="border-solid border-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="default-btn">
            Sign Up
          </button>
        </form>

        <p>
          Already have an account?{" "}
          <Link to="/login" className="font-bold underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
