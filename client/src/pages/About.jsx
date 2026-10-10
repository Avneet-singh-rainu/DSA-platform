import React from "react";
import { Link } from "react-router-dom";

const STEPS = [
  {
    n: "01",
    title: "Pick a topic",
    text: "Arrays, Strings, and more — each with a curated problem list and difficulty badges.",
    to: "/topics",
    cta: "Browse topics",
  },
  {
    n: "02",
    title: "Solve in the editor",
    text: "Read examples, watch the linked walkthrough, then run Java against custom input.",
    to: "/topics/arrays",
    cta: "Try a problem",
  },
  {
    n: "03",
    title: "Track progress",
    text: "Mark solves, save bookmarks, and watch your streak and activity grow on your profile.",
    to: "/profile",
    cta: "See your dashboard",
  },
];

const About = () => {
  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen">
      <div className="w-full px-4 py-10">
        {/* Hero */}
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-widest text-teal-400 mb-2">
            About EatCode
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Practice DSA the way interviews test it.
          </h1>
          <p className="text-gray-400 mt-3 leading-relaxed">
            EatCode is a focused Data Structures & Algorithms practice app:
            short problem statements, concrete examples, video walkthroughs,
            and an in-browser Java editor — with your solves, bookmarks, and
            streaks tracked per account.
          </p>
          <div className="flex gap-3 mt-6">
            <Link
              to="/topics"
              className="bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold py-2 px-5 rounded-lg"
            >
              Start practicing
            </Link>
            <Link
              to="/signup"
              className="bg-gray-800 hover:bg-gray-700 text-sm font-semibold py-2 px-5 rounded-lg"
            >
              Create account
            </Link>
          </div>
        </div>

        {/* How it works */}
        <h2 className="text-xl font-bold mt-12 mb-4">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STEPS.map((s) => (
            <div key={s.n} className="bg-gray-800 rounded-xl p-5">
              <p className="text-teal-400 font-bold text-sm">{s.n}</p>
              <h3 className="font-semibold text-lg mt-1">{s.title}</h3>
              <p className="text-sm text-gray-400 mt-2">{s.text}</p>
              <Link
                to={s.to}
                className="text-teal-400 hover:underline text-sm mt-3 inline-block"
              >
                {s.cta} →
              </Link>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default About;
