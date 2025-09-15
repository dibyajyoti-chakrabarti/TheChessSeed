import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Side: App Name/Logo */}
        <Link to="/" className="text-xl font-bold hover:text-gray-300">
          TheChessSeed
        </Link>

        {/* Right Side: User Info or Login/Signup Links */}
        <div className="flex items-center space-x-4">
          {user ? (
            // If user is logged in
            <>
              <span className="font-medium">Welcome, {user.username}</span>
              <button 
                onClick={logout} 
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            // If user is not logged in
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/signup" className="hover:text-gray-300">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;