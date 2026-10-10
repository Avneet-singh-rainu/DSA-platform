import React, { useMemo, useState } from "react";

const PAGE_SIZE = 12;

function difficultyColor(d) {
  if (d === "Easy") return "text-emerald-600 dark:text-emerald-400";
  if (d === "Medium") return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
}

const ProblemTable = ({
  problems,
  bookmarks,
  completed,
  onToggleBookmark,
  onToggleCompletion,
  onSolve,
}) => {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return (problems || []).filter((t) => {
      const id = t._id || t.id;
      if (query && !t.title.toLowerCase().includes(query.toLowerCase()))
        return false;
      if (level !== "All" && t.difficulty !== level) return false;
      const done = completed.includes(id);
      const marked = bookmarks.includes(id);
      if (status === "Solved" && !done) return false;
      if (status === "Unsolved" && done) return false;
      if (status === "Bookmarked" && !marked) return false;
      return true;
    });
  }, [problems, query, level, status, bookmarks, completed]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const setFilter = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  const selectClass =
    "px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-sm";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg overflow-hidden">
      {/* Toolbar */}
      <div className="px-3 py-2.5 flex flex-col md:flex-row gap-2 md:items-center border-b border-slate-200 dark:border-slate-700">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search problems..."
          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
        />
        <div className="flex gap-2">
          <select
            value={level}
            onChange={setFilter(setLevel)}
            className={selectClass}
          >
            <option>All</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          <select
            value={status}
            onChange={setFilter(setStatus)}
            className={selectClass}
          >
            <option>All</option>
            <option>Solved</option>
            <option>Unsolved</option>
            <option>Bookmarked</option>
          </select>
        </div>
      </div>

      {/* Header */}
      <div className="hidden md:grid grid-cols-[2.5rem_1fr_6rem_9rem_5rem] gap-2 px-3 py-1.5 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
        <span>#</span>
        <span>Title</span>
        <span>Difficulty</span>
        <span>Status</span>
        <span className="text-right">Action</span>
      </div>

      {/* Rows */}
      {pageItems.length === 0 ? (
        <p className="p-6 text-center text-slate-500 dark:text-slate-400">
          No problems match your filters.
        </p>
      ) : (
        pageItems.map((t, i) => {
          const id = t._id || t.id;
          const isArticle = (t.kind || "problem") === "article";
          const done = completed.includes(id);
          const marked = bookmarks.includes(id);
          const num = (safePage - 1) * PAGE_SIZE + i + 1;
          return (
            <div
              key={id}
              className="grid grid-cols-1 md:grid-cols-[2.5rem_1fr_6rem_9rem_5rem] gap-1 md:gap-2 px-3 py-2 border-b border-slate-200 dark:border-slate-700 items-center"
            >
              <span className="text-slate-400 dark:text-slate-500 text-sm">
                {num}
              </span>
              <div className="min-w-0">
                <button
                  onClick={() => onSolve(t)}
                  className="text-sm font-medium text-left hover:text-emerald-600 dark:hover:text-emerald-300 truncate block w-full"
                >
                  {t.title}
                </button>
                <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                  {(t.tags || []).slice(0, 3).join(" · ")}
                </div>
              </div>
              <span
                className={`${difficultyColor(t.difficulty)} font-medium text-sm`}
              >
                {isArticle ? "Guide" : t.difficulty}
              </span>
              <div className="flex gap-1.5">
                {!isArticle && (
                  <button
                    onClick={() => onToggleCompletion(id)}
                    title={done ? "Mark as unsolved" : "Mark as solved"}
                    className={`text-xs px-2 py-0.5 rounded border ${
                      done
                        ? "text-emerald-600 border-emerald-500 dark:text-emerald-400 dark:border-emerald-600"
                        : "text-slate-500 border-slate-300 hover:text-emerald-600 dark:text-slate-400 dark:border-slate-600 dark:hover:text-emerald-300"
                    }`}
                  >
                    {done ? "Solved" : "Todo"}
                  </button>
                )}
                <button
                  onClick={() => onToggleBookmark(id)}
                  title={marked ? "Remove bookmark" : "Bookmark"}
                  className={`text-xs px-2 py-0.5 rounded border ${
                    marked
                      ? "text-amber-600 border-amber-500 dark:text-yellow-400 dark:border-yellow-600"
                      : "text-slate-500 border-slate-300 hover:text-amber-600 dark:text-slate-400 dark:border-slate-600 dark:hover:text-yellow-300"
                  }`}
                >
                  {marked ? "Saved" : "Save"}
                </button>
              </div>
              <div className="md:text-right">
                <button
                  onClick={() => onSolve(t)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm py-1 px-3 rounded"
                >
                  {isArticle ? "Read" : "Solve"}
                </button>
              </div>
            </div>
          );
        })
      )}

      {/* Pagination */}
      <div className="px-3 py-2.5 flex items-center justify-between text-sm">
        <span className="text-slate-500 dark:text-slate-400">
          {filtered.length} problem{filtered.length !== 1 ? "s" : ""} · page{" "}
          {safePage}/{totalPages}
        </span>
        <div className="flex gap-2">
          <button
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 rounded bg-slate-200 disabled:opacity-40 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            Prev
          </button>
          {[...Array(totalPages).keys()].slice(0, 5).map((k) => (
            <button
              key={k}
              onClick={() => setPage(k + 1)}
              className={`px-3 py-1 rounded ${
                safePage === k + 1
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
              }`}
            >
              {k + 1}
            </button>
          ))}
          <button
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 rounded bg-slate-200 disabled:opacity-40 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProblemTable;
