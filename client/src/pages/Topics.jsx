import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllTopics } from "../utils/api";

const LEVEL_ORDER = ["Easy", "Medium", "Hard"];

function initials(name) {
  return (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAllTopics();
        setTopics(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error fetching topics:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const groups = useMemo(() => {
    const map = new Map();
    for (const t of topics) {
      const key = (t.name || "Misc").trim();
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(t);
    }
    return [...map.entries()]
      .map(([name, items]) => {
        const counts = { Easy: 0, Medium: 0, Hard: 0 };
        for (const i of items) {
          if (counts[i.difficulty] !== undefined) counts[i.difficulty]++;
        }
        return { name, items, total: items.length, counts };
      })
      .filter((g) => g.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => b.total - a.total);
  }, [topics, query]);

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-center mb-2">Explore Topics</h1>
        <p className="text-gray-400 text-center mb-6">
          {topics.length} problems across {groups.length} topics
        </p>
        <div className="max-w-md mx-auto mb-8">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics..."
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-200"
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-400">Loading topics...</p>
        ) : groups.length === 0 ? (
          <p className="text-center text-gray-400">No topics found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((g) => (
              <Link
                key={g.name}
                to={`/topics/${g.name.toLowerCase()}s`}
                className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-750 border border-gray-800 hover:border-teal-600"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-teal-600 flex items-center justify-center text-lg font-bold text-white shrink-0">
                    {initials(g.name)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{g.name}</h2>
                    <p className="text-gray-400 text-sm">
                      {g.total} problem{g.total !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 text-sm mb-4">
                  {LEVEL_ORDER.map((lv) => (
                    <span key={lv} className="text-gray-400">
                      <span
                        className={
                          lv === "Easy"
                            ? "text-green-400 font-semibold"
                            : lv === "Medium"
                            ? "text-yellow-400 font-semibold"
                            : "text-red-400 font-semibold"
                        }
                      >
                        {g.counts[lv] || 0}
                      </span>{" "}
                      {lv}
                    </span>
                  ))}
                </div>
                <span className="text-teal-400 font-semibold">
                  Start solving →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Topics;
