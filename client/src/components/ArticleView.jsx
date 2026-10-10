import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ReactPlayer from "react-player";

// Long-form article view for kind === "article" (e.g. LangChain track).
// Body comes from `content` (markdown); diagrams from `exampleImages`.
// Place an image mid-article with ![](image:N) — unreferenced images
// are appended as figures at the end.
const ArticleView = ({ data }) => {
  const [showVideo, setShowVideo] = useState(true);
  const images = (data.exampleImages || []).filter(Boolean);
  const referenced = new Set(
    [...(data.content || "").matchAll(/!\[.*?\]\(image:(\d+)\)/g)].map((m) =>
      Number(m[1])
    )
  );
  const trailing = images.filter((_, i) => !referenced.has(i));
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 lg:p-8 lg:overflow-y-auto lg:min-h-0">
      <h1 className="text-4xl font-bold">{data.title}</h1>
      {(data.tags || []).length > 0 && (
        <div className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-4">
          {(data.tags || []).join(" · ")}
        </div>
      )}
      {data.desc && (
        <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          {data.desc}
        </p>
      )}

      {data.content && (
        <div className="markdown-body text-lg leading-relaxed space-y-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-5 [&_p]:text-slate-700 [&_p]:dark:text-slate-300 [&_li]:text-slate-700 [&_li]:dark:text-slate-300 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-emerald-700 [&_a]:dark:text-emerald-400 [&_a]:hover:underline [&_code]:bg-slate-100 [&_code]:dark:bg-slate-800 [&_code]:px-1 [&_code]:rounded [&_code]:text-[15px] [&_pre]:bg-slate-100 [&_pre]:dark:bg-slate-950 [&_pre]:border [&_pre]:border-slate-200 [&_pre]:dark:border-slate-800 [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:text-[15px] [&_pre_code]:bg-transparent [&_pre_code]:dark:bg-transparent [&_pre_code]:p-0 [&_img]:rounded-lg [&_img]:my-4 [&_table]:w-full [&_table]:text-base [&_th]:text-left [&_th]:border-b [&_th]:border-slate-300 [&_th]:dark:border-slate-700 [&_th]:py-2 [&_td]:border-b [&_td]:border-slate-200 [&_td]:dark:border-slate-800 [&_td]:py-2">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            urlTransform={(url) => url}
            components={{
              img: ({ src, alt }) => {
                const m = /^image:(\d+)$/.exec(src || "");
                const resolved =
                  m && images[Number(m[1])] ? images[Number(m[1])] : src;
                return (
                  <img
                    src={resolved}
                    alt={alt || "article diagram"}
                    className="rounded-lg border border-slate-200 dark:border-slate-800 w-full my-4"
                    loading="lazy"
                  />
                );
              },
            }}
          >
            {data.content}
          </ReactMarkdown>
        </div>
      )}

      {trailing.length > 0 && (
        <div className="mt-6 space-y-4">
          {trailing.map((src) => {
            const i = images.indexOf(src);
            return (
              <figure key={src.slice(0, 32) + i}>
                <img
                  src={src}
                  alt={`${data.title} diagram ${i + 1}`}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 w-full"
                  loading="lazy"
                />
                <figcaption className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-center">
                  Figure {i + 1}
                </figcaption>
              </figure>
            );
          })}
        </div>
      )}

      <div className="flex gap-4 mt-6 text-sm">
        {data.link && (
          <a
            href={data.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            Reference link →
          </a>
        )}
        {data.videoUrl && (
          <button
            onClick={() => setShowVideo((v) => !v)}
            className="text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            {showVideo ? "Hide video" : "Watch video"}
          </button>
        )}
      </div>

      {showVideo && data.videoUrl && (
        <div className="mt-4 aspect-video bg-black rounded-lg overflow-hidden">
          <ReactPlayer
            url={data.videoUrl}
            controls
            width="100%"
            height="100%"
          />
        </div>
      )}
    </div>
  );
};

export default ArticleView;
