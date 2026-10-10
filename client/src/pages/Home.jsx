import React from "react";
import { Link } from "react-router-dom";
import { topics } from "../constants/topics";

// Home Component - clean, no entrance/scale animations
const Home = () => {
  return (
    <div className="w-full">
      <div className="sm:mx-56 sm:w-3/4 bg-gray-900 text-gray-200 min-h-screen relative">
        {/* Hero Section */}
        <section className="bg-gray-800 py-20 rounded-xl">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-teal-400">
              Master Data Structures & Algorithms
            </h1>
            <p className="text-lg md:text-xl mb-6">
              Improve your coding skills and land your dream job.
            </p>
            <div>
              <Link
                to="/login"
                className="bg-teal-500 hover:bg-teal-400 text-white font-bold py-3 px-6 rounded-full"
              >
                Get Started
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8 text-teal-400">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-800 p-6 rounded-lg text-center">
                <h3 className="text-xl font-bold mb-2">Interactive Lessons</h3>
                <p className="text-gray-400">
                  Learn DSA through hands-on, interactive lessons that engage
                  you.
                </p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg text-center">
                <h3 className="text-xl font-bold mb-2">Practice Problems</h3>
                <p className="text-gray-400">
                  Solve hundreds of problems with instant feedback and
                  solutions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Topics Section */}
        <section className="bg-gray-800 py-16 rounded-xl">
          <div className="container mx-auto px-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-teal-400">
              Hot Topics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {topics.map((topic, index) => (
                <div
                  key={index}
                  className="bg-gray-700 p-6 rounded-lg text-center hover:bg-teal-600"
                >
                  <Link to={topic.path}>
                    <h3 className="text-xl font-bold mb-2">{topic.name}</h3>
                    <p className="text-gray-400">{topic.desc}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8 text-teal-400">
              Testimonials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-800 p-6 rounded-lg">
                <p className="text-gray-400 italic mb-4">
                  &quot;This platform has transformed my understanding of
                  algorithms. The interactive lessons make learning so
                  engaging!&quot;
                </p>
                <h4 className="text-lg font-bold text-teal-400">John Doe</h4>
                <p className="text-gray-500">Software Engineer</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <p className="text-gray-400 italic mb-4">
                  &quot;The variety of problems and contests keep me motivated.
                  It&apos;s the best way to prepare for interviews.&quot;
                </p>
                <h4 className="text-lg font-bold text-teal-400">Jane Smith</h4>
                <p className="text-gray-500">Data Scientist</p>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="bg-gray-800 py-16">
          <div className="container mx-auto px-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-teal-400">
              Latest Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">
                  Understanding Recursion
                </h3>
                <p className="text-gray-400 mb-4">
                  Explore the concept of recursion with practical examples and
                  problems.
                </p>
                <Link
                  to="/blog/recursion"
                  className="text-teal-400 hover:underline"
                >
                  Read More
                </Link>
              </div>
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">
                  Optimizing Algorithms
                </h3>
                <p className="text-gray-400 mb-4">
                  Learn techniques to optimize algorithms for better
                  performance.
                </p>
                <Link
                  to="/blog/optimization"
                  className="text-teal-400 hover:underline"
                >
                  Read More
                </Link>
              </div>
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Graph Theory Basics</h3>
                <p className="text-gray-400 mb-4">
                  A beginner&apos;s guide to understanding graph theory and its
                  applications.
                </p>
                <Link
                  to="/blog/graph-theory"
                  className="text-teal-400 hover:underline"
                >
                  Read More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 py-6">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-400">
              &copy; 2024 EatCode. All rights reserved.
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              <Link to="/privacy" className="text-teal-400 hover:underline">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-teal-400 hover:underline">
                Terms of Service
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
