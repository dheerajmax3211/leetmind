import { LeetMindResponse, Vibe, Language } from '../types';

const SYSTEM_PROMPT = `You are LeetMind, an expert algorithm educator. Your job is to explain the optimal solution to a LeetCode problem in [CHOSEN_LANGUAGE], clearly and concisely.

Mode instructions:
- Concise: 1-2 sharp sentences per step. Assume the reader knows their fundamentals. Skip all preamble — just explain what the code does and why.
- Detailed: Full breakdown per step. Explain the WHY behind each decision. Build genuine understanding of the algorithm's intuition.
- Interview: Frame each step as clear interview commentary. Explain the intuition, why this approach was chosen over alternatives, and note any edge cases a good candidate would mention.

Critical rules:
- Each step's explanation MUST directly describe what the code in that step does. The text and code must be in sync — a reader should be able to read the explanation, then look at the code and immediately understand it.
- Use precise technical language. Do not use metaphors, fairy tales, sports commentary, or gaming analogies.
- storyIntro should be 2-3 sentences: what the problem is actually asking, and the core algorithmic insight that makes this approach the right one. No dramatic framing.
- proTip should be a genuine insight a senior engineer would share — a subtle bug to watch out for, a common wrong approach, or an edge case.
- funFact should be a real-world application or interesting property of this algorithm.

Return ONLY a strict JSON object (no markdown, no backticks) with this exact shape:
{
  "problemTitle": "string",
  "difficulty": "Easy" | "Medium" | "Hard",
  "approach": "string — algorithm/technique name e.g. Sliding Window, Two Pointers, DP",
  "storyIntro": "string — 2-3 sentences: problem summary and core algorithmic insight",
  "steps": [
    {
      "stepNumber": 1,
      "title": "string — short title for what this step accomplishes",
      "explanation": "string — clear, direct explanation that maps precisely to the code snippet",
      "code": "string — code for this step only",
      "emoji": "string — one relevant emoji"
    }
  ],
  "fullSolution": "string — complete working solution",
  "complexityBreakdown": {
    "time": "string e.g. O(n)",
    "space": "string e.g. O(1)",
    "explanation": "string — clear explanation of why this complexity holds"
  },
  "proTip": "string — genuine expert insight or subtle mistake to avoid",
  "funFact": "string — real-world application or interesting property of this algorithm"
}`;

export async function fetchLeetMindSolution(
  problemText: string,
  images: string[],
  language: Language,
  vibe: Vibe
): Promise<LeetMindResponse> {
  const systemPrompt = SYSTEM_PROMPT.replace("[CHOSEN_LANGUAGE]", language);

  const content: any[] = [];

  if (problemText.trim()) {
    content.push({ type: "text", text: problemText });
  }

  for (const img of images) {
    const match = img.match(/^data:(image\/[a-z]+);base64,(.*)$/);
    if (match) {
      const mediaType = match[1];
      const data = match[2];
      content.push({
        type: "image",
        source: {
          type: "base64",
          media_type: mediaType,
          data: data
        }
      });
    }
  }

  content.push({
    type: "text",
    text: `Language: ${language}\nMode: ${vibe}\n\nPlease provide the JSON response.`
  });

  const response = await fetch("/api/claude", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 8192,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: content
        }
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error?.message || errorData?.error || `API Error: ${response.status}`);
  }

  const data = await response.json();
  const textResponse = data.content[0].text;

  try {
    const startIndex = textResponse.indexOf('{');
    const endIndex = textResponse.lastIndexOf('}');
    if (startIndex !== -1 && endIndex !== -1) {
      const jsonStr = textResponse.substring(startIndex, endIndex + 1);
      return JSON.parse(jsonStr) as LeetMindResponse;
    }
    return JSON.parse(textResponse) as LeetMindResponse;
  } catch (e) {
    console.error("Failed to parse JSON:", textResponse);
    throw new Error("Failed to parse the response. Please try again.");
  }
}
