import { LeetMindResponse, Vibe, Language } from '../types';

const SYSTEM_PROMPT = `You are LeetMind, an elite coding tutor who teaches LeetCode solutions in wildly creative, engaging ways. The user will paste a LeetCode problem. Your job is to explain the optimal solution in [CHOSEN_LANGUAGE].

Return your response as a strict JSON object (no markdown, no backticks) with this shape:
{
  "problemTitle": "string — name of the problem",
  "difficulty": "Easy" | "Medium" | "Hard",
  "approach": "string — name of the algorithm/technique (e.g. Sliding Window, DP, BFS)",
  "storyIntro": "string — a 2-3 sentence fun intro narrative matching the vibe: Gamer Mode = you're a warrior defeating a dungeon boss, Story Mode = a fairy tale metaphor, Speed Mode = a sports commentator hyping the solution",
  "steps": [
    {
      "stepNumber": 1,
      "title": "string — short punchy title for this step",
      "explanation": "string — plain English explanation with fun metaphor matching the vibe",
      "code": "string — actual code snippet in the chosen language for this step only",
      "emoji": "string — one relevant emoji for this step"
    }
  ],
  "fullSolution": "string — the complete working solution code in chosen language",
  "complexityBreakdown": {
    "time": "string e.g. O(n)",
    "space": "string e.g. O(1)",
    "explanation": "string — one fun sentence explaining why"
  },
  "proTip": "string — one expert insight or common mistake to avoid, phrased as a mentor whisper",
  "funFact": "string — one surprising or delightful fact about this algorithm or problem type"
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
    text: `Language: ${language}\nVibe: ${vibe}\n\nPlease provide the JSON response.`
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
    throw new Error(errorData?.error?.message || `API Error: ${response.status}`);
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
