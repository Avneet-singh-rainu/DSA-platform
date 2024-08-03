import React, { useState } from "react";
import UserDashboard from "../components/DashBoard";
import { useSelector } from "react-redux";

const DashBoard = () => {
  const user = JSON.parse(sessionStorage.getItem("user")) || null;

  const [userData, setUserData] = useState({
    name: user?.name || "John Doe",
    email: user?.email || "john.doe@example.com",
    bio:
      user?.bio ||
      "I am a software developer with a passion for creating innovative solutions.",
    location: user?.location || "New York, USA",
    profilePicture:
      user?.profilePicture ||
      "https://tse3.mm.bing.net/th?id=OIP.hXZi-2Lc_OPdbDXIR_MSNQHaHa&pid=Api&P=0&h=220",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save the changes to a server
    console.log("User Data Saved:", userData);
  };

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full p-8 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          Profile
        </h1>
        <div className="flex flex-col items-center mb-8">
          <img
            src={userData.profilePicture}
            alt="Profile"
            className="w-32 h-32 rounded-full mb-4"
          />
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
        <div className="space-y-6">
          <div>
            <label
              className="block text-sm font-medium text-gray-400 mb-1"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full p-3 rounded-lg bg-gray-700 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isEditing ? "focus:ring-2" : "bg-gray-600 cursor-not-allowed"
              }`}
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-400 mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full p-3 rounded-lg bg-gray-700 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isEditing ? "focus:ring-2" : "bg-gray-600 cursor-not-allowed"
              }`}
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-400 mb-1"
              htmlFor="location"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={userData.location}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full p-3 rounded-lg bg-gray-700 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isEditing ? "focus:ring-2" : "bg-gray-600 cursor-not-allowed"
              }`}
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-400 mb-1"
              htmlFor="bio"
            >
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={userData.bio}
              onChange={handleChange}
              readOnly={!isEditing}
              rows="3"
              className={`w-full p-3 rounded-lg bg-gray-700 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isEditing ? "focus:ring-2" : "bg-gray-600 cursor-not-allowed"
              }`}
            ></textarea>
          </div>
          {isEditing && (
            <button
              onClick={handleSave}
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>

      <UserDashboard />
    </div>
  );
};

export default DashBoard;
