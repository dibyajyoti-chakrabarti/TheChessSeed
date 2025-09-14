import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token); // Save token
        console.log('Login successful!');
        navigate('/'); // Redirect to home page on success
      } else {
        console.error('Login failed:', data.msg);
        // TODO: Show an error message to the user
      }
    } catch (err) {
      console.error('An error occurred:', err);
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] bg-black flex justify-center items-center">
      <div className="h-[300px] w-[600px] bg-white flex flex-col justify-center items-center gap-[50px]">
        <h2 className="text-4xl font-extrabold">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
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

          <button className="default-btn" type="submit">Log In</button>
        </form>

        <p>
          Don't have an account? <Link to="/signup" className="font-bold underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
