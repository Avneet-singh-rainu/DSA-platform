import React, { useState, useEffect } from "react";
import { questionsData } from "../constants/questionsData";
import { useSelector } from "react-redux";

const Dropper = ({ isDown, filteredData, setIsDown }) => {
    const state = useSelector((state) => state?.userSlice?.data);
    const [user, setUser] = useState(state||null);

    const handleCompletion = (i) => {
        const changes = { ...questionsData[i], isCompleted: true };
    };

    useEffect(() => {
        setUser(state);
    }, [user]);

    return (
        <div className="p-4 relative w-full">
            <span
                className="w-full fixed z-20 left-48 top-12 md:top-28 md:left-28 cursor-pointer text-lg font-bold mb-4 flex items-center"
                onClick={() => {
                    setIsDown(!isDown);
                }}
            >
                <div className="w-20px h-20px bg-slate-500 rounded-xl">
                    <svg
                        viewBox="0 0 1024 1024"
                        fill="currentColor"
                        height="1em"
                        width="1em"
                    >
                        <path d="M862 465.3h-81c-4.6 0-9 2-12.1 5.5L550 723.1V160c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v563.1L255.1 470.8c-3-3.5-7.4-5.5-12.1-5.5h-81c-6.8 0-10.5 8.1-6 13.2L487.9 861a31.96 31.96 0 0048.3 0L868 478.5c4.5-5.2.8-13.2-6-13.2z" />
                    </svg>
                </div>
            </span>
            {/* Dropdown Content */}
            <div className="w-full bg-black md:max-w-1400 fixed z-20">
                <div
                    className={`absolute w-[90vw] md:w-[73vw] top-0 -left-3 md:left-3 bg-gray-800 md:p-4 p-2 rounded-lg shadow-lg transition-transform duration-300 ${
                        isDown ? "block" : "hidden"
                    }`}
                    style={{
                        zIndex: 10,
                        maxHeight: "50vh",
                        overflowY: "scroll",
                    }}
                >
                    {filteredData.map((v, k) => (
                        /**name of the problem */
                        <div
                            key={k}
                            className="md:p-4 px-1 md:px-12 bg-gray-700 grid grid-cols-2 md:grid-cols-3 hover:bg-gray-600 gap-2 rounded mb-2"
                        >
                            <h1 className="text-sm md:text-xl">
                                {k + 1}. {v.title}
                            </h1>

                            {/** tags */}

                            <div className="flex flex-col md:flex-row md:gap-2">
                                {v.tags.map((tags, i) => (
                                    <h4 key={i} className="text-xs md:text-xl">
                                        {tags},
                                    </h4>
                                ))}
                            </div>

                            {/** difficulty */}
                            <span
                                className={`${
                                    v.difficulty === "Easy"
                                        ? "text-green-400"
                                        : v.difficulty === "Medium"
                                        ? "text-yellow-400"
                                        : "text-red-500"
                                } font-semibold text-xs md:text-xl`}
                            >
                                {v.difficulty}
                            </span>

                            {/**Status completed or not */}
                            <h2>
                                <span
                                    onClick={() => {
                                        handleCompletion(k);
                                    }}
                                    className={`${
                                        user?.completed?.some(
                                            (item) => item.questionId == v._id
                                        )
                                            ? "text-green-400"
                                            : "text-red-500"
                                    } cursor-pointer text-xs md:text-xl`}
                                >
                                    {user?.completed?.some(
                                        (item) => item.questionId == v._id
                                    )
                                        ? "Completed"
                                        : "Not Completed"}
                                </span>
                            </h2>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dropper;
