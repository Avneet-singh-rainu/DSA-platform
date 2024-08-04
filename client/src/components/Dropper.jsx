import React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { questionsData } from "../constants/questionsData";
import { useSelector } from "react-redux";

const Dropper = ({ isDown, filteredData, setIsDown }) => {
  const user = useSelector((state) => state.userSlice.data);

    const handleCompletion = (i) => {
    const changes = { ...questionsData[i], isCompleted: true };
  };
  return (
    <div className="w-64 p-4 relative ">
      <span
        className="fixed  top-28 left-28 cursor-pointer text-lg font-bold mb-4 flex items-cente"
        onClick={() => {
          setIsDown(!isDown);
        }}
      >
        <svg
          viewBox="0 0 1024 1024"
          fill="currentColor"
          height="1em"
          width="1em"
        >
          <path d="M862 465.3h-81c-4.6 0-9 2-12.1 5.5L550 723.1V160c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v563.1L255.1 470.8c-3-3.5-7.4-5.5-12.1-5.5h-81c-6.8 0-10.5 8.1-6 13.2L487.9 861a31.96 31.96 0 0048.3 0L868 478.5c4.5-5.2.8-13.2-6-13.2z" />
        </svg>
      </span>
      {/* Dropdown Content */}
      <div className="max-w-1400 fixed z-20">
        <div
          className={`absolute top-0 left-0 bg-gray-800 p-4 rounded-lg shadow-lg transition-transform duration-300 ${
            isDown ? "block" : "hidden"
          }`}
          style={{
            zIndex: 10,
            width: "73vw",
            maxHeight: "50vh",
            overflowY: "scroll",
          }}
        >
          {filteredData.map((v, k) => (
            /**name of the problem */
            <div
              key={k}
              className="p-4 px-12 bg-gray-700 grid grid-cols-3 hover:bg-gray-600 rounded mb-2"
            >
              <h1 className="text-xl">
                {k + 1}. {v.title}
              </h1>

              {/** tags */}

              <div className="flex gap-2 ">
                {v.tags.map((tags, i) => (
                  <h4>{tags},</h4>
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
                } font-semibold`}
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
                    user?.completed?.includes(v._id)
                      ? "text-green-400"
                      : "text-red-500"
                  } cursor-pointer`}
                >
                  {user?.completed?.includes(v._id)
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
