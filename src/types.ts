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
}

export type Vibe = "Concise" | "Detailed" | "Interview";
export type Language = "Python" | "JavaScript" | "Java" | "C++" | "Go" | "Rust" | "TypeScript";
export type AIProvider = "Claude" | "Gemini";
