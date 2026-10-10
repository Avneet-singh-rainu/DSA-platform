import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useDispatch, useSelector } from "react-redux";
import { executeCode } from "../store/codeExecutionSlice";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../utils/apiBase";

function difficultyColor(d) {
  if (d === "Easy") return "text-green-400";
  if (d === "Medium") return "text-yellow-400";
  return "text-red-400";
}

const STARTER = `class Solution {
    public int solve() {
        // Write your code here
        return 0;
    }
}`;

function CodeEditor() {
  const location = useLocation();
  const params = useParams();
  const [data, setData] = useState(location.state?.data || null);
  const [loadingProblem, setLoadingProblem] = useState(!location.state?.data);
  const { isLoading, isError, errorMessage } = useSelector(
    (state) => state.codeExecution
  );
  const [code, setCode] = useState(
    Array.isArray(location.state?.data?.code)
      ? location.state.data.code.join("\n")
      : location.state?.data?.code || STARTER
  );
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
        const c = resp.data?.code;
        setCode(Array.isArray(c) ? c.join("\n") : c || STARTER);
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
      const resultAction = await dispatch(executeCode({ code, input: inp }));
      setOutput(resultAction.payload?.run?.output ?? "No output");
    } catch (error) {
      console.error("Execution error:", error);
      setOutput("Error: Something went wrong.");
    }
  };

  if (loadingProblem) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center">
        Loading problem...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center gap-4">
        <p>Problem not found.</p>
        <Link to="/topics" className="text-teal-400 hover:underline">
          ← Back to topics
        </Link>
      </div>
    );
  }

  const listPath = `/topics/${params.topicname || (data?.name || "Array")}`;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <div className="w-full px-4 py-4">
        <Link to={listPath} className="text-teal-400 hover:underline text-sm">
          ← Back to problems
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          {/* Left: problem */}
          <div className="bg-gray-800 rounded-lg p-6 h-fit">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{data.title}</h1>
              {data.difficulty && (
                <span
                  className={`${difficultyColor(
                    data.difficulty
                  )} text-sm font-semibold border border-gray-700 rounded px-2 py-0.5`}
                >
                  {data.difficulty}
                </span>
              )}
            </div>
            {(data.tags || []).length > 0 && (
              <div className="text-xs text-gray-400 mb-4">
                {(data.tags || []).join(" · ")}
              </div>
            )}
            <p className="text-gray-300 leading-relaxed mb-4">{data.desc}</p>

            {(data.examples || []).map((v, i) => (
              <div key={i} className="p-4 mt-3 bg-gray-700 rounded-lg text-sm">
                <p>
                  <span className="font-semibold">Input:</span> {v.input}
                </p>
                <p>
                  <span className="font-semibold">Output:</span> {v.output}
                </p>
                {v.explanation && (
                  <p className="text-gray-400">
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
                  className="text-sky-400 hover:underline"
                >
                  Problem link →
                </a>
              )}
              {data.videoUrl && (
                <button
                  onClick={() => setShowVideo((s) => !s)}
                  className="text-teal-400 hover:underline"
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
                  className="text-teal-300 text-sm p-4 block hover:underline"
                >
                  Open video: {data.videoUrl}
                </a>
              </div>
            )}
          </div>

          {/* Right: editor */}
          <div className="flex flex-col gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold">Code Editor · Java</h2>
                <button
                  onClick={runCode}
                  disabled={isLoading}
                  className="bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-sm font-bold py-2 px-5 rounded"
                >
                  {isLoading ? "Running..." : "Run"}
                </button>
              </div>
              <div className="rounded-lg overflow-hidden border border-gray-700">
                <Editor
                  height="70vh"
                  defaultLanguage="java"
                  theme="vs-dark"
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

            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-sm text-gray-300">
                Custom input (stdin)
              </h3>
              <textarea
                value={inp}
                onChange={(e) => setInp(e.target.value)}
                rows={3}
                placeholder="Optional input for your program"
                className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-sm text-gray-300">Output</h3>
              <pre className="whitespace-pre-wrap text-sm bg-gray-900 rounded-lg p-3 min-h-[5rem]">
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
  );
}

export default CodeEditor;
