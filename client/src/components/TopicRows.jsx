import React from "react";
import { Link } from "react-router-dom";
import { topicSlug } from "../utils/slug";

export function levelClass(lv) {
  if (lv === "Easy") return "text-emerald-600 dark:text-emerald-400";
  if (lv === "Medium") return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
}

function initials(name) {
  return (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// Clean row list, no cards. groups: [{ name, total, counts }]
// basePath prefixes topic links, e.g. "/topics" or "/topics/dsa"
const TopicRows = ({ groups, basePath = "/topics" }) => {
  if (!groups || groups.length === 0) {
    return (
      <p className="text-center text-slate-500 dark:text-slate-400 py-6">
        No topics yet.
      </p>
    );
  }
  return (
    <div className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
      {groups.map((g) => (
        <Link
          key={g.name}
          to={`${basePath}/${topicSlug(g.name)}`}
          className="flex items-center gap-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-900 px-2 rounded"
        >
          <span className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
            {initials(g.name)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold truncate">{g.name}</span>
            <span className="block text-xs text-slate-500 dark:text-slate-400">
              {g.total} problem{g.total !== 1 ? "s" : ""} ·{" "}
              <span className={levelClass("Easy")}>{g.counts.Easy || 0} Easy</span>
              {" · "}
              <span className={levelClass("Medium")}>{g.counts.Medium || 0} Med</span>
              {" · "}
              <span className={levelClass("Hard")}>{g.counts.Hard || 0} Hard</span>
            </span>
          </span>
          <span className="text-slate-400 dark:text-slate-500 shrink-0">→</span>
        </Link>
      ))}
    </div>
  );
};

export default TopicRows;
