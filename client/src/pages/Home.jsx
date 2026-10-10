import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchAllTopics, fetchTracks } from "../utils/api";
import fetchUserByid from "../utils/fetchUserById";
import { topicSlug, trackSlug } from "../utils/slug";

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

function difficultyColor(d) {
  if (d === "Easy") return "text-emerald-600 dark:text-emerald-400";
  if (d === "Medium") return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
}

// Home: bold hero + personal continue band + live tracks.
const Home = () => {
  const [tracks, setTracks] = useState([]);
  const [topics, setTopics] = useState([]);
  const [completedIds, setCompletedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const stored = getStoredUser();
  const uid = stored?._id || stored?.id;

  useEffect(() => {
    const load = async () => {
      try {
        const [tr, tp] = await Promise.all([fetchTracks(), fetchAllTopics()]);
        if (Array.isArray(tr)) setTracks(tr);
        if (Array.isArray(tp)) setTopics(tp);
        if (uid) {
          const u = await fetchUserByid(uid).catch(() => null);
          if (u) setCompletedIds(new Set((u.completed || []).map((c) => c.questionId)));
        }
      } catch (e) {
        console.error("Error fetching home data:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  const topicCount = useMemo(() => {
    return new Set(topics.map((t) => (t.name || "Misc").trim())).size;
  }, [topics]);

  const upNext = useMemo(
    () => topics.find((t) => !completedIds.has(t._id || t.id)) || null,
    [topics, completedIds]
  );

  const solved = completedIds.size;
  const rate = topics.length > 0 ? Math.round((solved / topics.length) * 100) : 0;

  const openTopic = (t) => {
    navigate(
      `/topics/${trackSlug(t.track)}/${topicSlug(t.name)}/${t._id || t.id}`,
      { state: { data: t } }
    );
  };

  return (
    <div className="w-full">
      <div className="w-full max-w-4xl mx-auto bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-200 min-h-screen px-4">
        {/* Hero */}
        <section className="pt-16 pb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400 mb-4">
            DSA · AI · Hands-on
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            Learn by{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-400 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
              solving
            </span>
            ,<br />
            not just reading.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mt-5 mb-8">
            {loading
              ? "Loading content..."
              : `${topics.length} problems · ${topicCount} topics · ${tracks.length} tracks and growing.`}
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/topics"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-7 rounded-full"
            >
              Start solving
            </Link>
            {!uid && (
              <Link
                to="/signup"
                className="py-3 px-7 rounded-full font-bold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                Create account
              </Link>
            )}
          </div>
        </section>

        {/* Continue band */}
        {!loading && upNext && (
          <section className="mb-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 p-5 flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                {solved > 0 ? "Pick up where you left off" : "Start here"}
              </p>
              <button
                onClick={() => openTopic(upNext)}
                className="text-lg font-bold text-left hover:underline truncate block w-full"
              >
                {upNext.title}
              </button>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {upNext.track} · {upNext.name}
                {upNext.kind !== "article" && (
                  <>
                    {" · "}
                    <span className={difficultyColor(upNext.difficulty)}>
                      {upNext.difficulty}
                    </span>
                  </>
                )}
              </p>
              {uid && (
                <div className="mt-2 h-1.5 rounded-full bg-emerald-200/60 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${rate}%` }}
                  />
                </div>
              )}
            </div>
            <button
              onClick={() => openTopic(upNext)}
              className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-6 rounded-full"
            >
              {upNext.kind === "article" ? "Read →" : "Solve →"}
            </button>
          </section>
        )}

        {/* Tracks */}
        <section className="pb-10">
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
