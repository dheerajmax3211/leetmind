import { PatternEntry } from '../types';

export const PATTERNS: PatternEntry[] = [
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    category: 'Arrays & Strings',
    description: 'Used to perform operations on a specific window size of a given array or linked list, such as finding the longest subarray containing all 1s. The window "slides" over the data structure to reduce time complexity from O(n²) to O(n).',
    classicProblems: ['Maximum Sum Subarray of Size K', 'Longest Substring Without Repeating Characters', 'Minimum Window Substring'],
    complexityOptions: {
      time: 'O(N)',
      space: 'O(1) or O(K)'
    },
    emoji: '🪟'
  },
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    category: 'Arrays & Strings',
    description: 'Uses two pointers to iterate through a data structure concurrently, typically an array or string. One pointer starts at the beginning and the other at the end (or both at the beginning moving at different speeds), moving towards each other to find a specific condition.',
    classicProblems: ['Valid Palindrome', 'Two Sum II', 'Container With Most Water', 'Trapping Rain Water'],
    complexityOptions: {
      time: 'O(N)',
      space: 'O(1)'
    },
    emoji: '👉'
  },
  {
    id: 'fast-slow-pointers',
    name: 'Fast & Slow Pointers',
    category: 'Linked Lists',
    description: 'Also known as the Hare & Tortoise algorithm. Uses two pointers moving at different speeds to detect cycles or find specific elements (like the middle of a linked list) efficiently.',
    classicProblems: ['Linked List Cycle', 'Middle of the Linked List', 'Find the Duplicate Number'],
    complexityOptions: {
      time: 'O(N)',
      space: 'O(1)'
    },
    emoji: '🐢'
  },
  {
    id: 'merge-intervals',
    name: 'Merge Intervals',
    category: 'Arrays',
    description: 'Deals with overlapping intervals. The core idea is to sort the intervals by their starting times and then iterate through them, comparing current interval with the previous to see if they overlap.',
    classicProblems: ['Merge Intervals', 'Insert Interval', 'Non-overlapping Intervals'],
    complexityOptions: {
      time: 'O(N log N)',
      space: 'O(N)'
    },
    emoji: '🛤️'
  },
  {
    id: 'cyclic-sort',
    name: 'Cyclic Sort',
    category: 'Arrays',
    description: 'Used when elements in an array are in a specific range (e.g., 1 to N). It places each element at its correct index in O(N) time without extra space.',
    classicProblems: ['Missing Number', 'Find All Numbers Disappeared in an Array', 'First Missing Positive'],
    complexityOptions: {
      time: 'O(N)',
      space: 'O(1)'
    },
    emoji: '🔄'
  },
  {
    id: 'in-place-reversal',
    name: 'In-place Reversal',
    category: 'Linked Lists',
    description: 'Reverses the links between nodes of a Linked List sequentially in a single pass without using extra memory.',
    classicProblems: ['Reverse Linked List', 'Reverse Linked List II', 'Reverse Nodes in k-Group'],
    complexityOptions: {
      time: 'O(N)',
      space: 'O(1)'
    },
    emoji: '↩️'
  },
  {
    id: 'bfs',
    name: 'Tree/Graph BFS',
    category: 'Trees & Graphs',
    description: 'Level-by-level traversal using a Queue. Explores all neighbors of the current node before moving to the next level.',
    classicProblems: ['Binary Tree Level Order Traversal', 'Rotting Oranges', 'Word Ladder'],
    complexityOptions: {
      time: 'O(V + E)',
      space: 'O(V)'
    },
    emoji: '🌊'
  },
  {
    id: 'dfs',
    name: 'Tree/Graph DFS',
    category: 'Trees & Graphs',
    description: 'Depth-first traversal using recursion or a Stack. Explores as far down a branch as possible before backtracking.',
    classicProblems: ['Number of Islands', 'Max Area of Island', 'Lowest Common Ancestor'],
    complexityOptions: {
      time: 'O(V + E)',
      space: 'O(H) or O(V)'
    },
    emoji: '🌲'
  },
  {
    id: 'two-heaps',
    name: 'Two Heaps',
    category: 'Heaps',
    description: 'Uses a Max Heap for the smaller half of numbers and a Min Heap for the larger half. Great for finding the sliding median or managing a streaming dataset.',
    classicProblems: ['Find Median from Data Stream', 'Sliding Window Median', 'IPO'],
    complexityOptions: {
      time: 'O(log N)',
      space: 'O(N)'
    },
    emoji: '⛰️'
  },
  {
    id: 'subsets',
    name: 'Subsets (Backtracking)',
    category: 'Dynamic Programming',
    description: 'Exploring all possible combinations or permutations by building a tree of possibilities and backtracking when a dead end is reached.',
    classicProblems: ['Subsets', 'Permutations', 'Combination Sum'],
    complexityOptions: {
      time: 'O(2^N)',
      space: 'O(N)'
    },
    emoji: '🌳'
  },
  {
    id: 'modified-binary-search',
    name: 'Modified Binary Search',
    category: 'Binary Search',
    description: 'Extended versions of Binary Search to find elements in shifted/rotated arrays, or to search for ranges instead of exact targets.',
    classicProblems: ['Search in Rotated Sorted Array', 'Find Minimum in Rotated Sorted Array', 'Search a 2D Matrix'],
    complexityOptions: {
      time: 'O(log N)',
      space: 'O(1)'
    },
    emoji: '🔍'
  },
  {
    id: 'top-k-elements',
    name: 'Top K Elements',
    category: 'Heaps',
    description: 'Finding the largest, smallest, or most frequent K elements in a collection, typically using a Priority Queue (Heap).',
    classicProblems: ['Kth Largest Element in an Array', 'Top K Frequent Elements', 'Merge K Sorted Lists'],
    complexityOptions: {
      time: 'O(N log K)',
      space: 'O(K)'
    },
    emoji: '👑'
  },
  {
    id: 'k-way-merge',
    name: 'K-way Merge',
    category: 'Heaps',
    description: 'Merging multiple sorted arrays or linked lists simultaneously using a Min Heap.',
    classicProblems: ['Merge K Sorted Lists', 'Kth Smallest Element in a Sorted Matrix', 'Find K Pairs with Smallest Sums'],
    complexityOptions: {
      time: 'O(N log K)',
      space: 'O(K)'
    },
    emoji: '🧵'
  },
  {
    id: 'dp-knapsack',
    name: '0/1 Knapsack (DP)',
    category: 'Dynamic Programming',
    description: 'Classic DP pattern for optimization problems where each item can either be taken (1) or skipped (0) to maximize value within a capacity.',
    classicProblems: ['Partition Equal Subset Sum', 'Target Sum', 'Coin Change'],
    complexityOptions: {
      time: 'O(N * W)',
      space: 'O(W)'
    },
    emoji: '🎒'
  },
  {
    id: 'topological-sort',
    name: 'Topological Sort',
    category: 'Graphs',
    description: 'Linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u→v, u comes before v. Used for dependency resolution.',
    classicProblems: ['Course Schedule', 'Alien Dictionary', 'Minimum Height Trees'],
    complexityOptions: {
      time: 'O(V + E)',
      space: 'O(V + E)'
    },
    emoji: '🗺️'
  }
];
