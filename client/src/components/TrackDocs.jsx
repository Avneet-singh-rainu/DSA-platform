import React, { useMemo, useState } from "react";
import ArticleView from "./ArticleView";

// Docs layout for article tracks: narrow topic sidebar left, article right.
// groups: [{ name, items: [{...article}] }]
const TrackDocs = ({ groups }) => {
  const all = useMemo(
    () => (groups || []).flatMap((g) => g.items.map((a) => ({ ...a, group: g.name }))),
    [groups]
  );
  const [selectedId, setSelectedId] = useState(null);
  const selected =
    all.find((a) => (a._id || a.id) === selectedId) || all[0] || null;

  if (!selected) {
    return (
      <p className="text-center text-slate-500 dark:text-slate-400 py-10">
        No guides yet — check back soon.
      </p>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Slim sidebar */}
      <aside className="w-full lg:w-60 shrink-0 lg:sticky lg:top-[4.5rem] lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
        <div className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
          {groups.map((g) => (
            <div key={g.name} className="py-2">
              <p className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                {g.name}
              </p>
              {g.items.map((a, idx) => {
                const id = a._id || a.id;
                const active = (selected._id || selected.id) === id;
                const numbered = g.items.length > 1;
                return (
                  <button
                    key={id}
                    onClick={() => setSelectedId(id)}
                    className={`w-full text-left px-2 py-1.5 rounded text-sm truncate ${
                      numbered ? "pl-5" : ""
                    } ${
                      active
                        ? "text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-slate-900"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                    }`}
                  >
                    {numbered && (
                      <span className="text-slate-400 dark:text-slate-500 mr-1.5">
                        {idx + 1}.
                      </span>
                    )}
                    {a.title}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </aside>

      {/* Article */}
      <div className="flex-1 w-full min-w-0">
        <ArticleView data={selected} />
      </div>
    </div>
  );
};

export default TrackDocs;
