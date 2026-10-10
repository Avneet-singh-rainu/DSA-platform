import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../utils/authApi";
import { API_BASE } from "../utils/apiBase";

const EMPTY = {
  track: "DSA",
  kind: "problem",
  name: "",
  title: "",
  difficulty: "Medium",
  desc: "",
  content: "",
  tags: "",
  link: "",
  videoUrl: "",
  examples: "[]",
  exampleImages: [],
};

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

// Admin: full CRUD for problems + articles, images stored in Postgres
// (base64 data-URLs survive free hosting, unlike Render's wiped disk).
const Admin = () => {
  const navigate = useNavigate();
  const reduxUser = useSelector((s) => s.userSlice.data);
  const me = reduxUser || getStoredUser();
  const isAdmin = me?.role === "admin";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [kindFilter, setKindFilter] = useState("All");
  const [editing, setEditing] = useState(null); // null | {…form, id?}
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const resp = await api.get(`${API_BASE}/api/topics`);
      setItems(Array.isArray(resp.data) ? resp.data : []);
    } catch (e) {
      setError("Failed to load content.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const filtered = useMemo(
    () =>
      items.filter((t) => {
        if (
          query &&
          !`${t.title} ${t.name} ${t.track}`
            .toLowerCase()
            .includes(query.toLowerCase())
        )
          return false;
        if (kindFilter !== "All" && (t.kind || "problem") !== kindFilter)
          return false;
        return true;
      }),
    [items, query, kindFilter]
  );

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
          <p className="text-slate-500">
            Your account ({me.name}) is not an admin. Log out and back in if
            you were just promoted.
          </p>
        </div>
      </div>
    );
  }

  const startNew = () => {
    setError("");
    setEditing({ ...EMPTY });
  };

  const startEdit = (t) => {
    setError("");
    setEditing({
      id: t._id || t.id,
      track: t.track || "DSA",
      kind: t.kind || "problem",
      name: t.name || "",
      title: t.title || "",
      difficulty: t.difficulty || "Medium",
      desc: t.desc || "",
      content: t.content || "",
      tags: (t.tags || []).join(", "),
      link: t.link || "",
      videoUrl: t.videoUrl || "",
      examples: JSON.stringify(t.examples || [], null, 2),
      exampleImages: t.exampleImages || [],
    });
    window.scrollTo({ top: 0 });
  };

  const onImages = (files) => {
    const arr = [...files];
    for (const f of arr) {
      if (f.size > 2 * 1024 * 1024) {
        setError(`"${f.name}" exceeds 2MB, skipped.`);
        continue;
      }
      const reader = new FileReader();
      reader.onload = () =>
        setEditing((prev) =>
          prev
            ? { ...prev, exampleImages: [...prev.exampleImages, reader.result] }
            : prev
        );
      reader.readAsDataURL(f);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      let examples = [];
      try {
        examples = editing.examples.trim()
          ? JSON.parse(editing.examples)
          : [];
      } catch {
        throw new Error("Examples must be valid JSON array.");
      }
      const payload = {
        track: editing.track.trim() || "DSA",
        kind: editing.kind,
        name: editing.name.trim(),
        title: editing.title.trim(),
        difficulty: editing.difficulty,
        desc: editing.desc,
        content: editing.content,
        tags: editing.tags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        link: editing.link.trim(),
        videoUrl: editing.videoUrl.trim(),
        examples,
        exampleImages: editing.exampleImages,
      };
      if (!payload.title) throw new Error("Title is required.");
      if (editing.id) {
        await api.put(`${API_BASE}/api/topics/id/${editing.id}`, payload);
      } else {
        await api.post(`${API_BASE}/api/topics`, payload);
      }
      setEditing(null);
      load();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Save failed."
      );
    } finally {
      setSaving(false);
    }
  };

  const remove = async (t) => {
    const id = t._id || t.id;
    if (!window.confirm(`Delete "${t.title}"?`)) return;
    try {
      await api.delete(`${API_BASE}/api/topics/id/${id}`);
      load();
    } catch {
      setError("Delete failed.");
    }
  };

  const inputCls =
    "w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500";
  const labelCls = "block text-xs font-semibold mb-1";

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Admin · Content</h1>
        <button
          onClick={startNew}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold py-2 px-4 rounded-lg"
        >
          + New
        </button>
      </div>
      {error && (
        <p className="text-sm text-rose-600 dark:text-rose-400 mb-4">{error}</p>
      )}

      {editing && (
        <form
          onSubmit={save}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 mb-6 space-y-3"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <label className={labelCls}>
              Track
              <input
                value={editing.track}
                onChange={(e) => setEditing({ ...editing, track: e.target.value })}
                className={inputCls}
                placeholder="DSA"
              />
            </label>
            <label className={labelCls}>
              Topic
              <input
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className={inputCls}
                placeholder="Arrays"
              />
            </label>
            <label className={labelCls}>
              Kind
              <select
                value={editing.kind}
                onChange={(e) => setEditing({ ...editing, kind: e.target.value })}
                className={inputCls}
              >
                <option value="problem">Problem</option>
                <option value="article">Article</option>
              </select>
            </label>
            <label className={labelCls}>
              Difficulty
              <select
                value={editing.difficulty}
                onChange={(e) =>
                  setEditing({ ...editing, difficulty: e.target.value })
                }
                className={inputCls}
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </label>
          </div>
          <label className={labelCls}>
            Title
            <input
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              className={inputCls}
              required
            />
          </label>
          <label className={labelCls}>
            Description
            <textarea
              value={editing.desc}
              onChange={(e) => setEditing({ ...editing, desc: e.target.value })}
              rows={3}
              className={inputCls}
            />
          </label>
          {editing.kind === "article" && (
            <label className={labelCls}>
              Content (markdown)
              <textarea
                value={editing.content}
                onChange={(e) =>
                  setEditing({ ...editing, content: e.target.value })
                }
                rows={10}
                className={`${inputCls} font-mono`}
                placeholder="# Heading&#10;&#10;Body text..."
              />
            </label>
          )}
          {editing.kind === "problem" && (
            <label className={labelCls}>
              Examples (JSON: [{`input, output, explanation`}])
              <textarea
                value={editing.examples}
                onChange={(e) =>
                  setEditing({ ...editing, examples: e.target.value })
                }
                rows={4}
                className={`${inputCls} font-mono`}
              />
            </label>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className={labelCls}>
              Tags (comma separated)
              <input
                value={editing.tags}
                onChange={(e) => setEditing({ ...editing, tags: e.target.value })}
                className={inputCls}
              />
            </label>
            <label className={labelCls}>
              Link
              <input
                value={editing.link}
                onChange={(e) => setEditing({ ...editing, link: e.target.value })}
                className={inputCls}
              />
            </label>
            <label className={labelCls}>
              Video URL
              <input
                value={editing.videoUrl}
                onChange={(e) =>
                  setEditing({ ...editing, videoUrl: e.target.value })
                }
                className={inputCls}
              />
            </label>
          </div>
          <div>
            <span className={labelCls}>Diagrams / images (≤2MB each, stored in DB)</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => onImages(e.target.files)}
              className="text-sm"
            />
            {editing.exampleImages.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {editing.exampleImages.map((src, i) => (
                  <div key={i} className="relative">
                    <img
                      src={src}
                      alt={`upload ${i + 1}`}
                      className="w-24 h-24 object-cover rounded border border-slate-300 dark:border-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setEditing({
                          ...editing,
                          exampleImages: editing.exampleImages.filter(
                            (_, k) => k !== i
                          ),
                        })
                      }
                      className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs w-5 h-5 rounded-full"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-semibold py-2 px-5 rounded-lg"
            >
              {saving ? "Saving..." : editing.id ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="text-sm px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col md:flex-row gap-2 mb-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title, topic, track..."
          className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <select
          value={kindFilter}
          onChange={(e) => setKindFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
        >
          <option value="All">All kinds</option>
          <option value="problem">Problems</option>
          <option value="article">Articles</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-slate-500 py-8">Loading...</p>
      ) : (
        <div className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
          {filtered.map((t) => {
            const id = t._id || t.id;
            return (
              <div key={id} className="flex items-center gap-3 py-2 px-2">
                <span className="flex-1 min-w-0 text-sm truncate">
                  {t.title}
                  <span className="text-slate-400 ml-2">
                    {t.track} · {t.name} · {t.kind}
                  </span>
                </span>
                <button
                  onClick={() => startEdit(t)}
                  className="text-sm text-emerald-700 dark:text-emerald-400 hover:underline shrink-0"
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(t)}
                  className="text-sm text-rose-600 dark:text-rose-400 hover:underline shrink-0"
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
      <p className="text-xs text-slate-500 mt-3">
        {filtered.length} items ·{" "}
        <button onClick={() => navigate("/topics")} className="hover:underline">
          Back to site →
        </button>
      </p>
    </div>
  );
};

export default Admin;
