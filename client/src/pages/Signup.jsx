import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
//import { signupUser } from "../store/userSlice"; // Replace with your signup action

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5000/user`, { name: email });
            navigate("/login"); // Redirect to login page after successful signup
        } catch (err) {
            setError("Failed to sign up. Please try again.");
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gray-900 text-gray-200">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md transform transition-transform duration-500 hover:scale-105">
                <h2 className="text-3xl font-bold mb-6 text-teal-400 animate-fade-in">
                    Sign Up
                </h2>
                {error && <p className="text-red-400 mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">
                            Email
                        </label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="text-black w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
                            required
                        />
                    </div>
                    {/* <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="text-black w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
                            required
                        />
                    </div> */}
                    {/* <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="text-black w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
                            required
                        />
                    </div> */}
                    <button
                        type="submit"
                        className="w-full bg-teal-500 hover:bg-teal-400 text-white font-bold py-2 px-4 rounded-full transition duration-300 transform hover:scale-105"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-400">
                    Already have an account?{" "}
                    <Link to="/login" className="text-teal-400 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
