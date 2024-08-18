// Navbar.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../store/userSlice";
import { motion } from "framer-motion";

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
        <motion.nav
            initial={{ opacity: 0, x: "-100vw" }}
            animate={{
                opacity: 1,
                x: 0,
                transitionDuration: 0.5,
                transitionBehavior: "revert-layer",
            }}
            className={`md:w-full md:relative md:bg-gray-80 p-4 z-20  ${
                isOpen ? "bg-gray-900" : ""
            }`}
        >
            <div className=" md:relative container mx-auto flex justify-between items-center">
                <div className="text-teal-200 text-lg font-bold">
                    <Link
                        to="/"
                        className="flex gap-4 justify-center items-center"
                    >
                        <div
                            className={`w-8 h-8 rounded-2xl overflow-hidden ${
                                isOpen ? "absolute" : ""
                            } top-4 left-4 `}
                        >
                            <img src="/eatcode.jpeg" alt="eatcode" />
                        </div>
                        <h1
                            className={`${
                                isOpen ? "absolute" : ""
                            } top-4 left-16 `}
                        >
                            EatCode
                        </h1>
                    </Link>
                </div>
                <div
                    className={` md:flex ${
                        isOpen ? "block" : "hidden"
                    } w-full md:w-auto`}
                >
                    <ul
                        className={`flex flex-col md:flex-row items-center ${
                            isOpen ? "flex gap-6 " : ""
                        }`}
                    >
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
                        className={`text-teal-200 top-0 right-0 focus:outline-none ${
                            isOpen ? "absolute -top-36" : " "
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
        </motion.nav>
    );
};

export default Navbar;
