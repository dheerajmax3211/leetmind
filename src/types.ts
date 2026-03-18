export interface Step {
  stepNumber: number;
  title: string;
  explanation: string;
  code: string;
  emoji: string;
}

export interface ComplexityBreakdown {
  time: string;
  space: string;
  explanation: string;
}

export interface LeetMindResponse {
  problemTitle: string;
  difficulty: "Easy" | "Medium" | "Hard";
  approach: string;
  storyIntro: string;
  steps: Step[];
  fullSolution: string;
  complexityBreakdown: ComplexityBreakdown;
  proTip: string;
  funFact: string;
  language?: string;
  nextSteps?: string[];
}

export type Vibe = "Concise" | "Detailed" | "Interview";
export type Language = "Python" | "JavaScript" | "Java" | "C++" | "Go" | "Rust" | "TypeScript";
export type AIProvider = "Claude" | "Gemini";

// --- New Features Types ---

export interface PatternEntry {
  id: string;
  name: string;
  category: string;
  description: string;
  classicProblems: string[];
  complexityOptions: {
    time: string;
    space: string;
  };
  emoji: string;
}

export interface StudyTrackProblem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  completed: boolean;
}

export interface StudyTrack {
  id: string;
  name: string;
  description: string;
  categories: {
    name: string;
    problems: StudyTrackProblem[];
  }[];
}

export interface MockInterviewSession {
  id: string;
  date: string;
  problemTitle: string;
  feedback: string;
  duration: number; // in seconds
}

export interface SpacedRepEntry {
  problemId: string;
  lastReviewed: number; // timestamp
  interval: number; // days
  easeFactor: number;
  repCount: number;
}

export interface CheatSheetData {
  topic: string;
  definition: string;
  keyOperations: string;
  timeComplexity: string;
  codeTemplate: string;
  commonMistakes: string;
}

export interface StudyPlanDay {
  dayNumber: number;
  topic: string;
  description: string;
  resources: string[];
}

export interface StudyPlan {
  id: string;
  title: string;
  durationWeeks: number;
  targetRole: 'faang' | 'startup' | 'internship';
  weeks: Array<{
    weekNumber: number;
    focus: string;
    tasks: Array<{
      id: string;
      title: string;
      type: 'learning' | 'practice' | 'mock';
      completed: boolean;
    }>;
  }>;
}
