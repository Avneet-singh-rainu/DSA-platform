import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTracks } from "../utils/api";

// /topics -> track overview (DSA, AI, ...). Generic, backend-driven.
const Topics = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchTracks();
        setTracks(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error fetching tracks:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = tracks.filter((t) =>
    t.track.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-200 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-2">Explore</h1>
        <p className="text-slate-500 dark:text-slate-400 text-center mb-6">
          {tracks.reduce((a, t) => a + t.problems, 0)} problems across{" "}
          {tracks.length} track{tracks.length !== 1 ? "s" : ""}
        </p>
        <div className="max-w-md mx-auto mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tracks..."
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {loading ? (
          <p className="text-center text-slate-500 dark:text-slate-400">
            Loading...
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-slate-500 dark:text-slate-400 py-6">
            No tracks yet — check back soon.
          </p>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
            {filtered.map((t) => (
              <Link
                key={t.track}
                to={`/topics/${t.track.toLowerCase()}`}
                className="flex items-center gap-4 py-4 hover:bg-slate-100 dark:hover:bg-slate-900 px-2 rounded"
              >
                <span className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {t.track.slice(0, 2).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-lg">{t.track}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    {t.topics} topic{t.topics !== 1 ? "s" : ""} · {t.problems}{" "}
                    problem{t.problems !== 1 ? "s" : ""}
                  </span>
                </span>
                <span className="text-slate-400 dark:text-slate-500 shrink-0">
                  →
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
