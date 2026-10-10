// Seed DSA problems from the author's LeetCode list (122 problems).
// Upserts by (track, title): existing entries keep their ids/examples/videos,
// so user bookmarks/completions stay intact.
// Usage: node scripts/seed-leetcode.js
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// [leetcodeNum, title, acceptance%, Easy|Med|Hard]
const RAW = [
  [3043, "Find the Length of the Longest Common Prefix", 62.3, "Med"],
  [55, "Jump Game", 41.6, "Med"],
  [1289, "Minimum Falling Path Sum II", 62.9, "Hard"],
  [506, "Relative Ranks", 75.3, "Easy"],
  [347, "Top K Frequent Elements", 67.5, "Med"],
  [2812, "Find the Safest Path in a Grid", 57.2, "Med"],
  [853, "Car Fleet", 55.8, "Med"],
  [846, "Hand of Straights", 58.5, "Med"],
  [994, "Rotting Oranges", 59.5, "Med"],
  [934, "Shortest Bridge", 59.8, "Med"],
  [72, "Edit Distance", 61.4, "Med"],
  [139, "Word Break", 50.0, "Med"],
  [152, "Maximum Product Subarray", 37.2, "Med"],
  [122, "Best Time to Buy and Sell Stock II", 71.7, "Med"],
  [264, "Ugly Number II", 49.9, "Med"],
  [2997, "Minimum Number of Operations to Make Array XOR Equal to K", 85.2, "Med"],
  [2962, "Count Subarrays Where Max Element Appears at Least K Times", 62.3, "Med"],
  [2597, "The Number of Beautiful Subsets", 50.9, "Med"],
  [2370, "Longest Ideal Subsequence", 46.6, "Med"],
  [2220, "Minimum Bit Flips to Convert Number", 88.0, "Easy"],
  [1759, "Count Number of Homogenous Substrings", 57.3, "Med"],
  [1438, "Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit", 58.1, "Med"],
  [2099, "Find Subsequence of Length K With the Largest Sum", 57.3, "Easy"],
  [2335, "Minimum Amount of Time to Fill Cups", 60.7, "Easy"],
  [995, "Minimum Number of K Consecutive Bit Flips", 62.5, "Hard"],
  [767, "Reorganize String", 57.7, "Med"],
  [974, "Subarray Sums Divisible by K", 56.8, "Med"],
  [979, "Distribute Coins in Binary Tree", 77.4, "Med"],
  [1038, "Binary Search Tree to Greater Sum Tree", 88.4, "Med"],
  [1404, "Number of Steps to Reduce a Number in Binary Representation to One", 63.7, "Med"],
  [1219, "Path with Maximum Gold", 68.6, "Med"],
  [875, "Koko Eating Bananas", 50.7, "Med"],
  [1769, "Minimum Number of Operations to Move All Balls to Each Box", 90.2, "Med"],
  [739, "Daily Temperatures", 69.3, "Med"],
  [648, "Replace Words", 69.0, "Med"],
  [417, "Pacific Atlantic Water Flow", 61.6, "Med"],
  [621, "Task Scheduler", 64.0, "Med"],
  [45, "Jump Game II", 43.6, "Med"],
  [49, "Group Anagrams", 73.4, "Med"],
  [1884, "Egg Drop With 2 Eggs and N Floors", 74.8, "Med"],
  [1043, "Partition Array for Maximum Sum", 77.6, "Med"],
  [416, "Partition Equal Subset Sum", 50.1, "Med"],
  [1312, "Minimum Insertion Steps to Make a String Palindrome", 74.5, "Hard"],
  [44, "Wildcard Matching", 33.0, "Hard"],
  [2305, "Fair Distribution of Cookies", 70.1, "Med"],
  [322, "Coin Change", 49.3, "Med"],
  [1638, "Count Substrings That Differ by One Character", 72.4, "Med"],
  [313, "Super Ugly Number", 46.7, "Med"],
  [115, "Distinct Subsequences", 54.4, "Hard"],
  [300, "Longest Increasing Subsequence", 60.1, "Med"],
  [1986, "Minimum Number of Work Sessions to Finish the Tasks", 35.5, "Med"],
  [698, "Partition to K Equal Sum Subsets", 38.9, "Med"],
  [357, "Count Numbers with Unique Digits", 56.4, "Med"],
  [3213, "Construct String with Minimum Cost", 18.8, "Hard"],
  [140, "Word Break II", 56.3, "Hard"],
  [1547, "Minimum Cost to Cut a Stick", 63.5, "Hard"],
  [2500, "Delete Greatest Value in Each Row", 80.6, "Easy"],
  [874, "Walking Robot Simulation", 64.6, "Med"],
  [3160, "Find the Number of Distinct Colors Among the Balls", 54.1, "Med"],
  [640, "Solve the Equation", 46.9, "Med"],
  [3186, "Maximum Total Damage With Spell Casting", 45.0, "Med"],
  [2856, "Minimum Array Length After Pair Removals", 28.2, "Med"],
  [1963, "Minimum Number of Swaps to Make the String Balanced", 78.1, "Med"],
  [959, "Regions Cut By Slashes", 77.6, "Med"],
  [475, "Heaters", 42.8, "Med"],
  [2563, "Count the Number of Fair Pairs", 52.6, "Med"],
  [443, "String Compression", 60.9, "Med"],
  [3132, "Find the Integer Added to Array II", 33.3, "Med"],
  [3006, "Find Beautiful Indices in the Given Array I", 41.5, "Med"],
  [1717, "Maximum Score From Removing Substrings", 66.4, "Med"],
  [1861, "Rotating the Box", 82.5, "Med"],
  [795, "Number of Subarrays with Bounded Maximum", 55.5, "Med"],
  [993, "Cousins in Binary Tree", 59.9, "Easy"],
  [189, "Rotate Array", 45.7, "Med"],
  [572, "Subtree of Another Tree", 52.3, "Easy"],
  [530, "Minimum Absolute Difference in BST", 59.8, "Easy"],
  [2096, "Step-By-Step Directions From a Binary Tree Node to Another", 56.5, "Med"],
  [1530, "Number of Good Leaf Nodes Pairs", 71.8, "Med"],
  [235, "Lowest Common Ancestor of a Binary Search Tree", 71.5, "Easy"],
  [542, "01 Matrix", 55.1, "Med"],
  [667, "Beautiful Arrangement II", 61.5, "Med"],
  [124, "Binary Tree Maximum Path Sum", 42.9, "Hard"],
  [633, "Sum of Square Numbers", 37.1, "Med"],
  [881, "Boats to Save People", 62.6, "Med"],
  [1498, "Number of Subsequences That Satisfy the Given Sum Condition", 49.0, "Med"],
  [31, "Next Permutation", 46.3, "Med"],
  [236, "Lowest Common Ancestor of a Binary Tree", 70.2, "Med"],
  [3233, "Find the Count of Numbers Which Are Not Special", 28.4, "Med"],
  [1395, "Count Number of Teams", 70.2, "Med"],
  [863, "All Nodes Distance K in Binary Tree", 68.2, "Med"],
  [56, "Merge Intervals", 53.0, "Med"],
  [3148, "Maximum Difference Score in a Grid", 48.1, "Med"],
  [2134, "Minimum Swaps to Group All 1's Together II", 65.8, "Med"],
  [1508, "Range Sum of Sorted Subarray Sums", 63.0, "Med"],
  [525, "Contiguous Array", 52.6, "Med"],
  [15, "3Sum", 40.0, "Med"],
  [885, "Spiral Matrix III", 84.6, "Med"],
  [169, "Majority Element", 66.5, "Easy"],
  [1614, "Maximum Nesting Depth of the Parentheses", 86.1, "Easy"],
  [50, "Pow(x, n)", 39.3, "Med"],
  [22, "Generate Parentheses", 79.7, "Med"],
  [3249, "Count the Number of Good Nodes", 55.2, "Med"],
  [131, "Palindrome Partitioning", 74.8, "Med"],
  [1448, "Count Good Nodes in Binary Tree", 74.0, "Med"],
  [155, "Min Stack", 58.8, "Med"],
  [907, "Sum of Subarray Minimums", 39.0, "Med"],
  [84, "Largest Rectangle in Histogram", 51.0, "Hard"],
  [101, "Symmetric Tree", 62.1, "Easy"],
  [207, "Course Schedule", 52.4, "Med"],
  [5, "Longest Palindromic Substring", 38.8, "Med"],
  [242, "Valid Anagram", 68.7, "Easy"],
  [1497, "Check If Array Pairs Are Divisible by k", 46.2, "Med"],
  [1590, "Make Sum Divisible by P", 42.6, "Med"],
  [962, "Maximum Width Ramp", 56.0, "Med"],
  [3133, "Minimum Array End", 55.3, "Med"],
  [3356, "Zero Array Transformation II", 43.5, "Med"],
  [3108, "Minimum Cost Walk in Weighted Graph", 68.0, "Hard"],
  [2115, "Find All Possible Recipes from Given Supplies", 57.2, "Med"],
  [3394, "Check if Grid can be Cut into Sections", 68.0, "Med"],
  [2551, "Put Marbles in Bags", 72.0, "Hard"],
  [2873, "Maximum Value of an Ordered Triplet I", 58.1, "Easy"],
  [2874, "Maximum Value of an Ordered Triplet II", 56.2, "Med"],
];

function topicFor(title) {
  if (/binary tree|search tree|\bbst\b|leaf|leaves|ancestor|cousin|subtree|symmetric|good nodes|directions from/i.test(title)) return "Trees";
  if (/rotting|bridge|pacific|atlantic|fleet|gold|safest|slashes|weighted graph|cut into sections|course schedule|01 matrix|recipes|grid/i.test(title)) return "Graphs";
  if (/top k|task scheduler|koko/i.test(title)) return "Heap";
  if (/daily temperatures|min stack|subarray minimums|histogram|ramp/i.test(title)) return "Stack";
  if (/heaters|pow\(x/i.test(title)) return "Binary Search";
  if (/interval/i.test(title)) return "Intervals";
  if (/edit distance|word break|wildcard|distinct subsequence|ideal subsequence|increasing subsequence|subsequences that satisfy|palindrom|coin change|partition|subset|jump game|super ugly|ugly number|unique digits|egg drop|work sessions|fair distribution|cookies|marbles|cut a stick|\bstick\b|spell casting|construct string|falling path/i.test(title)) return "DP";
  if (/anagram|parentheses|reorganize|compression|balanced|equation|replace words|homogenous|substring|prefix/i.test(title)) return "Strings";
  return "Arrays";
}

function slug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const diffMap = { Easy: "Easy", Med: "Medium", Hard: "Hard" };

async function main() {
  let created = 0;
  let updated = 0;
  for (const [num, title, acc, diff] of RAW) {
    const topic = topicFor(title);
    const data = {
      track: "DSA",
      kind: "problem",
      name: topic,
      title,
      desc: `LeetCode #${num} · Acceptance ${acc}%`,
      difficulty: diffMap[diff] || "Medium",
      link: `https://leetcode.com/problems/${slug(title)}/`,
      tags: [topic],
    };
    const existing = await prisma.topic.findFirst({
      where: { track: "DSA", title },
    });
    if (existing) {
      await prisma.topic.update({
        where: { id: existing.id },
        data: {
          name: topic,
          difficulty: data.difficulty,
          link: data.link,
          tags: existing.tags && existing.tags.length ? undefined : data.tags,
          desc: existing.desc && existing.desc.trim() ? undefined : data.desc,
        },
      });
      updated++;
    } else {
      await prisma.topic.create({ data });
      created++;
    }
  }
  console.log(`LeetCode seed done: ${created} created, ${updated} updated (${RAW.length} total)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
