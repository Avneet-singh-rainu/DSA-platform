import React from "react";
import { Link } from "react-router-dom";
import UserDashboard from "../components/DashBoard";

function getStoredUser() {
  try {
    const raw = sessionStorage.getItem("user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed[0] : parsed;
  } catch {
    return null;
  }
}

function initials(name) {
  return (name || "?")
    .split(/[@\s._-]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const Profile = () => {
  const user = getStoredUser();

  if (!user) {
    return (
      <div className="bg-gray-900 text-gray-200 min-h-screen flex items-center justify-center px-4">
        <div className="bg-gray-800 p-8 rounded-xl text-center max-w-sm w-full">
          <h1 className="text-2xl font-bold mb-2">Profile</h1>
          <p className="text-gray-400 mb-6">
            Log in to see your profile and progress.
          </p>
          <Link
            to="/login"
            className="bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Log in
          </Link>
        </div>
      </div>
    );
  }

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("default", {
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen px-4 py-6">
      <div className="w-full space-y-5">
        {/* Identity banner */}
        <div className="bg-gray-800 rounded-xl p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-teal-600 flex items-center justify-center text-xl font-bold text-white shrink-0">
            {initials(user.name)}
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold truncate">{user.name}</h1>
            <p className="text-xs text-gray-400">
              {memberSince ? `Member since ${memberSince}` : "EatCode member"}
            </p>
          </div>
          <Link
            to="/topics"
            className="ml-auto shrink-0 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold py-2 px-4 rounded-lg"
          >
            Keep solving
          </Link>
        </div>

        <UserDashboard />
      </div>
    </div>
  );
};

export default Profile;
