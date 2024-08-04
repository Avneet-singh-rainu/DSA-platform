import React, { useEffect } from "react";
import { Line } from "react-chartjs-2"; // You can use any chart library
import { Chart as ChartJS, registerables } from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../store/userSlice";

ChartJS.register(...registerables);

const UserDashboard = () => {
  const dispatch = useDispatch();
  const user = JSON.parse(sessionStorage.getItem("user"))||null;

  const fetchUserData = async () => {
    const resp = await dispatch(fetchUser());
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Example data
  const totalQuestions = 150;
                const solvedQuestions = user?.completed.length;
  const avgDifficulty = "Medium";
  const recentQuestions = [
    { title: "Two Sum", difficulty: "Easy" },
    {
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
    },
    { title: "Binary Tree Maximum Path Sum", difficulty: "Hard" },
  ];
  const solvedPerWeek = [5, 8, 10, 15, 18, 20, 22];

  const data = {
    labels: [
      "Week 1",
      "Week 2",
      "Week 3",
      "Week 4",
      "Week 5",
      "Week 6",
      "Week 7",
    ],
    datasets: [
      {
        label: "Questions Solved",
        data: solvedPerWeek,
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">User Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Cards */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Total Questions</h2>
          <p className="text-3xl font-bold">{totalQuestions}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Solved Questions</h2>
          <p className="text-3xl font-bold">{solvedQuestions}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Average Difficulty</h2>
          <p className="text-3xl font-bold">{avgDifficulty}</p>
        </div>

        {/* Chart */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">
              Questions Solved Per Week
            </h2>
            <Line data={data} options={options} />
          </div>
        </div>

        {/* Recent Questions */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">
            Recent Questions Solved
          </h2>
          <ul className="space-y-4">
            {recentQuestions.map((question, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{question.title}</span>
                <span
                  className={`font-semibold ${
                    question.difficulty === "Easy"
                      ? "text-green-400"
                      : question.difficulty === "Medium"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {question.difficulty}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
