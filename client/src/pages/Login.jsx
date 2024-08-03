//!---------LOGIN>JSX

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../store/userSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resp = await dispatch(fetchUser({ email: email }));
    if (resp.payload) {
      sessionStorage.setItem("user", JSON.stringify(resp.payload[0]));
      navigate("/");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-900 text-gray-200">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm transform transition-transform duration-500 hover:scale-105">
        <h2 className="text-3xl font-bold mb-6 text-teal-400">Login</h2>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-black"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-400 text-white font-bold py-2 px-4 rounded-full transition duration-300 transform hover:scale-105"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-teal-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
