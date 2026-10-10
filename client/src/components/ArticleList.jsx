import React from "react";

// Editorial list for article-kind content (guides). No problem grid.
const ArticleList = ({ items, onOpen }) => {
  if (!items || items.length === 0) {
    return (
      <p className="text-center text-slate-500 dark:text-slate-400 py-10">
        No guides yet — check back soon.
      </p>
    );
  }
  return (
    <div className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
      {items.map((a, i) => {
        const id = a._id || a.id;
        return (
          <button
            key={id}
            onClick={() => onOpen(a)}
            className="w-full text-left py-5 px-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded group"
          >
            <p className="text-xs font-semibold tracking-widest text-emerald-700 dark:text-emerald-400 uppercase">
              {String(i + 1).padStart(2, "0")} · Guide
            </p>
            <h3 className="text-xl font-bold mt-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
              {a.title}
            </h3>
            {a.desc && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {a.desc}
              </p>
            )}
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
              {(a.tags || []).join(" · ")}
              {(a.tags || []).length > 0 && "  →  "}
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                Read
              </span>
            </p>
          </button>
        );
      })}
    </div>
  );
};

export default ArticleList;
