import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../utils/authApi";
import { API_BASE } from "../utils/apiBase";

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

function Bar({ value, max }) {
  return (
    <div className="flex-1 min-w-0 bg-slate-100 dark:bg-slate-800 rounded h-24 flex items-end overflow-hidden">
      <div
        className="w-full bg-emerald-500/80 rounded-t"
        style={{ height: `${max > 0 ? Math.max(4, (value / max) * 100) : 4}%` }}
        title={String(value)}
      />
    </div>
  );
}

// Admin-only visit stats. No cookies, no third parties — data from /api/visits.
const Stats = () => {
  const reduxUser = useSelector((s) => s.userSlice.data);
  const me = reduxUser || getStoredUser();
  const isAdmin = me?.role === "admin";

  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    api
      .get(`${API_BASE}/api/visits/stats?days=${days}`)
      .then((r) => setData(r.data))
      .catch(() => setError("Failed to load stats."))
      .finally(() => setLoading(false));
  }, [isAdmin, days]);

  if (!me) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link to="/login" className="text-emerald-600 hover:underline">
          Log in first →
        </Link>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Admin only</h1>
          <p className="text-slate-500">This page is not for you.</p>
        </div>
      </div>
    );
  }

  const perDay = data?.perDay || [];
  const maxViews = Math.max(1, ...perDay.map((d) => d.views));
  const totalSignups = (data?.signups || []).reduce((s, d) => s + d.signups, 0);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">
          Admin · <Link to="/admin" className="hover:underline">Content</Link> / Stats
        </h1>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="text-sm px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {loading && <p className="text-slate-500">Loading stats…</p>}
      {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}

      {data && (
        <>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              ["Views", data.totals?.views ?? 0],
              ["Visitors", data.totals?.visitors ?? 0],
              ["Signups", totalSignups],
            ].map(([label, value]) => (
              <div
                key={label}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4"
              >
                <p className="text-xs uppercase tracking-wider text-slate-400">{label}</p>
                <p className="text-3xl font-bold">{value}</p>
              </div>
            ))}
          </div>

          <h2 className="font-semibold mb-2">Views per day</h2>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 mb-6">
            <div className="flex items-end gap-1">
              {perDay.map((d) => (
                <Bar key={d.day} value={d.views} max={maxViews} />
              ))}
            </div>
            {perDay.length > 0 && (
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>{perDay[0].day}</span>
                <span>{perDay[perDay.length - 1].day}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="font-semibold mb-2">Top pages</h2>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg divide-y divide-slate-100 dark:divide-slate-800">
                {(data.topPaths || []).map((p) => (
                  <div key={p.path} className="flex items-center justify-between px-4 py-2 text-sm">
                    <span className="truncate mr-3">{p.path}</span>
                    <span className="text-slate-500 shrink-0">
                      {p.views} views · {p.visitors} visitors
                    </span>
                  </div>
                ))}
                {(data.topPaths || []).length === 0 && (
                  <p className="px-4 py-3 text-sm text-slate-500">No data yet.</p>
                )}
              </div>
            </div>
            <div>
              <h2 className="font-semibold mb-2">Top tracks</h2>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg divide-y divide-slate-100 dark:divide-slate-800">
                {(data.topTracks || []).map((t) => (
                  <div key={t.track} className="flex items-center justify-between px-4 py-2 text-sm">
                    <span className="truncate mr-3">{t.track || "(home)"}</span>
                    <span className="text-slate-500 shrink-0">
                      {t.views} views · {t.visitors} visitors
                    </span>
                  </div>
                ))}
                {(data.topTracks || []).length === 0 && (
                  <p className="px-4 py-3 text-sm text-slate-500">No data yet.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Stats;
