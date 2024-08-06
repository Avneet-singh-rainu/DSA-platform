// Navbar.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../store/userSlice";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const user = useSelector((state) => state.userSlice);
    const [isLoggedIn, setIsLoggedIn] = useState(
        user.isLoggedIn || sessionStorage.getItem("isLoggedIn")
    );
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    const handleLogOut = () => {
        setIsLoggedIn(false);
        dispatch(logOut());
        navigate("/");
    };

    

    return (
        <nav className="w-full  md:relative bg-gray-800 p-4 ">
            <div className="relative container mx-auto flex justify-between items-center">
                <div className="text-teal-200 text-lg font-bold">
                    <Link
                        to="/"
                        className="flex gap-4 justify-center items-center relative"
                    >
                        <div
                            className={`w-8 h-8 rounded-2xl overflow-hidden ${
                                isOpen ? "absolute" : ""
                            } -top-20 left-0 `}
                        >
                            <img src="/public/eatcode.jpeg" alt="icon" />
                        </div>
                        <h1
                            className={`${
                                isOpen ? "absolute" : ""
                            } -top-20 left-12 `}
                        >
                            EatCode
                        </h1>
                    </Link>
                </div>
                <div
                    className={`md:flex ${
                        isOpen ? "block " : "hidden"
                    } w-full md:w-auto`}
                >
                    <ul className="flex flex-col md:flex-row items-center">
                        <li className="mt-2 md:mt-0 md:ml-6">
                            <Link
                                to="/"
                                className="text-teal-200 hover:text-teal-400"
                            >
                                Home
                            </Link>
                        </li>
                        <li className="mt-2 md:mt-0 md:ml-6">
                            <Link
                                to="/about"
                                className="text-teal-200 hover:text-teal-400"
                            >
                                About
                            </Link>
                        </li>
                        <li className="mt-2 md:mt-0 md:ml-6">
                            <Link
                                to="/topics"
                                className="text-teal-200 hover:text-teal-400"
                            >
                                Topics
                            </Link>
                        </li>
                        <li className="mt-2 md:mt-0 md:ml-6">
                            <Link
                                to="/contact"
                                className="text-teal-200 hover:text-teal-400"
                            >
                                Contact
                            </Link>
                        </li>
                        <li className="mt-2 md:mt-0 md:ml-6">
                            <Link
                                to="/profile"
                                className="text-teal-200 hover:text-teal-400"
                            >
                                Profile
                            </Link>
                        </li>
                        <li className="mt-2 md:mt-0 md:ml-6">
                            {isLoggedIn && (
                                <button onClick={handleLogOut}>logout</button>
                            )}
                        </li>
                    </ul>
                </div>
                <div className={`md:hidden relative`}>
                    <button
                        onClick={toggleNavbar}
                        className={`text-teal-200 -top-20 right-0 focus:outline-none ${
                            isOpen ? "absolute" : " "
                        }`}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                            ></path>
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
