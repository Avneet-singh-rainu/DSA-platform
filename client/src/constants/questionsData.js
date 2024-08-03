export const questionsData = [
  {
    id: 1,
    name: "Array",
    title: "Find the Missing Number",
    desc: "Given an array containing n distinct numbers taken from 0, 1, 2, ..., n, find the one that is missing from the array.",
    difficulty: "Medium",
    examples: [
      {
        input: "nums = [3, 0, 1]",
        output: "2",
        explanation: "The numbers are 0, 1, 3. The missing number is 2.",
      },
      {
        input: "nums = [9,6,4,2,3,5,7,0,1]",
        output: "8",
        explanation:
          "The numbers are 0, 1, 2, 3, 4, 5, 6, 7, 9. The missing number is 8.",
      },
    ],
    videoUrl: "https://youtu.be/7Fjtz3Z5Frg?si=np87laLjD_qehKFg",
    isBookmarked: true,
    isCompleted: true,
    tags: ["Two pointer", "Greedy", "HashMap"],
  },
  {
    id: 2,
    name: "Array",
    title: "Maximum Subarray",
    desc: "Find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    difficulty: "Easy",
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "The subarray [4,-1,2,1] has the largest sum 6.",
      },
      {
        input: "nums = [1]",
        output: "1",
        explanation: "The entire array is the largest subarray.",
      },
    ],
    videoUrl: "https://www.youtube.com/watch?v=2MmGzdiKR9Y",
    isBookmarked: false,
    isCompleted: true,
    tags: ["Two pointer", "Greedy", "HashMap"],
  },
  {
    id: 3,
    name: "Array",
    title: "Contains Duplicate",
    desc: "Given an array of integers, find if the array contains any duplicates.",
    difficulty: "Easy",
    examples: [
      {
        input: "nums = [1,2,3,1]",
        output: "true",
        explanation: "The array contains duplicate 1.",
      },
      {
        input: "nums = [1,2,3,4]",
        output: "false",
        explanation: "The array contains no duplicates.",
      },
    ],
    videoUrl: "https://www.youtube.com/watch?v=3OamzN90kPg",
    isBookmarked: false,
    isCompleted: false,
    tags: ["Two pointer", "Greedy", "HashMap"],
  },
  {
    id: 4,
    name: "Array",
    title: "Product of Array Except Self",
    desc: "Given an array nums of n integers where n > 1, return an array output such that output[i] is equal to the product of all the elements of nums except nums[i].",
    difficulty: "Medium",
    examples: [
      {
        input: "nums = [1,2,3,4]",
        output: "[24,12,8,6]",
        explanation:
          "The product of all numbers except self for each index is [24, 12, 8, 6].",
      },
      {
        input: "nums = [2,3,4,5]",
        output: "[60,40,30,24]",
        explanation:
          "The product of all numbers except self for each index is [60, 40, 30, 24].",
      },
    ],
    videoUrl: "https://www.youtube.com/watch?v=tSRFtR3pv74",
    isBookmarked: false,
    isCompleted: false,
    tags: ["Two pointer", "Greedy", "HashMap"],
  },
  {
    id: 5,
    name: "Array",
    title: "Maximum Product Subarray",
    desc: "Find the contiguous subarray within an array (containing at least one number) which has the largest product.",
    difficulty: "Medium",
    examples: [
      {
        input: "nums = [2,3,-2,4]",
        output: "6",
        explanation: "The subarray [2,3] has the largest product 6.",
      },
      {
        input: "nums = [-2,0,-1]",
        output: "0",
        explanation: "The subarray [0] has the largest product 0.",
      },
    ],
    videoUrl: "https://www.youtube.com/watch?v=lXVy6YWFcRM",
    isBookmarked: false,
    isCompleted: false,
    tags: ["Two pointer", "Greedy", "HashMap"],
  },
  {
    id: 6,
    name: "Array",
    title: "Find Peak Element",
    desc: "A peak element is an element that is greater than its neighbors. Find a peak element and return its index.",
    difficulty: "Medium",
    examples: [
      {
        input: "nums = [1,2,3,1]",
        output: "2",
        explanation:
          "3 is a peak element and your function should return the index number 2.",
      },
      {
        input: "nums = [1,2,1,3,5,6,4]",
        output: "5",
        explanation:
          "Your function can return index number 5 where element 6 is a peak.",
      },
    ],
    videoUrl: "https://www.youtube.com/watch?v=a7D77DdhlFc",
    isBookmarked: false,
    isCompleted: true,
    tags: ["Two pointer", "Greedy", "HashMap"],
  },
  {
    id: 7,
    name: "Array",
    title: "Longest Consecutive Sequence",
    desc: "Given an unsorted array of integers, find the length of the longest consecutive elements sequence.",
    difficulty: "Hard",
    examples: [
      {
        input: "nums = [100,4,200,1,3,2]",
        output: "4",
        explanation:
          "The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4.",
      },
      {
        input: "nums = [0,3,7,2,5,8,4,6,0,1]",
        output: "9",
        explanation:
          "The longest consecutive elements sequence is [0, 1, 2, 3, 4, 5, 6, 7, 8]. Therefore its length is 9.",
      },
    ],
    videoUrl: "https://www.youtube.com/watch?v=rc2QdQ7U78I",
    isBookmarked: false,
    isCompleted: false,
    tags: ["Two pointer", "Greedy", "HashMap"],
  },
  {
    id: 8,
    name: "Array",
    title: "Search in Rotated Sorted Array",
    desc: "You are given an integer array nums sorted in ascending order, and an integer target. Suppose that nums is rotated at an unknown pivot index. Find the target in nums.",
    difficulty: "Medium",
    examples: [
      {
        input: "nums = [4,5,6,7,0,1,2], target = 0",
        output: "4",
        explanation: "The index of the target 0 is 4.",
      },
      {
        input: "nums = [4,5,6,7,0,1,2], target = 3",
        output: "-1",
        explanation: "The target 3 is not in the array.",
      },
    ],
    videoUrl: "https://www.youtube.com/watch?v=QdVrY3stDD4",
    isBookmarked: false,
    isCompleted: false,
    tags: ["Two pointer", "Greedy", "HashMap"],
  },
  {
    id: 9,
    name: "Array",
    title: "Trapping Rain Water",
    desc: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    difficulty: "Hard",
    examples: [
      {
        input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        output: "6",
        explanation: "The elevation map can trap 6 units of rain water.",
      },
      {
        input: "height = [4,2,0,3,2,5]",
        output: "9",
        explanation: "The elevation map can trap 9 units of rain water.",
      },
    ],
    videoUrl: "https://www.youtube.com/watch?v=ZI2z5pq0TqA",
    isBookmarked: false,
    isCompleted: false,
    tags: ["Two pointer", "Greedy", "HashMap"],
  },
  {
    id: 10,
    name: "Array",
    title: "Rotate Image",
    desc: "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).",
    difficulty: "Medium",
    examples: [
      {
        input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        output: "[[7,4,1],[8,5,2],[9,6,3]]",
        explanation: "The matrix is rotated by 90 degrees (clockwise).",
      },
      {
        input: "matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]",
        output: "[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]",
        explanation: "The matrix is rotated by 90 degrees (clockwise).",
      },
    ],
    videoUrl: "https://www.youtube.com/watch?v=fMSJSS7eO1w",
    isBookmarked: false,
    isCompleted: false,
    tags: ["Two pointer", "Greedy", "HashMap"],
  },
  {
    id: 11,
    name: "Array",
    title: "Jump Game",
    desc: "Given an array of non-negative integers nums, you are initially positioned at the first index of the array. Each element in the array represents your maximum jump length at that position. Determine if you are able to reach the last index.",
    difficulty: "Medium",
    examples: [
      {
        input: "nums = [2,3,1,1,4]",
        output: "true",
        explanation:
          "Jump 1 step from index 0 to 1, then 3 steps to the last index.",
      },
      {
        input: "nums = [3,2,1,0,4]",
        output: "false",
        explanation:
          "You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.",
      },
    ],
    videoUrl: "https://www.youtube.com/watch?v=Yan0cv2cLy8",
    isBookmarked: false,
    isCompleted: false,
    tags: ["Two pointer", "Greedy", "HashMap"],
  },
  {
    id: 12,
    name: "Array",
    title: "Merge Intervals",
    desc: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    difficulty: "Medium",
    examples: [
      {
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1,6],[8,10],[15,18]]",
        explanation:
          "Intervals [1,3] and [2,6] overlap, merging them into [1,6].",
      },
      {
        input: "intervals = [[1,4],[4,5]]",
        output: "[[1,5]]",
        explanation:
          "Intervals [1,4] and [4,5] overlap, merging them into [1,5].",
      },
    ],
    videoUrl: "https://www.youtube.com/watch?v=44H3cEC2fFM",
    isBookmarked: false,
    isCompleted: false,
    tags: ["Two pointer", "Greedy", "HashMap"],
  },
  {
    id: 13,
    name: "Array",
    title: "3Sum",
    desc: "Given an array nums of n integers, find all unique triplets in the array which gives the sum of zero.",
    difficulty: "Medium",
    examples: [
      {
        input: "nums = [-1,0,1,2,-1,-4]",
        output: "[[-1,-1,2],[-1,0,1]]",
        explanation:
          "The triplets that sum to zero are [-1,-1,2] and [-1,0,1].",
      },
      {
        input: "nums = []",
        output: "[]",
        explanation: "There are no triplets that sum to zero.",
      },
    ],
    videoUrl: "https://www.youtube.com/watch?v=jzZsG8n2R9A",
    isBookmarked: false,
    isCompleted: false,
    tags: ["Two pointer", "Greedy", "HashMap"],
  },
];
