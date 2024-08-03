import {topicsData} from '../constants/topicsData'
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Topics = () => {
  const [topics, setTopics] = useState([]);

  // Fetch topics data
  useEffect(() => {
    // Simulate an API call
    const fetchTopics = async () => {
      try {
        // Assume we fetched data from an API
        setTopics(topicsData);
      } catch (error) {
        console.error("Error fetching topics data:", error);
      }
    };

    fetchTopics();
  }, []);

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Explore Topics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="bg-gray-800 p-6 rounded-lg shadow-lg transition-transform transform hover:-translate-y-1"
            >
              <img
                src={topic.image}
                alt={topic.name}
                className="w-full h-32 object-cover rounded-t-lg mb-4"
              />
              <h2 className="text-2xl font-bold mb-2">{topic.name}</h2>
              <p className="text-gray-400 mb-4">{topic.description}</p>
              <Link
                to={topic.link}
                className="text-teal-500 hover:text-teal-400 font-bold"
              >
                Learn More
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Topics;
