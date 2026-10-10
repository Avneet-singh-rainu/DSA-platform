import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import fetchUserByid from "../utils/fetchUserById";
import { fetchAllTopics, API_THIS_MONTH_QUESTIONS } from "../utils/api";
import { useTheme } from "../hooks/useTheme";

ChartJS.register(...registerables);

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

function dayKey(d) {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;
}

function intensityColor(n) {
  if (!n) return "bg-slate-200 dark:bg-slate-700";
  if (n === 1) return "bg-emerald-200 dark:bg-emerald-900";
  if (n === 2) return "bg-emerald-400 dark:bg-emerald-600";
  return "bg-emerald-500 dark:bg-emerald-400";
}

function difficultyColor(d) {
  if (d === "Easy") return "text-emerald-600 dark:text-emerald-400";
  if (d === "Medium") return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [topicsData, setTopicsData] = useState([]);
  const [solvedPerDay, setSolvedPerDay] = useState([]);
  const [loading, setLoading] = useState(true);
  const stored = getStoredUser();
  const uid = stored?._id || stored?.id;

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const [u, topics, perMonth] = await Promise.all([
          fetchUserByid(uid),
          fetchAllTopics(),
          API_THIS_MONTH_QUESTIONS(uid).catch(() => null),
        ]);
        if (u) setUserData(u);
        if (Array.isArray(topics)) setTopicsData(topics);
        if (perMonth?.solvedPerDay) setSolvedPerDay(perMonth.solvedPerDay);
      } catch (e) {
        console.error("Dashboard load failed:", e);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  const topicById = useMemo(() => {
    const m = new Map();
    for (const t of topicsData) m.set(t._id || t.id, t);
    return m;
  }, [topicsData]);

  const completed = userData?.completed || [];
  const completedIds = useMemo(
    () => new Set(completed.map((c) => c.questionId)),
    [completed]
  );
  const solved = completedIds.size;
  const total = topicsData.length;
  const rate = total > 0 ? Math.round((solved / total) * 100) : 0;

  const streak = useMemo(() => {
    const days = new Set(completed.map((c) => dayKey(c.completedAt)));
    let s = 0;
    const d = new Date();
    if (!days.has(dayKey(d))) d.setDate(d.getDate() - 1);
    while (days.has(dayKey(d))) {
      s++;
      d.setDate(d.getDate() - 1);
    }
    return s;
  }, [completed]);

  const diffSplit = useMemo(() => {
    const split = { Easy: { solved: 0, total: 0 }, Medium: { solved: 0, total: 0 }, Hard: { solved: 0, total: 0 } };
    for (const t of topicsData) {
      const d = t.difficulty;
      if (!split[d]) continue;
      split[d].total++;
      if (completedIds.has(t._id || t.id)) split[d].solved++;
    }
    return split;
  }, [topicsData, completedIds]);

  const recent = useMemo(() => {
    return [...completed]
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, 5)
      .map((c) => ({ ...c, topic: topicById.get(c.questionId) }));
  }, [completed, topicById]);

  const saved = useMemo(() => {
    return (userData?.bookmarks || [])
      .map((id) => topicById.get(id))
      .filter(Boolean)
      .slice(0, 5);
  }, [userData, topicById]);

  const upNext = useMemo(
    () => topicsData.find((t) => !completedIds.has(t._id || t.id)) || null,
    [topicsData, completedIds]
  );

  const monthName = new Date().toLocaleString("default", { month: "long" });
  const thisMonth = solvedPerDay.reduce((a, b) => a + (b || 0), 0);
  const firstName = (userData?.name || stored?.name || "coder").split("@")[0];

  const { isDark } = useTheme();

  const chartData = {
    labels: solvedPerDay.map((_, i) => `${i + 1}`),
    datasets: [
      {
        label: "Solved",
        data: solvedPerDay,
        fill: true,
        backgroundColor: "rgba(45, 212, 191, 0.12)",
        borderColor: "rgb(45, 212, 191)",
        tension: 0.35,
        pointRadius: 0,
      },
    ],
  };

  const gridColor = isDark
    ? "rgba(55, 65, 81, 0.4)"
    : "rgba(203, 213, 225, 0.8)";
  const tickColor = isDark ? "#9ca3af" : "#64748b";

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        ticks: { color: tickColor, maxTicksLimit: 10 },
        grid: { color: gridColor },
      },
      y: {
        beginAtZero: true,
        ticks: { color: tickColor, precision: 0 },
        grid: { color: gridColor },
      },
    },
  };

  const openTopic = (t) => {
    navigate(
      `/topics/${trackSlug(t.track)}/${topicSlug(t.name)}/${t._id || t.id}`,
      { state: { data: t } }
    );
  };

  if (!uid) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center">
        <p className="text-slate-600 dark:text-slate-300 mb-4">Log in to see your dashboard.</p>
        <Link
          to="/login"
          className="text-emerald-700 dark:text-emerald-400 hover:underline"
        >
          Go to login →
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center text-slate-500 dark:text-slate-400">
        Loading your progress...
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      {/* Greeting + streak */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">
            {greeting()}, {firstName}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {solved === 0
              ? "Solve your first problem to start your streak."
              : `${solved} of ${total} problems solved — keep going.`}
          </p>
        </div>
        <div
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            streak > 0
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
              : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
          }`}
        >
          {streak > 0 ? `🔥 ${streak}-day streak` : "No streak yet"}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Solved", value: solved, sub: `of ${total} problems` },
          { label: "Completion", value: `${rate}%`, sub: "overall progress" },
          {
            label: "Saved",
            value: userData?.bookmarks?.length || 0,
            sub: "bookmarked",
          },
          {
            label: "This month",
            value: thisMonth,
            sub: `solved in ${monthName}`,
          },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {s.label}
            </p>
            <p className="text-3xl font-bold mt-1">{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Progress + up next */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold mb-1">Mastery by difficulty</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Share of solved problems per level
          </p>
          <div className="space-y-4">
            {["Easy", "Medium", "Hard"].map((lv) => {
              const s = diffSplit[lv];
              const pct =
                s.total > 0 ? Math.round((s.solved / s.total) * 100) : 0;
              return (
                <div key={lv}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className={`font-semibold ${difficultyColor(lv)}`}>
                      {lv}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {s.solved}/{s.total} · {pct}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        lv === "Easy"
                          ? "bg-emerald-500 dark:bg-emerald-400"
                          : lv === "Medium"
                          ? "bg-amber-500 dark:bg-amber-400"
                          : "bg-rose-500 dark:bg-rose-400"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Up next
            </p>
            {upNext ? (
              <>
                <h3 className="text-lg font-bold mt-2">{upNext.title}</h3>
                <p className={`text-sm font-semibold mt-1 ${difficultyColor(upNext.difficulty)}`}>
                  {upNext.difficulty}
                  <span className="text-slate-500 dark:text-slate-400 font-normal">
                    {" "}
                    · {upNext.name}
                  </span>
                </p>
              </>
            ) : (
              <h3 className="text-lg font-bold mt-2">
                Everything solved 🎉
              </h3>
            )}
          </div>
          {upNext ? (
            <button
              onClick={() => openTopic(upNext)}
              className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg text-sm"
            >
              Solve now →
            </button>
          ) : (
            <Link
              to="/topics"
              className="mt-4 text-center bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 font-semibold py-2 px-4 rounded-lg text-sm"
            >
              Browse topics
            </Link>
          )}
        </div>
      </div>

      {/* Activity */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
        <div className="flex items-baseline justify-between mb-4">
          <h3 className="font-semibold">Activity · {monthName}</h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {thisMonth} solved this month
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {solvedPerDay.map((n, i) => (
            <div
              key={i}
              title={`Day ${i + 1}: ${n || 0} solved`}
              className={`w-7 h-7 rounded-md flex items-center justify-center text-[10px] ${
                n ? "text-emerald-950 dark:text-emerald-100" : "text-slate-400 dark:text-slate-500"
              } ${intensityColor(n)}`}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <div className="h-72">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Recent + saved */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold mb-3">Recently solved</h3>
          {recent.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Nothing yet — your solves will appear here.
            </p>
          ) : (
            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
              {recent.map((r) => (
                <li key={r.id || r.questionId} className="py-2.5 flex items-center justify-between gap-2">
                  <button
                    onClick={() => r.topic && openTopic(r.topic)}
                    className="text-sm text-left hover:text-emerald-700 dark:hover:text-emerald-300 truncate"
                  >
                    {r.topic?.title || r.questionId}
                  </button>
                  {r.topic?.difficulty && (
                    <span className={`shrink-0 text-xs font-semibold ${difficultyColor(r.topic.difficulty)}`}>
                      {r.topic.difficulty}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold mb-3">Saved for later</h3>
          {saved.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No bookmarks — tap Save on any problem to park it here.
            </p>
          ) : (
            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
              {saved.map((t) => (
                <li key={t._id || t.id} className="py-2.5 flex items-center justify-between gap-2">
                  <button
                    onClick={() => openTopic(t)}
                    className="text-sm text-left hover:text-emerald-700 dark:hover:text-emerald-300 truncate"
                  >
                    {t.title}
                  </button>
                  {t.difficulty && (
                    <span className={`shrink-0 text-xs font-semibold ${difficultyColor(t.difficulty)}`}>
                      {t.difficulty}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
