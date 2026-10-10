import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../utils/apiBase";
import { topicSlug, trackSlug } from "../utils/slug";
import fetchUserByid from "../utils/fetchUserById";
import TrackDocs from "../components/TrackDocs";

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

// /topics/:track -> topics with their items inline on one page.
// Article tracks render the docs layout instead.
const TrackTopics = () => {
  const { track } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(searchParams.get("q") || "");

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
      .sort((a, b) => b.total - a.total);
  }, [topics]);

  const topicNames = useMemo(() => groups.map((g) => g.name), [groups]);
  const [topicFilter, setTopicFilter] = useState(
    searchParams.get("topic") || "All"
  );
  const [levelFilter, setLevelFilter] = useState(
    searchParams.get("level") || "All"
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "All"
  );
  const [bookmarks, setBookmarks] = useState([]);
  const [completedIds, setCompletedIds] = useState(new Set());

  // Progress for solved/saved indicators + status filter (logged-in only)
  useEffect(() => {
    const stored = getStoredUser();
    const uid = stored?._id || stored?.id;
    if (!uid) {
      setBookmarks([]);
      setCompletedIds(new Set());
      return;
    }
    fetchUserByid(uid)
      .then((u) => {
        if (!u) return;
        setBookmarks(u.bookmarks || []);
        setCompletedIds(
          new Set((u.completed || []).map((c) => c.questionId))
        );
      })
      .catch(() => {});
  }, [track]);

  const flat = useMemo(() => {
    return topics.filter((t) => {
      const id = t._id || t.id;
      if (
        query &&
        !`${t.title} ${(t.tags || []).join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
        return false;
      if (topicFilter !== "All" && (t.name || "Misc").trim() !== topicFilter)
        return false;
      if (levelFilter !== "All" && t.difficulty !== levelFilter) return false;
      const done = completedIds.has(id);
      if (statusFilter === "Solved" && !done) return false;
      if (statusFilter === "Unsolved" && done) return false;
      if (statusFilter === "Bookmarked" && !bookmarks.includes(id))
        return false;
      return true;
    });
  }, [topics, query, topicFilter, levelFilter, statusFilter, completedIds, bookmarks]);

  const PAGE_SIZE = 15;
  const [page, setPage] = useState(() => {
    const p = parseInt(searchParams.get("page") || "1", 10);
    return Number.isFinite(p) && p > 0 ? p : 1;
  });
  const totalPages = Math.max(1, Math.ceil(flat.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = flat.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Keep filters + page in the URL so back-navigation restores the list
  useEffect(() => {
    const next = {};
    if (query) next.q = query;
    if (topicFilter !== "All") next.topic = topicFilter;
    if (levelFilter !== "All") next.level = levelFilter;
    if (statusFilter !== "All") next.status = statusFilter;
    if (safePage > 1) next.page = String(safePage);
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, topicFilter, levelFilter, statusFilter, safePage]);

  const resetPage = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  const basePath = `/topics/${trackSlug(track)}`;
  const allArticles =
    topics.length > 0 &&
    topics.every((t) => (t.kind || "problem") === "article");

  const openItem = (groupName, item) => {
    const id = item._id || item.id;
    navigate(`${basePath}/${topicSlug(groupName)}/${id}`, {
      state: { data: item, from: location.search },
    });
  };

  return (
    <div className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-200 min-h-screen py-8">
      <div className={`container mx-auto px-4 ${allArticles ? "" : "max-w-3xl"}`}>
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
          <div className="flex flex-col md:flex-row gap-2 mb-4">
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search problems..."
              className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <select
              value={topicFilter}
              onChange={resetPage(setTopicFilter)}
              className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
            >
              <option value="All">All topics</option>
              {topicNames.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <select
              value={levelFilter}
              onChange={resetPage(setLevelFilter)}
              className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
            >
              <option value="All">All levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <select
              value={statusFilter}
              onChange={resetPage(setStatusFilter)}
              className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
            >
              <option value="All">All status</option>
              <option value="Solved">Solved</option>
              <option value="Unsolved">Unsolved</option>
              <option value="Bookmarked">Bookmarked</option>
            </select>
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
        ) : flat.length === 0 ? (
          <p className="text-center text-slate-500 dark:text-slate-400 py-10">
            No problems match your filters.
          </p>
        ) : (
          <>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              Showing {flat.length} of {topics.length} problems · page{" "}
              {safePage}/{totalPages}
            </p>
            <div className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
              {pageItems.map((item, i) => {
                const id = item._id || item.id;
                const gName = (item.name || "Misc").trim();
                const done = completedIds.has(id);
                const marked = bookmarks.includes(id);
                return (
                  <button
                    key={id}
                    onClick={() => openItem(gName, item)}
                    className="w-full flex items-center gap-3 py-2.5 px-2 hover:bg-slate-100 dark:hover:bg-slate-900 text-left"
                  >
                    <span
                      title={done ? "Solved" : "Unsolved"}
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        done
                          ? "bg-emerald-500"
                          : "bg-slate-300 dark:bg-slate-700"
                      }`}
                    />
                    <span className="text-slate-400 dark:text-slate-500 text-sm w-6 shrink-0">
                      {(safePage - 1) * PAGE_SIZE + i + 1}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-base font-medium truncate">
                        {item.title}
                        {marked && (
                          <span className="text-amber-500 ml-1.5">★</span>
                        )}
                      </span>
                      <span className="block text-xs text-slate-400 dark:text-slate-500 truncate">
                        {gName} · {(item.tags || []).slice(0, 3).join(" · ")}
                        {done && " · Solved"}
                      </span>
                    </span>
                    <span
                      className={`text-sm font-medium shrink-0 ${difficultyColor(
                        item.difficulty
                      )}`}
                    >
                      {item.difficulty}
                    </span>
                    <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 shrink-0">
                      Solve →
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="py-3 flex items-center justify-end gap-2 text-sm">
              <button
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded bg-slate-200 disabled:opacity-40 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                Prev
              </button>
              {[...Array(totalPages).keys()].slice(0, 7).map((k) => (
                <button
                  key={k}
                  onClick={() => setPage(k + 1)}
                  className={`px-3 py-1 rounded ${
                    safePage === k + 1
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
                  }`}
                >
                  {k + 1}
                </button>
              ))}
              <button
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 rounded bg-slate-200 disabled:opacity-40 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TrackTopics;
