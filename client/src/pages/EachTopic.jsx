import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateBookmarks, logOut } from "../store/userSlice";
import axios from "axios";
import fetchUserByid from "../utils/fetchUserById";
import api from "../utils/authApi";
import { API_BASE } from "../utils/apiBase";
import ProblemTable from "../components/ProblemTable";
import ArticleList from "../components/ArticleList";

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

const EachTopic = () => {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const { track, topic: topicName } = useParams();
  const trackSlug = (track || "").toLowerCase();
  const navigate = useNavigate();
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [completed, setCompleted] = useState([]);

  const fetchDatas = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/topics/${topicName}`, {
        params: { track: trackSlug },
      });
      setFetchData(res?.data || []);
    } catch (error) {
      console.error("Failed to fetch topics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatas();
    const f = async () => {
      const stored = getStoredUser();
      if (!stored) {
        setUser(null);
        setBookmarks([]);
        setCompleted([]);
        return;
      }
      const uid = stored._id || stored.id;
      if (!uid) return;
      try {
        const resp = await fetchUserByid(uid);
        if (!resp) return;
        setUser(resp);
        setBookmarks(resp.bookmarks || []);
        setCompleted((resp.completed || []).map((e) => e.questionId));
      } catch (e) {
        console.error("Failed to fetch user:", e);
      }
    };
    f();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackSlug, topicName]);

  const toggleBookmark = async (id) => {
    const uid = user?._id || user?.id;
    if (!uid) {
      navigate("/login");
      return;
    }
    const wasMarked = bookmarks.includes(id);
    setBookmarks((prev) =>
      wasMarked ? prev.filter((x) => x !== id) : [...prev, id]
    );
    try {
      await api.post(`${API_BASE}/user/${uid}/${id}`);
      const updated = {
        ...user,
        bookmarks: wasMarked
          ? user.bookmarks.filter((x) => x !== id)
          : [...(user.bookmarks || []), id],
      };
      setUser(updated);
      sessionStorage.setItem("user", JSON.stringify(updated));
      dispatch(updateBookmarks(updated.bookmarks));
    } catch (error) {
      console.error("Error toggling bookmark:", error.message);
      setBookmarks((prev) =>
        wasMarked ? [...prev, id] : prev.filter((x) => x !== id)
      );
      if (error.response?.status === 401) {
        dispatch(logOut());
        navigate("/login");
      }
    }
  };

  const toggleCompletion = async (id) => {
    const uid = user?._id || user?.id;
    if (!uid) {
      navigate("/login");
      return;
    }
    const wasDone = completed.includes(id);
    setCompleted((prev) =>
      wasDone ? prev.filter((x) => x !== id) : [...prev, id]
    );
    try {
      await api.put(`${API_BASE}/user/${uid}/complete/${id}`);
      const resp2 = await fetchUserByid(uid);
      if (resp2) {
        setUser(resp2);
        setCompleted((resp2.completed || []).map((e) => e.questionId));
        sessionStorage.setItem("user", JSON.stringify(resp2));
      }
    } catch (error) {
      console.log(error);
      setCompleted((prev) =>
        wasDone ? [...prev, id] : prev.filter((x) => x !== id)
      );
      if (error.response?.status === 401) {
        dispatch(logOut());
        navigate("/login");
      }
    }
  };

  const handleSolve = (topic) => {
    const id = topic._id || topic.id;
    navigate(`/topics/${trackSlug}/${topicName}/${id}`, {
      state: { data: topic },
    });
  };

  const doneCount = completed.length;
  const allArticles =
    fetchData.length > 0 &&
    fetchData.every((t) => (t.kind || "problem") === "article");

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-200">
      <div className="w-full px-4 py-4">
        <Link
          to={`/topics/${trackSlug}`}
          className="text-emerald-700 dark:text-emerald-400 hover:underline text-sm"
        >
          ← {track || "Track"}
        </Link>
        <div className="flex items-end justify-between mt-1 mb-1">
          <h1 className="text-2xl font-bold capitalize">{topicName}</h1>
          {user && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {doneCount} solved · {bookmarks.length} saved
            </span>
          )}
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-xs mb-4">
          {allArticles ? (
            <>
              {fetchData.length} guide{fetchData.length !== 1 ? "s" : ""} ·
              click Read to open
            </>
          ) : (
            <>
              {fetchData.length} problem{fetchData.length !== 1 ? "s" : ""} ·
              click Solve to open the editor
              {!user && " · log in to track progress"}
            </>
          )}
        </p>

        {loading ? (
          <p className="text-center text-slate-500 dark:text-slate-400 py-10">
            Loading...
          </p>
        ) : fetchData.length === 0 ? (
          <p className="text-center text-rose-600 dark:text-rose-400 py-10">
            No topics found. Please try again later.
          </p>
        ) : allArticles ? (
          <ArticleList items={fetchData} onOpen={handleSolve} />
        ) : (
          <ProblemTable
            problems={fetchData}
            bookmarks={bookmarks}
            completed={completed}
            onToggleBookmark={toggleBookmark}
            onToggleCompletion={toggleCompletion}
            onSolve={handleSolve}
          />
        )}
      </div>
    </div>
  );
};

export default EachTopic;
