import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../store/userSlice";
import fetchUserByid from "../utils/fetchUserById";
import { fetchAllTopics, API_THIS_MONTH_QUESTIONS } from "../utils/api";
ChartJS.register(...registerables);
import { animate, motion } from "framer-motion";

const UserDashboard = () => {
    const user = JSON.parse(sessionStorage.getItem("user")) || "";
    console.log(user);
    const [userData, setUserData] = useState(null);
    const [topicsData, setTopicsData] = useState([]);
    const [recentQuestions, setRecentQuestions] = useState([]);
    const [solvedPerMonth, setSolvedPerMonth] = useState([]);
    const [mobile, setMobile] = useState(false);

    const fetchUser = async () => {
        const resp = await fetchUserByid(user?._id);
        setUserData(resp);
    };
    const API_fetchAllTopics = async () => {
        const resp = await fetchAllTopics();
        setTopicsData(resp);
    };
    const fetchSolvedPerMonth = async () => {
        const resp = await API_THIS_MONTH_QUESTIONS(user._id);
        setSolvedPerMonth(resp.solvedPerDay);
    };
    useEffect(() => {
        fetchUser();
        API_fetchAllTopics();
        fetchSolvedPerMonth();
    }, []);

    useEffect(() => {
        if (userData && topicsData.length > 0) {
            const data = userData.completed?.slice(-3);
            const lastThree = data.map((data) => data.questionId);
            const names = topicsData
                .map((topic) => {
                    if (lastThree.includes(topic._id)) {
                        return {
                            title: topic.title,
                            difficulty: topic.difficulty,
                        };
                    }
                    return null;
                })
                .filter(Boolean);
            setRecentQuestions(names);
        }
    }, [topicsData]);

    // Example data
    const totalQuestions = 150;
    const solvedQuestions = userData?.completed.length;
    const avgDifficulty = "Medium";

    const data = {
        labels: [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
            "21",
            "22",
            "23",
            "24",
            "25",
            "26",
            "27",
            "28",
            "29",
            "30",
            "31",
        ],
        datasets: [
            {
                label: "Questions Solved",
                data: solvedPerMonth,
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

    const cards = {
        initial: { opacity: 0, y: "120px" },
        animate: {
            opacity: 1,
            y: 0,
            transition: { duration: 1 },
        },
    };

    return (
        <div className=" min-h-screen bg-gray-900 text-gray-200 p-8">
            <h1 className=" text-4xl font-bold mb-8 text-center">
                User Dashboard
            </h1>
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Cards */}
                <motion.div
                    initial="initial"
                    whileInView="animate"
                    variants={cards}
                    className="bg-gray-800 p-6 rounded-lg shadow-lg"
                >
                    <h2 className="text-2xl font-semibold mb-4">
                        Total Questions
                    </h2>
                    <p className="text-3xl font-bold">{totalQuestions}</p>
                </motion.div>
                <motion.div
                    initial="initial"
                    whileInView="animate"
                    variants={cards}
                    className="bg-gray-800 p-6 rounded-lg shadow-lg"
                >
                    <h2 className="text-2xl font-semibold mb-4">
                        Solved Questions
                    </h2>
                    <p className="text-3xl font-bold">{solvedQuestions}</p>
                </motion.div>
                <motion.div
                    initial="initial"
                    whileInView="animate"
                    variants={cards}
                    className="bg-gray-800 p-6 rounded-lg shadow-lg"
                >
                    <h2 className="text-2xl font-semibold mb-4 ">
                        Average Difficulty
                    </h2>
                    <p
                        className={`font-semibold ${
                            avgDifficulty === "Easy"
                                ? "text-green-400"
                                : avgDifficulty === "Medium"
                                ? "text-yellow-400"
                                : "text-red-400"
                        }`}
                    >
                        {avgDifficulty}
                    </p>
                </motion.div>

                {/* Chart */}
                <motion.div
                    initial="initial"
                    whileInView="animate"
                    variants={cards}
                    whileHover={{
                        scale: 1.5,
                        x: "-300px",
                        transition: { duration: 0.5, delay: 0.5 },
                    }}
                    className="col-span-1 md:col-span-2 lg:col-span-3"
                >
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4">
                            Questions Solved Per Week
                        </h2>
                        <Line data={data} options={options} />
                    </div>
                </motion.div>

                {/* Recent Questions */}
                <motion.div
                    initial="initial"
                    whileInView="animate"
                    variants={cards}
                    className="bg-gray-800 p-6 rounded-lg shadow-lg"
                >
                    <h2 className="text-2xl font-semibold mb-4">
                        Recent Questions Solved
                    </h2>
                    <ul className="space-y-4">
                        {recentQuestions.map((question, index) => (
                            <li
                                key={index}
                                className="flex justify-between items-center"
                            >
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
                </motion.div>
            </motion.div>
        </div>
    );
};

export default UserDashboard;
