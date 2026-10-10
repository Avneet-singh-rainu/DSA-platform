import React, { useState, useEffect, useRef, useMemo } from "react";
import Editor from "@monaco-editor/react";
import { useDispatch, useSelector } from "react-redux";
import { executeCode } from "../store/codeExecutionSlice";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../utils/apiBase";
import { useTheme } from "../hooks/useTheme";
import ArticleView from "./ArticleView";

function difficultyColor(d) {
  if (d === "Easy") return "text-emerald-600 dark:text-emerald-400";
  if (d === "Medium") return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
}

// Wandbox compiles Java as prog.java, so no `public class` (it fails to compile).
const STARTERS = {
  java: `import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your code here
        System.out.println("Hello EatCode");
    }
}`,
  python: `import sys

def solve():
    data = sys.stdin.read().strip()
    # Write your code here
    print("Hello EatCode")

if __name__ == "__main__":
    solve()`,
  javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim();
// Write your code here
console.log("Hello EatCode");`,
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // Write your code here
    cout << "Hello EatCode";
    return 0;
}`,
};

const LANG_OPTIONS = [
  { id: "java", label: "Java", monaco: "java" },
  { id: "python", label: "Python", monaco: "python" },
  { id: "javascript", label: "JavaScript", monaco: "javascript" },
  { id: "cpp", label: "C++", monaco: "cpp" },
];

function toCode(c, lang) {
  if (Array.isArray(c)) c = c.join("\n");
  const s = c == null ? "" : String(c);
  if (s.trim()) return s;
  return STARTERS[lang] || STARTERS.java;
}

function CodeEditor() {
  const location = useLocation();
  const params = useParams();
  const { isDark } = useTheme();
  const [data, setData] = useState(location.state?.data || null);
  const [loadingProblem, setLoadingProblem] = useState(!location.state?.data);
  const { isLoading, isError, errorMessage } = useSelector(
    (state) => state.codeExecution
  );
  const [lang, setLang] = useState("java");
  // Keep edits per language so switching doesn't lose work
  const [codes, setCodes] = useState(() => ({
    java: toCode(location.state?.data?.code, "java"),
  }));
  const code = codes[lang] ?? STARTERS[lang];
  const setCode = (v) => setCodes((prev) => ({ ...prev, [lang]: v || "" }));
  const [output, setOutput] = useState("");
  const [inp, setInp] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (data) return;
    const qid = params.question;
    if (!qid) {
      setLoadingProblem(false);
      return;
    }
    const load = async () => {
      try {
        const resp = await axios.get(`${API_BASE}/api/topics/id/${qid}`);
        setData(resp.data);
        setCodes({ java: toCode(resp.data?.code, "java") });
      } catch (e) {
        console.error("Failed to load problem:", e);
      } finally {
        setLoadingProblem(false);
      }
    };
    load();
  }, [data, params.question]);

  const runCode = async () => {
    try {
      const resultAction = await dispatch(
        executeCode({ code, input: inp, language: lang })
      );
      if (resultAction.meta.requestStatus === "fulfilled") {
        setOutput(resultAction.payload.output || "No output");
      } else {
        const msg = resultAction.payload;
        setOutput(
          `Error: ${typeof msg === "string" ? msg : JSON.stringify(msg)}`
        );
      }
    } catch (error) {
      console.error("Execution error:", error);
      setOutput("Error: Something went wrong.");
    }
  };

  const listPath = useMemo(() => {
    if (params.track && params.topic) {
      return `/topics/${params.track.toLowerCase()}/${params.topic.toLowerCase()}`;
    }
    // legacy /topics/:topicname/:question URLs
    return `/topics/${params.topicname || data?.name || "Array"}`;
  }, [params.track, params.topic, params.topicname, data?.name]);

  // Articles (e.g. LangChain track) render as reading pages, not editors
  if (!loadingProblem && data && (data.kind || "problem") === "article") {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-200">
        <div className="w-full px-4 py-4">
          <Link
            to={listPath}
            className="text-emerald-700 dark:text-emerald-400 hover:underline text-sm"
          >
            ← Back to list
          </Link>
          <div className="mt-3">
            <ArticleView data={data} />
          </div>
        </div>
      </div>
    );
  }
  const outputRef = useRef(null);
  const wasRunning = useRef(false);

  // Bring the output into view when a run finishes (mobile / small screens)
  useEffect(() => {
    if (wasRunning.current && !isLoading) {
      outputRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    wasRunning.current = isLoading;
  }, [isLoading]);

  if (loadingProblem) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-200 flex items-center justify-center">
        Loading problem...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-200 flex flex-col items-center justify-center gap-4">
        <p>Problem not found.</p>
        <Link
          to="/topics"
          className="text-emerald-700 dark:text-emerald-400 hover:underline"
        >
          ← Back to topics
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-3.5rem)] lg:overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-200">
      <div className="w-full h-full px-4 py-3 flex flex-col gap-3">
        <Link
          to={listPath}
          className="text-emerald-700 dark:text-emerald-400 hover:underline text-sm shrink-0"
        >
          ← Back to problems
        </Link>

        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:overflow-hidden">
          {/* Left: problem */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 lg:overflow-y-auto lg:min-h-0">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{data.title}</h1>
              {data.difficulty && (
                <span
                  className={`${difficultyColor(
                    data.difficulty
                  )} text-sm font-semibold border border-slate-300 dark:border-slate-700 rounded px-2 py-0.5`}
                >
                  {data.difficulty}
                </span>
              )}
            </div>
            {(data.tags || []).length > 0 && (
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                {(data.tags || []).join(" · ")}
              </div>
            )}
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              {data.desc}
            </p>

            {(data.examples || []).map((v, i) => (
              <div
                key={i}
                className="p-4 mt-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm"
              >
                <p>
                  <span className="font-semibold">Input:</span> {v.input}
                </p>
                <p>
                  <span className="font-semibold">Output:</span> {v.output}
                </p>
                {v.explanation && (
                  <p className="text-slate-500 dark:text-slate-400">
                    <span className="font-semibold">Explanation:</span>{" "}
                    {v.explanation}
                  </p>
                )}
              </div>
            ))}

            <div className="flex gap-4 mt-4 text-sm">
              {data.link && (
                <a
                  href={data.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 dark:text-emerald-400 hover:underline"
                >
                  Problem link →
                </a>
              )}
              {data.videoUrl && (
                <button
                  onClick={() => setShowVideo((s) => !s)}
                  className="text-emerald-700 dark:text-emerald-400 hover:underline"
                >
                  {showVideo ? "Hide video" : "Watch video"}
                </button>
              )}
            </div>

            {showVideo && data.videoUrl && (
              <div className="mt-4 aspect-video bg-black rounded-lg overflow-hidden">
                <a
                  href={data.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-300 text-sm p-4 block hover:underline"
                >
                  Open video: {data.videoUrl}
                </a>
              </div>
            )}
          </div>

          {/* Right: editor */}
          <div className="flex flex-col gap-3 lg:min-h-0 lg:overflow-hidden">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 flex flex-col min-h-[320px] lg:flex-1 lg:min-h-0">
              <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-sm">Code Editor</h2>
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    className="text-sm px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {LANG_OPTIONS.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={runCode}
                  disabled={isLoading}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-bold py-1.5 px-5 rounded"
                >
                  {isLoading ? "Running..." : "Run"}
                </button>
              </div>
              <div className="rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 flex-1 min-h-0">
                <Editor
                  height="100%"
                  defaultLanguage="java"
                  language={
                    LANG_OPTIONS.find((l) => l.id === lang)?.monaco || "java"
                  }
                  theme={isDark ? "vs-dark" : "vs"}
                  value={code}
                  onChange={(v) => setCode(v || "")}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3">
                <h3 className="font-semibold mb-2 text-sm text-slate-600 dark:text-slate-300">
                  Input (stdin)
                </h3>
                <textarea
                  value={inp}
                  onChange={(e) => setInp(e.target.value)}
                  rows={3}
                  placeholder="Optional input for your program"
                  className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div
                ref={outputRef}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3"
              >
                <h3 className="font-semibold mb-2 text-sm text-slate-600 dark:text-slate-300">
                  Output
                </h3>
                <pre className="whitespace-pre-wrap text-sm bg-slate-100 dark:bg-slate-950 rounded-lg p-3 h-[5.5rem] overflow-y-auto">
                  {isLoading
                    ? "Running..."
                    : isError
                    ? `Error: ${
                        typeof errorMessage === "string"
                          ? errorMessage
                          : JSON.stringify(errorMessage)
                      }`
                    : output || "Output will appear here"}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;
