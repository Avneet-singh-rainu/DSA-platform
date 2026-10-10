import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../utils/apiBase";
import { topicSlug, trackSlug } from "../utils/slug";
import TrackDocs from "../components/TrackDocs";

// /topics/:track -> topics inside one track (DSA, AI, ...)
// Each topic expands in place to reveal its articles/problems.
const TrackTopics = () => {
  const { track } = useParams();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const resp = await axios.get(`${API_BASE}/api/topics`, {
          params: { track },
        });
        setTopics(Array.isArray(resp.data) ? resp.data : []);
      } catch (e) {
        console.error("Error fetching track topics:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [track]);

  const groups = useMemo(() => {
    const map = new Map();
    for (const t of topics) {
      const key = (t.name || "Misc").trim();
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(t);
    }
    return [...map.entries()]
      .map(([name, items]) => ({ name, items, total: items.length }))
      .filter((g) => g.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => b.total - a.total);
  }, [topics, query]);

  const basePath = `/topics/${trackSlug(track)}`;
  const allArticles =
    topics.length > 0 &&
    topics.every((t) => (t.kind || "problem") === "article");

  return (
    <div className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-200 min-h-screen py-8">
      <div
        className={`container mx-auto px-4 ${
          allArticles ? "" : "max-w-3xl"
        }`}
      >
        <Link
          to="/topics"
          className="text-emerald-700 dark:text-emerald-400 hover:underline text-sm"
        >
          ← All tracks
        </Link>
        <h1 className="text-3xl font-bold text-center mb-2 capitalize mt-2">
          {track}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-center mb-6">
          {allArticles ? (
            <>
              {groups.length} topic{groups.length !== 1 ? "s" : ""} ·{" "}
              {topics.length} guide{topics.length !== 1 ? "s" : ""}
            </>
          ) : (
            <>
              {topics.length} problem{topics.length !== 1 ? "s" : ""} across{" "}
              {groups.length} topic{groups.length !== 1 ? "s" : ""}
            </>
          )}
        </p>
        {!allArticles && (
          <div className="max-w-md mx-auto mb-6">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search topics..."
              className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        )}

        {loading ? (
          <p className="text-center text-slate-500 dark:text-slate-400">
            Loading topics...
          </p>
        ) : groups.length === 0 ? (
          <p className="text-center text-slate-500 dark:text-slate-400 py-6">
            No topics yet — check back soon.
          </p>
        ) : allArticles ? (
          <TrackDocs groups={groups} />
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
            {groups.map((g) => (
              <Link
                key={g.name}
                to={`${basePath}/${topicSlug(g.name)}`}
                className="flex items-center gap-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-900 px-2 rounded"
              >
                <span className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {g.name.slice(0, 2).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{g.name}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    {g.total} item{g.total !== 1 ? "s" : ""}
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

export default TrackTopics;
