// Fill real LeetCode statements + examples + tags for DSA problems.
// Source: LeetCode public GraphQL (no key needed). Skips videos (not bulk-sourceable).
// Usage: node scripts/enrich-leetcode.js
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const Q = `query questionData($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    title
    content
    difficulty
    topicTags { name }
  }
}`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function decodeEntities(s) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function htmlToLines(html) {
  let s = decodeEntities(html);
  s = s
    .replace(/<(br|p|div|li|ul|ol|pre|h\d)[^>]*>/gi, "\n")
    .replace(/<\/(p|div|li|ul|ol|pre|h\d)>/gi, "\n")
    .replace(/<[^>]*>/g, "");
  return s
    .replace(/[ \t]+/g, " ")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

const BLOCK_RE =
  /<(pre[^>]*|div class="example-block"[^>]*)>([\s\S]*?)<\/(pre|div)>/gi;

function parseExamples(content) {
  const out = [];
  BLOCK_RE.lastIndex = 0;
  let m;
  while ((m = BLOCK_RE.exec(content)) && out.length < 3) {
    const lines = htmlToLines(m[2]);
    let input = "",
      output = "",
      expl = "",
      mode = null;
    for (const ln of lines) {
      if (/^Input:/i.test(ln)) {
        mode = "in";
        input = ln.replace(/^Input:/i, "").trim();
      } else if (/^Output:/i.test(ln)) {
        mode = "out";
        output = ln.replace(/^Output:/i, "").trim();
      } else if (/^Explanation:/i.test(ln)) {
        mode = "ex";
        expl = ln.replace(/^Explanation:/i, "").trim();
      } else if (mode === "in") input += "\n" + ln;
      else if (mode === "out") output += "\n" + ln;
      else if (mode === "ex") expl += "\n" + ln;
    }
    if (!input || !output) continue;
    out.push({
      input: input.trim(),
      output: output.trim(),
      explanation: expl.trim(),
    });
  }
  return out;
}

function parseDesc(content) {
  const noBlocks = content.replace(BLOCK_RE, " ");
  BLOCK_RE.lastIndex = 0;
  // cut off at constraints/follow-up sections if present
  const cut = noBlocks.split(/<p><strong>(Constraints|Follow-up)/i)[0];
  return htmlToLines(cut)
    .filter((l) => !/^Example \d+:?$/i.test(l))
    .join(" ")
    .slice(0, 4000);
}

async function fetchQuestion(slug) {
  const r = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
      Referer: `https://leetcode.com/problems/${slug}/`,
    },
    body: JSON.stringify({
      operationName: "questionData",
      query: Q,
      variables: { titleSlug: slug },
    }),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const j = await r.json();
  if (!j.data || !j.data.question) throw new Error("no question data");
  return j.data.question;
}

function slugFromLink(link) {
  const m = /leetcode\.com\/problems\/([^/]+)\//.exec(link || "");
  return m ? m[1] : null;
}

async function main() {
  const topics = await prisma.topic.findMany({ where: { track: "DSA" } });
  let ok = 0;
  const failed = [];
  for (const t of topics) {
    const slug = slugFromLink(t.link);
    if (!slug) {
      failed.push(`${t.title} (no slug)`);
      continue;
    }
    try {
      const q = await fetchQuestion(slug);
      await prisma.topic.update({
        where: { id: t.id },
        data: {
          desc: parseDesc(q.content) || t.desc,
          examples: parseExamples(q.content),
          tags:
            q.topicTags && q.topicTags.length
              ? q.topicTags.map((x) => x.name)
              : undefined,
          difficulty: q.difficulty || undefined,
        },
      });
      ok++;
      if (ok % 20 === 0) console.log(`...${ok}/${topics.length}`);
    } catch (e) {
      failed.push(`${t.title} (${e.message})`);
    }
    await sleep(600);
  }
  console.log(`Enriched ${ok}/${topics.length}`);
  if (failed.length) console.log("FAILED:\n" + failed.join("\n"));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
