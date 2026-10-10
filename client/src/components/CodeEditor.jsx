import React, { useState, useEffect, useRef } from "react";
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

// Wandbox compiles as prog.java, so no `public class` (it fails to compile).
const STARTER = `import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your code here
        System.out.println("Hello EatCode");
    }
}`;

function toCode(c) {
  if (Array.isArray(c)) c = c.join("\n");
  const s = c == null ? "" : String(c);
  return s.trim() ? s : STARTER;
}

function CodeEditor() {
  const location = useLocation();
  const params = useParams();
  const [data, setData] = useState(location.state?.data || null);
  const [loadingProblem, setLoadingProblem] = useState(!location.state?.data);
  const { isLoading, isError, errorMessage } = useSelector(
    (state) => state.codeExecution
  );
  const [code, setCode] = useState(() => toCode(location.state?.data?.code));
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
        setCode(toCode(resp.data?.code));
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
  const outputRef = useRef(null);
  const wasRunning = useRef(false);

  // Bring the output into view when a run finishes (mobile / small screens)
  useEffect(() => {
    if (wasRunning.current && !isLoading) {
      outputRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    wasRunning.current = isLoading;
  }, [isLoading]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-3.5rem)] lg:overflow-hidden bg-gray-900 text-gray-200">
      <div className="w-full h-full px-4 py-3 flex flex-col gap-3">
        <Link to={listPath} className="text-teal-400 hover:underline text-sm shrink-0">
          ← Back to problems
        </Link>

        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:overflow-hidden">
          {/* Left: problem */}
          <div className="bg-gray-800 rounded-lg p-5 lg:overflow-y-auto lg:min-h-0">
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
          <div className="flex flex-col gap-3 lg:min-h-0 lg:overflow-hidden">
            <div className="bg-gray-800 rounded-lg p-3 flex flex-col min-h-[320px] lg:flex-1 lg:min-h-0">
              <div className="flex items-center justify-between mb-2 px-1">
                <h2 className="font-semibold text-sm">Code Editor · Java</h2>
                <button
                  onClick={runCode}
                  disabled={isLoading}
                  className="bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-sm font-bold py-1.5 px-5 rounded"
                >
                  {isLoading ? "Running..." : "Run"}
                </button>
              </div>
              <div className="rounded-lg overflow-hidden border border-gray-700 flex-1 min-h-0">
                <Editor
                  height="100%"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-gray-800 rounded-lg p-3">
                <h3 className="font-semibold mb-2 text-sm text-gray-300">
                  Input (stdin)
                </h3>
                <textarea
                  value={inp}
                  onChange={(e) => setInp(e.target.value)}
                  rows={3}
                  placeholder="Optional input for your program"
                  className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div ref={outputRef} className="bg-gray-800 rounded-lg p-3">
                <h3 className="font-semibold mb-2 text-sm text-gray-300">Output</h3>
                <pre className="whitespace-pre-wrap text-sm bg-gray-900 rounded-lg p-3 h-[5.5rem] overflow-y-auto">
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
