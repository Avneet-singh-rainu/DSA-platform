require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const topics = [
  {
    name: "Array",
    title: "Find the Missing Number",
    desc: "Given an array containing n distinct numbers taken from 0, 1, 2, ..., n, find the one that is missing from the array.",
    difficulty: "Medium",
    examples: [
      { input: "nums = [3, 0, 1]", output: "2", explanation: "The numbers are 0, 1, 3. The missing number is 2." },
      { input: "nums = [9,6,4,2,3,5,7,0,1]", output: "8", explanation: "The numbers are 0-9 except 8." },
    ],
    videoUrl: "https://youtu.be/7Fjtz3Z5Frg?si=np87laLjD_qehKFg",
    tags: ["Two pointer", "Greedy", "HashMap"],
    link: "https://leetcode.com/problems/missing-number/",
  },
  {
    name: "Array",
    title: "Maximum Subarray",
    desc: "Find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    difficulty: "Easy",
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
      { input: "nums = [1]", output: "1", explanation: "The entire array is the largest subarray." },
    ],
    videoUrl: "https://www.youtube.com/watch?v=2MmGzdiKR9Y",
    tags: ["DP", "Kadane", "Array"],
    link: "https://leetcode.com/problems/maximum-subarray/",
  },
  {
    name: "Array",
    title: "Contains Duplicate",
    desc: "Given an array of integers, find if the array contains any duplicates.",
    difficulty: "Easy",
    examples: [
      { input: "nums = [1,2,3,1]", output: "true", explanation: "The array contains duplicate 1." },
      { input: "nums = [1,2,3,4]", output: "false", explanation: "No duplicates." },
    ],
    videoUrl: "https://www.youtube.com/watch?v=3OamzN90kPg",
    tags: ["HashMap", "Set", "Array"],
    link: "https://leetcode.com/problems/contains-duplicate/",
  },
  {
    name: "Array",
    title: "Product of Array Except Self",
    desc: "Given an array nums of n integers where n > 1, return an array output such that output[i] is equal to the product of all the elements of nums except nums[i].",
    difficulty: "Medium",
    examples: [
      { input: "nums = [1,2,3,4]", output: "[24,12,8,6]", explanation: "Product except self." },
      { input: "nums = [2,3,4,5]", output: "[60,40,30,24]", explanation: "Product except self." },
    ],
    videoUrl: "https://www.youtube.com/watch?v=tSRFtR3pv74",
    tags: ["Prefix Sum", "Array"],
    link: "https://leetcode.com/problems/product-of-array-except-self/",
  },
  {
    name: "Array",
    title: "Maximum Product Subarray",
    desc: "Find the contiguous subarray within an array (containing at least one number) which has the largest product.",
    difficulty: "Medium",
    examples: [
      { input: "nums = [2,3,-2,4]", output: "6", explanation: "Subarray [2,3] has largest product 6." },
      { input: "nums = [-2,0,-1]", output: "0", explanation: "Subarray [0] has largest product 0." },
    ],
    videoUrl: "https://www.youtube.com/watch?v=lXVy6YWFcRM",
    tags: ["DP", "Array"],
    link: "https://leetcode.com/problems/maximum-product-subarray/",
  },
  {
    name: "Array",
    title: "Find Peak Element",
    desc: "A peak element is an element that is greater than its neighbors. Find a peak element and return its index.",
    difficulty: "Medium",
    examples: [
      { input: "nums = [1,2,3,1]", output: "2", explanation: "3 is peak at index 2." },
      { input: "nums = [1,2,1,3,5,6,4]", output: "5", explanation: "6 is peak at index 5." },
    ],
    videoUrl: "https://www.youtube.com/watch?v=a7D77DdhlFc",
    tags: ["Binary Search", "Array"],
    link: "https://leetcode.com/problems/find-peak-element/",
  },
  {
    name: "Array",
    title: "Longest Consecutive Sequence",
    desc: "Given an unsorted array of integers, find the length of the longest consecutive elements sequence.",
    difficulty: "Hard",
    examples: [
      { input: "nums = [100,4,200,1,3,2]", output: "4", explanation: "Longest is [1,2,3,4]." },
      { input: "nums = [0,3,7,2,5,8,4,6,0,1]", output: "9", explanation: "Longest is 0-8." },
    ],
    videoUrl: "https://www.youtube.com/watch?v=rc2QdQ7U78I",
    tags: ["HashMap", "Set"],
    link: "https://leetcode.com/problems/longest-consecutive-sequence/",
  },
  {
    name: "Array",
    title: "Search in Rotated Sorted Array",
    desc: "You are given an integer array nums sorted in ascending order rotated at an unknown pivot. Find the target in nums.",
    difficulty: "Medium",
    examples: [
      { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4", explanation: "Index of 0 is 4." },
      { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1", explanation: "3 not in array." },
    ],
    videoUrl: "https://www.youtube.com/watch?v=QdVrY3stDD4",
    tags: ["Binary Search"],
    link: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
  },
  {
    name: "Array",
    title: "Trapping Rain Water",
    desc: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    difficulty: "Hard",
    examples: [
      { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6", explanation: "Can trap 6 units." },
      { input: "height = [4,2,0,3,2,5]", output: "9", explanation: "Can trap 9 units." },
    ],
    videoUrl: "https://www.youtube.com/watch?v=ZI2z5pq0TqA",
    tags: ["Two Pointer", "Stack"],
    link: "https://leetcode.com/problems/trapping-rain-water/",
  },
  {
    name: "Array",
    title: "Rotate Image",
    desc: "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).",
    difficulty: "Medium",
    examples: [
      { input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", output: "[[7,4,1],[8,5,2],[9,6,3]]", explanation: "Rotated 90 degrees." },
    ],
    videoUrl: "https://www.youtube.com/watch?v=fMSJSS7eO1w",
    tags: ["Matrix", "Array"],
    link: "https://leetcode.com/problems/rotate-image/",
  },
  {
    name: "Array",
    title: "Jump Game",
    desc: "Each element represents your maximum jump length at that position. Determine if you are able to reach the last index.",
    difficulty: "Medium",
    examples: [
      { input: "nums = [2,3,1,1,4]", output: "true", explanation: "Jump 1 to index 1, then 3 to last." },
      { input: "nums = [3,2,1,0,4]", output: "false", explanation: "Stuck at index 3." },
    ],
    videoUrl: "https://www.youtube.com/watch?v=Yan0cv2cLy8",
    tags: ["Greedy", "DP"],
    link: "https://leetcode.com/problems/jump-game/",
  },
  {
    name: "Array",
    title: "Merge Intervals",
    desc: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.",
    difficulty: "Medium",
    examples: [
      { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]", explanation: "[1,3] and [2,6] merge to [1,6]." },
    ],
    videoUrl: "https://www.youtube.com/watch?v=44H3cEC2fFM",
    tags: ["Sorting", "Intervals"],
    link: "https://leetcode.com/problems/merge-intervals/",
  },
  {
    name: "Array",
    title: "3Sum",
    desc: "Given an array nums of n integers, find all unique triplets which gives sum zero.",
    difficulty: "Medium",
    examples: [
      { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]", explanation: "Two triplets sum to zero." },
    ],
    videoUrl: "https://www.youtube.com/watch?v=jzZsG8n2R9A",
    tags: ["Two Pointer", "Sorting"],
    link: "https://leetcode.com/problems/3sum/",
  },
  {
    name: "String",
    title: "Valid Anagram",
    desc: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
    difficulty: "Easy",
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: "true", explanation: "Same chars reordered." },
      { input: 's = "rat", t = "car"', output: "false", explanation: "Different chars." },
    ],
    videoUrl: "https://www.youtube.com/watch?v=9UtInBqnCgA",
    tags: ["HashMap", "String"],
    link: "https://leetcode.com/problems/valid-anagram/",
  },
  {
    name: "String",
    title: "Longest Substring Without Repeating Characters",
    desc: "Given a string s, find the length of the longest substring without repeating characters.",
    difficulty: "Medium",
    examples: [
      { input: 's = "abcabcbb"', output: "3", explanation: '"abc" is longest.' },
      { input: 's = "bbbbb"', output: "1", explanation: '"b" is longest.' },
    ],
    videoUrl: "https://www.youtube.com/watch?v=wiGpQwVHdE0",
    tags: ["Sliding Window", "HashMap"],
    link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
  },
];

async function main() {
  console.log("Seeding topics...");
  await prisma.topic.deleteMany({});
  const created = await prisma.topic.createMany({ data: topics });
  console.log(`Inserted ${created.count} topics`);

  const all = await prisma.topic.findMany({ take: 3, orderBy: { createdAt: "asc" } });

  await prisma.user.upsert({
    where: { name: "demo@eatcode.io" },
    update: {
      bookmarks: { set: all.slice(0, 1).map((t) => t.id) },
    },
    create: {
      name: "demo@eatcode.io",
      bookmarks: all.slice(0, 1).map((t) => t.id),
    },
  });

  const demo = await prisma.user.findUnique({ where: { name: "demo@eatcode.io" } });
  if (demo && all[0]) {
    await prisma.completed.upsert({
      where: { userId_questionId: { userId: demo.id, questionId: all[0].id } },
      update: {},
      create: { userId: demo.id, questionId: all[0].id },
    });
    if (all[1]) {
      await prisma.completed.upsert({
        where: { userId_questionId: { userId: demo.id, questionId: all[1].id } },
        update: {},
        create: { userId: demo.id, questionId: all[1].id },
      });
    }
  }

  console.log("Demo user: demo@eatcode.io with 1 bookmark + 2 completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
