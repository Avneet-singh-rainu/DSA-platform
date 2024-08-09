import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { topics } from "../constants/topics";
import { motion } from "framer-motion";

// Home Component
const Home = () => {
    const [user, setUser] = useState(() => {
        if(sessionStorage.getItem("user")){
            return sessionStorage.getItem("user");
        }
        else{
            return " ";
        }
    });

    useEffect(() => {
        const handleStorageChange = () => {
            setUser(sessionStorage.getItem("user"));
        };
        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    // Variants for animations
    const containerVariants = {
        hidden: { opacity: 0, x: "-100vw" },
        visible: {
            opacity: 1,
            x: 0,
            transition: { type: "spring", delay: 0.5 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    };

    const listVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    return (
        <motion.div
            className="w-full "
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="sm:mx-56 sm:w-3/4 bg-gray-900 text-gray-200 min-h-screen relative">
                {/* Hero Section */}
                <motion.section
                    className="bg-gray-800 py-20 rounded-xl"
                    variants={itemVariants}
                >
                    <div className="container mx-auto px-4 text-center">
                        <motion.h1
                            className="text-4xl md:text-6xl font-bold mb-4 text-teal-400"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            Master Data Structures & Algorithms
                        </motion.h1>
                        <motion.p
                            className="text-lg md:text-xl mb-6"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            Improve your coding skills and land your dream job.
                        </motion.p>
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Link
                                to="/login"
                                className="bg-teal-500 hover:bg-teal-400 text-white font-bold py-3 px-6 rounded-full transition duration-300"
                            >
                                Get Started
                            </Link>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Features Section */}
                <motion.section className="py-16 " variants={itemVariants}>
                    <div className="container mx-auto px-4">
                        <motion.h2
                            className="text-3xl font-bold text-center mb-8 text-teal-400"
                            variants={itemVariants}
                        >
                            Features
                        </motion.h2>
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"
                            variants={listVariants}
                        >
                            <motion.div
                                className="bg-gray-800 p-6 rounded-lg text-center hover:shadow-lg transition duration-300"
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                            >
                                <h3 className="text-xl font-bold mb-2">
                                    Interactive Lessons
                                </h3>
                                <p className="text-gray-400">
                                    Learn DSA through hands-on, interactive
                                    lessons that engage you.
                                </p>
                            </motion.div>
                            <motion.div
                                className="bg-gray-800 p-6 rounded-lg text-center hover:shadow-lg transition duration-300"
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                            >
                                <h3 className="text-xl font-bold mb-2">
                                    Practice Problems
                                </h3>
                                <p className="text-gray-400">
                                    Solve hundreds of problems with instant
                                    feedback and solutions.
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Topics Section */}
                <motion.section className="bg-gray-800 py-16  rounded-xl">
                    <div className="container mx-auto px-16">
                        <motion.h2
                            className="text-3xl font-bold text-center mb-8 text-teal-400"
                            variants={itemVariants}
                        >
                            Hot Topics
                        </motion.h2>
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8"
                            variants={listVariants}
                        >
                            {topics.map((topic, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-gray-700 p-6 rounded-lg text-center hover:bg-teal-600 hover:shadow-lg transition duration-300"
                                >
                                    <Link to={topic.path}>
                                        <h3 className="text-xl font-bold mb-2">
                                            {topic.name}
                                        </h3>
                                        <p className="text-gray-400">
                                            {topic.desc}
                                        </p>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.section>

                {/* Testimonials Section */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: false, amount: 0.2 }}
                >
                    <motion.section className="py-16">
                        <div className="container mx-auto px-4">
                            <motion.h2
                                className="text-3xl font-bold text-center mb-8 text-teal-400"
                                variants={itemVariants}
                            >
                                Testimonials
                            </motion.h2>
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                                variants={listVariants}
                            >
                                <motion.div
                                    className="bg-gray-800 p-6 rounded-lg hover:shadow-lg transition duration-300"
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <p className="text-gray-400 italic mb-4">
                                        "This platform has transformed my
                                        understanding of algorithms. The
                                        interactive lessons make learning so
                                        engaging!"
                                    </p>
                                    <h4 className="text-lg font-bold text-teal-400">
                                        John Doe
                                    </h4>
                                    <p className="text-gray-500">
                                        Software Engineer
                                    </p>
                                </motion.div>
                                <motion.div
                                    className="bg-gray-800 p-6 rounded-lg hover:shadow-lg transition duration-300"
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <p className="text-gray-400 italic mb-4">
                                        "The variety of problems and contests
                                        keep me motivated. It's the best way to
                                        prepare for interviews."
                                    </p>
                                    <h4 className="text-lg font-bold text-teal-400">
                                        Jane Smith
                                    </h4>
                                    <p className="text-gray-500">
                                        Data Scientist
                                    </p>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.section>
                </motion.div>
                {/* Blog Section */}
                <motion.section className="bg-gray-800 py-16">
                    <div className="container mx-auto px-16">
                        <motion.h2
                            className="text-3xl font-bold text-center mb-8 text-teal-400"
                            variants={itemVariants}
                        >
                            Latest Articles
                        </motion.h2>
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-3 gap-8"
                            variants={listVariants}
                        >
                            <motion.div
                                className="bg-gray-700 p-6 rounded-lg hover:shadow-lg transition duration-300"
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                            >
                                <h3 className="text-xl font-bold mb-2">
                                    Understanding Recursion
                                </h3>
                                <p className="text-gray-400 mb-4">
                                    Explore the concept of recursion with
                                    practical examples and problems.
                                </p>
                                <Link
                                    to="/blog/recursion"
                                    className="text-teal-400 hover:underline"
                                >
                                    Read More
                                </Link>
                            </motion.div>
                            <motion.div
                                className="bg-gray-700 p-6 rounded-lg hover:shadow-lg transition duration-300"
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                            >
                                <h3 className="text-xl font-bold mb-2">
                                    Optimizing Algorithms
                                </h3>
                                <p className="text-gray-400 mb-4">
                                    Learn techniques to optimize algorithms for
                                    better performance.
                                </p>
                                <Link
                                    to="/blog/optimization"
                                    className="text-teal-400 hover:underline"
                                >
                                    Read More
                                </Link>
                            </motion.div>
                            <motion.div
                                className="bg-gray-700 p-6 rounded-lg hover:shadow-lg transition duration-300"
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                            >
                                <h3 className="text-xl font-bold mb-2">
                                    Graph Theory Basics
                                </h3>
                                <p className="text-gray-400 mb-4">
                                    A beginner's guide to understanding graph
                                    theory and its applications.
                                </p>
                                <Link
                                    to="/blog/graph-theory"
                                    className="text-teal-400 hover:underline"
                                >
                                    Read More
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Footer */}
                <motion.footer
                    className="bg-gray-800 py-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="container mx-auto px-4 text-center">
                        <p className="text-gray-400">
                            &copy; 2024 EatCode. All rights reserved.
                        </p>
                        <div className="flex justify-center space-x-4 mt-4">
                            <Link
                                to="/privacy"
                                className="text-teal-400 hover:underline"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                to="/terms"
                                className="text-teal-400 hover:underline"
                            >
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </motion.footer>
            </div>
        </motion.div>
    );
};

export default Home;
