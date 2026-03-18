import { StudyTrack } from '../types';

export const TRACKS: StudyTrack[] = [
  {
    id: 'blind-75',
    name: 'Blind 75',
    description: 'The legendary list of 75 most common LeetCode problems asked in FAANG interviews. Covers all major patterns and data structures.',
    categories: [
      {
        name: 'Arrays & Hashing',
        problems: [
          { id: 'b75-1', title: 'Contains Duplicate', difficulty: 'Easy', completed: false },
          { id: 'b75-2', title: 'Valid Anagram', difficulty: 'Easy', completed: false },
          { id: 'b75-3', title: 'Two Sum', difficulty: 'Easy', completed: false },
          { id: 'b75-4', title: 'Group Anagrams', difficulty: 'Medium', completed: false },
          { id: 'b75-5', title: 'Top K Frequent Elements', difficulty: 'Medium', completed: false },
          { id: 'b75-6', title: 'Product of Array Except Self', difficulty: 'Medium', completed: false },
          { id: 'b75-7', title: 'Valid Sudoku', difficulty: 'Medium', completed: false },
          { id: 'b75-8', title: 'Longest Consecutive Sequence', difficulty: 'Medium', completed: false }
        ]
      },
      {
        name: 'Two Pointers',
        problems: [
          { id: 'b75-9', title: 'Valid Palindrome', difficulty: 'Easy', completed: false },
          { id: 'b75-10', title: '3Sum', difficulty: 'Medium', completed: false },
          { id: 'b75-11', title: 'Container With Most Water', difficulty: 'Medium', completed: false }
        ]
      },
      {
        name: 'Sliding Window',
        problems: [
          { id: 'b75-12', title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', completed: false },
          { id: 'b75-13', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', completed: false },
          { id: 'b75-14', title: 'Longest Repeating Character Replacement', difficulty: 'Medium', completed: false },
          { id: 'b75-15', title: 'Minimum Window Substring', difficulty: 'Hard', completed: false }
        ]
      },
      {
        name: 'Trees',
        problems: [
          { id: 'b75-16', title: 'Invert Binary Tree', difficulty: 'Easy', completed: false },
          { id: 'b75-17', title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', completed: false },
          { id: 'b75-18', title: 'Diameter of Binary Tree', difficulty: 'Easy', completed: false },
          { id: 'b75-19', title: 'Balanced Binary Tree', difficulty: 'Easy', completed: false },
          { id: 'b75-20', title: 'Same Tree', difficulty: 'Easy', completed: false },
          { id: 'b75-21', title: 'Subtree of Another Tree', difficulty: 'Easy', completed: false },
          { id: 'b75-22', title: 'Lowest Common Ancestor of a BST', difficulty: 'Medium', completed: false },
          { id: 'b75-23', title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', completed: false }
        ]
      }
    ]
  },
  {
    id: 'google-50',
    name: 'Google Top 50',
    description: 'The 50 most frequently asked questions in Google onsite interviews over the last 6 months.',
    categories: [
      {
        name: 'Graphs & Disjoint Sets',
        problems: [
          { id: 'g50-1', title: 'Number of Islands', difficulty: 'Medium', completed: false },
          { id: 'g50-2', title: 'Evaluate Division', difficulty: 'Medium', completed: false },
          { id: 'g50-3', title: 'Alien Dictionary', difficulty: 'Hard', completed: false },
          { id: 'g50-4', title: 'Word Ladder', difficulty: 'Hard', completed: false }
        ]
      },
      {
        name: 'Dynamic Programming',
        problems: [
          { id: 'g50-5', title: 'Longest Increasing Path in a Matrix', difficulty: 'Hard', completed: false },
          { id: 'g50-6', title: 'Coin Change', difficulty: 'Medium', completed: false },
          { id: 'g50-7', title: 'Split Array Largest Sum', difficulty: 'Hard', completed: false }
        ]
      }
    ]
  }
];
