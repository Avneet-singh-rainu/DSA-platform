const Q = `query questionData($titleSlug: String!) {
  question(titleSlug: $titleSlug) { content }
}`;
(async () => {
  const r = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0",
      Referer: "https://leetcode.com/problems/contains-duplicate/",
    },
    body: JSON.stringify({
      operationName: "questionData",
      query: Q,
      variables: { titleSlug: "contains-duplicate" },
    }),
  });
  const j = await r.json();
  const c = j.data.question.content;
  const pres = c.match(/<pre[^>]*>/gi);
  console.log("pre open tags:", JSON.stringify(pres));
  console.log("---");
  console.log(c.slice(0, 600));
})();
