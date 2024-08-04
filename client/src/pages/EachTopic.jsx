import React, { useEffect, useState, Suspense, lazy } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Dropper from "../components/Dropper";
import fetchTopicsbyName from "../utils/fetchTopicsByName";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser, updateBookmarks } from "../store/userSlice";
import axios from "axios";

const EachTopic = () => {
  const selector = useSelector((state) => state);
  const [user, setUser] = useState(
    selector.userSlice.data || JSON.parse(sessionStorage.getItem("user")) || []
  );
  const dispatch = useDispatch();
  const location = useLocation();
  const topicName = location.pathname.split("/").pop();
  const navigate = useNavigate();
  const [isDown, setIsDown] = useState(false);
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState(user.bookmarks || []);

  const fetchDatas = async () => {
    setLoading(true);
    try {
      const res = await fetchTopicsbyName(topicName);
      setFetchData(res.data);
    } catch (error) {
      console.error("Failed to fetch topics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatas();
  }, [topicName, bookmarks]);

  const toggleBookmark = async (index) => {
    const isBookmarked = bookmarks.includes(index);
    const previousBookmarks = [...bookmarks];
    setBookmarks((prev) => {
      if (isBookmarked) {
        return prev.filter((id) => id !== index);
      } else {
        return [...prev, index];
      }
    });

    try {
      const response = await axios.post(
        `http://localhost:5000/user/${user._id}/${index}`
      );
      let updatedUser = { ...user };
      if (isBookmarked) {
        updatedUser.bookmarks = updatedUser.bookmarks.filter(
          (id) => id !== index
        );
      } else {
        updatedUser.bookmarks.push(index);
      }
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
      dispatch(updateBookmarks(updatedUser.bookmarks));
    } catch (error) {
      console.error("Error toggling bookmark:", error.message);

      // Revert to the previous state if the API call fails
      setBookmarks(previousBookmarks);
      alert("Failed to update bookmarks. Please try again.");
    }
  };

  const toggleCompletion = (index) => {
    console.log(user.completed.includes(index));
  };

  const handleCodeEditor = (topic) => {
    navigate(`/topics/${topic.name}/${topic._id}`, { state: { data: topic } });
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 text-gray-200">
      <div className="mx-8 lg:mx-56 relative">
        <Dropper
          isDown={isDown}
          filteredData={fetchData}
          setIsDown={setIsDown}
        />
        {/* Main Content */}
        <div className="flex-grow py-8 space-y-8 max-w-full">
          {fetchData.length > 0 ? (
            <Suspense
              fallback={<div className="text-gray-400">Loading...</div>}
            >
              {fetchData.map((t, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-6 lg:p-8 rounded-lg shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  {/* Question Section */}
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-6">
                      <h1 className="text-2xl lg:text-3xl font-bold">
                        {t.title}
                      </h1>
                      <div className="flex space-x-4">
                        <span className="text-sky-400">
                          <a
                            href={t.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-sky-300 transition-colors"
                          >
                            Problem Link
                          </a>
                        </span>
                        {/* Bookmark Button */}
                        <button
                          onClick={() => toggleBookmark(t._id)}
                          className={`${
                            bookmarks.includes(t._id)
                              ? "text-yellow-400"
                              : "text-gray-400"
                          } transition-colors hover:text-yellow-300`}
                          title={
                            bookmarks.includes(t._id)
                              ? "Remove Bookmark"
                              : "Add Bookmark"
                          }
                        >
                          {bookmarks.includes(t._id) ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 3v18l7-5 7 5V3H5z"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 3h14a2 2 0 012 2v16l-7-5-7 5V5a2 2 0 012-2z"
                              />
                            </svg>
                          )}
                        </button>

                        {/* Complete/Not Complete Button */}
                        <button
                          onClick={() => toggleCompletion(t._id)}
                          className={`${
                            user?.completed?.includes(t._id)
                              ? "text-green-400"
                              : "text-gray-400"
                          } transition-colors hover:text-green-300`}
                          title={
                            user?.completed?.includes(t._id)
                              ? "Mark as Not Complete"
                              : "Mark as Complete"
                          }
                        >
                          {user?.completed?.includes(t._id) ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 12l9 9 9-9-9-9-9 9z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-lg mb-4 leading-relaxed">{t.desc}</p>
                    <p className="text-sm text-gray-400 mb-4">
                      Difficulty:{" "}
                      <span
                        className={`${
                          t.difficulty === "Easy"
                            ? "text-green-400"
                            : t.difficulty === "Medium"
                            ? "text-yellow-400"
                            : "text-red-400"
                        } font-semibold`}
                      >
                        {t.difficulty}
                      </span>
                    </p>
                    <div>
                      <h3 className="text-md font-bold mb-2">Examples:</h3>
                      {t.examples.map((ex, idx) => (
                        <div
                          key={idx}
                          className="mb-4 p-4 bg-gray-700 rounded-lg text-gray-300"
                        >
                          <p>
                            <span className="font-semibold">Input:</span>{" "}
                            {ex.input}
                          </p>
                          <p>
                            <span className="font-semibold">Output:</span>{" "}
                            {ex.output}
                          </p>
                          <p>
                            <span className="font-semibold">Explanation:</span>{" "}
                            {ex.explanation}
                          </p>
                        </div>
                      ))}
                      <div
                        className="cursor-pointer mt-2 inline-block bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded transition-colors"
                        onClick={() => handleCodeEditor(t)}
                      >
                        Code Editor
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Suspense>
          ) : loading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : (
            <div className="text-center text-red-400">
              No topics found. Please try again later.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EachTopic;
