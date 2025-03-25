import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-yellow-600 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-5xl font-bold mb-4 text-center tracking-tight">🎟️ Box Seat</h1>
      <p className="text-xl mb-6 text-center max-w-xl">
        Your premium dashboard for managing streaming favorites, tracking new releases, and getting smart recommendations — all in one seat.
      </p>
      <div className="flex gap-4">
        <Link to="/login" className="bg-white text-blue-900 font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-100">
          Log In
        </Link>
        <Link to="/signup" className="bg-white text-yellow-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-yellow-100">
          Sign Up
        </Link>
      </div>
      <footer className="mt-10 text-sm text-white/80 text-center">
        © {new Date().getFullYear()} Box Seat. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
