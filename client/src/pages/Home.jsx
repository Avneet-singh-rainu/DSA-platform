import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchAllTopics, fetchTracks } from "../utils/api";

function difficultyColor(d) {
  if (d === "Easy") return "text-emerald-600 dark:text-emerald-400";
  if (d === "Medium") return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
}

// Home: hero + live stats, tracks, sample problems. No fake content.
const Home = () => {
  const [tracks, setTracks] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [tr, tp] = await Promise.all([fetchTracks(), fetchAllTopics()]);
        if (Array.isArray(tr)) setTracks(tr);
        if (Array.isArray(tp)) setTopics(tp);
      } catch (e) {
        console.error("Error fetching home data:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const topicCount = useMemo(() => {
    const s = new Set(topics.map((t) => (t.name || "Misc").trim()));
    return s.size;
  }, [topics]);

  const sample = useMemo(() => {
    const seen = new Set();
    const out = [];
    for (const t of topics) {
      const key = t.name || "";
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(t);
      if (out.length >= 6) break;
    }
    return out;
  }, [topics]);

  const openTopic = (t) => {
    const trackSlug = (t.track || "DSA").toLowerCase();
    const topicSlug = `${(t.name || "misc").toLowerCase()}s`;
    navigate(`/topics/${trackSlug}/${topicSlug}/${t._id || t.id}`, {
      state: { data: t },
    });
  };

  return (
    <div className="w-full">
      <div className="w-full max-w-3xl mx-auto bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-200 min-h-screen px-4">
        {/* Hero */}
        <section className="py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-emerald-700 dark:text-emerald-400">
            Master Skills Through Practice
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            DSA, AI, and more — learn by solving, not just reading.
          </p>
          <Link
            to="/topics"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-full"
          >
            Start solving
          </Link>
        </section>

        {/* Live stats */}
        <section className="flex justify-center gap-8 py-4 border-y border-slate-200 dark:border-slate-800 mb-8">
          {[
            { v: loading ? "…" : topics.length, l: "Problems" },
            { v: loading ? "…" : topicCount, l: "Topics" },
            { v: loading ? "…" : tracks.length, l: "Tracks" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <p className="text-2xl font-bold">{s.v}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{s.l}</p>
            </div>
          ))}
        </section>

        {/* Tracks */}
        <section className="pb-8">
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="text-xl font-bold">Tracks</h2>
            <Link
              to="/topics"
              className="text-sm text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              View all →
            </Link>
          </div>
          {loading ? (
            <p className="text-slate-500 dark:text-slate-400 py-6 text-center">
              Loading tracks...
            </p>
          ) : tracks.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 py-6 text-center">
              No tracks yet — check back soon.
            </p>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
              {tracks.map((t) => (
                <Link
                  key={t.track}
                  to={`/topics/${t.track.toLowerCase()}`}
                  className="flex items-center gap-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-900 px-2 rounded"
                >
                  <span className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                    {t.track.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{t.track}</span>
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
        </section>

        {/* Sample problems */}
        {!loading && sample.length > 0 && (
          <section className="pb-8">
            <h2 className="text-xl font-bold mb-2">Try a problem</h2>
            <div className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
              {sample.map((t) => {
                const id = t._id || t.id;
                return (
                  <div key={id} className="flex items-center gap-3 py-2.5 px-2">
                    <button
                      onClick={() => openTopic(t)}
                      className="flex-1 min-w-0 text-left hover:text-emerald-700 dark:hover:text-emerald-300"
                    >
                      <span className="block text-sm font-medium truncate">
                        {t.title}
                      </span>
                      <span className="block text-xs text-slate-500 dark:text-slate-400">
                        {t.track} · {t.name}
                      </span>
                    </button>
                    <span
                      className={`text-xs font-semibold shrink-0 ${difficultyColor(
                        t.difficulty
                      )}`}
                    >
                      {t.difficulty}
                    </span>
                    <button
                      onClick={() => openTopic(t)}
                      className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white text-xs py-1 px-3 rounded"
                    >
                      Solve
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* How it works */}
        <section className="pb-8">
          <h2 className="text-xl font-bold mb-3">How it works</h2>
          <ol className="space-y-3">
            {[
              ["1", "Pick a track and topic", "DSA today, AI tomorrow — content grows over time."],
              ["2", "Solve in the editor", "Examples, video walkthroughs, and runnable Java."],
              ["3", "Track progress", "Solves, bookmarks, and streaks on your profile."],
            ].map(([n, title, text]) => (
              <li key={n} className="flex gap-3">
                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-sm shrink-0">
                  {n}.
                </span>
                <div>
                  <p className="font-semibold text-sm">{title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <footer className="py-6 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; 2024 EatCode. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
